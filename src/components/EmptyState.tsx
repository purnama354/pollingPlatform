import { Link } from "react-router-dom"

interface EmptyStateProps {
    title: string
    description: string
    actionLabel?: string
    actionLink?: string
    icon?: string
}

export function EmptyState({
    title,
    description,
    actionLabel,
    actionLink,
    icon = "🤷",
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">{icon}</div>
            <h3 className="text-2xl font-bold text-base-content mb-2">{title}</h3>
            <p className="text-base-content/70 text-center max-w-md mb-6">
                {description}
            </p>
            {actionLabel && actionLink && (
                <Link to={actionLink} className="btn btn-gradient btn-lg">
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}
