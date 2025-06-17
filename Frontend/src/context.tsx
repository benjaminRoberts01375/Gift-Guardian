import React, { useState, ReactNode } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";
import { ListsContext, ListsContextType } from "./context-object.tsx";

// Props for the provider component
interface ListsProviderProps {
	children: ReactNode;
	initialLists?: List[];
}

// Provider component that will wrap the components that need access to the context
export const ListsProvider: React.FC<ListsProviderProps> = ({ children }) => {
	const [lists, setLists] = useState<List[]>([]);

	function requestUserData(): void {
		console.log("Requesting user data");
		(async () => {
			try {
				const response = await fetch("/db/userGetLists", {
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
				const data: List[] = await response.json(); // Correctly parse JSON
				// Give a UUID to each list, gift, and group
				data.forEach(list => {
					list.clientID = crypto.randomUUID();
					if (list.title === "" || list.title === undefined) {
						list.title = "Untitled List";
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

	function groupGet(listClientID: string, groupClientID: string): Group | undefined {
		const list = listGet(listClientID);
		if (list === undefined) {
			return undefined;
		}
		return list.groups.find(group => group.clientID === groupClientID);
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

	const value: ListsContextType = {
		lists,
		requestUserData,
		listsGet,
		listGet,
		groupGet,
		giftGet,
	};

	return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
};
