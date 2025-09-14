'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DayComparisonWidget } from '@/components/ui/day-comparison-widget'
import { cn } from '@/lib/utils'
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  UserX,
  UserCheck,
  Calendar,
  Settings,
  ArrowRight
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  role: string
  hourlyWage: number
  scheduledHours: number
  actualHours: number
  venue: string
  status: 'scheduled' | 'active' | 'overtime' | 'cut'
  shift: string
}

interface Shift {
  id: string
  venue: string
  date: string
  role: string
  employee: string
  startTime: string
  endTime: string
  plannedHours: number
  actualHours: number
  cost: number
  status: 'scheduled' | 'active' | 'completed' | 'cut'
  recommendation?: string
}

// Generate realistic labor data
const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Mike Thompson', role: 'Bartender', hourlyWage: 22, scheduledHours: 8, actualHours: 8.5, venue: 'Corner Pocket', status: 'overtime', shift: '6pm-2am' },
  { id: '2', name: 'Sarah Chen', role: 'Bartender', hourlyWage: 18, scheduledHours: 6, actualHours: 6, venue: 'Corner Pocket', status: 'active', shift: '4pm-10pm' },
  { id: '3', name: 'David Rodriguez', role: 'Server', hourlyWage: 15, scheduledHours: 7, actualHours: 7, venue: 'Corner Pocket', status: 'active', shift: '5pm-12am' },
  { id: '4', name: 'Emily Johnson', role: 'Server', hourlyWage: 16, scheduledHours: 6, actualHours: 5.5, venue: 'Corner Pocket', status: 'cut', shift: '6pm-11pm' },
  { id: '5', name: 'James Park', role: 'Kitchen', hourlyWage: 19, scheduledHours: 8, actualHours: 8, venue: 'Corner Pocket', status: 'active', shift: '5pm-1am' },
  { id: '6', name: 'Lisa Wong', role: 'Hibachi Chef', hourlyWage: 28, scheduledHours: 8, actualHours: 8, venue: 'Shogun Sushi', status: 'active', shift: '5pm-1am' },
  { id: '7', name: 'Alex Kumar', role: 'Server', hourlyWage: 17, scheduledHours: 6, actualHours: 6, venue: 'Shogun Sushi', status: 'scheduled', shift: '6pm-12am' },
]

const SHIFTS: Shift[] = [
  { id: '1', venue: 'Corner Pocket', date: 'Today', role: 'Bartender', employee: 'Mike Thompson', startTime: '6:00 PM', endTime: '2:00 AM', plannedHours: 8, actualHours: 8.5, cost: 187, status: 'active', recommendation: 'Cut 2 hours to save $44' },
  { id: '2', venue: 'Corner Pocket', date: 'Today', role: 'Bartender', employee: 'Sarah Chen', startTime: '4:00 PM', endTime: '10:00 PM', plannedHours: 6, actualHours: 6, cost: 108, status: 'active' },
  { id: '3', venue: 'Corner Pocket', date: 'Today', role: 'Server', employee: 'David Rodriguez', startTime: '5:00 PM', endTime: '12:00 AM', plannedHours: 7, actualHours: 7, cost: 105, status: 'active' },
  { id: '4', venue: 'Corner Pocket', date: 'Today', role: 'Server', employee: 'Emily Johnson', startTime: '6:00 PM', endTime: '11:00 PM', plannedHours: 6, actualHours: 5.5, cost: 88, status: 'cut' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'overtime': return 'status-error'
    case 'cut': return 'status-warning' 
    case 'active': return 'status-success'
    default: return 'border'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'overtime': return AlertTriangle
    case 'cut': return UserX
    case 'active': return UserCheck
    default: return Clock
  }
}

export default function LaborPage() {
  const handleCutShift = (shiftId: string) => {
    console.log('Cutting shift:', shiftId)
    // In real implementation, this would make API call to scheduling system
  }

  const handleApproveSchedule = () => {
    console.log('Approving optimized schedule')
    // Would integrate with actual scheduling system
  }

  return (
    <div className="container-premium py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Labor Management</h1>
          <p className="text-muted-foreground text-lg">
            Real-time scheduling optimization and cost control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Schedule Settings
          </Button>
          <Button size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Schedule
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Today's Labor Cost</span>
              </div>
              <div className="text-3xl font-bold">$2,847</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-destructive" />
                <span className="text-destructive">2.3% over target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Staff</span>
              </div>
              <div className="text-3xl font-bold">23</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">Optimal coverage</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Overtime Hours</span>
              </div>
              <div className="text-3xl font-bold">4.5</div>
              <div className="flex items-center gap-1 text-sm">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-warning">Reduce by 2hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Potential Savings</span>
              </div>
              <div className="text-3xl font-bold">$127</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">Apply optimizations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Current Shifts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  <span>Active Shifts</span>
                </div>
                <Button size="sm" onClick={handleApproveSchedule} className="gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Apply Optimizations
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SHIFTS.map((shift) => (
                <div key={shift.id} className={cn(
                  "p-4 rounded-lg border transition-all duration-300",
                  getStatusColor(shift.status)
                )}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">{shift.employee}</div>
                        <Badge variant="secondary">{shift.role}</Badge>
                        <Badge variant="outline">{shift.venue}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{shift.startTime} - {shift.endTime}</span>
                        <span>{shift.actualHours}h @ ${EMPLOYEES.find(e => e.name === shift.employee)?.hourlyWage}/hr</span>
                        <span className="font-medium">${shift.cost}</span>
                      </div>
                      {shift.recommendation && (
                        <div className="text-sm text-warning bg-warning/10 px-2 py-1 rounded">
                          💡 {shift.recommendation}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {shift.recommendation && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCutShift(shift.id)}
                          className="gap-1"
                        >
                          <UserX className="h-3 w-3" />
                          Cut Shift
                        </Button>
                      )}
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {(() => {
                          const StatusIcon = getStatusIcon(shift.status)
                          return <StatusIcon className="h-4 w-4" />
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Day Comparison */}
        <div>
          <DayComparisonWidget className="mb-6" />
          
          {/* POS Integration Status */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">POS Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Toast POS</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Live</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">When I Work</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Sync</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-sm">Deputy</span>
                  </div>
                  <Badge variant="secondary" className="status-warning">Pending</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Last sync: 2 minutes ago</div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}