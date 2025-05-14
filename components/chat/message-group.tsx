import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MessageGroupProps {
  children: ReactNode;
  date: string;
  isUser: boolean;
}

export function MessageGroup({ children, date, isUser }: MessageGroupProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-center mb-2">
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {date}
        </div>
      </div>
      <div className={cn("space-y-2", isUser ? "items-end" : "items-start")}>
        {children}
      </div>
    </div>
  );
}
