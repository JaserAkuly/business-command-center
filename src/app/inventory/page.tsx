'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DayComparisonWidget } from '@/components/ui/day-comparison-widget'
import { formatCurrency } from '@/lib/business-logic'
import { 
  Package, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  category: 'food' | 'liquor' | 'nonfood'
  currentStock: number
  parLevel: number
  reorderPoint: number
  cost: number
  daysOfStock: number
  status: 'good' | 'warning' | 'critical'
  venue: string
}

const INVENTORY_DATA: InventoryItem[] = [
  { id: '1', name: 'Premium Vodka', category: 'liquor', currentStock: 12, parLevel: 24, reorderPoint: 18, cost: 28.50, daysOfStock: 8, status: 'warning', venue: 'Corner Pocket' },
  { id: '2', name: 'Chicken Wings (lb)', category: 'food', currentStock: 45, parLevel: 80, reorderPoint: 60, cost: 4.25, daysOfStock: 3, status: 'critical', venue: 'Corner Pocket' },
  { id: '3', name: 'Draft Beer Cups', category: 'nonfood', currentStock: 2400, parLevel: 5000, reorderPoint: 3000, cost: 0.12, daysOfStock: 12, status: 'good', venue: 'Corner Pocket' },
  { id: '4', name: 'Salmon Fillets', category: 'food', currentStock: 18, parLevel: 30, reorderPoint: 25, cost: 12.75, daysOfStock: 6, status: 'warning', venue: 'Shogun Sushi' },
  { id: '5', name: 'Sake Premium', category: 'liquor', currentStock: 8, parLevel: 15, reorderPoint: 12, cost: 24.00, daysOfStock: 4, status: 'critical', venue: 'Shogun Sushi' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical': return 'status-error'
    case 'warning': return 'status-warning'
    case 'good': return 'status-success'
    default: return 'border'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'critical': return XCircle
    case 'warning': return AlertTriangle
    case 'good': return CheckCircle
    default: return Package
  }
}

export default function InventoryPage() {
  const criticalItems = INVENTORY_DATA.filter(item => item.status === 'critical')
  const warningItems = INVENTORY_DATA.filter(item => item.status === 'warning')
  const totalValue = INVENTORY_DATA.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)

  const handleReorder = (itemId: string) => {
    console.log('Reordering item:', itemId)
    // Would integrate with ordering system
  }

  return (
    <div className="container-premium py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground text-lg">
            Smart inventory tracking and automated reorder recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Package className="h-4 w-4" />
            Import Orders
          </Button>
          <Button size="sm" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Generate Orders
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Inventory Value</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalValue)}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">3% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Critical Items</span>
              </div>
              <div className="text-3xl font-bold text-destructive">{criticalItems.length}</div>
              <div className="flex items-center gap-1 text-sm">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-destructive">Need immediate reorder</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Warning Items</span>
              </div>
              <div className="text-3xl font-bold text-warning">{warningItems.length}</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-warning" />
                <span className="text-warning">Approaching reorder point</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Auto Orders</span>
              </div>
              <div className="text-3xl font-bold">7</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">Ready to place</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Inventory Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <span>Inventory Status</span>
                </div>
                <Button size="sm" className="gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Generate All Orders
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {INVENTORY_DATA.map((item) => {
                const StatusIcon = getStatusIcon(item.status)
                const reorderAmount = Math.max(0, item.parLevel - item.currentStock)
                
                return (
                  <div key={item.id} className={`p-4 rounded-lg border transition-all duration-300 ${getStatusColor(item.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{item.name}</div>
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge variant="outline">{item.venue}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Stock: {item.currentStock} / Par: {item.parLevel}</span>
                          <span>{formatCurrency(item.cost)} per unit</span>
                          <span className="font-medium">{item.daysOfStock} days remaining</span>
                        </div>
                        {item.status !== 'good' && (
                          <div className="text-sm bg-muted/50 px-2 py-1 rounded">
                            💡 Reorder {reorderAmount} units ({formatCurrency(reorderAmount * item.cost)})
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.status !== 'good' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReorder(item.id)}
                            className="gap-1"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            Reorder
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
          
          {/* Supplier Integration */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">Supplier Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Sysco</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">US Foods</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-sm">Wine.com</span>
                  </div>
                  <Badge variant="secondary" className="status-warning">Pending</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Last sync: 1 hour ago</div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Package className="h-4 w-4" />
                  Manage Suppliers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}