import * as React from "react"

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline"
}

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  const variantClass =
    variant === "secondary"
      ? "bg-gray-100 text-gray-700"
      : variant === "outline"
      ? "border border-border text-foreground"
      : "bg-primary text-primary-foreground"

  return (
    <span
      className={
        "inline-flex items-center badge-pill " +
        variantClass +
        (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </span>
  )
}


