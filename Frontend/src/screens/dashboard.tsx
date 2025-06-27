import dashboardStyles from "./dashboard.module.css";
import "../style.css";
import { useList } from "../context-hook.tsx";
import ListView from "../components/list-view.tsx";
import List from "../types/list.tsx";
import { useEffect } from "react";

const Dashboard = () => {
	const { user, listsGet, listAdd, userRequestData } = useList();

	useEffect(() => {
		if (user === undefined) {
			userRequestData();
		}
	}, [user, userRequestData]);

	return (
		<>
			<div className={`${dashboardStyles["dashboard-header"]} secondary`}>
				<h1>Your lists</h1>
				<button className="flavor-button" onClick={() => listAdd()}>
					Add List
				</button>
			</div>
			<div>
				{listsGet().map((list: List) => (
					<div key={list.clientID}>
						<ListView listID={list.clientID} />
					</div>
				))}
			</div>
			<div className={`${dashboardStyles["dashboard-header"]} secondary`}>
				<h1>Lists shared with you</h1>
			</div>
			<div>{/* TODO: Add list entries for shared lists */}</div>
		</>
	);
};

export default Dashboard;
