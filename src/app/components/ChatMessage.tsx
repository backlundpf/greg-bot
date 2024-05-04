import { useState } from "react";
import { Message } from "../types/message";
export default function ChatMessage({ message }: { message: Message }) {
  const [messageContent, setMessageContent] = useState(message.content);
  return (
    <div>
      <h4>{message.role}</h4>
      <div>{messageContent}</div>
    </div>
  );
}
