export function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-2xl">📊</span>
                </div>
            </div>
            <p className="text-base-content/70 font-medium">Loading polls...</p>
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-base-300 rounded w-3/4"></div>
                <div className="h-4 bg-base-300 rounded w-1/4"></div>
                <div className="h-20 bg-base-300 rounded"></div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-base-300 rounded w-20"></div>
                    <div className="h-10 bg-base-300 rounded w-24"></div>
                </div>
            </div>
        </div>
    )
}
