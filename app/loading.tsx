import { Layout } from "@/components/layout"
import { SkeletonStatCard, SkeletonListItem, SkeletonCalendarGrid } from "@/components/ui/skeletons"

export default function LoadingPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-7 w-36 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <SkeletonCalendarGrid />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 w-40 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonListItem key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
