import { useList } from "../context-hook.tsx";
import ListStyles from "./list-view.module.css";
import { useState } from "react";

interface ListProps {
  listID: string;
  defaultExpanded?: boolean;
}

const ListView = ({ listID, defaultExpanded }: ListProps) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);

  const { listGet } = useList();
  const list = listGet(listID);

  return (
    <>
      <button
        id={ListStyles["List-Header"]}
        onClick={() => setExpanded(!expanded)}
      >
        <h1>
          {expanded ? "▾" : "▸"} {list?.title}
        </h1>
      </button>
    </>
  );
};

export default ListView;
