import { createContext } from "react";
import List from "./types/list.tsx";

// Define the shape of our context
export interface ListsContextType {
	lists: List[];
	requestUserData: () => void;
	listsGet: () => List[];
	listGet: (clientID: string) => List | undefined;
}

// Create the context with a default value
export const ListsContext = createContext<ListsContextType | undefined>(undefined);
