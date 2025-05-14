"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  accept?: string;
}

export function FileUploadButton({
  onFileSelect,
  disabled = false,
  accept = "image/*",
}: FileUploadButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
      // Reset the input value so the same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "p-2 transition-colors",
          disabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />
    </>
  );
}
