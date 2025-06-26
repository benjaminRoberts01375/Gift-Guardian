import "../style.css";
import ListShareStyles from "./list-share.module.css";
import { useList } from "../context-hook.tsx";

interface ListShareProps {
	listID: string;
	onClose: () => void;
}

const ListShare = ({ listID, onClose }: ListShareProps) => {
	const { listGet, listUpdate } = useList();
	const list = listGet(listID);

	function copyLink() {
		navigator.clipboard.writeText(`gg.benlab.us/list/${list?.id}`);
	}

	function checkIfPrivate(event: React.ChangeEvent<HTMLInputElement>) {
		if (list === undefined) {
			return;
		}
		list.isPrivate = event.target.checked;
		listUpdate(list);
	}

	return (
		<div>
			<h2>List Sharing</h2>
			<div id={ListShareStyles["link-container"]}>
				<a href={`gg.benlab.us/list/${list?.id}`} id={ListShareStyles["link"]}>
					gg.benlab.us/list/{list?.id}
				</a>
				<button className="flavor-button" onClick={copyLink}>
					Copy Link
				</button>
			</div>
			<p id={ListShareStyles["responsible-warning"]}>
				Public links can be reshared. Share responsibly, and set to private anytime.
			</p>
			<div id={ListShareStyles["actions"]}>
				<input type="checkbox" id={ListShareStyles["private-checkbox"]} onChange={checkIfPrivate} />
				<label htmlFor={ListShareStyles["private-checkbox"]} id={ListShareStyles["private-label"]}>
					Private
				</label>
				<button
					className="flavor-button-distant"
					id={ListShareStyles["close-button"]}
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default ListShare;
