import express from "express";
import userController from "../controllers/user.controller.js";
import authentication from "../middleware/auth.middleware.js";
import store from "../config/multer.config.js";

export const userRouter = express.Router();


userRouter.post("/create", userController.createUser)
userRouter.post("/login", userController.login)
userRouter.put("/image",authentication, store.single("image"), userController.updateImage)
userRouter.put("/update", authentication, userController.updateUser)
userRouter.get("/:url", userController.generateQrCodeStringForUrl);
userRouter.get("/link/:url", userController.generateQrCodeImageForUrl);

