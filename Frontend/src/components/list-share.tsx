import "../style.css";
import ListShareStyles from "./list-share.module.css";
import { useList } from "../context-hook.tsx";

interface ListShareProps {
	listID: string;
}

const ListShare = ({ listID }: ListShareProps) => {
	const { listGet } = useList();
	const list = listGet(listID);

	return (
		<>
			<h1>ListShare</h1>
		</>
	);
};

export default ListShare;
