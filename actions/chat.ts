"use server";
import { streamText } from "ai";
import { gemini } from "@/lib/gemini";
import { createStreamableValue } from "@ai-sdk/rsc";
import { Message } from "@/types/message";

export const chat = async (history: Message[]) => {
  const stream = createStreamableValue();

  (async () => {
    try {
      const { textStream } = streamText({
        model: gemini("gemini-2.5-flash"),
        messages: history,
      });

      for await (const chunk of textStream) {
        stream.update(chunk);
      }
      stream.done();
    } catch (error) {
      console.error("Error in chat AI stream:", error);
      stream.error(error);
    }
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
};
