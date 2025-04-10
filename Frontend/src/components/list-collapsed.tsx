import listStyles from "./list.module.css";
import "../style.css";
import { useList } from "../context-template.tsx";

interface ListCollapsedProps {
  listID: string;
}

const ListCollapsed = ({ listID }: ListCollapsedProps) => {
  const { getList } = useList();
  const list = getList(listID);
  return (
    <div id={listStyles["List-entry"]}>
      <h1>▸ {list?.title}</h1>
    </div>
  );
};

export default ListCollapsed;
