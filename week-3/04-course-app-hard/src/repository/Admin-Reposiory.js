import Admin from "../model/admin.js";
import CrudRepository from "./Crud-Repository.js";

class AdminRepository extends CrudRepository {
  constructor() {
    super(Admin);
  }

  async getByEmail(email) {
    try {
      let response = await Admin.findOne({ email: email });
      return response;
    } catch (error) {
      console.log("Something went wrong in the ADMIN REPO");
      throw error;
    }
  }
}

export default AdminRepository;
