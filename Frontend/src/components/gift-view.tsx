import "../style.css";
import GiftStyles from "./gift-view.module.css";

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

	return (
		<form id={GiftStyles["inputs"]} className="layer-down">
			<input type="text" placeholder="Item Name" className={GiftStyles["field"]} />
			<input type="text" placeholder="URL or Location" className={GiftStyles["field"]} />
			<input type="text" placeholder="Notes" className={GiftStyles["field"]} />
			<button role="submit" onClick={handleSubmit} id={GiftStyles["save"]}>
				Save
			</button>
		</form>
	);
};

export default GiftView;
