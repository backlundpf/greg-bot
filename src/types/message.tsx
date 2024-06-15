export interface Message {
  id: string;
  chatId: string;
  groupId: string;
  parentGroupId: string | undefined;
  role: Role;
  content: string;
  isCompleted: boolean;
}

export enum Role {
  user = "user",
  assistant = "assistant",
}

export interface MessageUpdate {
  id: string;
  chatId: string;
  content: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface ChatGroup {
  id: string;
  prompt: Message;
  response: Message;
}
