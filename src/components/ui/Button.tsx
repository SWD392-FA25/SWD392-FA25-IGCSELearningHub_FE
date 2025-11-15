"use client";
import * as React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "primary";
  size?: "default" | "icon" | "sm" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, variant = "default", size = "default", className, ...props }: ButtonProps) => {
  const variantClass =
    variant === "ghost"
      ? "bg-transparent hover:bg-muted"
      : variant === "outline"
      ? "border bg-transparent hover:bg-muted"
      : variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : "bg-black text-white";

  const sizeClass =
    size === "icon"
      ? "h-10 w-10 p-0 inline-flex items-center justify-center"
      : size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
      ? "px-5 py-2.5 text-base"
      : "px-4 py-2";

  return (
    <button
      className={`rounded ${variantClass} ${sizeClass} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
