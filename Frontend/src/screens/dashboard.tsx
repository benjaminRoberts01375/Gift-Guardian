import dashboardStyles from "./dashboard.module.css";
import "../style.css";
import AddListButton from "../components/add-list-button.tsx";
import { useList } from "../context-template.tsx";
import ListCollapsed from "../components/list-collapsed.tsx";

const Dashboard = () => {
  const { lists } = useList();
  return (
    <div>
      <div className={dashboardStyles["dashboard-header"]}>
        <h1>Your lists</h1>
        {lists.find((list) => list.id === "dummy") ? null : <AddListButton />}
      </div>
      <div>
        {lists.map((list) => (
          <div>
            <h1>{list.title}</h1>
            <ListCollapsed listID={list.id} />
          </div>
        ))}
      </div>
      <div className={dashboardStyles["dashboard-header"]}>
        <h1>Lists shared with you</h1>
      </div>
      <div>{/* TODO: Add list entries for shared lists */}</div>
    </div>
  );
};

export default Dashboard;
