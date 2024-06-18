import { Request } from "express";

export interface UserRequest extends Request {
  file?: any;
  user?: {
    id: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    status: string;
    type: "user" | "admin";
    qrcode: string;
    image: string;
  };
}

export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  status: string;
  type: "user" | "admin";
  qrcode: string;
  image: string;
}

export interface UserPublicData {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  type: "user" | "admin";
  qrcode?: string;
  image: string;
}
