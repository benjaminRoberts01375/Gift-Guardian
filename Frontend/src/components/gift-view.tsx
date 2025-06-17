import "../style.css";
import GiftStyles from "./gift-view.module.css";
import { useList } from "../context-hook.tsx";
import { FormEvent } from "react";

interface ListGiftProps {
	listID: string;
	groupID: string;
	giftID: string;
}

const GiftView = ({ listID, groupID, giftID }: ListGiftProps) => {
	const { giftGet, giftUpdate } = useList();
	const gift = giftGet(listID, groupID, giftID);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("Submitting for", listID, groupID, giftID);
		const formData = new FormData(event.currentTarget);

		if (gift === undefined) {
			return;
		}
		gift.name = formData.get("name") as string;
		gift.url = formData.get("url") as string;
		gift.description = formData.get("description") as string;
		console.log("Updating gift", gift);
		giftUpdate(gift);
	};

	return (
		<form
			id={GiftStyles["inputs"]}
			className="layer-down"
			onSubmit={event => {
				handleSubmit(event);
			}}
		>
			<input
				defaultValue={gift?.name ?? "Untitled Gift"}
				type="text"
				placeholder="Item Name"
				className={GiftStyles["field"]}
				name="name"
			/>
			<input
				defaultValue={gift?.url ?? ""}
				type="text"
				placeholder="URL or Location"
				className={GiftStyles["field"]}
				name="url"
			/>
			<input
				defaultValue={gift?.description ?? ""}
				type="text"
				placeholder="Notes"
				className={GiftStyles["field"]}
				name="description"
			/>
			<button role="submit" type="submit" id={GiftStyles["save"]}>
				Save
			</button>
		</form>
	);
};

export default GiftView;
