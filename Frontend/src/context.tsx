import React, { useState, ReactNode } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";
import User from "./types/user.tsx";
import { ListsContext, ListsContextType } from "./context-object.tsx";

// Props for the provider component
interface ListsProviderProps {
	children: ReactNode;
	initialLists?: List[];
}

// Provider component that will wrap the components that need access to the context
export const ListsProvider: React.FC<ListsProviderProps> = ({ children }) => {
	const [lists, setLists] = useState<List[]>([]);
	const [user, setUser] = useState<User | undefined>(undefined);

	function requestUserData(): void {
		console.log("Requesting user data");
		(async () => {
			try {
				const response = await fetch("/db/userGetData", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				// Parse the response as JSON and set the lists state
				const rawData = await response.json(); // Correctly parse JSON
				setUser(rawData.user);
				if (rawData.lists === undefined || rawData.lists === null) {
					return;
				}
				const data: List[] = rawData.lists;
				// Give a UUID to each list, gift, and group
				data.forEach(list => {
					list.clientID = crypto.randomUUID();
					if (list.name === "" || list.name === undefined) {
						list.name = "Untitled List";
					}
					list.groups.forEach(group => {
						group.clientID = crypto.randomUUID();
						if (group.name === "" || group.name === undefined) {
							group.name = "Unsorted";
						}
						group.gifts.forEach(gift => {
							gift.clientID = crypto.randomUUID();
							if (gift.name === "" || gift.name === undefined) {
								gift.name = "Untitled Gift";
							}
						});
					});
				});
				setLists(data);
				console.log("Successfully fetched user data:", data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		})();
	}

	function listsGet(): List[] {
		return lists;
	}

	function listGet(clientID: string): List | undefined {
		return lists.find(list => list.clientID === clientID);
	}

	function listUpdate(list: List): void {
		listUpdateInternal(list);
		(async () => {
			try {
				const response = await fetch("/db/userUpdateList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(list),
				});

				if (!response.ok) {
					throw new Error("Failed to update list: " + response.status);
				}
			} catch (error) {
				console.error("Error updating list:", error);
			}
		})();
	}

	function listAdd(name: string = "Untitled List"): List {
		if (user === undefined) {
			throw new Error("User must be logged in to create a list");
		}
		const newList = new List(user, name);
		setLists(prevLists => [...prevLists, newList]);

		(async () => {
			try {
				const response = await fetch("/db/userCreateList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(newList),
				});

				if (!response.ok) {
					throw new Error("Failed to create list: " + response.status);
				}
				// Parse the response as JSON and set the lists state
				const dbList: List = await response.json();
				dbList.clientID = newList.clientID;
				dbList.groups[0].clientID = newList.groups[0].clientID;
				dbList.groups[0].gifts[0].clientID = newList.groups[0].gifts[0].clientID;

				listUpdateInternal(dbList);
				console.log("Successfully created list:", dbList);
			} catch (error) {
				console.error("Error creating list:", error);
			}
		})();
		return newList;
	}

	function listUpdateInternal(updateList: List): void {
		// Update the list in the state without making a network request
		setLists(prevLists => {
			const newLists = prevLists.map(list => {
				if (list.clientID === updateList.clientID) {
					console.log("Found list to update:", updateList);
					return updateList;
				}
				console.log("Did not find list to update:", list);
				return list;
			});
			return newLists;
		});
	}

	function listDelete(list: List): void {
		(async () => {
			try {
				const response = await fetch("/db/userDeleteList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(list.id),
				});

				if (!response.ok) {
					throw new Error("Failed to delete list: " + response.status);
				}
			} catch (error) {
				console.error("Error deleting list:", error);
			}
		})();
		const updatedLists = lists.filter(existingList => existingList.clientID !== list.clientID);
		setLists(updatedLists);
	}

	function groupGet(listClientID: string, groupClientID: string): Group | undefined {
		const list = listGet(listClientID);
		if (list === undefined) {
			return undefined;
		}
		return list.groups.find(group => group.clientID === groupClientID);
	}

	function groupUpdate(group: Group): void {
		console.log("Updating group", group);
		(async () => {
			try {
				const response = await fetch("/db/userUpdateGroup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(group),
				});

				if (!response.ok) {
					throw new Error("Failed to update group: " + response.status);
				}
				groupUpdateInternal(group, group.list_id);
			} catch (error) {
				console.error("Error updating group:", error);
			}
		})();
	}

	function groupAdd(listClientID: string, name: string = "Untitled Group"): Group {
		if (user === undefined) {
			throw new Error("User must be logged in to create a Group");
		}
		const baseList = lists.find(list => list.clientID === listClientID);
		if (listClientID === "" || baseList === undefined) {
			throw new Error("List must exist to create a Group");
		}
		const newGroup = new Group(name);
		newGroup.list_id = baseList.id;
		baseList.groups.push(newGroup);
		console.log("Sending group to DB:", newGroup);
		listUpdateInternal(baseList);
		(async () => {
			try {
				const response = await fetch("/db/userCreateGroup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(newGroup),
				});

				if (!response.ok) {
					throw new Error("Failed to create group: " + response.status);
				}
				// Parse the response as JSON and set the lists state
				const dbGroup: Group = await response.json();
				dbGroup.clientID = newGroup.clientID;
				dbGroup.gifts[0].clientID = newGroup.gifts[0].clientID;

				groupUpdateInternal(dbGroup, listClientID);
				console.log("Successfully created group:", dbGroup);
			} catch (error) {
				console.error("Error creating group:", error);
			}
		})();
		return newGroup;
	}

	function groupUpdateInternal(updateGroup: Group, baseListClientID: string): void {
		// Update the list in the state without making a network request
		setLists(prevLists => {
			const newLists = prevLists.map(list => {
				if (list.clientID === baseListClientID) {
					const updatedGroups = list.groups.map(group => {
						if (group.clientID === updateGroup.clientID) {
							return updateGroup;
						}
						return group;
					});
					list.groups = updatedGroups;
				}
				return list;
			});
			return newLists;
		});
	}

	function groupDelete(group: Group): void {
		const parentList = lists.find(list => list.id === group.list_id);
		if (parentList === undefined) {
			throw new Error("Failed to find parent list");
		}
		(async () => {
			try {
				const response = await fetch("/db/userDeleteGroup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(group.id),
				});

				if (!response.ok) {
					throw new Error("Failed to delete group: " + response.status);
				}
			} catch (error) {
				console.error("Error deleting group:", error);
			}
		})();
		const updatedGroups = parentList.groups.filter(grp => grp.clientID !== group.clientID);
		parentList.groups = updatedGroups;
		listUpdateInternal(parentList);
	}

	function giftGet(
		listClientID: string,
		groupClientID: string,
		giftClientID: string,
	): Gift | undefined {
		const group = groupGet(listClientID, groupClientID);
		if (group === undefined) {
			return undefined;
		}
		return group.gifts.find(gift => gift.clientID === giftClientID);
	}

	function giftUpdate(gift: Gift): void {
		console.log("Updating gift", gift);
		(async () => {
			try {
				const response = await fetch("/db/userUpdateGift", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(gift),
				});

				if (!response.ok) {
					throw new Error("Failed to update gift: " + response.status);
				}
			} catch (error) {
				console.error("Error updating gift:", error);
			}
		})();
	}

	function giftAdd(listClientID: string, groupClientID: string, name: string = ""): Gift {
		if (user === undefined) {
			throw new Error("User must be logged in to create a Gift");
		}
		const baseList = lists.find(list => list.clientID === listClientID);
		if (listClientID === "" || baseList === undefined) {
			throw new Error("List must exist to create a Gift");
		}

		const baseGroup = baseList.groups.find(group => group.clientID === groupClientID);
		if (baseGroup === undefined || groupClientID === "") {
			throw new Error("Group must exist to create a Gift");
		}

		const newGift = new Gift(name);
		newGift.group_id = baseGroup.id;
		baseGroup.gifts.push(newGift);

		console.log("Sending gift to DB:", newGift);
		groupUpdateInternal(baseGroup, listClientID);
		(async () => {
			try {
				const response = await fetch("/db/userCreateGift", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(newGift),
				});

				if (!response.ok) {
					throw new Error("Failed to create gift: " + response.status);
				}
				// Parse the response as JSON and set the lists state
				const dbGift: Gift = await response.json();
				dbGift.clientID = newGift.clientID;

				giftUpdateInternal(dbGift, listClientID, groupClientID);
				console.log("Successfully created gift:", dbGift);
			} catch (error) {
				console.error("Error creating gift:", error);
			}
		})();
		return newGift;
	}

	function giftUpdateInternal(
		updateGift: Gift,
		baseListClientID: string,
		baseGroupClientID: string,
	): void {
		// Update the list in the state without making a network request
		setLists(prevLists => {
			const newLists = prevLists.map(list => {
				if (list.clientID === baseListClientID) {
					const updatedGroups = list.groups.map(group => {
						if (group.clientID === baseGroupClientID) {
							const updatedGifts = group.gifts.map(gift => {
								if (gift.clientID === updateGift.clientID) {
									return updateGift;
								}
								return gift;
							});
							group.gifts = updatedGifts;
						}
						return group;
					});
					list.groups = updatedGroups;
				}
				return list;
			});
			return newLists;
		});
	}

	function giftDelete(listClientID: string, groupClientID: string, gift: Gift): void {
		(async () => {
			try {
				const response = await fetch("/db/userDeleteGift", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(gift.id),
				});

				if (!response.ok) {
					throw new Error("Failed to delete gift: " + response.status);
				}
			} catch (error) {
				console.error("Error deleting gift:", error);
			}
		})();
		const parentGroup = groupGet(listClientID, groupClientID);
		if (parentGroup === undefined) {
			throw new Error("Failed to find parent group");
		}
		const updatedGifts = parentGroup.gifts.filter(
			parentGift => parentGift.clientID !== gift.clientID,
		);
		parentGroup.gifts = updatedGifts;
		groupUpdateInternal(parentGroup, listClientID);
	}

	const value: ListsContextType = {
		lists,
		user,
		requestUserData,
		listsGet,
		listGet,
		listUpdate,
		listAdd,
		listUpdateInternal,
		listDelete,
		groupGet,
		groupUpdate,
		groupAdd,
		groupUpdateInternal,
		groupDelete,
		giftGet,
		giftUpdate,
		giftAdd,
		giftUpdateInternal,
		giftDelete,
	};

	return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
};
