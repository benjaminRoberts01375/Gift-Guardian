import dashboardStyles from "./dashboard.module.css";
import "../style.css";
import AddListButton from "../components/add-list-button.tsx";
import { useList } from "../context-hook.tsx";
import ListView from "../components/list-view.tsx";
import List from "../types/list.tsx";

const Dashboard = () => {
	const { listsGet } = useList();
	return (
		<div>
			<div className={`${dashboardStyles["dashboard-header"]} layer`}>
				<h1>Your lists</h1>
				<AddListButton />
			</div>
			<div>
				{listsGet().map((list: List) => (
					<div key={list.clientID}>
						<ListView listID={list.clientID} />
					</div>
				))}
			</div>
			<div className={`${dashboardStyles["dashboard-header"]} layer`}>
				<h1>Lists shared with you</h1>
			</div>
			<div>{/* TODO: Add list entries for shared lists */}</div>
		</div>
	);
};

export default Dashboard;
