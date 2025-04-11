import { useContext } from "react";
import { ListsContext, ListsContextType } from "./context-object.tsx";

// Custom hook to use the context
export const useLists = (): ListsContextType => {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error("useLists must be used within a ListsProvider");
  }
  return context;
};
