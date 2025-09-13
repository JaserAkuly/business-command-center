import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercentage } from '@/lib/business-logic'
import { cn } from '@/lib/utils'
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react'

interface LaborGuardrailProps {
  data: {
    forecast_sales: number
    target_labor_pct: number
    allowed_labor_spend: number
    current_labor_spend: number
    labor_variance_pct: number
    variance_status: 'good' | 'warning' | 'alert'
    role_recommendations?: Array<{
      role_name: string
      current_hours: number
      recommended_hours: number
      hours_difference: number
      suggestion: string
      status: 'good' | 'warning' | 'alert'
    }>
  }
  onAdjustSchedule?: () => void
  className?: string
}

export function LaborGuardrail({ data, onAdjustSchedule, className }: LaborGuardrailProps) {
  const {
    forecast_sales,
    target_labor_pct,
    allowed_labor_spend,
    current_labor_spend,
    labor_variance_pct,
    variance_status,
    role_recommendations = []
  } = data

  const getStatusIcon = () => {
    switch (variance_status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusBadge = () => {
    switch (variance_status) {
      case 'good': return <Badge variant="default" className="bg-green-100 text-green-800">On Target</Badge>
      case 'warning': return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'alert': return <Badge variant="destructive">Alert</Badge>
    }
  }

  const getProgressColor = () => {
    switch (variance_status) {
      case 'good': return 'progress-green'
      case 'warning': return 'progress-yellow' 
      case 'alert': return 'progress-red'
    }
  }

  const usagePercentage = (current_labor_spend / allowed_labor_spend) * 100

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Labor Guardrail
        </CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Forecast Sales</div>
            <div className="text-xl font-semibold">{formatCurrency(forecast_sales)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Target Labor %</div>
            <div className="text-xl font-semibold">{formatPercentage(target_labor_pct)}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Labor Spend</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">
                {formatCurrency(current_labor_spend)} / {formatCurrency(allowed_labor_spend)}
              </span>
            </div>
          </div>
          <Progress 
            value={usagePercentage} 
            max={120} 
            className={cn("h-3", getProgressColor())} 
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {formatPercentage(usagePercentage)} of target
            </span>
            <span className={cn(
              "text-xs font-medium",
              labor_variance_pct > 0 ? 'text-red-600' : 'text-green-600'
            )}>
              {labor_variance_pct > 0 ? '+' : ''}{labor_variance_pct.toFixed(1)}% variance
            </span>
          </div>
        </div>

        {role_recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Role Adjustments</div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {role_recommendations
                .filter(role => role.status !== 'good')
                .map((role, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md border bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{role.role_name}</span>
                    <Badge 
                      variant={role.status === 'alert' ? 'destructive' : 'default'}
                      className={role.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {role.suggestion}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {role.current_hours}h → {role.recommended_hours}h
                    </div>
                    <div className={cn(
                      "text-xs font-medium flex items-center gap-1",
                      role.hours_difference > 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {role.hours_difference > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(role.hours_difference).toFixed(1)}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {onAdjustSchedule && variance_status !== 'good' && (
          <div className="pt-2">
            <Button onClick={onAdjustSchedule} className="w-full">
              Adjust Schedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}