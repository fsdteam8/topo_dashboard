"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { StatCard } from "@/components/ui/stat-card";
import { SearchInput } from "@/components/ui/search-input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { ViewButton } from "@/components/ui/view-button";
import { Pagination } from "@/components/ui/pagination";
import { NewDisputeModal } from "@/components/new-dispute-modal";
import { Plus } from "lucide-react";
import { getAllDisputes } from "@/services/disputes-service";
import type { Dispute } from "@/types/disputes";
import Link from "next/link";

export default function DisputesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("This Month");

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const data = await getAllDisputes();
      setDisputes(data);
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleDisputeSuccess = () => {
    setIsModalOpen(false);
    fetchDisputes();
  };

  const filteredDisputes = disputes.filter((dispute) => {
    // Status filter
    if (statusFilter !== "All" && dispute.status !== statusFilter) {
      return false;
    }

    // Search filter - check multiple fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        dispute.id.toLowerCase().includes(searchLower) ||
        dispute.bookingId.toLowerCase().includes(searchLower) ||
        dispute.customerId.toLowerCase().includes(searchLower) ||
        dispute.customerName.toLowerCase().includes(searchLower) ||
        dispute.dressId.toLowerCase().includes(searchLower) ||
        dispute.reason.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calculate stats
  const totalDisputes = disputes.length;
  const pendingDisputes = disputes.filter((d) => d.status === "Pending").length;
  const resolvedDisputes = disputes.filter(
    (d) => d.status === "Resolved"
  ).length;
  const resolutionRate = totalDisputes
    ? Math.round((resolvedDisputes / totalDisputes) * 100)
    : 0;

  // Pagination
  const resultsPerPage = 10;
  const totalPages = Math.ceil(filteredDisputes.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentDisputes = filteredDisputes.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold uppercase">Disputes</h2>
          <div className="flex space-x-4">
            <SelectDropdown
              label="Time Filter"
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                "Today",
                "This Week",
                "This Month",
                "This Year",
                "All Time",
              ]}
              className="bg-[#8c1c3a] text-white border-[#8c1c3a]"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Submit New Dispute
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Disputes"
            value={totalDisputes.toString()}
            className="bg-[#8c1c3a] text-white"
          />
          <StatCard title="Resolution Rate" value={`${resolutionRate}%`} />
          <StatCard
            title="Pending Disputes"
            value={pendingDisputes.toString()}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <SearchInput
              placeholder="Search ......"
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SelectDropdown
              label="Status Filter"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All",
                "Pending",
                "In Progress",
                "Resolved",
                "Escalated",
                "Closed",
              ]}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Date Submitted</th>
                  <th className="text-left py-3 font-medium">Booking ID</th>
                  <th className="text-left py-3 font-medium">Customer ID</th>
                  <th className="text-left py-3 font-medium">Dress ID</th>
                  <th className="text-left py-3 font-medium">Dispute Reason</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center">
                      Loading disputes...
                    </td>
                  </tr>
                ) : currentDisputes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center">
                      No disputes found
                    </td>
                  </tr>
                ) : (
                  currentDisputes.map((dispute, index) => (
                    <tr key={dispute.id} className="border-b">
                      <td className="py-4">{dispute.dateSubmitted}</td>
                      <td className="py-4">{dispute.bookingId}</td>
                      <td className="py-4">{dispute.customerId}</td>
                      <td className="py-4">{dispute.dressId}</td>
                      <td className="py-4">{dispute.reason}</td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            dispute.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : dispute.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : dispute.status === "Escalated"
                              ? "bg-red-100 text-red-800"
                              : dispute.status === "Closed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {dispute.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <Link href={`/disputes/${dispute.id}`}>
                          <ViewButton />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredDisputes.length > resultsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalResults={filteredDisputes.length}
                resultsPerPage={resultsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <NewDisputeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleDisputeSuccess}
      />
    </Layout>
  );
}
