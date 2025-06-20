import "../style.css";
import { useList } from "../context-hook.tsx";
import ListStyles from "./list-view.module.css";
import { useState } from "react";
import GroupView from "./group-view.tsx";
import Group from "../types/group.tsx";

interface ListProps {
	listID: string;
	defaultExpanded?: boolean;
}

const ListView = ({ listID, defaultExpanded }: ListProps) => {
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);

	const { listGet, groupAdd } = useList();
	const list = listGet(listID);

	return (
		<div id={ListStyles["List"]} className="secondary">
			<div id={ListStyles["List-Header"]}>
				<button onClick={() => setExpanded(!expanded)} id={ListStyles["List-Button"]}>
					<h1>
						{expanded ? "▾" : "▸"} {list?.name}
					</h1>
				</button>
				{expanded ? (
					// Ensure this button has the class to be styled
					<button className="flavor-button" onClick={() => groupAdd(listID)}>
						Add Group
					</button>
				) : null}
			</div>

			{expanded &&
				list?.groups.map((group: Group) => (
					<GroupView key={group.clientID} listClientID={listID} groupClientID={group.clientID} />
				))}
		</div>
	);
};

export default ListView;
