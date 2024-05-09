"use client";
import ChatContainer from "./components/ChatContainer";
import { uuidv4 } from "./common/crypto";

export default function Home() {
  const chatId = uuidv4();

  return (
    <>
      <ChatContainer chatId={chatId}></ChatContainer>
      <div className="absolute top-3 right-5 w-8 h-8">
        <a href="https://github.com/backlundpf/greg-bot/" target="_blank">
          <img src="/github-mark-white.svg" alt="Link to github" />
        </a>
      </div>
    </>
  );
}
