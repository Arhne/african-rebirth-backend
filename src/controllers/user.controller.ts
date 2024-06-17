import { Request, Response } from "express";
import userService from "../services/user.service.js";
import {
  generateQrCodeForJson,
  generateQrcodeForUrl,
} from "../utils/functions.js";
import bcrypt from "bcryptjs";

class UserController {
  async generateQrCodeStringForUrl(req: Request, res: Response) {
    const url = req.params.url;

    const qrcode = await generateQrcodeForUrl(url);
    console.log(qrcode);

    return res.status(200).send({
      success: true,
      qrcode: qrcode,
    });
  }
  async generateQrCodeImageForUrl(req: Request, res: Response) {
    const url = req.params.url;

    const qrcode = await generateQrcodeForUrl(url);
    console.log(qrcode);

    return res.send(`<img src="${qrcode}" />`);
  }

  async createUser(req: Request, res: Response) {
    const data = {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: bcrypt.hashSync(req.body.password, 10),
      type: req.body.type,
    };
    console.log(data);
    const user = await userService.create(data);

    console.log(user);
    const qrcode = await generateQrCodeForJson(user);
    console.log(qrcode);
    user.qrcode = qrcode;
    await user.save();
    return res.status(200).send({
      success: true,
      data: user,
    });
  }
}

export default new UserController();
