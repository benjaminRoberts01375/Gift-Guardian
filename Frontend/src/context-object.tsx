import { createContext } from "react";
import List from "./types/list.tsx";

// Define the shape of our context
export interface ListsContextType {
  listsGet: () => List[];
  listRemove: (id: string) => void;
}

// Create the context with a default value
export const ListsContext = createContext<ListsContextType | undefined>(
  undefined,
);
