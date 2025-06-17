import { createContext } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";

// Define the shape of our context
export interface ListsContextType {
	lists: List[];
	requestUserData: () => void;
	listsGet: () => List[];
	listGet: (clientID: string) => List | undefined;
	groupGet: (listClientID: string, groupClientID: string) => Group | undefined;
}

// Create the context with a default value
export const ListsContext = createContext<ListsContextType | undefined>(undefined);
