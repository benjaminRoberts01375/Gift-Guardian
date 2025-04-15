import Gift from "./gift.tsx";
class Group {
  id: string;
  clientID: string;
  name: string;
  gifts: Gift[];

  constructor(id: string = "", name: string = "Unsorted", gifts: Gift[] = []) {
    this.gifts = gifts;
    this.id = id;
    this.name = name;
    this.clientID = crypto.randomUUID();
  }
}

export default Group;
