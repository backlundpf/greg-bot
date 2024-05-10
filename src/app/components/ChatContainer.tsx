import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import ChatMessage from "./ChatMessage";
import { Message, Role } from "../../types/message";
import { uuidv4 } from "../common/crypto";
import { socket } from "@/socket";
import ReactFlow, {
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { ChatGroupNode } from "./ChatGroupNode";

const nodeTypes = { chatGroup: ChatGroupNode };

export type MessageHeadContextType = {
  respondingTo: string;
  setRespondingTo: Dispatch<SetStateAction<string>>;
};
export const MessageHeadContext = createContext<MessageHeadContextType | null>(
  null
);

export default function ChatContainer({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [respondingTo, setRespondingTo] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

    const newMessage: Message = {
      id: uuidv4(),
      chatId,
      parentGroupId,
      groupId,
      role: Role.user,
      content: message,
      isCompleted: true,
    };

    const responseMessage: Message = {
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

    // Place new Node and edges
    // Y position based on number of ancestors
    const xSpacing = 150;
    const ySpacing = 150;
    const xCenter = 300;

    let traverseGroupId = parentGroupId;

    let ancestorsCount = 1;
    while (traverseGroupId) {
      const parent = newMessages.find(
        (message) => message.groupId == traverseGroupId
      );
      ancestorsCount++;
      traverseGroupId = parent?.parentGroupId;
    }

    const yPosition = ancestorsCount * ySpacing;
    // X position based on number of siblings
    const siblings = newMessages.filter(
      (message) => message.parentGroupId == parentGroupId
    );

    const xPosition = siblings.length * xSpacing || xCenter;

    const newNode: Node = {
      id: groupId,
      type: "chatGroup",
      data: {
        id: groupId,
        prompt: newMessage,
        response: responseMessage,
      },
      position: {
        x: xPosition,
        y: yPosition,
      },
    };

    if (parentGroupId) {
      const newEdge: Edge = {
        id: uuidv4(),
        source: parentGroupId,
        target: groupId,
      };
      setEdges((prevEdges) => prevEdges.concat(newEdge));
    }

    setNodes((prevNodes) => prevNodes.concat(newNode));

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
    <MessageHeadContext.Provider value={{ respondingTo, setRespondingTo }}>
      <div className="flex justify-end divide-x divide-slate-400 items-stretch h-dvh max-h-dvh">
        <div className="grow">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
          ></ReactFlow>
        </div>
        <div className="container max-w-4xl flex flex-col justify-end items-stretch">
          <div className="overflow-y-scroll px-4 ">
            <div className="flex flex-col justify-end gap-y-10 w-full align stretch">
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
          </div>
          <div className="px-4">
            <ChatInput
              onSubmit={submitMessage}
              respondingTo={respondingTo}
              isEnabled={isConnected}
            ></ChatInput>
          </div>
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
    </MessageHeadContext.Provider>
  );
}
