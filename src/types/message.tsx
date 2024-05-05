export interface Message {
  id: string;
  chatId: string;
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
