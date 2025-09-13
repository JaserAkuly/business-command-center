'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVenues, useVenueSales, useCashEnvelopes } from '@/hooks/use-bcc-api'
import { formatCurrency } from '@/lib/business-logic'
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users,
  ArrowRight 
} from 'lucide-react'

export default function VenuesPage() {
  const { data: venues, isLoading } = useVenues()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
        <div className="text-sm text-muted-foreground">
          {venues?.length || 0} locations
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues?.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  )
}

function VenueCard({ venue }: { venue: { id: string; name: string; type: string } }) {
  // Get last 7 days of sales data
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
  const startDateStr = startDate.toISOString().split('T')[0]

  const { data: salesData } = useVenueSales(venue.id, startDateStr, endDate)
  const { data: envelopes } = useCashEnvelopes(venue.id)

  const totalSales = salesData?.reduce((sum, sale) => sum + sale.net_sales, 0) || 0
  const avgDailySales = totalSales / 7
  const totalLabor = salesData?.reduce((sum, sale) => sum + sale.labor_cost, 0) || 0
  const laborPercentage = totalSales > 0 ? (totalLabor / totalSales) * 100 : 0
  const totalCashBalance = envelopes?.reduce((sum, env) => sum + (env.current_balance || 0), 0) || 0

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

  const laborStatus = getLaborStatus(laborPercentage)

  return (
    <Link href={`/venues/${venue.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
              <div className="font-medium">{formatCurrency(totalSales)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Daily Avg</span>
              </div>
              <div className="font-medium">{formatCurrency(avgDailySales)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Labor %</span>
              </div>
              <div className={`font-medium ${laborStatus.color}`}>
                {laborPercentage.toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-muted-foreground">Cash Balance</div>
              <div className="font-medium">{formatCurrency(totalCashBalance)}</div>
            </div>
          </div>

          {salesData && salesData.length > 0 && (
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(salesData[0]?.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}