import { useState, useEffect } from "react";
import { Message, MessageUpdate, Role } from "../../types/message";
import { socket } from "@/socket";
import Image from "next/image";
import MarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({
  message,
  onComplete,
}: {
  message: Message;
  onComplete: (messageId: string, completedMessage: string) => void;
}) {
  const [loadingMessage, setLoadingMessage] = useState(".");
  const [messageContent, setMessageContent] = useState(message.content);
  const [messageUpdates, setMessageUpdates] = useState<MessageUpdate[]>([]);
  const [isCompleted, setIsCompleted] = useState(message.isCompleted);

  // let messageUpdates: MessageUpdate[] = [];

  useEffect(() => {
    if (isCompleted) return;
    const interval = window.setInterval(() => {
      console.log(message.id, messageContent);
      if (isCompleted) window.clearInterval(interval);
      setLoadingMessage((prevLoadingMessage) => prevLoadingMessage + ".");
    }, 750);

    return () => window.clearInterval(interval);
  }, [isCompleted]);

  useEffect(() => {
    function updateMessage(messageUpdate: MessageUpdate) {
      if (
        messageUpdates.find(
          (update) => update.createdAt == messageUpdate.createdAt
        )
      )
        return;
      // console.log("updating message: " + message.id, messageUpdate);
      let newMessageUpdates = messageUpdates;
      newMessageUpdates.push(messageUpdate);

      newMessageUpdates = newMessageUpdates.sort(
        (a: MessageUpdate, b: MessageUpdate) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const newMessage = newMessageUpdates
        .map((update) => update.content)
        .join("");
      // .replace(/(?:\r\n|\r|\n)/g, "<br>");
      // messageUpdates = newMessageUpdates;
      setMessageUpdates(newMessageUpdates);

      if (messageUpdate.isCompleted) {
        onComplete(message.id, newMessage), setIsCompleted(true);
      }

      // console.log(
      //   "new message: ",
      //   messageUpdates.map((update) => update.content).join()
      // );
      setMessageContent(newMessage);
    }

    socket.on("update-message-" + message.id, updateMessage);
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  function getProfileSource() {
    switch (message.role) {
      case Role.assistant:
        return "/gregprofile.png";
      case Role.user:
      default:
        return "/userprofile.png";
    }
  }

  function getRoleLabel() {
    switch (message.role) {
      case Role.assistant:
        return "GregPT";
      case Role.user:
      default:
        return "You";
    }
  }
  return (
    <div className="flex gap-4">
      <div className="min-w-12">
        <Image
          className="rounded-full w-12 h-12"
          src={getProfileSource()}
          alt="profile"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col grow">
        <div className="flex justify-between">
          <h4 className="font-bold" title={message.id}>
            {getRoleLabel()}
          </h4>
        </div>
        <div className="font-semibold">
          {messageContent ? (
            <MarkDown
              remarkPlugins={[remarkGfm]}
              className="prose space-y-4 max-w-full font-sans"
            >
              {messageContent}
            </MarkDown>
          ) : (
            loadingMessage
          )}
        </div>
      </div>
    </div>
  );
}
