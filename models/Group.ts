import { ObjectId } from "mongodb";

export interface Group {
  name: string;
  image_url: string;
  createdAt: Date;
  users: ObjectId[];
  messages: ObjectId[];
}
