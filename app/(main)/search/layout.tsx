import { Suspense } from "react"

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-primary mb-4" />
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}