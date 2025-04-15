import Gift from "./gift.tsx";
class Group {
  id: string;
  clientID: string;
  name: string;
  gifts: Gift[];

  constructor(name: string, gifts: Gift[] = [], id: string = "") {
    this.gifts = gifts;
    this.id = id;
    this.name = name;
    this.clientID = crypto.randomUUID();
  }
}

export default Group;
