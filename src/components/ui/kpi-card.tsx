import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    period: string
    positive?: boolean
  }
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'flat'
  status?: 'good' | 'warning' | 'alert'
  subtitle?: string
  className?: string
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend, 
  status,
  subtitle,
  className 
}: KPICardProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50/50'
      case 'warning': return 'border-yellow-200 bg-yellow-50/50'
      case 'alert': return 'border-red-200 bg-red-50/50'
      default: return 'border-border bg-card'
    }
  }

  const getTrendColor = () => {
    if (change?.positive !== undefined) {
      return change.positive ? 'text-green-600' : 'text-red-600'
    }
    
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Card className={cn(getStatusStyles(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {change && (
          <p className={cn("text-xs mt-1", getTrendColor())}>
            {change.value > 0 ? '+' : ''}{change.value}% from {change.period}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function KPIGrid({ children, className }: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  )
}