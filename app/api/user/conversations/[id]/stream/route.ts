import googleGenerativeAI from "@/lib/@google-generative-ai";
import logger from "@/lib/consola/logger";
import prisma from "@/lib/prisma/index.prisma";
import { MessageSender } from "@prisma/client";
import { NextRequest } from "next/server";

const updateUserConversationHandler = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const { message, modelId } = await req.json();

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            content: true,
            sender: true,
          },
        },
      },
    });

    if (!conversation) {
      return new Response("Invalid conversation id", { status: 400 });
    }

    const model = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!model) {
      return new Response("Invalid model id", { status: 400 });
    }

    const aiModel = await googleGenerativeAI.genAI.getGenerativeModel({
      model: model.name,
    });

    const chat = aiModel.startChat({
      history: conversation.messages.map((message) => ({
        role: message.sender === MessageSender.USER ? "user" : "model",
        parts: [{ text: message.content }],
      })),
    });

    const { stream } = await chat.sendMessageStream(message);
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode("data: start\n\n"));

        for await (const chunk of stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(`data: ${text}\n\n`));
        }

        controller.enqueue(encoder.encode("data: done\n\n"));
        controller.close();
      },
      cancel() {
        console.log("Stream cancelled");
      },
    });

    // Actualiza la conversación DESPUÉS de que el stream se haya completado.
    await prisma.conversation.update({
      where: { id },
      data: {
        messages: {
          create: {
            content: message,
            sender: MessageSender.USER,
          },
        },
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    logger.error("[ERROR-CREATE-CONVERSATION-HANDLER]", err);
    const encoder = new TextEncoder();
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: error\n\n"));
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      status: 500,
    });
  }
};

const POST = updateUserConversationHandler;

export { POST };