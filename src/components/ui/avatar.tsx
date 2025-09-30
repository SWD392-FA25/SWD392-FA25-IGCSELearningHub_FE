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
    <span className={"text-xs font-medium text-muted-foreground " + (className ?? "")} {...props}>
      {children}
    </span>
  )
}


