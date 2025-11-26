import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Poll } from "../interfaces/poll"
import api from "../services/api"

export function PollCreate() {
  const navigate = useNavigate()
  const [poll, setPoll] = useState<Poll>({
    title: "",
    description: "",
    endDate: "",
    options: [
      { text: "", votes: 0 },
      { text: "", votes: 0 },
    ],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addOption = () => {
    if (poll.options.length < 10) {
      setPoll({
        ...poll,
        options: [...poll.options, { text: "", votes: 0 }],
      })
    }
  }

  const removeOption = (index: number) => {
    if (poll.options.length > 2) {
      setPoll({
        ...poll,
        options: poll.options.filter((_, i) => i !== index),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/polls", poll)
      if (response.status === 201) {
        navigate("/polls")
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create poll")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Create New Poll
        </h1>
        <p className="text-base-content/70">
          Gather opinions and insights from your community
        </p>
      </div>

      {/* Error Alert */}
      {error && (
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
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-2xl p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Poll Title
              </span>
              <span className="label-text-alt text-base-content/60">
                {poll.title.length}/100
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full input-lg focus:input-primary"
              placeholder="What's your question?"
              value={poll.title}
              onChange={(e) => setPoll({ ...poll, title: e.target.value })}
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
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
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Description
              </span>
              <span className="label-text-alt text-base-content/60">
                {poll.description.length}/500
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 focus:textarea-primary"
              placeholder="Provide context for your poll..."
              value={poll.description}
              onChange={(e) =>
                setPoll({ ...poll, description: e.target.value })
              }
              required
              maxLength={500}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                End Date & Time
              </span>
            </label>
            <input
              type="datetime-local"
              className="input input-bordered w-full focus:input-primary"
              value={poll.endDate}
              onChange={(e) => setPoll({ ...poll, endDate: e.target.value })}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        {/* Options */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <svg
                className="w-6 h-6"
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
              Poll Options
            </h3>
            <span className="badge badge-primary">
              {poll.options.length}/10
            </span>
          </div>

          <div className="space-y-3">
            {poll.options.map((option, index) => (
              <div
                key={index}
                className="flex gap-2 items-center animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="badge badge-lg badge-ghost">
                  {index + 1}
                </span>
                <input
                  type="text"
                  className="input input-bordered flex-1 focus:input-primary"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...poll.options]
                    newOptions[index].text = e.target.value
                    setPoll({ ...poll, options: newOptions })
                  }}
                  required
                  minLength={1}
                  maxLength={200}
                />
                {poll.options.length > 2 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-circle text-error"
                    onClick={() => removeOption(index)}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {poll.options.length < 10 && (
            <button
              type="button"
              className="btn btn-outline btn-secondary w-full gap-2"
              onClick={addOption}
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
              Add Option
            </button>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/polls")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-gradient btn-lg gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Create Poll
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
