"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  isTyping: boolean;
  className?: string;
}

export function TypingIndicator({ isTyping, className }: TypingIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  if (!visible) return null;

  return (
    <div className={cn("flex items-center space-x-1 p-2", className)}>
      <div className="text-xs text-gray-500">Typing</div>
      <div className="flex space-x-1">
        <div
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
