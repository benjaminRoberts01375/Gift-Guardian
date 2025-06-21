import "../style.css";
import GiftStyles from "./gift-view.module.css";
import { useList } from "../context-hook.tsx";
import { FormEvent, useState } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";

interface ListGiftProps {
	listID: string;
	groupID: string;
	giftID: string;
}

const GiftView = ({ listID, groupID, giftID }: ListGiftProps) => {
	const { giftGet, giftUpdate } = useList();
	const gift = giftGet(listID, groupID, giftID);
	const [giftName, setGiftName] = useState<string>(gift?.name ?? "Untitled Gift");
	const [giftURL, setGiftURL] = useState<string>(gift?.url ?? "");
	const [giftDescription, setGiftDescription] = useState<string>(gift?.description ?? "");
	const [showSave, setShowSave] = useState<boolean>(false);

	// Modify giftDiffers to accept the current input values
	function giftDiffers(currentName: string, currentURL: string, currentDescription: string) {
		const giftChange =
			(currentName !== gift?.name && !(currentName === "" && gift?.name === undefined)) ||
			(currentURL !== gift?.url && !(currentURL === "" && gift?.url === undefined)) ||
			(currentDescription !== gift?.description &&
				!(currentDescription === "" && gift?.description === currentDescription));
		setShowSave(giftChange);
	}

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
		giftUpdate(gift);
	};

	const handleReset = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setGiftName(gift?.name ?? "Untitled Gift");
		setGiftURL(gift?.url ?? "");
		setGiftDescription(gift?.description ?? "");
		setShowSave(false);
	};

	return (
		<form
			id={GiftStyles["inputs"]}
			className="secondary"
			onSubmit={event => handleSubmit(event)}
			onReset={event => handleReset(event)}
		>
			<input
				type="text"
				placeholder="Item name"
				className={GiftStyles["field"]}
				id={GiftStyles["input-top"]}
				value={giftName}
				name="name"
				onChange={event => {
					setGiftName(event.target.value);
					giftDiffers(event.target.value, giftURL, giftDescription);
				}}
			/>
			<input
				type="text"
				placeholder="Where to get"
				className={GiftStyles["field"]}
				value={giftURL}
				name="url"
				onChange={event => {
					setGiftURL(event.target.value);
					giftDiffers(giftName, event.target.value, giftDescription);
				}}
			/>
			<input
				type="text"
				placeholder="Notes"
				className={GiftStyles["field"]}
				id={GiftStyles["input-bottom"]}
				value={giftDescription}
				name="description"
				onChange={event => {
					setGiftDescription(event.target.value);
					giftDiffers(giftName, giftURL, event.target.value);
				}}
			/>
			{showSave && (
				<div id={GiftStyles["save-container"]}>
					<button role="submit" type="submit" className="flavor-icon">
						<FaCheck />
					</button>
					<button className="flavor-icon" type="reset">
						<FaXmark />
					</button>
				</div>
			)}
		</form>
	);
};

export default GiftView;
