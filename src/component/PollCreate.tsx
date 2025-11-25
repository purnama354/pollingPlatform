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
    try {
      const response = await api.post("/polls", poll)
      if (response.status === 201) {
        navigate("/polls")
      }
    } catch (error) {
      console.error("Failed to create poll:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Poll</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={poll.title}
            onChange={(e) => setPoll({ ...poll, title: e.target.value })}
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={poll.description}
            onChange={(e) => setPoll({ ...poll, description: e.target.value })}
            required
            maxLength={500}
          />
        </div>

        <div>
          <label className="label">End Date</label>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            value={poll.endDate}
            onChange={(e) => setPoll({ ...poll, endDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="label">Options</label>
          {poll.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
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
                  className="btn btn-error"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {poll.options.length < 10 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addOption}
            >
              Add Option
            </button>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Create Poll
        </button>
      </form>
    </div>
  )
}
