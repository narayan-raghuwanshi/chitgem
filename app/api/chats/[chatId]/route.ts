import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Chat } from "@/models/Chat";

type Params = {
  params: Promise<{
    chatId: string;
  }>;
};

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectToDB();
    const { chatId } = await params;
    const { title } = await req.json();

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { title: title.trim(), updatedAt: new Date() },
      { new: true }
    );

    if (!updatedChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Rename chat failed:", error);
    return NextResponse.json(
      { error: "Failed to rename chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectToDB();
    const { chatId } = await params;

    const deletedChat = await Chat.findByIdAndDelete(chatId);
    if (!deletedChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat deleted" });
  } catch (error) {
    console.error("Delete chat failed:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}

