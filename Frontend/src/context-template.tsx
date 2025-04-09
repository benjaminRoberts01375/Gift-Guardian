import { createContext, useContext } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";

// Define types for the context actions
export type ListContextType = {
  list: List | null;
  setList: (list: List) => void;

  // Group operations
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updatedGroup: Partial<Group>) => void;
  removeGroup: (groupId: string) => void;

  // Gift operations
  addGift: (groupId: string, gift: Gift) => void;
  updateGift: (
    groupId: string,
    giftId: string,
    updatedGift: Partial<Gift>,
  ) => void;
  removeGift: (groupId: string, giftId: string) => void;
  moveGift: (fromGroupId: string, toGroupId: string, giftId: string) => void;

  // List operations
  updateListTitle: (title: string) => void;
};

// Create the context with default values
export const ListContext = createContext<ListContextType>({
  list: null,
  setList: () => {},
  addGroup: () => {},
  updateGroup: () => {},
  removeGroup: () => {},
  addGift: () => {},
  updateGift: () => {},
  removeGift: () => {},
  moveGift: () => {},
  updateListTitle: () => {},
});

// Create a custom hook to use the context
export const useList = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
