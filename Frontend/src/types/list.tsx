import Group from "./group.tsx";
import User from "./user.tsx";

class List {
	id: string;
	clientID: string;
	title: string;
	groups: Group[];
	owner: User;

	constructor(
		owner: User,
		id: string = "",
		title: string = "Untitled List",
		groups: Group[] = [new Group("Unsorted")],
	) {
		this.owner = owner;
		this.groups = groups;
		this.id = id;
		this.title = title;
		this.clientID = crypto.randomUUID();
	}
}

export default List;
