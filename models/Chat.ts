import mongoose, { Schema, model, models } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChat {
  title: string;
  userId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true },
  content: { type: String, required: true },
});

const ChatSchema = new Schema<IChat>(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model<IChat>("Chat", ChatSchema);
