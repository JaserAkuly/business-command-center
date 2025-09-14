'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DayComparisonWidget } from '@/components/ui/day-comparison-widget'
import { formatCurrency, formatPercentage } from '@/lib/business-logic'
import { 
  TrendingUp, 
  Target, 
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2
} from 'lucide-react'

interface GrowthGoal {
  id: string
  type: 'new_venue' | 'expansion' | 'renovation'
  title: string
  targetUnits: number
  estimatedCost: number
  currentFunding: number
  targetDate: string
  status: 'planning' | 'funding' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  location?: string
}

const GROWTH_GOALS: GrowthGoal[] = [
  {
    id: '1',
    type: 'new_venue',
    title: 'Downtown Sports Bar',
    targetUnits: 1,
    estimatedCost: 485000.00,
    currentFunding: 298500.00,
    targetDate: '2025-06-15',
    status: 'funding',
    priority: 'high',
    location: 'Downtown District'
  },
  {
    id: '2',
    type: 'expansion',
    title: 'Corner Pocket Patio',
    targetUnits: 1,
    estimatedCost: 125000.00,
    currentFunding: 87500.00,
    targetDate: '2025-03-01',
    status: 'funding',
    priority: 'medium',
    location: 'Corner Pocket'
  },
  {
    id: '3',
    type: 'renovation',
    title: 'Shogun Kitchen Upgrade',
    targetUnits: 1,
    estimatedCost: 65000.00,
    currentFunding: 65000.00,
    targetDate: '2025-01-15',
    status: 'in_progress',
    priority: 'high',
    location: 'Shogun Sushi'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'status-success'
    case 'in_progress': return 'status-warning'
    case 'funding': return 'status-info'
    case 'planning': return 'border'
    default: return 'border'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle
    case 'in_progress': return Clock
    case 'funding': return DollarSign
    case 'planning': return Target
    default: return Target
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50'
    case 'medium': return 'text-yellow-600 bg-yellow-50'
    case 'low': return 'text-green-600 bg-green-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export default function GrowthPage() {
  const totalGoalValue = GROWTH_GOALS.reduce((sum, goal) => sum + goal.estimatedCost, 0)
  const totalCurrentFunding = GROWTH_GOALS.reduce((sum, goal) => sum + goal.currentFunding, 0)
  const fundingProgress = (totalCurrentFunding / totalGoalValue) * 100
  const monthlyTarget = 25000.00 // Target monthly savings
  const currentMonthly = 18750.00 // Actual monthly savings

  const handleAccelerateFunding = (goalId: string) => {
    console.log('Accelerating funding for goal:', goalId)
    // Would integrate with financial planning system
  }

  return (
    <div className="container-premium py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Growth Planner</h1>
          <p className="text-muted-foreground text-lg">
            Strategic expansion planning with AI-powered funding optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Target className="h-4 w-4" />
            Market Analysis
          </Button>
          <Button size="sm" className="gap-2">
            <Building2 className="h-4 w-4" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Goal Value</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalGoalValue)}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">{GROWTH_GOALS.length} active goals</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Current Funding</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalCurrentFunding)}</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">{Math.ceil(fundingProgress)}% of target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Monthly Target</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(monthlyTarget)}</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-warning" />
                <span className="text-warning">Need {formatCurrency(monthlyTarget - currentMonthly)} more</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Funding Rate</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(currentMonthly)}</div>
              <div className="flex items-center gap-1 text-sm">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-warning">{Math.ceil((currentMonthly / monthlyTarget) * 100)}% of target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Growth Goals */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5" />
                  <span>Active Growth Goals</span>
                </div>
                <Button size="sm" className="gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Optimize Funding
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {GROWTH_GOALS.map((goal) => {
                const StatusIcon = getStatusIcon(goal.status)
                const fundingProgress = (goal.currentFunding / goal.estimatedCost) * 100
                const remainingFunding = goal.estimatedCost - goal.currentFunding
                const targetDate = new Date(goal.targetDate)
                const monthsRemaining = Math.max(1, Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)))
                const monthlyNeed = remainingFunding / monthsRemaining
                
                return (
                  <div key={goal.id} className={`p-4 rounded-lg border transition-all duration-300 ${getStatusColor(goal.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{goal.title}</div>
                          <Badge variant="secondary" className={getPriorityColor(goal.priority)}>
                            {goal.priority} priority
                          </Badge>
                          <Badge variant="outline">{goal.type.replace('_', ' ')}</Badge>
                        </div>
                        
                        {goal.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{goal.location}</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-muted-foreground">Progress</div>
                            <div className="font-medium">
                              {formatCurrency(goal.currentFunding)} / {formatCurrency(goal.estimatedCost)}
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, fundingProgress)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-muted-foreground">Target Date</div>
                            <div className="font-medium">{targetDate.toLocaleDateString()}</div>
                            <div className="text-xs text-warning">
                              Need {formatCurrency(monthlyNeed)}/month
                            </div>
                          </div>
                        </div>

                        {remainingFunding > 0 && (
                          <div className="text-sm bg-muted/50 px-2 py-1 rounded">
                            💡 {formatCurrency(remainingFunding)} needed - increase savings by {formatCurrency(monthlyNeed - currentMonthly)}/month
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {remainingFunding > 0 && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAccelerateFunding(goal.id)}
                            className="gap-1"
                          >
                            <TrendingUp className="h-3 w-3" />
                            Accelerate
                          </Button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <StatusIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Day Comparison */}
        <div>
          <DayComparisonWidget className="mb-6" />
          
          {/* Market Intelligence */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="font-medium text-success text-sm">High Opportunity</div>
                  <div className="text-xs text-muted-foreground mt-1">Downtown District shows 23% growth in dining traffic</div>
                </div>
                
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="font-medium text-warning text-sm">Market Risk</div>
                  <div className="text-xs text-muted-foreground mt-1">Construction costs up 8% this quarter</div>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="font-medium text-primary text-sm">Funding Opportunity</div>
                  <div className="text-xs text-muted-foreground mt-1">SBA loans available at 5.2% APR</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Updated: 2 hours ago</div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Full Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}