import "../style.css";
import PrimaryActionsStyles from "./primary-actions.module.css";
import { BiRename } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";

interface PrimaryActionsProps {
	name: "List" | "Group" | "Gift";
	addFunction: () => void;
	deleteFunction: () => void;
	renameFunction: () => void;
}

const PrimaryActions = ({
	name,
	addFunction,
	deleteFunction,
	renameFunction,
}: PrimaryActionsProps) => {
	return (
		<div id={PrimaryActionsStyles["Primary-Actions"]}>
			<button className="flavor-button" id={PrimaryActionsStyles["Add"]} onClick={addFunction}>
				Add {name}
			</button>
			<button className="flavor-icon" onClick={() => renameFunction()}>
				<BiRename />
			</button>
			<button className="flavor-icon" onClick={() => deleteFunction()}>
				<FaTrashCan />
			</button>
		</div>
	);
};

export default PrimaryActions;
