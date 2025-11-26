import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Poll } from "../interfaces/poll"
import api from "../services/api"
import { Badge } from "../components/ui/Badge"
import { LoadingState } from "../components/LoadingState"
import { EmptyState } from "../components/EmptyState"

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function fetchPolls() {
      try {
        setLoading(true)
        const response = await api.get(
          `/polls?page=${page}&limit=6&status=${filter}`
        )
        setPolls(response.data.polls)
        setTotalPages(response.data.pagination.total_pages)
        setError("")
      } catch (err) {
        setError("Failed to load polls")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [page, filter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isPollActive = (endDate: string) => {
    return new Date(endDate) > new Date()
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg animate-slide-up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discover Polls
          </h1>
          <p className="text-base-content/70 mt-1">
            Vote on trending polls or create your own
          </p>
        </div>
        <Link
          to="/polls/create"
          className="btn btn-gradient btn-lg gap-2 shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Poll
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "ended"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status)
              setPage(1)
            }}
            className={`btn btn-sm ${filter === status
                ? "btn-primary"
                : "btn-ghost hover:bg-primary/10"
              } capitalize`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Polls Grid */}
      {polls.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No polls found"
          description="Be the first to create a poll and start gathering opinions from the community!"
          actionLabel="Create First Poll"
          actionLink="/polls/create"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll, index) => {
              const isActive = isPollActive(poll.endDate)
              return (
                <div
                  key={poll.id}
                  className="glass-card rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={isActive ? "success" : "error"} size="sm">
                      {isActive ? "🟢 Active" : "🔴 Ended"}
                    </Badge>
                  </div>

                  {/* Poll Title */}
                  <h2 className="text-xl font-bold text-base-content mb-3 line-clamp-2 flex-grow">
                    {poll.title}
                  </h2>

                  {/* Description */}
                  <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
                    {poll.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 text-xs text-base-content/60 mb-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Ends: {formatDate(poll.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>{poll.options?.length || 0} options</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/polls/${poll.id}`}
                    className="btn btn-primary btn-sm w-full group"
                  >
                    <span>View Poll</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
              <span className="flex items-center px-4 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
