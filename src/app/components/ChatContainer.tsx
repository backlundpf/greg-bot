import { useMemo, useState } from "react";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import ChatMessage from "./ChatMessage";
import { Message } from "../types/message";
import { uuidv4 } from "../common/crypto";

export default function ChatContainer({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  async function submitMessage(message: string) {
    setMessages([
      ...messages,
      { id: uuidv4(), chatId, role: "You", content: message },
    ]);
  }

  return (
    <div className="flex flex-col justify-end">
      {messages.length ? (
        messages.map((message) => {
          return <ChatMessage key={message.id} message={message}></ChatMessage>;
        })
      ) : (
        <EmptyChat></EmptyChat>
      )}
      <ChatInput onSubmit={submitMessage}></ChatInput>
    </div>
  );
}
