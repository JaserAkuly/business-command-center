'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/business-logic'
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users,
  ArrowRight,
  Settings,
  Plus
} from 'lucide-react'

interface Venue {
  id: string
  name: string
  type: 'restaurant' | 'bar' | 'lounge'
  weeklySales: number
  dailyAverage: number
  laborPercentage: number
  cashBalance: number
  lastUpdated: string
  status: 'good' | 'warning' | 'alert'
}

const VENUES_DATA: Venue[] = [
  {
    id: '1',
    name: 'Corner Pocket',
    type: 'bar',
    weeklySales: 24850.00,
    dailyAverage: 3550.00,
    laborPercentage: 28,
    cashBalance: 4275.50,
    lastUpdated: '2025-01-15',
    status: 'good'
  },
  {
    id: '2', 
    name: 'Shogun Sushi',
    type: 'restaurant',
    weeklySales: 31240.00,
    dailyAverage: 4462.86,
    laborPercentage: 35,
    cashBalance: 6180.25,
    lastUpdated: '2025-01-15',
    status: 'warning'
  },
  {
    id: '3',
    name: 'Harbor House',
    type: 'restaurant',
    weeklySales: 28490.00,
    dailyAverage: 4070.00,
    laborPercentage: 31,
    cashBalance: 5520.75,
    lastUpdated: '2025-01-15',
    status: 'good'
  },
  {
    id: '4',
    name: 'Velvet Room',
    type: 'lounge',
    weeklySales: 42180.00,
    dailyAverage: 6025.71,
    laborPercentage: 25,
    cashBalance: 8435.00,
    lastUpdated: '2025-01-15',
    status: 'good'
  },
  {
    id: '5',
    name: 'Speak Easy',
    type: 'lounge',
    weeklySales: 38650.00,
    dailyAverage: 5521.43,
    laborPercentage: 38,
    cashBalance: 7230.50,
    lastUpdated: '2025-01-15',
    status: 'alert'
  }
]

export default function VenuesPage() {
  const totalWeeklySales = VENUES_DATA.reduce((sum, venue) => sum + venue.weeklySales, 0)
  const avgDailySales = VENUES_DATA.reduce((sum, venue) => sum + venue.dailyAverage, 0) / VENUES_DATA.length

  return (
    <div className="container-premium py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Venues</h1>
          <p className="text-muted-foreground text-lg">
            Portfolio overview and individual venue performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Portfolio Settings
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Venue
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Venues</span>
              </div>
              <div className="text-3xl font-bold">{VENUES_DATA.length}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">Active locations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Weekly Sales</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalWeeklySales)}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">12% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Daily Average</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(avgDailySales)}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">8% above target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Avg Labor %</span>
              </div>
              <div className="text-3xl font-bold">{Math.round(VENUES_DATA.reduce((sum, venue) => sum + venue.laborPercentage, 0) / VENUES_DATA.length)}%</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-warning" />
                <span className="text-warning">2% over target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Venues Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Venues</h2>
          <div className="text-sm text-muted-foreground">
            {VENUES_DATA.length} locations
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VENUES_DATA.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </div>
  )
}

function VenueCard({ venue }: { venue: Venue }) {
  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant': return 'bg-blue-100 text-blue-800'
      case 'bar': return 'bg-green-100 text-green-800'
      case 'lounge': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLaborStatus = (percentage: number) => {
    if (percentage <= 32) return { color: 'text-green-600', status: 'good' }
    if (percentage <= 35) return { color: 'text-yellow-600', status: 'warning' }
    return { color: 'text-red-600', status: 'alert' }
  }

  const laborStatus = getLaborStatus(venue.laborPercentage)

  return (
    <Link href={`/venues/${venue.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer hover-lift">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {venue.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={getVenueTypeColor(venue.type)}>
                  {venue.type}
                </Badge>
                {venue.status === 'alert' && (
                  <Badge variant="destructive" className="text-xs">
                    Needs Attention
                  </Badge>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                <span>Weekly Sales</span>
              </div>
              <div className="font-medium">{formatCurrency(venue.weeklySales)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Daily Avg</span>
              </div>
              <div className="font-medium">{formatCurrency(venue.dailyAverage)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Labor %</span>
              </div>
              <div className={`font-medium ${laborStatus.color}`}>
                {venue.laborPercentage}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-muted-foreground">Cash Balance</div>
              <div className="font-medium">{formatCurrency(venue.cashBalance)}</div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(venue.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}