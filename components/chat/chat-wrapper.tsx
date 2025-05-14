"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Import the chat component dynamically with no SSR
const ChatComponent = dynamic(
  () => import("@/components/chat/chat-component"),
  {
    ssr: false,
    loading: () => <ChatLoading />,
  }
);

function ChatLoading() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold uppercase mb-8">Chats</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 h-[650px] animate-pulse"></div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm h-[700px] animate-pulse"></div>
      </div>
    </div>
  );
}

export default function ChatWrapper() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatComponent />
    </Suspense>
  );
}
