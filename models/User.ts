import { ObjectId } from "mongodb";

export interface BaseUser {
  _id?: ObjectId;
  username: string;
  password?: string;
  email: string;
  groups?: ObjectId[];
}
