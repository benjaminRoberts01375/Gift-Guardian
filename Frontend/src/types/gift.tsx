class Gift {
	id: string;
	name: string;
	url: string;
	clientID: string;

	constructor(name: string = "", id: string = "") {
		this.id = id;
		this.name = name;
		this.url = "";
		this.clientID = crypto.randomUUID();
	}
}

export default Gift;
