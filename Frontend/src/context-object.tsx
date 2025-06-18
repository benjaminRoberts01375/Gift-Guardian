import { createContext } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";
import User from "./types/user.tsx";

// Define the shape of our context
export interface ListsContextType {
	lists: List[];
	user: User | undefined;
	requestUserData: () => void;
	listsGet: () => List[];
	listGet: (clientID: string) => List | undefined;
	groupGet: (listClientID: string, groupClientID: string) => Group | undefined;
	giftGet: (listClientID: string, groupClientID: string, giftClientID: string) => Gift | undefined;
	giftUpdate: (gift: Gift) => void;
}

// Create the context with a default value
export const ListsContext = createContext<ListsContextType | undefined>(undefined);
