import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Poll } from "../interfaces/poll"
import api from "../services/api"
import { Badge } from "../components/ui/Badge"
import { LoadingState } from "../components/LoadingState"

export function PollVote() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [poll, setPoll] = useState<Poll | null>(null)
    const [loading, setLoading] = useState(true)
    const [voting, setVoting] = useState(false)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [hasVoted, setHasVoted] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchPoll() {
            try {
                setLoading(true)
                const response = await api.get(`/polls/${id}`)
                setPoll(response.data)
                setError("")
            } catch (err) {
                setError("Failed to load poll")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPoll()
    }, [id])

    const handleVote = async () => {
        if (selectedOption === null || !poll) return

        setVoting(true)
        try {
            await api.post(`/polls/${id}/vote`, {
                option_index: selectedOption,
            })

            // Refetch poll to get updated results
            const response = await api.get(`/polls/${id}`)
            setPoll(response.data)
            setHasVoted(true)
            setError("")
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to submit vote")
        } finally {
            setVoting(false)
        }
    }

    const isPollActive = poll && new Date(poll.endDate) > new Date()
    const totalVotes = poll?.options.reduce((sum, opt) => sum + opt.votes, 0) || 0

    const getPercentage = (votes: number) => {
        if (totalVotes === 0) return 0
        return Math.round((votes / totalVotes) * 100)
    }

    if (loading) return <LoadingState />

    if (error && !poll) {
        return (
            <div className="container mx-auto p-4 max-w-3xl">
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
                <button
                    onClick={() => navigate("/polls")}
                    className="btn btn-ghost mt-4"
                >
                    ← Back to Polls
                </button>
            </div>
        )
    }

    if (!poll) return null

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/polls")}
                    className="btn btn-ghost btn-circle"
                >
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {poll.title}
                        </h1>
                        <Badge variant={isPollActive ? "success" : "error"} size="md">
                            {isPollActive ? "🟢 Active" : "🔴 Ended"}
                        </Badge>
                    </div>
                    <p className="text-base-content/70 mt-1">{poll.description}</p>
                </div>
            </div>

            {/* Poll Info */}
            <div className="glass-card rounded-2xl p-4">
                <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-primary"
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
                        <span className="text-base-content/70">
                            Ends: {new Date(poll.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="text-base-content/70">
                            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && hasVoted && (
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

            {/* Success Message */}
            {hasVoted && !error && (
                <div className="alert alert-success shadow-lg animate-slide-up">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Thank you for voting! Your response has been recorded.</span>
                </div>
            )}

            {/* Voting Options */}
            <div className="glass-card rounded-2xl p-8 space-y-4">
                <h2 className="text-2xl font-bold mb-6">
                    {hasVoted || !isPollActive ? "Results" : "Cast Your Vote"}
                </h2>

                <div className="space-y-4">
                    {poll.options.map((option, index) => {
                        const percentage = getPercentage(option.votes)
                        const isSelected = selectedOption === index
                        const isWinning = option.votes === Math.max(...poll.options.map(o => o.votes)) && totalVotes > 0

                        return (
                            <div
                                key={index}
                                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${!hasVoted && isPollActive
                                        ? isSelected
                                            ? "border-primary bg-primary/10 shadow-lg scale-105"
                                            : "border-base-300 hover:border-primary/50 hover:shadow-md cursor-pointer"
                                        : "border-base-300"
                                    }`}
                                onClick={() => {
                                    if (!hasVoted && isPollActive) {
                                        setSelectedOption(index)
                                    }
                                }}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Progress Bar Background */}
                                {(hasVoted || !isPollActive) && (
                                    <div
                                        className={`absolute inset-0 transition-all duration-1000 ease-out ${isWinning
                                                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                                                : "bg-base-200"
                                            }`}
                                        style={{
                                            width: `${percentage}%`,
                                            transitionDelay: `${index * 0.1}s`,
                                        }}
                                    />
                                )}

                                <div className="relative p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {/* Radio/Checkbox */}
                                        {!hasVoted && isPollActive ? (
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                                        ? "border-primary bg-primary"
                                                        : "border-base-300"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xl font-bold text-base-content/40">
                                                {index + 1}
                                            </span>
                                        )}

                                        {/* Option Text */}
                                        <span className="font-medium text-base-content flex-1">
                                            {option.text}
                                        </span>

                                        {/* Winner Badge */}
                                        {isWinning && (hasVoted || !isPollActive) && totalVotes > 0 && (
                                            <span className="badge badge-primary gap-1">
                                                🏆 Leading
                                            </span>
                                        )}
                                    </div>

                                    {/* Percentage */}
                                    {(hasVoted || !isPollActive) && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-base-content/60">
                                                {option.votes} {option.votes === 1 ? "vote" : "votes"}
                                            </span>
                                            <span className="font-bold text-lg min-w-[4rem] text-right">
                                                {percentage}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Vote Button */}
                {!hasVoted && isPollActive && (
                    <button
                        onClick={handleVote}
                        disabled={selectedOption === null || voting}
                        className="btn btn-gradient btn-lg w-full mt-6 gap-2"
                    >
                        {voting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Submitting Vote...
                            </>
                        ) : (
                            <>
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Submit Vote
                            </>
                        )}
                    </button>
                )}

                {/* Poll Ended Message */}
                {!isPollActive && !hasVoted && (
                    <div className="alert alert-warning">
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <span>This poll has ended. Voting is no longer available.</span>
                    </div>
                )}
            </div>
        </div>
    )
}
