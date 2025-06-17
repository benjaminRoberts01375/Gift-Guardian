import React, { useState, ReactNode } from "react";
import List from "./types/list.tsx";
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
					list.groups.forEach(group => {
						group.clientID = crypto.randomUUID();
						group.gifts.forEach(gift => {
							gift.clientID = crypto.randomUUID();
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

	const value: ListsContextType = {
		lists,
		requestUserData,
		listsGet,
		listGet,
	};

	return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>;
};
