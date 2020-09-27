import UserModel from "../models/User";
import TryCatchErrorDecorator from "../decorators/TryCatchErrorDecorator";

class UsersController {
  @TryCatchErrorDecorator
  static async index(req, res) {
    console.log(`user:${req}`)
    const users = await UserModel.find().select("_id name email type");

    res.json(users);
  }
}

export default UsersController;
