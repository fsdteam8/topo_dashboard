"use client"

import { useState, useEffect, useMemo } from "react"
import { Layout } from "@/components/layout"
import { SearchInput } from "@/components/ui/search-input"
import { SelectDropdown } from "@/components/ui/select-dropdown"
import { Calendar } from "@/components/ui/calendar"
import { Pagination } from "@/components/ui/pagination"
import { BookingModal } from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SkeletonTable, SkeletonCalendarGrid } from "@/components/ui/skeletons"

// Sample bookings data
const allBookingsData = [
  {
    id: "BK10001",
    dressId: "DRESS001",
    dressName: "Emerald Evening Gown",
    customer: "Emma Thompson",
    customerId: "CUST001",
    price: "$89.99",
    rentalPeriod: "May 12 - May 15, 2025",
    deliveryType: "Pickup",
    status: "Confirmed",
    bookingDate: "2025-04-01",
  },
  {
    id: "BK10002",
    dressId: "DRESS002",
    dressName: "Sunshine Maxi Dress",
    customer: "Olivia Wilson",
    customerId: "CUST002",
    price: "$65.70",
    rentalPeriod: "May 18 - May 21, 2025",
    deliveryType: "Shipping",
    status: "Shipped",
    bookingDate: "2025-04-05",
  },
  {
    id: "BK10003",
    dressId: "DRESS003",
    dressName: "Classic Black Cocktail",
    customer: "Sophia Martinez",
    customerId: "CUST003",
    price: "$74.50",
    rentalPeriod: "May 25 - May 28, 2025",
    deliveryType: "Pickup",
    status: "Completed",
    bookingDate: "2025-04-10",
  },
  {
    id: "BK10004",
    dressId: "DRESS004",
    dressName: "Ruby Gala Gown",
    customer: "Isabella Johnson",
    customerId: "CUST004",
    price: "$120.00",
    rentalPeriod: "June 2 - June 5, 2025",
    deliveryType: "Shipping",
    status: "Pending",
    bookingDate: "2025-04-15",
  },
  {
    id: "BK10005",
    dressId: "DRESS005",
    dressName: "Midnight Formal Dress",
    customer: "Mia Brown",
    customerId: "CUST005",
    price: "$95.25",
    rentalPeriod: "June 8 - June 11, 2025",
    deliveryType: "Pickup",
    status: "Confirmed",
    bookingDate: "2025-04-20",
  },
]

// Sample dresses data for the booking modal
const dressesData = [
  {
    id: "DRESS001",
    name: "Emerald Evening Gown",
    brand: "Vera Wang",
    price: "$89.99",
    image: "/elegant-green-dress.png",
  },
  {
    id: "DRESS002",
    name: "Sunshine Maxi Dress",
    brand: "Zimmermann",
    price: "$65.70",
    image: "/flowing-yellow-dress.png",
  },
  {
    id: "DRESS003",
    name: "Classic Black Cocktail",
    brand: "Dior",
    price: "$74.50",
    image: "/elegant-black-dress.png",
  },
  {
    id: "DRESS004",
    name: "Ruby Gala Gown",
    brand: "Valentino",
    price: "$120.00",
    image: "/woman-in-red-dress.png",
  },
  {
    id: "DRESS005",
    name: "Midnight Formal Dress",
    brand: "Chanel",
    price: "$95.25",
    image: "/woman-black-dress.png",
  },
]

// Calendar bookings data
const calendarBookings = [
  {
    id: "BK10001",
    startDate: new Date(2025, 4, 12), // May 12, 2025
    endDate: new Date(2025, 4, 15), // May 15, 2025
  },
  {
    id: "BK10002",
    startDate: new Date(2025, 4, 18), // May 18, 2025
    endDate: new Date(2025, 4, 21), // May 21, 2025
  },
  {
    id: "BK10003",
    startDate: new Date(2025, 4, 25), // May 25, 2025
    endDate: new Date(2025, 4, 28), // May 28, 2025
  },
  {
    id: "BK10004",
    startDate: new Date(2025, 5, 2), // June 2, 2025
    endDate: new Date(2025, 5, 5), // June 5, 2025
  },
  {
    id: "BK10005",
    startDate: new Date(2025, 5, 8), // June 8, 2025
    endDate: new Date(2025, 5, 11), // June 11, 2025
  },
]

