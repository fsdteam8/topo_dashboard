"use client";

import { cn } from "@/lib/utils";

interface QuickReplyButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export function QuickReplyButton({
  text,
  onClick,
  disabled = false,
}: QuickReplyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-md text-xs transition-colors",
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 hover:bg-gray-200"
      )}
    >
      {text}
    </button>
  );
}
