interface BadgeProps {
    children: React.ReactNode
    variant?: "success" | "error" | "warning" | "info" | "primary"
    size?: "sm" | "md" | "lg"
}

export function Badge({ children, variant = "primary", size = "md" }: BadgeProps) {
    const variants = {
        success: "badge-success",
        error: "badge-error",
        warning: "badge-warning",
        info: "badge-info",
        primary: "badge-primary",
    }

    const sizes = {
        sm: "badge-sm",
        md: "badge-md",
        lg: "badge-lg",
    }

    return (
        <span className={`badge ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    )
}
