import addListButtonStyles from "./add-list-button.module.css";
import "../style.css";
import { useList } from "../context-hook.tsx";

const AddListButton = () => {
	const { listCreate } = useList();

	const createNewList = () => {
		listCreate();
	};

	return (
		<button onClick={createNewList} id={addListButtonStyles["add-list-button"]}>
			＋
		</button>
	);
};

export default AddListButton;
