import "../style.css";
import { useList } from "../context-hook.tsx";
import GiftView from "./gift-view.tsx";
import Gift from "../types/gift.tsx";
import GroupStyles from "./group-view.module.css";
import { FaXmark, FaCheck } from "react-icons/fa6";
import { FormEvent, useState } from "react";
import PrimaryActions from "./primary-actions.tsx";

interface GroupViewProps {
	listClientID: string;
	groupClientID: string;
}

const GroupView = ({ listClientID, groupClientID: groupClientID }: GroupViewProps) => {
	const { groupGet, groupUpdate, giftAdd } = useList();
	const group = groupGet(listClientID, groupClientID);
	const [editingGroup, setEditingGroup] = useState<boolean>(false);

	function handleCancel(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setEditingGroup(false);
	}
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (group === undefined) {
			return;
		}
		const formData = new FormData(event.currentTarget);
		group.name = formData.get("name") as string;
		groupUpdate(group);
		setEditingGroup(false);
	}

	return (
		<>
			<div id={GroupStyles["Group-Header"]} className="tertiary">
				{!editingGroup && (
					<>
						<h2 id={GroupStyles["group-name"]}>{group?.name}</h2>
						<PrimaryActions
							name="Gift"
							addFunction={() => giftAdd(listClientID, groupClientID)}
							deleteFunction={() => console.log("Delete Group Stub")}
							renameFunction={() => setEditingGroup(true)}
						/>
					</>
				)}
				{editingGroup && (
					<form
						onReset={event => handleCancel(event)}
						onSubmit={event => handleSubmit(event)}
						id={GroupStyles["inputs"]}
					>
						<input
							type="text"
							placeholder="Group name"
							className={GroupStyles["input"]}
							name="name"
							defaultValue={group?.name}
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
			<div id={GroupStyles["Gifts"]} className="primary">
				{group?.gifts.map((gift: Gift) => (
					<GiftView
						key={gift.id}
						listID={listClientID}
						groupID={groupClientID}
						giftID={gift.clientID}
					/>
				))}
			</div>
		</>
	);
};

export default GroupView;
