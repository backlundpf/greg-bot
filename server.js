import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Ollama } from "ollama";
import { PrismaClient } from "@prisma/client";
// import { prisma } from "@/db";

const ollama = new Ollama({ host: "http://base2:11434" });

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // ...
    socket.on("new-message", async (data) => {
      const lastMessage = data.pop();

      const userMessage = data[data.length - 1];
      const insertedMessage = await prisma.message.create({
        data: userMessage,
      });
      console.log("new message:");
      console.table(data);

      const response = await ollama.chat({
        model: "gregbot",
        messages: data,
        stream: true,
      });

      // let messageContent = "";
      for await (const part of response) {
        // console.log(part);
        lastMessage.content = lastMessage.content.concat(part.message.content);
        socket.emit("update-message-" + lastMessage.id, {
          id: lastMessage.id,
          chatId: lastMessage.chatId,
          createdAt: part.created_at,
          content: part.message.content,
          isCompleted: part.done,
        });
      }

      const insertedResponse = await prisma.message.create({
        data: lastMessage,
      });

      // console.log("newResponse: ", insertedResponse);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
