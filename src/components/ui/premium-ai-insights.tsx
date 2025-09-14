'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Zap,
  Timer,
  BarChart3,
  Calendar
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

interface PremiumAIInsightsProps {
  insights: AIInsight[]
  onApplyAction?: (insight: AIInsight) => void
  className?: string
}

const categoryConfig = {
  cash: { 
    icon: DollarSign, 
    label: 'Cash Flow'
  },
  growth: { 
    icon: TrendingUp, 
    label: 'Growth'
  },
  labor: { 
    icon: Users, 
    label: 'Labor'
  },
  inventory: { 
    icon: Package, 
    label: 'Inventory'
  },
  risk: { 
    icon: AlertTriangle, 
    label: 'Risk'
  },
  opportunity: { 
    icon: Target, 
    label: 'Opportunity'
  }
}

const difficultyIcons = {
  easy: CheckCircle,
  medium: Clock,
  hard: AlertTriangle
}

// Generate premium, realistic AI insights
const PREMIUM_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    category: 'labor',
    severity: 'high',
    message: "Corner Pocket labor cost at 34.5% (target: 32%). Cut Mike Thompson (bartender, $22/hr) from tonight's 6-8pm shift to save $44.",
    action_data: {
      type: 'schedule_optimization',
      impact: '$85/day savings',
      timeframe: 'Tonight',
      difficulty: 'easy',
      roi: 2.3,
      steps: [
        'Contact Mike Thompson (bartender, $22/hr) - highest wage impact',
        'Remove from tonight\'s 6-8pm shift (2 hours = $44 savings)',
        'Keep Sarah Chen (bartender, $18/hr) for coverage',
        'Monitor bar service levels during rush',
        'Adjust future Thursday schedules based on results'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    category: 'opportunity',
    severity: 'medium',
    message: "Shogun hibachi tables fully booked weekends. Adding capacity could generate additional $4.2K weekly revenue.",
    action_data: {
      type: 'capacity_expansion',
      impact: '$4,200/week increase',
      timeframe: '2-3 weeks',
      difficulty: 'medium',
      roi: 4.8,
      steps: [
        'Analyze dining room layout options',
        'Source additional hibachi equipment',
        'Recruit certified hibachi chef',
        'Update reservation system'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    category: 'cash',
    severity: 'low',
    message: "Portfolio cash flow exceeds targets by 18%. Consider accelerating expansion timeline or increasing growth investments.",
    action_data: {
      type: 'growth_acceleration',
      impact: 'Open 6 months early',
      timeframe: '1-2 months planning',
      difficulty: 'hard',
      roi: 12.5,
      steps: [
        'Conduct market analysis for priority locations',
        'Secure additional financing pre-approval',
        'Begin lease negotiations',
        'Accelerate hiring and training'
      ]
    },
    business_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  }
]

export function PremiumAIInsights({ 
  insights = PREMIUM_INSIGHTS, 
  onApplyAction,
  className 
}: PremiumAIInsightsProps) {
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
      <Card className="animate-fade-in hover-lift">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">All systems optimal</h3>
              <p className="text-sm text-muted-foreground">No urgent actions required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("animate-slide-in-left hover-lift", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Insights</h3>
              <p className="text-xs text-muted-foreground font-normal">
                {insights.length} recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated 8m ago</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedInsights.map((insight, index) => {
          const config = categoryConfig[insight.category]
          const Icon = config.icon
          const DifficultyIcon = insight.action_data ? difficultyIcons[insight.action_data.difficulty] : CheckCircle
          const isExpanded = expandedInsight === insight.id
          const isApplied = appliedInsights.has(insight.id)
          
          return (
            <div
              key={insight.id}
              className={cn(
                "group rounded-lg border transition-all duration-300 animate-fade-in-up overflow-hidden",
                "hover:shadow-sm cursor-pointer",
                isExpanded && "ring-1 ring-primary/20",
                isApplied && "opacity-60 bg-muted/30"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => !isApplied && toggleExpanded(insight.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {config.label}
                          </span>
                          {insight.severity && insight.severity !== 'low' && (
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              insight.severity === 'critical' && "bg-destructive",
                              insight.severity === 'high' && "bg-destructive",
                              insight.severity === 'medium' && "bg-warning"
                            )} />
                          )}
                        </div>
                        
                        <p className="text-sm leading-relaxed text-foreground">
                          {insight.message}
                        </p>
                        
                        {insight.action_data && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{insight.action_data.impact}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              <span>{insight.action_data.timeframe}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>{insight.action_data.roi}x ROI</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {insight.action_data && !isApplied && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApplyAction(insight)
                            }}
                            className="gap-1 h-8 px-3"
                          >
                            <Zap className="h-3 w-3" />
                            Apply
                          </Button>
                        )}
                        
                        {isApplied && (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <CheckCircle className="h-3 w-3" />
                            <span>Applied</span>
                          </div>
                        )}
                        
                        {insight.action_data && !isApplied && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && insight.action_data?.steps && (
                  <div className="mt-4 pt-4 border-t animate-fade-in-up">
                    <div className="ml-12">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <DifficultyIcon className="h-4 w-4 text-muted-foreground" />
                        Implementation Steps
                      </h4>
                      <div className="space-y-2">
                        {insight.action_data.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-primary">
                                {stepIndex + 1}
                              </span>
                            </div>
                            <span className="text-muted-foreground leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        <div className="pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            {insights.filter(i => i.action_data && !appliedInsights.has(i.id)).length > 1 && (
              <Button 
                size="sm" 
                onClick={() => {
                  const applicableInsights = insights.filter(i => i.action_data && !appliedInsights.has(i.id))
                  applicableInsights.forEach(insight => handleApplyAction(insight))
                }}
                className="gap-1"
              >
                <Zap className="h-3 w-3" />
                Apply All ({insights.filter(i => i.action_data && !appliedInsights.has(i.id)).length})
              </Button>
            )}
            {appliedInsights.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {appliedInsights.size} actions applied
              </span>
            )}
          </div>
          
          {insights.length > 4 && (
            <Button variant="ghost" size="sm" className="gap-2">
              View all {insights.length} insights
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}