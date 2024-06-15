"use client";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

export default function EmptyChat({
  onSubmit,
  isEnabled,
}: {
  onSubmit: (prompt: string) => void;
  isEnabled: boolean;
}) {
  const samplePrompts = [
    "Make up a story",
    "What's happening?",
    "Show me how to use the window.setInterval() function",
    "Plan a mental health day",
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col justify-end items-center h-full">
      <div className="flex flex-col items-center justify-center grow pb-40">
        <Image
          className="rounded-full w-12 h-12"
          src="/gregprofile.png"
          alt="profile"
          width={48}
          height={48}
        />
        <div className="text-2xl font-lg">How can I help you today?</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {isEnabled &&
          samplePrompts.map((prompt) => (
            <PromptButton key={prompt} onClick={() => onSubmit(prompt)}>
              {prompt}
            </PromptButton>
          ))}
      </div>
    </div>
  );
}

function PromptButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="border border-1 border-neutral-700 rounded-xl p-3 cursor-pointer hover:bg-white/10"
      onClick={onClick}
    >
      <span className="opacity-100">{children}</span>
    </button>
  );
}
