import "../style.css";
import { useList } from "../context-hook.tsx";
import GiftView from "./gift-view.tsx";
import Gift from "../types/gift.tsx";
import GroupStyles from "./group-view.module.css";

interface GroupViewProps {
	listClientID: string;
	groupClientID: string;
}

const GroupView = ({ listClientID, groupClientID: groupClientID }: GroupViewProps) => {
	const { groupGet, giftAdd } = useList();
	const group = groupGet(listClientID, groupClientID);

	return (
		<>
			<div id={GroupStyles["Group-Header"]}>
				<h2>{group?.name}</h2>
				<button className="flavor-button" onClick={() => giftAdd(listClientID, groupClientID)}>
					Add Gift
				</button>
			</div>
			<div id={GroupStyles["Gifts"]}>
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
