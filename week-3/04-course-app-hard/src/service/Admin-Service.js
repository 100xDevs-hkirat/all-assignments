import AdminRepository from "../repository/Admin-Reposiory.js";

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async signUp(data) {
    try {
      let admin = await this.adminRepository.create(data);
      return admin;
    } catch (error) {
      console.log("Something went wrong in ADMIN SERVICE");
      throw error;
    }
  }
  
  async signIn(data) {
    try {
      let admin = await this.adminRepository.getByEmail(email);
    } catch (error) {
      console.log("Something went wrong in ADMIN SERVICE");
      throw error;
    }
  }
}
