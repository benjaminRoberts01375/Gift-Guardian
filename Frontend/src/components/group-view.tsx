import "../style.css";
import { useList } from "../context-hook.tsx";
import GiftView from "./gift-view.tsx";
import Gift from "../types/gift.tsx";

interface GroupViewProps {
	listClientID: string;
	groupClientID: string;
}

const GroupView = ({ listClientID, groupClientID: groupClientID }: GroupViewProps) => {
	const { groupGet } = useList();
	const group = groupGet(listClientID, groupClientID);

	return (
		<>
			<h2>{group?.name}</h2>
			{group?.gifts.map((gift: Gift) => (
				<GiftView key={gift.id} listID={listClientID} groupID={groupClientID} giftID={gift.id} />
			))}
		</>
	);
};

export default GroupView;
