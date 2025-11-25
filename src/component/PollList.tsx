import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Poll } from "../interfaces/poll"
import api from "../services/api"

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Polls</h1>
        <Link to="/polls/create" className="btn btn-primary">
          Create New Poll
        </Link>
      </div>

      <div className="mb-4">
        <select
          className="select select-bordered w-full max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Polls</option>
          <option value="active">Active Polls</option>
          <option value="ended">Ended Polls</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {polls.map((poll) => (
          <div key={poll.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{poll.title}</h2>
              <p className="text-sm text-gray-600">
                Ends: {formatDate(poll.endDate)}
              </p>
              <p className="line-clamp-2">{poll.description}</p>
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/polls/${poll.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Poll
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No polls found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
