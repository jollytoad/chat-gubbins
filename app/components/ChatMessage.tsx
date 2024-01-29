import type { Children } from "$jsx/types.ts";

interface ChatMessageProps {
  author: {
    name: string;
  };
  children?: Children;
}

export function ChatMessage(props: ChatMessageProps) {
  return (
    <div class="chat-message">
      <div class="chat-msg-author">
        {props.author.name}
      </div>
      <div class="chat-msg-content">
        {props.children}
      </div>
    </div>
  );
}
