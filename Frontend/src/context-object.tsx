import { createContext } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";

// Define the shape of our context
export interface ListsContextType {
  listsGet: () => List[];
  listGet: (id: string) => List | undefined;
  listRemove: (id: string) => void;
  listCreate: () => List;
  groupsGet: (listID: string) => Group[] | undefined;
  groupGet: (listID: string, id: string) => Group | undefined;
}

// Create the context with a default value
export const ListsContext = createContext<ListsContextType | undefined>(
  undefined,
);
