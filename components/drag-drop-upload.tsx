"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface DragDropUploadProps {
  onFileChange: (files: File[]) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
}

export function DragDropUpload({
  onFileChange,
  className = "",
  accept = "image/*",
  multiple = true,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const files = Array.from(fileList);
    onFileChange(files);

    if (files.length === 1) {
      setFileName(files[0].name);
    } else if (files.length > 1) {
      setFileName(`${files.length} files selected`);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        <input
          type="text"
          readOnly
          value={fileName}
          placeholder="File name"
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-2 bg-[#891d33] text-white rounded-r-md hover:bg-[#732032]"
        >
          Drag and Drop
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-2 border-2 border-dashed rounded-md p-6 text-center transition-colors ${
          isDragging ? "border-[#891d33] bg-[#891d33]/5" : "border-gray-300"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
        />
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Drag and drop your files here or click to browse
        </p>
      </div>
    </div>
  );
}
