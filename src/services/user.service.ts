import { userModel } from "../models/user.model.js";

class UserService {
  async create(data: any) {
    const user = await userModel.create(data);
    return user;
  }
}

export default new UserService();
