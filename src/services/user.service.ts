import { userModel } from "../models/user.model.js";

class UserService {
  async create(data: any) {
    const user = await userModel.create(data);
    return user;
  }
  async findByEmail(email: string) {
    const user = await userModel.findOne({ email: email });
    return user;
  }
  async findById(id: string) {
    const user = await userModel.findById(id);
    return user;
  }

  async update(id: string, data: any) {
    const user = await userModel.findByIdAndUpdate(id, data, { new: true });
    return user;
  }
  async getAllUsers() {
    const users = await userModel.find({ type: "user" });
    return users;
  }
}

export default new UserService();
