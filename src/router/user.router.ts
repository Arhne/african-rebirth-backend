import express from "express";
import userController from "../controllers/user.controller.js";

export const userRouter = express.Router();


userRouter.post("/create", userController.createUser)
userRouter.get("/:url", userController.generateQrCodeStringForUrl);
userRouter.get("/link/:url", userController.generateQrCodeImageForUrl);

