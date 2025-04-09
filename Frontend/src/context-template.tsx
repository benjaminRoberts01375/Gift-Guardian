import { createContext, useContext } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";

// Define types for the context actions
export type ListContextType = {
  lists: List[];
  setLists: (lists: List[]) => void;
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;

  // List operations
  addList: (list: List) => void;
  updateList: (listId: string, updatedList: Partial<List>) => void;
  removeList: (listId: string) => void;
  updateListTitle: (listId: string, title: string) => void;

  // Group operations
  addGroup: (listId: string, group: Group) => void;
  updateGroup: (
    listId: string,
    groupId: string,
    updatedGroup: Partial<Group>,
  ) => void;
  removeGroup: (listId: string, groupId: string) => void;

  // Gift operations
  addGift: (listId: string, groupId: string, gift: Gift) => void;
  updateGift: (
    listId: string,
    groupId: string,
    giftId: string,
    updatedGift: Partial<Gift>,
  ) => void;
  removeGift: (listId: string, groupId: string, giftId: string) => void;
  moveGift: (
    listId: string,
    fromGroupId: string,
    toGroupId: string,
    giftId: string,
  ) => void;
};

// Create the context with default values
export const ListContext = createContext<ListContextType>({
  lists: [],
  setLists: () => {},
  activeListId: null,
  setActiveListId: () => {},
  addList: () => {},
  updateList: () => {},
  removeList: () => {},
  updateListTitle: () => {},
  addGroup: () => {},
  updateGroup: () => {},
  removeGroup: () => {},
  addGift: () => {},
  updateGift: () => {},
  removeGift: () => {},
  moveGift: () => {},
});

// Create a custom hook to use the context
export const useList = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
