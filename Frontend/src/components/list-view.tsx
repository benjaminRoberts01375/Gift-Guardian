import "../style.css";
import { useList } from "../context-hook.tsx";
import ListStyles from "./list-view.module.css";
import { FormEvent, useState } from "react";
import GroupView from "./group-view.tsx";
import Group from "../types/group.tsx";
import PrimaryActions from "./primary-actions.tsx";
import { useRef } from "react";
import ConfirmDelete from "./confirm-delete.tsx";
import { FaXmark, FaCheck } from "react-icons/fa6";

interface ListProps {
	listID: string;
	defaultExpanded?: boolean;
}

const ListView = ({ listID, defaultExpanded }: ListProps) => {
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);
	const dialogRefDelete = useRef<HTMLDialogElement | null>(null);
	const { listGet, listUpdate, listDelete, groupAdd } = useList();
	const list = listGet(listID);
	const [editingList, setEditingList] = useState<boolean>(false);

	function handleCancel(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setEditingList(false);
	}
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (list === undefined) {
			return;
		}
		const formData = new FormData(event.currentTarget);
		list.name = formData.get("name") as string;
		listUpdate(list);
		setEditingList(false);
	}

	return (
		<>
			<dialog ref={dialogRefDelete}>
				<ConfirmDelete
					onConfirm={() => {
						if (list === undefined) {
							return;
						}
						listDelete(list);
					}}
					onCancel={() => dialogRefDelete.current?.close()}
					name={list?.name ?? "Untitled List"}
					type="List"
				/>
			</dialog>

			<div id={ListStyles["List"]} className="secondary">
				<div id={ListStyles["List-Header"]}>
					{!expanded && !editingList && (
						<button onClick={() => setExpanded(!expanded)} id={ListStyles["List-Button"]}>
							<h1>▸ {list?.name}</h1>
						</button>
					)}
					{expanded && !editingList && (
						<>
							<button onClick={() => setExpanded(!expanded)} id={ListStyles["List-Button"]}>
								<h1>▾ {list?.name}</h1>
							</button>
							<PrimaryActions
								name="Group"
								addFunction={() => groupAdd(listID)}
								deleteFunction={() => {
									if (list === undefined) {
										return;
									}
									dialogRefDelete.current?.showModal();
								}}
								renameFunction={() => setEditingList(true)}
							/>
						</>
					)}
					{editingList && (
						<form
							onReset={event => handleCancel(event)}
							onSubmit={event => handleSubmit(event)}
							className="edit-name-container"
						>
							<input
								type="text"
								placeholder="List name"
								className="edit-name"
								name="name"
								defaultValue={list?.name}
							/>
							<button className="flavor-button" type="submit">
								<FaCheck />
							</button>
							<button className="flavor-button" type="reset">
								<FaXmark />
							</button>
						</form>
					)}
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
