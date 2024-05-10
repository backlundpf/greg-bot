import { Message } from "@/types/message";
import { useContext } from "react";
import { MessageHeadContext, MessageHeadContextType } from "./ChatContainer";

export function ChatMessages({ messages }: { messages: Message[] }) {
  const { respondingTo } = useContext(
    MessageHeadContext
  ) as MessageHeadContextType;

  let messageChain: Message[] = [];
  let parentGroupId = respondingTo;

  while (parentGroupId != null) {
    messageChain = messageChain.concat(
      messages.filter((message) => message.groupId == parentGroupId)
    );
    // parentGroupId = messageChain[]
  }
}
