"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EmptyChat({
  onSubmit,
  isEnabled,
}: {
  onSubmit: (prompt: string) => void;
  isEnabled: boolean;
}) {
  const samplePrompts = [
    "Tell me about yourself.",
    "What's the latest trend in AI?",
    "Show me how to use the window.setInterval() function.",
    "Does the existential dread ever end?",
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col justify-end items-center h-full">
      <div className="flex flex-col items-center justify-center grow">
        <Image
          className="rounded-full w-12 h-12"
          src="/gregprofile.png"
          alt="profile"
          width={48}
          height={48}
        />
        <div className="text-2xl">How Can I Help you today?</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {isEnabled &&
          samplePrompts.map((prompt) => (
            <PromptButton
              key={prompt}
              prompt={prompt}
              onClick={onSubmit}
            ></PromptButton>
          ))}
      </div>
    </div>
  );
}

function PromptButton({
  prompt,
  onClick,
}: {
  prompt: string;
  onClick: (prompt: string) => void;
}) {
  function selectPromptHandler() {
    onClick(prompt);
  }
  return (
    <button
      type="button"
      className="border border-white rounded-xl p-3 cursor-pointer"
      onClick={selectPromptHandler}
    >
      {prompt}
    </button>
  );
}
