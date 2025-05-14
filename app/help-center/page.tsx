"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { SearchInput } from "@/components/ui/search-input"
import { Plus, Minus } from "lucide-react"

// FAQ sections with questions
const faqSections = [
  {
    title: "BOOKINGS",
    questions: [
      {
        question: "How will I know when someone books one of my dresses?",
        answer:
          "You'll receive an instant notification via email and in the app when someone books one of your dresses. You can also check the Bookings tab in your dashboard for all current and upcoming bookings.",
      },
      {
        question: "Can customers pick up locally?",
        answer:
          "Yes, you can enable local pickup for your listings. Customers will be able to select this option during checkout if you've enabled it.",
      },
      {
        question: "How do I enable local pickup for my listings?",
        answer:
          "Go to your Account Settings, navigate to the Pickup Address section, and add your pickup location. Then ensure the 'Allow Local Pickup' option is enabled for each applicable listing.",
      },
      {
        question: "A customer I know wants to book directly through the platform — how do I add that to my dashboard?",
        answer:
          "You can create a manual booking by clicking the 'Manual Booking' button in the Bookings section. Enter the customer's information and select the dress, dates, and other details.",
      },
    ],
  },
  {
    title: "LISTINGS",
    questions: [
      {
        question: "How do I edit or pause a listing?",
        answer:
          'To edit your dress listing, go to your dashboard > Listings > click "Edit" next to the item you want to update. You can adjust the price, description, photos, or availability.\n\nTo pause a listing, simply toggle it to "inactive" — it will no longer appear in the customer search but can be reactivated at any time.',
      },
    ],
  },
  {
    title: "SHIPPING & RETURNS",
    questions: [
      {
        question: "Who pays for shipping?",
        answer:
          "Shipping costs can be handled in two ways: either included in your rental price or charged separately to the customer at checkout. You can configure your shipping preferences in your account settings.",
      },
      {
        question: "How do I ship a dress?",
        answer:
          "After a booking is confirmed, you'll receive shipping details. You can use your own packaging or request a shipping kit from us. Print the shipping label from your dashboard and drop the package at your preferred carrier.",
      },
      {
        question: "What happens if a customer doesn't return the dress?",
        answer:
          "If a dress isn't returned by the due date, the system will automatically extend the rental and charge the customer additional fees. After 7 days, you can file a non-return dispute in the Disputes section.",
      },
    ],
  },
  {
    title: "PAYOUTS",
    questions: [
      {
        question: "When do I get paid?",
        answer:
          "Payouts are processed within 24 hours after a rental period has completed and the item has been returned in satisfactory condition. The funds will typically appear in your account within 3-5 business days.",
      },
      {
        question: "Where do I update my bank account?",
        answer:
          "You can update your bank account information in the Account Settings section under Banking Information. Ensure all details are entered correctly to avoid payout delays.",
      },
      {
        question: "Where can I track my payout?",
        answer:
          "All payouts can be tracked in the Payments section of your dashboard. You'll see the status of each payout, including pending, processing, and completed transactions.",
      },
    ],
  },
  {
    title: "DISPUTES & DAMAGES",
    questions: [
      {
        question: "What if a dress is damaged during a rental?",
        answer:
          "If a dress is returned damaged, you should document the damage with photos and submit a dispute within 48 hours of receiving the return. We'll review the case and may charge the customer's security deposit to cover repairs or replacement.",
      },
      {
        question: "How do I submit a dispute?",
        answer:
          "Go to the Disputes section and click on 'Submit New Dispute'. Fill out the form with all relevant details, including booking information, description of the issue, and upload supporting photos.",
      },
      {
        question: "How do I handle a late return?",
        answer:
          "Late returns are automatically flagged in the system. The customer will be charged late fees according to your settings. If a return is significantly delayed, you can submit a dispute for additional compensation.",
      },
    ],
  },
]

export default function HelpCenterPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({})

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }))
  }

  return (
    <Layout>
      <div className="p-8">
        <h2 className="text-2xl font-bold uppercase mb-8">Help Center</h2>

        <div className="mb-8">
          <SearchInput placeholder="Search......" className="max-w-3xl" />
        </div>

        <div className="space-y-8">
          {faqSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div
                className="p-4 border-b flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="font-medium">{section.title}</h3>
                {openSections[section.title] ? (
                  <Minus className="h-4 w-4 text-gray-500" />
                ) : (
                  <Plus className="h-4 w-4 text-gray-500" />
                )}
              </div>

              {openSections[section.title] && (
                <div className="p-4">
                  {section.questions.map((item, index) => (
                    <div key={index} className="border-b last:border-b-0 py-3">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleQuestion(item.question)}
                      >
                        <h4 className="text-sm text-[#8c1c3a]">{item.question}</h4>
                        <button>
                          {openQuestions[item.question] ? (
                            <Minus className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Plus className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {openQuestions[item.question] && (
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Contact Support</h3>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Subject of the Message"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full p-2 border rounded-md h-32 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Describe your issue or question in detail!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attach File (optional)</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l-md focus:outline-none"
                  placeholder="File name"
                  readOnly
                />
                <button type="button" className="px-4 py-2 bg-[#8c1c3a] text-white rounded-r-md">
                  Upload File
                </button>
              </div>
            </div>

            <button type="submit" className="px-4 py-2 bg-[#8c1c3a] text-white rounded-md">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
