import dashboardStyles from "./dashboard.module.css";
import "../style.css";
const Dashboard = () => {
  return (
    <div>
      <div className={dashboardStyles["dashboard-header"]}>
      </div>
      <div className={dashboardStyles["dashboard-header"]}>
        <h1>Lists shared with you</h1>
      </div>
    </div>
  );
};

export default Dashboard;
