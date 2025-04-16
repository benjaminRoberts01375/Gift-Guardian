import React, { useState, ReactNode } from "react";
import List from "./types/list.tsx";
import User from "./types/user.tsx";
import { ListsContext, ListsContextType } from "./context-object.tsx";

// Props for the provider component
interface ListsProviderProps {
	children: ReactNode;
	initialLists?: List[];
}

// Provider component that will wrap the components that need access to the context
export const ListsProvider: React.FC<ListsProviderProps> = ({ children, initialLists = [] }) => {
	const [lists, setLists] = useState<List[]>(initialLists);

	const listsGet = () => {
		return lists;
	};

	const listGet = (clientID: string) => {
		return lists.find(list => list.clientID === clientID);
	};

	const listRemove = (id: string) => {
		setLists(prevLists => prevLists.filter(list => list.id !== id));
	};

	const listCreate = () => {
		const newList = new List(new User("ben", "Benjamin", "Roberts"));
		setLists(prevLists => [...prevLists, newList]);

		// Fire and forget async POST request
		(async () => {
			try {
				const response = await fetch("/db/userUpsertList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newList),
				});

				if (!response.ok) {
					return;
				}

				const result: List = await response.json();
				const targetGroupClientID = newList.groups[0]?.clientID;
				// Update the list with server-generated ID or other fields
				setLists(prevLists =>
					prevLists.map(list => {
						if (list.clientID === newList.clientID) {
							// Create a new array of groups with the updated group
							const updatedGroups = list.groups.map(group =>
								group.clientID === targetGroupClientID
									? { ...group, id: targetGroupClientID }
									: group,
							);
							// Return updated list with modified groups
							return { ...list, groups: updatedGroups, id: result.id };
						}
						return list;
					}),
				);
			} catch (error) {
				console.error("Error saving list:", error);
				// Optionally handle error - e.g., notify user or rollback the list addition
			}
		})();

		return newList;
	};

	const groupsGet = (listClientID: string) => {
		return lists.find(list => list.clientID === listClientID)?.groups;
	};

	const groupGet = (listClientID: string, groupClientID: string) => {
		return lists
			.find(list => list.clientID === listClientID)
			?.groups.find(group => group.clientID === groupClientID);
	};

	// Value object that will be passed to consuming components
	const value: ListsContextType = {
		listCreate,
		listsGet,
		listGet,
		listRemove,
		groupsGet,
		groupGet,
	};

	return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
};
