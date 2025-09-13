'use client'

import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KPIGrid, KPICard } from '@/components/ui/kpi-card'
import { CashEnvelopeCard } from '@/components/ui/cash-envelope-card'
import { LaborGuardrail } from '@/components/ui/labor-guardrail'
import { AIInsights } from '@/components/ui/ai-insights'
import { 
  useVenue, 
  useVenueSales, 
  useCashEnvelopes, 
  useAIInsights,
  useLaborPlan,
  useOrderSuggestions,
  useUpdateEnvelopeTarget 
} from '@/hooks/use-bcc-api'
import { formatCurrency } from '@/lib/business-logic'
import { 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VenueDetailPage() {
  const { id } = useParams()
  const venueId = id as string

  const { data: venue, isLoading: venueLoading } = useVenue(venueId)
  const { data: envelopes } = useCashEnvelopes(venueId)
  const { data: insights } = useAIInsights(venueId)

  // Get last 7 days of sales data
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
  const startDateStr = startDate.toISOString().split('T')[0]

  const { data: salesData } = useVenueSales(venueId, startDateStr, endDate)

  const updateEnvelopeTarget = useUpdateEnvelopeTarget()
  const laborPlan = useLaborPlan()
  const orderSuggestions = useOrderSuggestions()

  if (venueLoading) {
    return <div className="animate-pulse">Loading venue details...</div>
  }

  if (!venue) {
    return <div>Venue not found</div>
  }

  // Calculate metrics from sales data
  const totalSales = salesData?.reduce((sum, sale) => sum + sale.net_sales, 0) || 0
  const avgDailySales = totalSales / (salesData?.length || 1)
  const totalLabor = salesData?.reduce((sum, sale) => sum + sale.labor_cost, 0) || 0
  const laborPercentage = totalSales > 0 ? (totalLabor / totalSales) * 100 : 0
  const totalGuests = salesData?.reduce((sum, sale) => sum + sale.guests, 0) || 0

  // Mock labor plan data
  const mockLaborData = {
    forecast_sales: avgDailySales * 1.1, // 10% higher forecast
    target_labor_pct: 32.5,
    allowed_labor_spend: avgDailySales * 1.1 * 0.325,
    current_labor_spend: avgDailySales * 1.1 * 0.35, // Slightly over
    labor_variance_pct: 7.7, // Over by 7.7%
    variance_status: 'warning' as const,
    role_recommendations: [
      {
        role_name: 'Server',
        current_hours: 24,
        recommended_hours: 20,
        hours_difference: -4,
        suggestion: 'Cut 4.0 hours',
        status: 'warning' as const
      },
      {
        role_name: 'Kitchen Staff',
        current_hours: 16,
        recommended_hours: 18,
        hours_difference: 2,
        suggestion: 'Add 2.0 hours',
        status: 'alert' as const
      }
    ]
  }

  const handleEnvelopeUpdate = (envelopeId: string, newTarget: number) => {
    updateEnvelopeTarget.mutate({ envelopeId, targetPct: newTarget })
  }

  const handleGetLaborPlan = () => {
    laborPlan.mutate({
      venue_id: venueId,
      forecast_date: new Date().toISOString().split('T')[0]
    })
  }

  const handleGetOrderSuggestions = () => {
    orderSuggestions.mutate({
      venue_id: venueId
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/venues">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Venues
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{venue.name}</h1>
          <p className="text-muted-foreground capitalize">{venue.type} • {venue.timezone}</p>
        </div>
      </div>

      {/* KPI Overview */}
      <KPIGrid>
        <KPICard
          title="Weekly Sales"
          value={formatCurrency(totalSales)}
          change={{ value: 8.3, period: 'last week', positive: true }}
          icon={DollarSign}
          status="good"
        />
        <KPICard
          title="Labor Percentage"
          value={`${laborPercentage.toFixed(1)}%`}
          change={{ value: 2.1, period: 'target', positive: false }}
          icon={Users}
          status={laborPercentage <= 32 ? 'good' : laborPercentage <= 35 ? 'warning' : 'alert'}
        />
        <KPICard
          title="Avg Daily Sales"
          value={formatCurrency(avgDailySales)}
          subtitle="Last 7 days"
          icon={TrendingUp}
          status="good"
        />
        <KPICard
          title="Weekly Guests"
          value={totalGuests.toLocaleString()}
          change={{ value: 12.5, period: 'last week', positive: true }}
          icon={Calendar}
          status="good"
        />
      </KPIGrid>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI Insights */}
            <AIInsights 
              insights={insights || []}
              onApplyAction={(insight) => {
                console.log('Apply action for venue:', insight)
              }}
            />

            {/* Labor Guardrail */}
            <LaborGuardrail 
              data={mockLaborData}
              onAdjustSchedule={() => {
                console.log('Adjust schedule for venue')
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="cash" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {envelopes?.map((envelope) => (
              <CashEnvelopeCard
                key={envelope.id}
                envelope={envelope}
                totalSales={avgDailySales}
                onUpdateTarget={handleEnvelopeUpdate}
                editable={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labor" className="space-y-6">
          <div className="grid gap-6">
            <LaborGuardrail 
              data={mockLaborData}
              onAdjustSchedule={() => {
                console.log('Open schedule adjustment')
              }}
            />
            
            <div className="flex gap-4">
              <Button onClick={handleGetLaborPlan} disabled={laborPlan.isPending}>
                {laborPlan.isPending ? 'Getting Plan...' : 'Get Labor Plan'}
              </Button>
            </div>

            {laborPlan.data && (
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-medium mb-2">Labor Plan Results</h3>
                <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(laborPlan.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex gap-4 mb-4">
            <Button onClick={handleGetOrderSuggestions} disabled={orderSuggestions.isPending}>
              {orderSuggestions.isPending ? 'Getting Suggestions...' : 'Get Order Suggestions'}
            </Button>
          </div>

          {orderSuggestions.data && (
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Order Suggestions</h3>
              <pre className="text-sm bg-muted p-2 rounded overflow-auto max-h-96">
                {JSON.stringify(orderSuggestions.data, null, 2)}
              </pre>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}