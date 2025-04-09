class User {
  username: string;
  first_name: string;
  last_name: string;

  constructor(username: string, first_name: string, last_name: string) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
  }
}

export default User;
