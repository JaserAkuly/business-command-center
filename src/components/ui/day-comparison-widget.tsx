'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Minus
} from 'lucide-react'

interface ComparisonData {
  today: number
  yesterday: number
  lastWeek: number
  lastMonth: number
  lastYear: number
}

interface DayComparisonWidgetProps {
  venue?: string
  className?: string
}

// Generate realistic comparison data
const generateComparisonData = (): {
  revenue: ComparisonData
  guests: ComparisonData
  avgCheck: ComparisonData
  laborCost: ComparisonData
} => {
  const baseRevenue = 8500
  const seasonalFactor = 1 + (Math.sin(new Date().getMonth() * Math.PI / 6) * 0.15)
  
  return {
    revenue: {
      today: Math.round(baseRevenue * (0.95 + Math.random() * 0.2)),
      yesterday: Math.round(baseRevenue * (0.90 + Math.random() * 0.15)),
      lastWeek: Math.round(baseRevenue * (0.85 + Math.random() * 0.2) * 0.95),
      lastMonth: Math.round(baseRevenue * (0.80 + Math.random() * 0.25) * 0.90),
      lastYear: Math.round(baseRevenue * (0.70 + Math.random() * 0.3) * seasonalFactor * 0.85)
    },
    guests: {
      today: Math.round(180 * (0.95 + Math.random() * 0.15)),
      yesterday: Math.round(180 * (0.90 + Math.random() * 0.15)),
      lastWeek: Math.round(180 * (0.85 + Math.random() * 0.2) * 0.95),
      lastMonth: Math.round(180 * (0.80 + Math.random() * 0.25) * 0.90),
      lastYear: Math.round(180 * (0.70 + Math.random() * 0.3) * seasonalFactor * 0.85)
    },
    avgCheck: {
      today: Math.round(47.20 * (0.98 + Math.random() * 0.08) * 100) / 100,
      yesterday: Math.round(47.20 * (0.95 + Math.random() * 0.10) * 100) / 100,
      lastWeek: Math.round(47.20 * (0.92 + Math.random() * 0.12) * 100) / 100,
      lastMonth: Math.round(47.20 * (0.88 + Math.random() * 0.15) * 100) / 100,
      lastYear: Math.round(47.20 * (0.80 + Math.random() * 0.20) * seasonalFactor * 100) / 100
    },
    laborCost: {
      today: Math.round((29.5 + (Math.random() * 6 - 3)) * 10) / 10,
      yesterday: Math.round((31.2 + (Math.random() * 4 - 2)) * 10) / 10,
      lastWeek: Math.round((30.8 + (Math.random() * 5 - 2.5)) * 10) / 10,
      lastMonth: Math.round((32.1 + (Math.random() * 6 - 3)) * 10) / 10,
      lastYear: Math.round((34.5 + (Math.random() * 4 - 2)) * 10) / 10
    }
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`
}

const calculateChange = (current: number, comparison: number): { value: number; positive: boolean } => {
  if (comparison === 0) return { value: 0, positive: true }
  const change = ((current - comparison) / comparison) * 100
  return {
    value: Math.abs(change),
    positive: change >= 0
  }
}

const ComparisonRow = ({ 
  label, 
  current, 
  comparison, 
  formatter,
  icon: Icon 
}: {
  label: string
  current: number
  comparison: number
  formatter: (value: number) => string
  icon: React.ComponentType<{ className?: string }>
}) => {
  const change = calculateChange(current, comparison)
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 w-full overflow-hidden">
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="font-medium text-sm truncate">{label}</span>
      </div>
      
      <div className="flex items-center gap-2 text-right min-w-0 flex-shrink">
        <div className="space-y-1 min-w-0">
          <div className="font-bold text-sm truncate">{formatter(current)}</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium min-w-[70px] justify-center flex-shrink-0",
          change.positive 
            ? "bg-success/10 text-success" 
            : "bg-destructive/10 text-destructive"
        )}>
          {change.value === 0 ? (
            <Minus className="h-3 w-3" />
          ) : change.positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span className="truncate">{change.value === 0 ? 'No change' : `${change.value.toFixed(0)}%`}</span>
        </div>
        
        <div className="space-y-1 min-w-[55px] flex-shrink-0">
          <div className="text-sm text-muted-foreground truncate">{formatter(comparison)}</div>
          <div className="text-xs text-muted-foreground">Previous</div>
        </div>
      </div>
    </div>
  )
}

export function DayComparisonWidget({ venue, className }: DayComparisonWidgetProps) {
  const data = generateComparisonData()
  
  const comparisonPeriods = [
    { label: 'Yesterday', key: 'yesterday' as keyof ComparisonData },
    { label: 'Last Week', key: 'lastWeek' as keyof ComparisonData },
    { label: 'Last Month', key: 'lastMonth' as keyof ComparisonData },
    { label: 'Last Year', key: 'lastYear' as keyof ComparisonData }
  ]

  return (
    <Card className={cn("animate-fade-in hover-lift", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {venue ? `${venue} Performance` : 'Portfolio Performance'}
              </h3>
              <p className="text-xs text-muted-foreground font-normal">
                Today vs historical comparison
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Overview */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Today's Revenue</div>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.today)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">vs Yesterday</div>
            <div className={cn(
              "text-lg font-semibold flex items-center gap-1",
              data.revenue.today > data.revenue.yesterday ? "text-success" : "text-destructive"
            )}>
              {data.revenue.today > data.revenue.yesterday ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {calculateChange(data.revenue.today, data.revenue.yesterday).value.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Detailed Comparisons - Show yesterday by default */}
        <div className="space-y-1">
          <ComparisonRow
            label="Revenue"
            current={data.revenue.today}
            comparison={data.revenue.yesterday}
            formatter={formatCurrency}
            icon={DollarSign}
          />
          <ComparisonRow
            label="Guests"
            current={data.guests.today}
            comparison={data.guests.yesterday}
            formatter={(v) => Math.round(v).toLocaleString()}
            icon={Users}
          />
          <ComparisonRow
            label="Avg Check"
            current={data.avgCheck.today}
            comparison={data.avgCheck.yesterday}
            formatter={formatCurrency}
            icon={BarChart3}
          />
          <ComparisonRow
            label="Labor Cost"
            current={data.laborCost.today}
            comparison={data.laborCost.yesterday}
            formatter={formatPercentage}
            icon={Calendar}
          />
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Calendar className="h-4 w-4" />
            View Historical Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}