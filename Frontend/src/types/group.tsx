import Gift from "./gift.tsx";

class Group {
  id: string;
  name: string;
  gifts: Gift[];

  constructor(id: string, name: string = "Unsorted", gifts: Gift[] = []) {
    this.gifts = gifts;
    this.id = id;
    this.name = name;
  }
}

export default Group;
