import "../style.css";
import GiftStyles from "./gift-view.module.css";
import { useList } from "../context-hook.tsx";

interface ListGiftProps {
	listID: string;
	groupID: string;
	giftID: string;
}

const GiftView = ({ listID, groupID, giftID }: ListGiftProps) => {
	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		console.log("Submitting for", listID, groupID, giftID);
	};
	const { giftGet } = useList();
	const gift = giftGet(listID, groupID, giftID);

	return (
		<form id={GiftStyles["inputs"]} className="layer-down">
			<input
				defaultValue={gift?.name ?? "Untitled Gift"}
				type="text"
				placeholder="Item Name"
				className={GiftStyles["field"]}
			/>
			<input
				defaultValue={gift?.url ?? ""}
				type="text"
				placeholder="URL or Location"
				className={GiftStyles["field"]}
			/>
			<input type="text" placeholder="Notes" className={GiftStyles["field"]} />
			<button role="submit" onClick={handleSubmit} id={GiftStyles["save"]}>
				Save
			</button>
		</form>
	);
};

export default GiftView;
