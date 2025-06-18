import Gift from "./gift.tsx";
class Group {
	id: string;
	clientID: string;
	name: string;
	gifts: Gift[];
	list_id: string;

	constructor(name: string = "Group", gifts: Gift[] = [new Gift()], id: string = "") {
		this.gifts = gifts;
		this.id = id;
		this.name = name;
		this.clientID = crypto.randomUUID();
		this.list_id = "";
	}
}

export default Group;
