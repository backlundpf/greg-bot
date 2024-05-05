import { useState } from "react";

export default function ChatInput({
  onSubmit,
  isEnabled,
}: {
  onSubmit: (message: string) => void;
  isEnabled: boolean;
}) {
  const [message, setMessage] = useState("");

  function onFormSubmit(formData: FormData) {
    if (!message) return;
    onSubmit(message);
    setMessage("");
  }

  return (
    <div className="flex flex-col justify-center mt-4">
      <form
        autoComplete="off"
        action={onFormSubmit}
        className="flex query-box border border-white rounded-xl p-3"
      >
        <input
          name="userMessage"
          id="prompt-textarea"
          type="text"
          placeholder="Message GregPT..."
          className="bg-transparent border-0 m-0 focus:border-transparent focus:ring-0 !outline-none w-full"
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        ></input>
        <button
          type="submit"
          className="rounded-lg border border-black bg-white p-0.5 text-white transition-colors enabled:bg-white disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3"
          disabled={message && isEnabled ? false : true}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white dark:text-black"
          >
            <path
              d="M7 11L12 6L17 11M12 18V7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  );
}
