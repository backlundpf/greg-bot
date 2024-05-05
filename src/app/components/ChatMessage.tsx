import { useState, useEffect } from "react";
import { Message, MessageUpdate } from "../../types/message";
import { socket } from "@/socket";
export default function ChatMessage({
  message,
  onComplete,
}: {
  message: Message;
  onComplete: (messageId: string, completedMessage: string) => void;
}) {
  const [messageContent, setMessageContent] = useState(message.content);
  const [messageUpdates, setMessageUpdates] = useState<MessageUpdate[]>([]);

  // let messageUpdates: MessageUpdate[] = [];

  useEffect(() => {
    function updateMessage(messageUpdate: MessageUpdate) {
      if (
        messageUpdates.find(
          (update) => update.createdAt == messageUpdate.createdAt
        )
      )
        return;
      console.log("updating message: " + message.id, messageUpdate);
      let newMessageUpdates = messageUpdates;
      newMessageUpdates.push(messageUpdate);

      newMessageUpdates = newMessageUpdates.sort(
        (a: MessageUpdate, b: MessageUpdate) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const newMessage = newMessageUpdates
        .map((update) => update.content)
        .join("");
      // messageUpdates = newMessageUpdates;
      setMessageUpdates(newMessageUpdates);

      if (messageUpdate.isCompleted)
        onComplete(
          message.id,
          newMessageUpdates.map((update) => update.content).join("")
        );

      console.log(
        "new message: ",
        messageUpdates.map((update) => update.content).join()
      );
      setMessageContent(newMessage);
    }

    socket.on("update-message-" + message.id, updateMessage);
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket, messageContent, messageUpdates]);

  return (
    <div className="">
      <div className="flex justify-between">
        <h4 className="font-bold">{message.role}</h4>
        <div>{message.id}</div>
      </div>
      <div>{messageContent}</div>
    </div>
  );
}
