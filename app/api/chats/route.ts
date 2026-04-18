import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Chat } from "@/models/Chat";
import { auth } from "@clerk/nextjs/server";

// GET: fetch all chats
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
  return NextResponse.json(chats);
}

// POST: create new chat
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const { title } = await req.json();
  const chat = new Chat({ title, userId, messages: [] });
  await chat.save();
  return NextResponse.json(chat);
}

// DELETE: delete a chat by ID
// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ chatId: string[] }> }
// ) {
//   await connectToDB();
//   const { chatId } = await context.params;
//   await Chat.findByIdAndDelete(chatId);
//   return NextResponse.json({ message: "Chat deleted" });
// }

// // PATCH: update a chat by ID
// export default async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ chatId: string[] }> }
// ) {
//   await connectToDB();
//   const { chatId } = await context.params;
//   const { title } = await req.json();
//   const chat = await Chat.findByIdAndUpdate(chatId, { title }, { new: true });
//   return NextResponse.json(chat);
// }
