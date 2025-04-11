import React, { useState, ReactNode } from "react";
import List from "./types/list.tsx";
import { ListsContext, ListsContextType } from "./context-object.tsx";

// Props for the provider component
interface ListsProviderProps {
  children: ReactNode;
  initialLists?: List[];
}

// Provider component that will wrap the components that need access to the context
export const ListsProvider: React.FC<ListsProviderProps> = ({
  children,
  initialLists = [],
}) => {
  const [lists, setLists] = useState<List[]>(initialLists);

  const listsGet = () => {
    return lists;
  };

  const listRemove = (id: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== id));
  };

  // Value object that will be passed to consuming components
  const value: ListsContextType = {
    listsGet,
    listRemove,
  };

  return (
    <ListsContext.Provider value={value}>{children}</ListsContext.Provider>
  );
};
