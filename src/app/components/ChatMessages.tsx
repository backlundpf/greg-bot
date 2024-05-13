import { Message } from "@/types/message";
import { useContext } from "react";
import { MessageHeadContext, MessageHeadContextType } from "./ChatContainer";
import ChatMessage from "./ChatMessage";

export function ChatMessages({
  messages,
  completeMessage,
}: {
  messages: Message[];
  completeMessage: (messageId: string, completedMessage: string) => void;
}) {
  const { respondingTo } = useContext(
    MessageHeadContext
  ) as MessageHeadContextType;

  let messageChain: Message[] = [];
  let parentGroupId: string | undefined = respondingTo;

  while (parentGroupId) {
    const parentMessages = messages.filter(
      (message) => message.groupId == parentGroupId
    );
    messageChain = messageChain.concat(...parentMessages);
    parentGroupId = parentMessages.pop()?.id;
  }

  messageChain = messageChain;

  return (
    <>
      {messageChain.map((message) => {
        return (
          <ChatMessage
            key={message.id}
            message={message}
            onComplete={completeMessage}
          ></ChatMessage>
        );
      })}
    </>
  );
}
