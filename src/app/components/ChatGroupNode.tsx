import { ChatGroup } from "@/types/message";
import { Handle, Position } from "reactflow";

export function ChatGroupNode({ data }: { data: ChatGroup }) {
  return (
    <>
      <Handle type="target" position={Position.Top}></Handle>
      <div>{data.prompt.content}</div>
      <Handle type="source" position={Position.Bottom}></Handle>
    </>
  );
}
