import "../style.css";
import { useList } from "../context-hook.tsx";
import ListStyles from "./list-view.module.css";
import { useState } from "react";
import GroupAddView from "./group-add-view";
import GroupView from "./group-view.tsx";
import Group from "../types/group.tsx";

interface ListProps {
	listID: string;
	defaultExpanded?: boolean;
}

const ListView = ({ listID, defaultExpanded }: ListProps) => {
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);

	const { listGet } = useList();
	const list = listGet(listID);

	return (
		<div id={ListStyles["List"]} className="layer">
			<button id={ListStyles["List-Header"]} onClick={() => setExpanded(!expanded)}>
				<h1>
					{expanded ? "▾" : "▸"} {list?.title}
				</h1>
			</button>

			{expanded && (
				<div className={`${ListStyles["Group"]} layer`}>
					{list?.groups.map((group: Group) => (
						<GroupView key={group.clientID} listClientID={listID} groupClientID={group.clientID} />
					))}
					<GroupAddView />
				</div>
			)}
		</div>
	);
};

export default ListView;
