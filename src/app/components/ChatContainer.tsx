import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import ChatMessage from "./ChatMessage";
import { Message } from "../../types/message";
import { uuidv4 } from "../common/crypto";
import { socket } from "@/socket";

export default function ChatContainer({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  async function submitMessage(message: string) {
    const newMessage = {
      id: uuidv4(),
      chatId,
      role: "user",
      content: message,
      isCompleted: true,
    };

    const responseMessage = {
      id: uuidv4(),
      chatId,
      role: "assistant",
      content: "",
      isCompleted: false,
    };

    const newMessages = [...messages, newMessage, responseMessage];

    setMessages(newMessages);

    socket.emit("new-message", newMessages);
    // const response = await fetch("api/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newMessages),
    // });
  }

  function completeMessage(messageId: string, completedMessage: string) {
    const newMessages = messages.map((message) => {
      if (message.id == messageId) {
        return { ...message, isCompleted: true, content: completedMessage };
      }
      return message;
    });
    setMessages(newMessages);
  }

  return (
    <div className="flex flex-col justify-end min-h-screen ">
      <div className="flex flex-col justify-end gap-y-4 overflow-auto">
        {messages.length ? (
          messages.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                message={message}
                onComplete={completeMessage}
              ></ChatMessage>
            );
          })
        ) : (
          <EmptyChat></EmptyChat>
        )}
      </div>
      <ChatInput onSubmit={submitMessage}></ChatInput>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
    </div>
  );
}
