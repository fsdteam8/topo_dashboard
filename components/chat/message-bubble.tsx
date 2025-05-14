"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MessageProps {
  text: string;
  timestamp: string;
  isUser: boolean;
  isRead?: boolean;
  status?: "sending" | "sent" | "delivered" | "read";
  imageUrl?: string;
}

export function MessageBubble({
  text,
  timestamp,
  isUser,
  isRead = false,
  status = "sent",
  imageUrl,
}: MessageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={cn("flex mb-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="max-w-[75%]">
          <div className="bg-gray-100 rounded-lg p-3 shadow-sm">
            {imageUrl && (
              <div className="mb-2 relative">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Shared image"
                  width={300}
                  height={200}
                  className={cn(
                    "rounded-md transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md">
                    <div className="animate-pulse">Loading image...</div>
                  </div>
                )}
              </div>
            )}
            <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
          </div>
          <div className="flex items-center mt-1">
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
        </div>
      )}

      {isUser && (
        <div className="max-w-[75%] text-right">
          <div className="bg-[#891d33] text-white rounded-lg p-3 shadow-sm">
            {imageUrl && (
              <div className="mb-2 relative">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Shared image"
                  width={300}
                  height={200}
                  className={cn(
                    "rounded-md transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-md">
                    <div className="animate-pulse text-white">
                      Loading image...
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
          </div>
          <div className="flex items-center justify-end mt-1">
            <p className="text-xs text-gray-500">{timestamp}</p>
            <span className="ml-1 text-xs">
              {status === "sending" && "●"}
              {status === "sent" && "✓"}
              {status === "delivered" && "✓✓"}
              {status === "read" && <span className="text-blue-500">✓✓</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
