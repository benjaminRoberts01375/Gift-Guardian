import addListButtonStyles from "./add-list-button.module.css";
import "../style.css";
import { useList } from "../context-template.tsx";
import List from "../types/list.tsx";
import User from "../types/user.tsx";

const AddListButton = () => {
  const { addList } = useList();

  const createNewList = () => {
    console.log("Creating new list");
    addList(new List(new User("ben", "Benjamin", "Roberts"))); // TODO: Replace with actual user
  };

  return (
    <button onClick={createNewList} id={addListButtonStyles["add-list-button"]}>
      ＋
    </button>
  );
};

export default AddListButton;
