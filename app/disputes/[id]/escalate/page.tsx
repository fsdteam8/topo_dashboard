"use client";

import type React from "react";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { FileUpload } from "@/components/file-upload";
import {
  getDisputeById,
  escalateDispute,
  getEscalationReasons,
} from "@/services/disputes-service";
import type {
  EscalationFormData,
  Dispute,
  ReasonOption,
} from "@/types/disputes";

export default function EscalateDisputePage({
  params,
}: {
  params: { id: string };
}) {
  // Access params directly
  const { id } = params;
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reasons, setReasons] = useState<ReasonOption[]>([]);
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<EscalationFormData>({
    reason: "",
    description: "",
    additionalEvidence: [],
    priorityLevel: "Standard",
    contactInfo: "",
    password: "",
    understand: false,
    scheduleFollowUp: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof EscalationFormData, string>>
  >({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const disputeData = await getDisputeById(id);
        if (disputeData) {
          setDispute(disputeData);
        } else {
          console.error("Dispute not found");
        }
        setReasons(getEscalationReasons());
      } catch (error) {
        console.error("Error fetching dispute:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof EscalationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (value: "Standard" | "High") => {
    setFormData((prev) => ({ ...prev, priorityLevel: value }));
  };

  const handleFileChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, additionalEvidence: files }));
  };

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Partial<Record<keyof EscalationFormData, string>> = {};

    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    if (!formData.contactInfo) {
      newErrors.contactInfo = "Email or phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!dispute) return;

    setSubmitting(true);
    try {
      await escalateDispute(dispute.id, formData);
      router.push(`/disputes/${dispute.id}`);
    } catch (error) {
      console.error("Error escalating dispute:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8">ESCALATE DISPUTE</h2>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dispute) {
    return (
      <Layout>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8">ESCALATE DISPUTE</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>Dispute not found</p>
            <button
              onClick={() => router.push("/disputes")}
              className="text-[#8c1c3a] hover:underline mt-4 inline-block"
            >
              Return to Disputes
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-[#faf9f7]">
        <h2 className="text-2xl font-bold mb-8">ESCALATE DISPUTE</h2>

        {/* Dispute Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Dispute Summary</h3>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              In Progress
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <p>
                <span className="font-medium">Dispute ID:</span> {dispute.id}
              </p>
              <p>
                <span className="font-medium">Booking ID:</span>{" "}
                {dispute.bookingId}
              </p>
              <p>
                <span className="font-medium">Customer ID:</span>{" "}
                {dispute.customerId}
              </p>
              <p>
                <span className="font-medium">Dress ID:</span> {dispute.dressId}
              </p>
              <p>
                <span className="font-medium">Customer Name:</span>{" "}
                {dispute.customerName}
              </p>
              <p>
                <span className="font-medium">Dress Name:</span>{" "}
                {dispute.dressName || "Zimmermann Silk Gown"}
              </p>
              <p>
                <span className="font-medium">Original Reason:</span>{" "}
                <span className="text-red-600">Not Returned</span>
              </p>
            </div>
          </div>
        </div>

        {/* Escalation Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Escalation Details</h3>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-base font-medium">
                Reason for Escalation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 border rounded-lg ${
                    errors.reason ? "border-red-500" : "border-gray-300"
                  } flex justify-between items-center`}
                  onClick={() => setReasonDropdownOpen(!reasonDropdownOpen)}
                >
                  <span>
                    {formData.reason ? formData.reason : "Select Reason"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      reasonDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {reasonDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {reasons.map((reason) => (
                        <li
                          key={reason.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              reason: reason.label,
                            }));
                            setReasonDropdownOpen(false);
                            if (errors.reason) {
                              setErrors((prev) => ({ ...prev, reason: "" }));
                            }
                          }}
                        >
                          {reason.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-base font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows={4}
                placeholder="Describe your issue or question in detail"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-base font-medium">
                Additional Evidence <span className="text-red-500">*</span>
              </label>
              <FileUpload
                onFileChange={handleFileChange}
                buttonText="Upload File"
                placeholder="File name"
                files={formData.additionalEvidence}
              />
            </div>

            <div>
              <label className="block mb-2 text-base font-medium">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="standard"
                    name="priorityLevel"
                    checked={formData.priorityLevel === "Standard"}
                    onChange={() => handleRadioChange("Standard")}
                    className="h-4 w-4 text-[#8c1c3a] border-gray-300 focus:ring-[#8c1c3a]"
                  />
                  <label htmlFor="standard" className="ml-2">
                    Standard
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="high"
                    name="priorityLevel"
                    checked={formData.priorityLevel === "High"}
                    onChange={() => handleRadioChange("High")}
                    className="h-4 w-4 text-[#8c1c3a] border-gray-300 focus:ring-[#8c1c3a]"
                  />
                  <label htmlFor="high" className="ml-2">
                    High
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Escalation */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Confirm Escalation</h3>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-base font-medium">
                Enter Email / Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="e.g., ##"
                className={`w-full px-4 py-2.5 border rounded-lg ${
                  errors.contactInfo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contactInfo && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactInfo}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-base font-medium">
                Enter Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="e.g., ##"
                className={`w-full px-4 py-2.5 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Additional Options</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="understand"
                name="understand"
                checked={formData.understand}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#8c1c3a] border-gray-300 rounded focus:ring-[#8c1c3a]"
              />
              <label htmlFor="understand" className="ml-2 text-sm">
                I understand that escalation may take up to 5 business days and
                cannot be undone.
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="scheduleFollowUp"
                name="scheduleFollowUp"
                checked={formData.scheduleFollowUp}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-[#8c1c3a] border-gray-300 rounded focus:ring-[#8c1c3a]"
              />
              <label htmlFor="scheduleFollowUp" className="ml-2 text-sm">
                Schedule a follow-up call with support
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md hover:bg-[#7a1832] disabled:opacity-70"
            >
              {submitting ? "Processing..." : "Escalate Dispute"}
            </button>
            <button
              onClick={() => router.push("/disputes")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Contact Support
            </button>
            <button
              onClick={() => router.push(`/disputes/${dispute.id}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
