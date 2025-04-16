class Gift {
	id: string;
	name: string;
	url: string;

	constructor(name: string = "", id: string = "") {
		this.id = id;
		this.name = name;
		this.url = "";
	}
}

export default Gift;
