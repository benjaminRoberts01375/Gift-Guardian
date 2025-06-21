import "../style.css";
import { useList } from "../context-hook.tsx";
import ListStyles from "./list-view.module.css";
import { useState } from "react";
import GroupView from "./group-view.tsx";
import Group from "../types/group.tsx";
import PrimaryActions from "./primary-actions.tsx";
import { useRef } from "react";
import ConfirmDelete from "./confirm-delete.tsx";

interface ListProps {
	listID: string;
	defaultExpanded?: boolean;
}

const ListView = ({ listID, defaultExpanded }: ListProps) => {
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const { listGet, listDelete, groupAdd } = useList();
	const list = listGet(listID);

	return (
		<>
			<dialog ref={dialogRef}>
				<ConfirmDelete
					onConfirm={() => {
						if (list === undefined) {
							return;
						}
						listDelete(list);
					}}
					onCancel={() => dialogRef.current?.close()}
					name={list?.name ?? "Untitled List"}
					type="List"
				/>
			</dialog>

			<div id={ListStyles["List"]} className="secondary">
				<div id={ListStyles["List-Header"]}>
					<button onClick={() => setExpanded(!expanded)} id={ListStyles["List-Button"]}>
						<h1>
							{expanded ? "▾" : "▸"} {list?.name}
						</h1>
					</button>
					{expanded ? (
						<PrimaryActions
							name="Group"
							addFunction={() => groupAdd(listID)}
							deleteFunction={() => {
								if (list === undefined) {
									return;
								}
								dialogRef.current?.showModal();
							}}
							renameFunction={() => console.log("Rename List")}
						/>
					) : null}
				</div>

				{expanded &&
					list?.groups.map((group: Group) => (
						<GroupView key={group.clientID} listClientID={listID} groupClientID={group.clientID} />
					))}
			</div>
		</>
	);
};

export default ListView;
