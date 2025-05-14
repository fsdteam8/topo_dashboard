"use client";
import { X } from "lucide-react";
import Image from "next/image";
import type { Dress } from "@/types/listings";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dress: Dress | null;
  newStatus: boolean;
}

export function StatusModal({
  isOpen,
  onClose,
  onConfirm,
  dress,
  newStatus,
}: StatusModalProps) {
  if (!isOpen || !dress) return null;

  const statusText = newStatus ? "Turned On" : "Turned Off";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center justify-center">
            <div className="text-[#891d33] text-4xl font-serif italic">𝓜</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Listing {statusText}
        </h2>

        <p className="text-center mb-8">
          {newStatus
            ? "This listing will now be visible to customers and available for booking."
            : "This listing will automatically reactivate when you turn the toggle back on."}
        </p>

        <div className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="relative w-40 h-60">
              <Image
                src={dress.image || "/placeholder.svg"}
                alt={dress.name}
                fill
                className="object-cover rounded-lg"
                sizes="160px"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {dress.brand} - {dress.name}
              </h3>
              <p className="text-sm">Product ID: {dress.id}</p>
              <p className="text-sm">Size: {dress.size}</p>
              <p className="text-sm">Color: {dress.color}</p>
              <p className="text-sm">Condition: {dress.condition}</p>
              <p className="text-sm">Rental Price: {dress.price}</p>
              <p className="text-sm">Last Updated: {dress.lastUpdated}</p>
              <p className="text-sm">
                Status: {newStatus ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#7a1832]"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
