import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercentage } from '@/lib/business-logic'
import { cn } from '@/lib/utils'
import { Wallet, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useState } from 'react'

interface CashEnvelopeCardProps {
  envelope: {
    id: string
    name: string
    target_pct: number
    current_balance: number
  }
  totalSales?: number
  trend?: {
    direction: 'up' | 'down' | 'flat'
    percentage: number
  }
  onUpdateTarget?: (envelopeId: string, newTarget: number) => void
  editable?: boolean
  className?: string
}

const envelopeColors: Record<string, string> = {
  tax: 'border-blue-200 bg-blue-50/50',
  payroll: 'border-green-200 bg-green-50/50', 
  debt: 'border-red-200 bg-red-50/50',
  growth: 'border-purple-200 bg-purple-50/50',
  reserves: 'border-orange-200 bg-orange-50/50',
  cogs: 'border-gray-200 bg-gray-50/50'
}

const envelopeIcons: Record<string, any> = {
  tax: Wallet,
  payroll: TrendingUp,
  debt: TrendingDown,
  growth: TrendingUp,
  reserves: Wallet,
  cogs: Minus
}

export function CashEnvelopeCard({ 
  envelope, 
  totalSales = 0,
  trend,
  onUpdateTarget,
  editable = false,
  className 
}: CashEnvelopeCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [targetValue, setTargetValue] = useState([envelope.target_pct])

  const Icon = envelopeIcons[envelope.name] || Wallet
  const colorClass = envelopeColors[envelope.name] || 'border-border bg-card'
  
  const todaysAllocation = totalSales * (envelope.target_pct / 100)
  
  const handleSave = () => {
    if (onUpdateTarget) {
      onUpdateTarget(envelope.id, targetValue[0])
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTargetValue([envelope.target_pct])
    setIsEditing(false)
  }

  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend.direction) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'down': return <TrendingDown className="h-3 w-3 text-red-600" />
      default: return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  return (
    <Card className={cn(colorClass, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {envelope.name}
        </CardTitle>
        {trend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={cn(
              "text-xs",
              trend.direction === 'up' ? 'text-green-600' : 
              trend.direction === 'down' ? 'text-red-600' : 'text-gray-400'
            )}>
              {trend.percentage}%
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="text-lg font-semibold">
              {formatCurrency(envelope.current_balance)}
            </span>
          </div>
          
          {totalSales > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Today's allocation</span>
              <span className="text-sm font-medium">
                {formatCurrency(todaysAllocation)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Target</span>
            <span className="text-sm font-medium">
              {formatPercentage(isEditing ? targetValue[0] : envelope.target_pct)}
            </span>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <Slider
                value={targetValue}
                onValueChange={setTargetValue}
                max={50}
                min={0}
                step={0.25}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <Progress 
                value={envelope.target_pct} 
                max={50} 
                className="h-2" 
              />
              {editable && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsEditing(true)}
                  className="text-xs p-1 h-auto"
                >
                  Adjust Target
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}