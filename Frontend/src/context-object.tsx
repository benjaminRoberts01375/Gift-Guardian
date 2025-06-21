import { createContext } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";
import User from "./types/user.tsx";

export type CookieKeys = "gg-jwt";

// Define the shape of our context
export interface ListsContextType {
	lists: List[];
	user: User | undefined;
	cookieGet: (key: CookieKeys) => string | undefined;
	requestUserData: () => void;
	listsGet: () => List[];
	listGet: (clientID: string) => List | undefined;
	listUpdate: (list: List) => void;
	listAdd: (name?: string) => List;
	listUpdateInternal: (updateList: List) => void;
	listDelete: (list: List) => void;
	groupGet: (listClientID: string, groupClientID: string) => Group | undefined;
	groupUpdate: (group: Group) => void;
	groupAdd: (listClientID: string, name?: string) => Group;
	groupUpdateInternal: (updateGroup: Group, baseListClientID: string) => void;
	groupDelete: (group: Group) => void;
	giftGet: (listClientID: string, groupClientID: string, giftClientID: string) => Gift | undefined;
	giftUpdate: (gift: Gift) => void;
	giftAdd: (listClientID: string, groupClientID: string, name?: string) => Gift;
	giftUpdateInternal: (
		updateGift: Gift,
		baseListClientID: string,
		baseGroupClientID: string,
	) => void;
	giftDelete: (listClientID: string, groupClientID: string, gift: Gift) => void;
}

// Create the context with a default value
export const ListsContext = createContext<ListsContextType | undefined>(undefined);
