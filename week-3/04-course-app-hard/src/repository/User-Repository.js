import User from "../model/User.js";
import CrudRepository from "./Crud-Repository.js";

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
}

export default UserRepository;
