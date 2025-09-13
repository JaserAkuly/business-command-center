import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  Target,
  CheckCircle
} from 'lucide-react'

interface AIInsight {
  id: string
  category: 'cash' | 'growth' | 'labor' | 'inventory' | 'risk' | 'opportunity'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical' | null
  action_data?: Record<string, unknown> | null
  business_date: string
  created_at: string
}

interface AIInsightsProps {
  insights: AIInsight[]
  onApplyAction?: (insight: AIInsight) => void
  className?: string
}

const categoryIcons = {
  cash: DollarSign,
  growth: TrendingUp,
  labor: Users,
  inventory: Package,
  risk: AlertTriangle,
  opportunity: Target
}

const categoryColors = {
  cash: 'border-green-200 bg-green-50/50',
  growth: 'border-purple-200 bg-purple-50/50',
  labor: 'border-blue-200 bg-blue-50/50',
  inventory: 'border-orange-200 bg-orange-50/50',
  risk: 'border-red-200 bg-red-50/50',
  opportunity: 'border-yellow-200 bg-yellow-50/50'
}

const severityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
  null: 'bg-gray-100 text-gray-800'
}

export function AIInsights({ insights, onApplyAction, className }: AIInsightsProps) {
  const sortedInsights = insights
    .sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, null: 0 }
      return severityOrder[b.severity || 'null'] - severityOrder[a.severity || 'null']
    })
    .slice(0, 4) // Show top 4 insights

  if (insights.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Daily Brief
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>All systems running smoothly</p>
            <p className="text-sm">No urgent actions needed</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Daily Brief
          <Badge variant="secondary">{insights.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedInsights.map((insight) => {
          const Icon = categoryIcons[insight.category]
          const categoryColor = categoryColors[insight.category]
          const severityColor = severityColors[insight.severity || 'null']
          
          return (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border",
                categoryColor
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">
                        {insight.category}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={severityColor}
                      >
                        {insight.severity || 'low'}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      {insight.message}
                    </p>
                  </div>
                </div>
                
                {onApplyAction && insight.action_data && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onApplyAction(insight)}
                    className="flex-shrink-0"
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          )
        })}
        
        {insights.length > 4 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm">
              View All {insights.length} Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AIInsightCard({ insight, onApplyAction, className }: {
  insight: AIInsight
  onApplyAction?: (insight: AIInsight) => void
  className?: string
}) {
  const Icon = categoryIcons[insight.category]
  const categoryColor = categoryColors[insight.category]
  const severityColor = severityColors[insight.severity || 'null']

  return (
    <Card className={cn(categoryColor, className)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <Icon className="h-4 w-4 mt-0.5" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">
                  {insight.category}
                </span>
                <Badge variant="secondary" className={severityColor}>
                  {insight.severity || 'low'}
                </Badge>
              </div>
              <p className="text-sm">{insight.message}</p>
            </div>
          </div>
          
          {onApplyAction && insight.action_data && (
            <Button
              size="sm"
              onClick={() => onApplyAction(insight)}
            >
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}