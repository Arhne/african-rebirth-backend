import { Request, Response } from "express";
import userService from "../services/user.service.js";
import {
  generateQrCodeForJson,
  generateQrcodeForUrl,
} from "../utils/functions.js";
import bcrypt from "bcryptjs";
import { UserRequest } from "../interfaces/user.interface.js";
import { uploadImage } from "../config/cloudinary.config.js";

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

    const emailExists = await userService.findByEmail(data.email);
    if (emailExists) {
      return res.status(409).send({
        success: false,
        message: "Email already in use",
      });
    }
    const user = await userService.create(data);

    console.log(user);
    const qrcode = await generateQrCodeForJson(user.getPublicData());
    console.log(qrcode);
    user.qrcode = qrcode;
    await user.save();
    return res.status(200).send({
      success: true,
      data: user.getPublicData(),
    });
  }

  async login(req: Request, res: Response) {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    const userExists = await userService.findByEmail(data.email);
    if (!userExists) {
      return res
        .status(404)
        .send({ success: false, message: "Email does not exist" });
    }
    const isMatch = bcrypt.compareSync(data.password, userExists.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect Credentials" });
    }
    const userPublicData = userExists.getPublicData();
    return res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        token: userExists.generateToken(),
        ...userPublicData,
      },
    });
  }

  async updateUser(req: UserRequest, res: Response) {
    const userId = req.user?.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Invalid Token",
      });
    }

    const user = await userService.findById(userId);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid Token, User not found.",
      });
    }
    if (user.type !== "admin") {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to update this user",
      });
    }
    const updatedUser = await userService.update(data.id, data);
    if (!updatedUser) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const updatedUserPublicData = updatedUser.getPublicData();
    delete updatedUserPublicData.qrcode;
    const qrcode = await generateQrCodeForJson(updatedUserPublicData);
    console.log(qrcode);
    updatedUser.qrcode = qrcode;
    await user.save();
    return res.status(200).send({
      success: true,
      data: updatedUser.getPublicData(),
    });
  }
  async updateImage(req: UserRequest, res: Response) {
    if (!req.file.path) {
      return res.status(400).send({
        success: false,
        message: "please provide an image file",
      });
    }
    const id = req.user?.id;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Invalid token",
      });
    }
    const user = await userService.findById(id);

    if (!user) {
      return res.status(404).send({
        suucess: false,
        message: "User not found",
      });
    }

    const upload = await uploadImage(req.file?.path);
    user.image = upload.url;
    await user.save();

    return res.status(200).json({
      success: true,
      data: user.getPublicData(),
    });
  }
}

export default new UserController();
