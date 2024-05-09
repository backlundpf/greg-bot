import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import ChatMessage from "./ChatMessage";
import { Message, Role } from "../../types/message";
import { uuidv4 } from "../common/crypto";
import { socket } from "@/socket";
import ReactFlow from "reactflow";

export default function ChatContainer({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [respondingTo, setRespondingTo] = useState("");

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

  async function submitMessage(message: string, parentGroupId?: string) {
    if (!isConnected) return;
    const groupId = uuidv4();

    const newMessage = {
      id: uuidv4(),
      chatId,
      parentGroupId,
      groupId,
      role: Role.user,
      content: message,
      isCompleted: true,
    };

    const responseMessage = {
      id: uuidv4(),
      chatId,
      parentGroupId,
      groupId,
      role: Role.assistant,
      content: "",
      isCompleted: false,
    };

    const newMessages = [...messages, newMessage, responseMessage];

    setMessages(newMessages);
    setRespondingTo(groupId);

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
    <div className="flex justify-end divide-x divide-slate-400">
      <div></div>
      <div className="container max-w-4xl flex flex-col justify-end min-h-dvh items-center px-4">
        <div className="flex flex-col justify-end gap-y-10 h-full">
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
            <EmptyChat
              onSubmit={submitMessage}
              isEnabled={isConnected}
            ></EmptyChat>
          )}
        </div>
        <ChatInput
          onSubmit={submitMessage}
          respondingTo={respondingTo}
          isEnabled={isConnected}
        ></ChatInput>
        <div className="flex flex-col items-center text-sm">
          <p className="font-semibold text-center">
            GregPT makes mistakes. We're not sure if it's intentional. Maybe
            don't trust him.
          </p>
          <div className="flex items-center gap-x-2">
            <p className="">
              Built with Lang<span className="">[e]</span>
              Chain |{" "}
            </p>
            <span>
              <svg height="12" width="12" xmlns="http://www.w3.org/2000/svg">
                <circle
                  r="5"
                  cx="6"
                  cy="6"
                  fill={isConnected ? "green" : "red"}
                />
              </svg>
            </span>{" "}
            {isConnected ? (
              <p>
                Connected{" "}
                <span className="font-light text-slate-400">
                  (but not to reality)
                </span>
              </p>
            ) : (
              "Disconnected"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
