import * as React from "react"

export function Avatar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted " + (className ?? "")} {...props}>
      {children}
    </div>
  )
}

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} className={"h-full w-full rounded-full object-cover " + (props.className ?? "")} />
}

export function AvatarFallback({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`flex items-center justify-center h-full w-full text-xs font-medium ${className ?? ""}`} {...props}>
      {children}
    </span>
  )
}


