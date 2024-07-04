import { Request, Response } from "express";
import userService from "../services/user.service.js";
import {
  generateQrCodeForJson,
  generateQrcodeForUrl,
} from "../utils/functions.js";
import bcrypt from "bcryptjs";
import { User, UserRequest } from "../interfaces/user.interface.js";
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
    const data: User = {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      type: req.body.type,
      passport: req.body.passport,
      itineraryPlan: req.body.itineraryPlan,
      inAttendance: req.body.inAttendance,
      status: req.body.status,
      password: req.body.password,
    };
    if (data.password) {
      data.password = bcrypt.hashSync(req.body.password, 10);
    }
    console.log(data);

    const emailExists = await userService.findByEmail(data.email);
    if (emailExists) {
      return res.status(409).send({
        success: false,
        message: "Email already in use",
      });
    }
    const user = await userService.create(data);

    const qrcode = await generateQrCodeForJson(user.getPublicData());

    user.qrcode = qrcode;
    await user.save();
    return res.status(200).send({
      success: true,
      data: user,
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
    const isMatch = bcrypt.compareSync(
      data.password,
      userExists.password as string
    );
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect Credentials" });
    }
    
    return res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        token: userExists.generateToken(),
        user: userExists,
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
        message: "You are not allowed to update users",
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
      data: updatedUser,
    });
  }

  async uploadImage(req: UserRequest, res: Response) {
    if (!req.file.path) {
      return res.status(400).send({
        success: false,
        message: "please provide an image file",
      });
    }
    const upload = await uploadImage(req.file?.path);

    return res.status(200).json({
      success: true,
      url: upload.url,
    });
  }
  async getUsers(req: UserRequest, res: Response) {
    const users = await userService.getAllUsers();
    return res.status(200).send({
      success: true,
      data: users,
    });
  }

  async getUserById(req: UserRequest, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Invalid id",
      });
    }
    const user = await userService.findById(id);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      success: true,
      data: user,
    });
  }
  async deleteUser(req: UserRequest, res: Response) {
    const adminId = req.user?.id;
    const admin = await userService.findById(adminId as string);
    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Invalid Token",
      });
    }

    if (admin.type !== "admin") {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to delete users",
      });
    }

    const id = req.body.id;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Invalid id",
      });
    }
    const user = await userService.findById(id);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const deleteUser = await userService.deleteUser(id);
    if (!deleteUser) {
      return res.status(500).send({
        success: false,
        message: "Failed",
      });
    }

    return res.status(200).send({
      success: true,
      message: `User with id: ${id} has been deleted successfully`,
    });
  }
}

export default new UserController();
