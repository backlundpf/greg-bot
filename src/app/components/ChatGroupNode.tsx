import { ChatGroup } from "@/types/message";
import { useContext } from "react";
import { Handle, Position } from "reactflow";
import { MessageHeadContext, MessageHeadContextType } from "./ChatContainer";

export function ChatGroupNode({ data }: { data: ChatGroup }) {
  const { respondingTo, setRespondingTo } = useContext(
    MessageHeadContext
  ) as MessageHeadContextType;

  function getClassName(): string {
    console.log("responding to:", respondingTo);
    console.log("from: ", data.id);
    if (respondingTo == data.id) return "text-green-600";

    return "";
  }

  return (
    <>
      <Handle type="target" position={Position.Top}></Handle>
      <div className={getClassName()}>{data.prompt.content}</div>
      <button
        type="button"
        onClick={() => {
          setRespondingTo(data.id);
        }}
      >
        Respond
      </button>
      <Handle type="source" position={Position.Bottom}></Handle>
    </>
  );
}
