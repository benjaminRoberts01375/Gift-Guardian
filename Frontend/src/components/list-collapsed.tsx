import listStyles from "./list.module.css";
import "../style.css";
import { useList } from "../context-hook.tsx";

interface ListCollapsedProps {
  listID: string;
}

const ListCollapsed = ({ listID }: ListCollapsedProps) => {
  const { listGet } = useList();
  const list = listGet(listID);
  return (
    <div id={listStyles["List-entry"]}>
      <h1>▸ {list?.title}</h1>
    </div>
  );
};

export default ListCollapsed;
