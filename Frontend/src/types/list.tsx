import Group from "./group.tsx";
import User from "./user.tsx";

class List {
  id: string;
  title: string;
  groups: Group[];
  owner: User;

  constructor(
    owner: User,
    id: string = "dummy",
    title: string = "Untitled List",
    groups: Group[] = [],
  ) {
    this.owner = owner;
    this.groups = groups;
    this.id = id;
    this.title = title;
  }
}

export default List;
