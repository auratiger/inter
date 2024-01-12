import { ObjectId } from "mongodb";

export interface Message {
  text: string;
  groupId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
}
