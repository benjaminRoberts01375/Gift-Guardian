import "../style.css";

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
		<form>
			<input type="text" placeholder="Add a gift idea" />
			<input type="text" placeholder="Where can it be gotten?" />
			<input type="text" placeholder="Notes" />
			<button role="submit" onClick={handleSubmit}>
				Add
			</button>
		</form>
	);
};

export default GiftView;
