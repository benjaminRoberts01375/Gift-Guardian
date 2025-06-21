import "../style.css";

interface ConfirmDeleteProps {
	onConfirm: () => void;
	onCancel: () => void;
	name: string;
	type: "List" | "Group" | "Gift";
}

const ConfirmDelete = ({ onConfirm, onCancel, name, type }: ConfirmDeleteProps) => {
	return (
		<div className="tertiary">
			<h2>Just Checking</h2>
			<p>
				Are you sure you want to delete the {type.toLowerCase()} "{name}"?
			</p>
			<div id="buttons">
				<button className="flavor-button" onClick={() => onConfirm()}>
					Delete {type}
				</button>
				<button className="flavor-button" onClick={() => onCancel()}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ConfirmDelete;
