import "../style.css";

const GroupAddView = () => {
	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		console.log("Submitting new group");
	};

	return <button onClick={handleSubmit}>Add Group</button>;
};

export default GroupAddView;
