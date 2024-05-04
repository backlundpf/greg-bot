"use client";
import { queryGregBot } from "@/queries/query";
import { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import { uuidv4 } from "./common/crypto";
export default function Home() {
  const chatId = uuidv4();
  // const [messages, setMessages] = useState([]);

  // async function queryGregBot () {
  //   const response = await fetch("")
  // }

  return (
    <>
      <ChatContainer chatId={chatId}></ChatContainer>
    </>
  );
}
