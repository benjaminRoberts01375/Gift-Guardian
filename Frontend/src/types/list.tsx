import Group from "./group.tsx";
import User from "./user.tsx";

class List {
	id: string;
	clientID: string;
	name: string;
	groups: Group[];
	owner: User;
	isPrivate: boolean;

	constructor(
		owner: User,
		id: string = "",
		title: string = "Untitled List",
		groups: Group[] = [new Group("Unsorted")],
	) {
		this.owner = owner;
		this.groups = groups;
		this.id = id;
		this.name = title;
		this.clientID = crypto.randomUUID();
		this.isPrivate = false;
	}
}

export default List;