export default function BookingsPage() {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [bookings, setBookings] = useState(allBookingsData)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const itemsPerPage = 3

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBookings(allBookingsData)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load bookings"))
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle booking creation
  const handleCreateBooking = (bookingData: any) => {
    // Generate a new booking ID
    const newId = `BK${10000 + bookings.length + 1}`

    // Create new booking object
    const newBooking = {
      id: newId,
      dressId: bookingData.dressId,
      dressName: dressesData.find((d) => d.id === bookingData.dressId)?.name || "Unknown Dress",
      customer: "New Customer",
      customerId: `CUST${1000 + bookings.length + 1}`,
      price: dressesData.find((d) => d.id === bookingData.dressId)?.price || "$0.00",
      rentalPeriod: `${new Date(bookingData.startDate).toLocaleDateString()} - ${new Date(bookingData.endDate).toLocaleDateString()}`,
      deliveryType: "Pickup",
      status: bookingData.status || "Confirmed",
      bookingDate: new Date().toISOString().split("T")[0],
    }

    // Add to bookings
    setBookings((prev) => [newBooking, ...prev])

    // Close modal
    setShowBookingModal(false)
  }

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        // Search term filter
        const matchesSearch =
          searchTerm === "" ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.dressId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.dressName.toLowerCase().includes(searchTerm.toLowerCase())

        // Delivery type filter
        const matchesDeliveryType = deliveryTypeFilter === "All" || booking.deliveryType === deliveryTypeFilter

        // Status filter
        const matchesStatus = statusFilter === "All" || booking.status === statusFilter

        // Date filter (simplified for demo)
        const matchesDate =
          dateFilter === "All" ||
          (dateFilter === "This Month" && booking.bookingDate.startsWith("2025-04")) ||
          (dateFilter === "Next Month" && booking.bookingDate.startsWith("2025-05"))

        return matchesSearch && matchesDeliveryType && matchesStatus && matchesDate
      })
      .sort((a, b) => {
        if (!sortField) return 0

        // Handle different field types
        if (sortField === "price") {
          const priceA = Number.parseFloat(a.price.replace("$", ""))
          const priceB = Number.parseFloat(b.price.replace("$", ""))
          return sortDirection === "asc" ? priceA - priceB : priceB - priceA
        }

        if (sortField === "bookingDate") {
          const dateA = new Date(a.bookingDate).getTime()
          const dateB = new Date(b.bookingDate).getTime()
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA
        }

        // Default string comparison
        const valueA = a[sortField as keyof typeof a]
        const valueB = b[sortField as keyof typeof b]

        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        }

        return 0
      })
  }, [bookings, searchTerm, deliveryTypeFilter, statusFilter, dateFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredBookings, currentPage, itemsPerPage])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, deliveryTypeFilter, statusFilter, dateFilter])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle calendar date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)

    // Filter bookings for this date
    const bookingsOnDate = calendarBookings.filter((booking) => {
      return date >= booking.startDate && date <= booking.endDate
    })

    if (bookingsOnDate.length > 0) {
      // If there are bookings on this date, filter the table
      setDateFilter("Custom")
      // In a real app, you would filter by the exact date
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setDeliveryTypeFilter("All")
    setStatusFilter("All")
    setDateFilter("All")
    setSortField(null)
  }

  // Get status class for styling
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Something went wrong!</h2>
            <p className="text-red-600 mb-6">
              We encountered an error while loading the bookings. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md hover:bg-[#732032] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold uppercase">Bookings</h2>
          <Button className="flex items-center" onClick={() => setShowBookingModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Manual Booking
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SearchInput
              placeholder="Search by ID, dress, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SelectDropdown
              label="Delivery Type"
              value={deliveryTypeFilter}
              options={["All", "Pickup", "Shipping"]}
              onChange={setDeliveryTypeFilter}
            />
            <SelectDropdown
              label="Status"
              value={statusFilter}
              options={["All", "Pending", "Confirmed", "Shipped", "Completed"]}
              onChange={setStatusFilter}
            />
            <SelectDropdown
              label="Date"
              value={dateFilter}
              options={["All", "This Month", "Next Month", "Custom"]}
              onChange={setDateFilter}
            />
          </div>

          {filteredBookings.length === 0 && !isLoading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
              <p className="text-yellow-800">No bookings match your filters. Try adjusting your search criteria.</p>
              <button onClick={clearFilters} className="mt-2 text-primary underline text-sm">
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Calendar</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs border rounded-md hover:bg-gray-50">Today</button>
                <button className="px-3 py-1 text-xs border rounded-md hover:bg-gray-50">Month</button>
                <button className="px-3 py-1 text-xs border rounded-md hover:bg-gray-50">Week</button>
              </div>
            </div>

            {isLoading ? (
              <SkeletonCalendarGrid />
            ) : (
              <Calendar bookings={calendarBookings} onDateClick={handleDateClick} />
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Recent Bookings</h3>
              <Link href="/bookings">
                <span className="text-sm text-primary hover:underline">View All</span>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <Link href={`/bookings/${booking.id}`} key={booking.id}>
                    <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{booking.dressName}</p>
                          <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                          <p className="text-sm text-gray-500">{booking.rentalPeriod}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {isLoading ? (
            <SkeletonTable rows={3} columns={8} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th
                        className="text-left py-3 font-medium cursor-pointer hover:text-primary"
                        onClick={() => handleSort("id")}
                      >
                        Order ID
                        {sortField === "id" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </th>
                      <th
                        className="text-left py-3 font-medium cursor-pointer hover:text-primary"
                        onClick={() => handleSort("dressId")}
                      >
                        Dress ID
                        {sortField === "dressId" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </th>
                      <th
                        className="text-left py-3 font-medium cursor-pointer hover:text-primary"
                        onClick={() => handleSort("customer")}
                      >
                        Customer
                        {sortField === "customer" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th
                        className="text-left py-3 font-medium cursor-pointer hover:text-primary"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        {sortField === "price" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </th>
                      <th className="text-left py-3 font-medium">Rental Period</th>
                      <th
                        className="text-left py-3 font-medium cursor-pointer hover:text-primary"
                        onClick={() => handleSort("deliveryType")}
                      >
                        Delivery Type
                        {sortField === "deliveryType" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th
                        className="text-left py-3 font-medium cursor-pointer hover:text-primary"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {sortField === "status" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </th>
                      <th className="text-left py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">{booking.id}</td>
                        <td className="py-4">{booking.dressId}</td>
                        <td className="py-4">{booking.customer}</td>
                        <td className="py-4">{booking.price}</td>
                        <td className="py-4">{booking.rentalPeriod}</td>
                        <td className="py-4">{booking.deliveryType}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <Link href={`/bookings/${booking.id}`}>
                            <span className="px-3 py-1 text-xs bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark transition-colors inline-block">
                              View
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalResults={filteredBookings.length}
                    resultsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSave={handleCreateBooking}
        dresses={dressesData}
      />
    </Layout>
  )
}
