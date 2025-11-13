import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import "@/app/globals.css";


interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconColor = "text-primary" }: StatsCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 p-3 shadow-sm ${iconColor}`}>
              <Icon className="h-6 w-6" strokeWidth={2.5} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2 break-words leading-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
