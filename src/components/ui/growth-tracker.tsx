import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/business-logic'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle,
  AlertTriangle 
} from 'lucide-react'

interface GrowthTrackerProps {
  data: {
    target_units: number
    horizon_years: number
    estimated_cost_per_unit: number
    total_cost_needed: number
    daily_target_savings: number
    current_growth_fund: number
    daily_actual_savings: number
    on_track: boolean
    eta_years: number
    shortfall_per_day?: number
  }
  venueData?: Array<{
    venue_name: string
    current_fund: number
    daily_savings: number
    on_track: boolean
  }>
  onAdjustGoals?: () => void
  className?: string
}

export function GrowthTracker({ data, venueData, onAdjustGoals, className }: GrowthTrackerProps) {
  const {
    target_units,
    horizon_years,
    estimated_cost_per_unit,
    total_cost_needed,
    daily_target_savings,
    current_growth_fund,
    daily_actual_savings,
    on_track,
    eta_years,
    shortfall_per_day
  } = data

  const progressPercentage = (current_growth_fund / total_cost_needed) * 100

  const getStatusBadge = () => {
    if (on_track) {
      return <Badge variant="default" className="bg-green-100 text-green-800">On Track</Badge>
    } else {
      return <Badge variant="destructive">Behind Target</Badge>
    }
  }

  const getStatusIcon = () => {
    return on_track ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Growth Tracker
        </CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goal Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              Target Units
            </div>
            <div className="text-xl font-semibold">{target_units}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Timeline
            </div>
            <div className="text-xl font-semibold">{horizon_years}y</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress to Goal</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">
                {formatCurrency(current_growth_fund)} / {formatCurrency(total_cost_needed)}
              </span>
            </div>
          </div>
          <Progress 
            value={progressPercentage} 
            max={100} 
            className="h-3" 
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% complete
            </span>
            <span className="text-xs text-muted-foreground">
              ETA: {eta_years.toFixed(1)} years
            </span>
          </div>
        </div>

        {/* Daily Savings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Daily Target</div>
            <div className="text-lg font-semibold">{formatCurrency(daily_target_savings)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Daily Actual</div>
            <div className={cn(
              "text-lg font-semibold",
              on_track ? 'text-green-600' : 'text-red-600'
            )}>
              {formatCurrency(daily_actual_savings)}
            </div>
          </div>
        </div>

        {/* Shortfall Alert */}
        {!on_track && shortfall_per_day && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Daily Shortfall</span>
            </div>
            <div className="text-sm text-red-700 mt-1">
              Need {formatCurrency(shortfall_per_day)} more per day to stay on track
            </div>
          </div>
        )}

        {/* Venue Breakdown */}
        {venueData && venueData.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Venue Contributions</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {venueData.map((venue, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md border bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{venue.venue_name}</span>
                    <Badge 
                      variant={venue.on_track ? 'default' : 'destructive'}
                      className={venue.on_track ? 'bg-green-100 text-green-800' : ''}
                    >
                      {venue.on_track ? 'On Track' : 'Behind'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(venue.current_fund)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(venue.daily_savings)}/day
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unit Economics */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Cost per unit</span>
            <span className="font-medium">{formatCurrency(estimated_cost_per_unit)}</span>
          </div>
        </div>

        {onAdjustGoals && (
          <div className="pt-2">
            <Button onClick={onAdjustGoals} variant="outline" className="w-full">
              Adjust Goals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}