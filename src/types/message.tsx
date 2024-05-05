export interface Message {
  id: string;
  chatId: string;
  role: string;
  content: string;
  isCompleted: boolean;
}

export interface MessageUpdate {
  id: string;
  chatId: string;
  content: string;
  createdAt: string;
  isCompleted: boolean;
}
