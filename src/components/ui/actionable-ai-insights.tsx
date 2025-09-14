'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Calendar,
  Zap
} from 'lucide-react'

interface AIInsight {
  id: string
  category: 'cash' | 'growth' | 'labor' | 'inventory' | 'risk' | 'opportunity'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical' | null
  action_data?: {
    type: string
    impact: string
    timeframe: string
    difficulty: 'easy' | 'medium' | 'hard'
    roi: number
    steps?: string[]
  }
  business_date: string
  created_at: string | null
}

interface ActionableAIInsightsProps {
  insights: AIInsight[]
  onApplyAction?: (insight: AIInsight) => void
  className?: string
}

const categoryConfig = {
  cash: { 
    icon: DollarSign, 
    color: 'border-green-200 bg-green-50/50',
    textColor: 'text-green-700',
    bgColor: 'bg-green-100'
  },
  growth: { 
    icon: TrendingUp, 
    color: 'border-purple-200 bg-purple-50/50',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-100'
  },
  labor: { 
    icon: Users, 
    color: 'border-blue-200 bg-blue-50/50',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  inventory: { 
    icon: Package, 
    color: 'border-orange-200 bg-orange-50/50',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-100'
  },
  risk: { 
    icon: AlertTriangle, 
    color: 'border-red-200 bg-red-50/50',
    textColor: 'text-red-700',
    bgColor: 'bg-red-100'
  },
  opportunity: { 
    icon: Target, 
    color: 'border-yellow-200 bg-yellow-50/50',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-100'
  }
}

const severityColors = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
  null: 'bg-gray-100 text-gray-800 border-gray-200'
}

const difficultyColors = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600'
}

// Generate realistic AI insights
const REALISTIC_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    category: 'labor',
    severity: 'high',
    message: "Corner Pocket's labor cost hit 34.5% yesterday (target: 32%). Thursday NFL games drive high volume but overstaffing is eating profits.",
    action_data: {
      type: 'schedule_optimization',
      impact: 'Save $125-180 per Thursday',
      timeframe: 'Immediate',
      difficulty: 'easy',
      roi: 2.3,
      steps: [
        'Reduce bartender shift from 3 to 2 during 6-8pm',
        'Move one server to on-call status',
        'Cross-train kitchen staff for bar backup'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    category: 'opportunity',
    severity: 'medium',
    message: "Shogun's hibachi tables consistently book out Friday-Sunday. Adding 2 more tables could capture $4,200 weekly revenue.",
    action_data: {
      type: 'capacity_expansion',
      impact: '$4,200/week additional revenue',
      timeframe: '2-3 weeks',
      difficulty: 'medium',
      roi: 4.8,
      steps: [
        'Reconfigure dining room layout',
        'Purchase 2 hibachi grills ($8,500)',
        'Hire 1 additional hibachi chef',
        'Update reservation system capacity'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    category: 'cash',
    severity: 'low',
    message: "Portfolio cash flow up 18% this month! Growth fund target exceeded - consider accelerating expansion timeline.",
    action_data: {
      type: 'growth_acceleration',
      impact: 'Open 6 months earlier',
      timeframe: '1-2 months',
      difficulty: 'hard',
      roi: 12.5,
      steps: [
        'Review market analysis for backup locations',
        'Secure additional pre-approval for $485K',
        'Begin lease negotiations',
        'Accelerate hiring for management team'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    category: 'inventory',
    severity: 'medium',
    message: "Harbor House seafood waste up 12% this week. Daily ordering vs predictive modeling could save $280/week.",
    action_data: {
      type: 'inventory_optimization',
      impact: 'Reduce waste by $280/week',
      timeframe: '1 week',
      difficulty: 'easy',
      roi: 3.2,
      steps: [
        'Switch to data-driven ordering system',
        'Train kitchen manager on predictive analytics',
        'Implement daily waste tracking',
        'Adjust par levels based on historical data'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  }
]

export function ActionableAIInsights({ 
  insights = REALISTIC_INSIGHTS, 
  onApplyAction,
  className 
}: ActionableAIInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  const [appliedInsights, setAppliedInsights] = useState<Set<string>>(new Set())

  const sortedInsights = insights
    .sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, null: 0 }
      return severityOrder[b.severity || 'null'] - severityOrder[a.severity || 'null']
    })
    .slice(0, 4)

  const handleApplyAction = (insight: AIInsight) => {
    setAppliedInsights(prev => new Set([...prev, insight.id]))
    onApplyAction?.(insight)
  }

  const toggleExpanded = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId)
  }

  if (insights.length === 0) {
    return (
      <Card className={cn("animate-fade-in", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-500" />
            AI Daily Brief
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="font-medium">All systems running smoothly</p>
            <p className="text-sm">No urgent actions needed today</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("animate-slide-in-left", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Daily Brief
            <Badge variant="secondary">{insights.length}</Badge>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updated 8 min ago
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedInsights.map((insight, index) => {
          const config = categoryConfig[insight.category]
          const Icon = config.icon
          const isExpanded = expandedInsight === insight.id
          const isApplied = appliedInsights.has(insight.id)
          
          return (
            <div
              key={insight.id}
              className={cn(
                "rounded-lg border p-4 transition-all duration-300 animate-fade-in-up cursor-pointer",
                config.color,
                isExpanded && "ring-2 ring-primary/20",
                isApplied && "opacity-60"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => toggleExpanded(insight.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn("p-2 rounded-full", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.textColor)} />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="secondary" 
                        className={cn("capitalize text-xs", config.textColor)}
                      >
                        {insight.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", severityColors[insight.severity || 'null'])}
                      >
                        {insight.severity || 'info'}
                      </Badge>
                      {insight.action_data && (
                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                          <Zap className="h-3 w-3 mr-1" />
                          {insight.action_data.difficulty} fix
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {insight.message}
                    </p>
                    
                    {insight.action_data && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <span>💰 {insight.action_data.impact}</span>
                          <span>⏱️ {insight.action_data.timeframe}</span>
                          <span>📈 {insight.action_data.roi}x ROI</span>
                        </div>
                      </div>
                    )}

                    {isExpanded && insight.action_data?.steps && (
                      <div className="mt-3 p-3 bg-background/50 rounded-lg animate-fade-in">
                        <h4 className="font-medium text-sm mb-2">Action Steps:</h4>
                        <ul className="space-y-1">
                          {insight.action_data.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Implementation Progress</span>
                            <span className="font-medium">Ready to start</span>
                          </div>
                          <Progress value={0} className="mt-1 h-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {insight.action_data && !isApplied && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApplyAction(insight)
                    }}
                    className="flex-shrink-0 gap-1 animate-pulse-subtle"
                  >
                    <Zap className="h-3 w-3" />
                    Apply
                  </Button>
                )}
                
                {isApplied && (
                  <div className="flex-shrink-0 flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="h-4 w-4" />
                    Applied
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm" className="gap-1">
            View All Insights
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}