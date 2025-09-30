import * as React from "react"

export function Select({ children }: { defaultValue?: string; onChange?: (v: string) => void; children: React.ReactNode }) {
  return <div data-select>{children}</div>
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <button type="button" className={"h-10 w-full rounded-md border px-3 text-left " + (className ?? "")}>{children}</button>
}

export function SelectValue() { return <span /> }

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 rounded-md border bg-card p-1 shadow-sm">{children}</div>
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <div data-value={value} className="cursor-pointer rounded px-2 py-1 hover:bg-muted">{children}</div>
}


