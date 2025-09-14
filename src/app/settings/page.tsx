'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Bell, 
  Shield,
  Zap,
  Database,
  Users,
  CreditCard,
  Globe,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected' | 'pending'
  category: 'pos' | 'accounting' | 'banking' | 'scheduling' | 'delivery'
}

const INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Toast POS', description: 'Point of sale and payment processing', status: 'connected', category: 'pos' },
  { id: '2', name: 'QuickBooks', description: 'Accounting and financial reporting', status: 'connected', category: 'accounting' },
  { id: '3', name: 'Chase Business Banking', description: 'Business bank account integration', status: 'connected', category: 'banking' },
  { id: '4', name: 'When I Work', description: 'Staff scheduling and time tracking', status: 'connected', category: 'scheduling' },
  { id: '5', name: 'Deputy', description: 'Advanced workforce management', status: 'pending', category: 'scheduling' },
  { id: '6', name: 'DoorDash for Business', description: 'Delivery order management', status: 'disconnected', category: 'delivery' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return 'status-success'
    case 'pending': return 'status-warning'
    case 'disconnected': return 'status-error'
    default: return 'border'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected': return CheckCircle
    case 'pending': return Clock
    case 'disconnected': return AlertCircle
    default: return Settings
  }
}

export default function SettingsPage() {
  const connectedIntegrations = INTEGRATIONS.filter(int => int.status === 'connected').length
  const totalIntegrations = INTEGRATIONS.length

  return (
    <div className="container-premium py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-lg">
            System configuration, integrations, and account management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Database className="h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Integrations</span>
              </div>
              <div className="text-3xl font-bold">{connectedIntegrations}/{totalIntegrations}</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">Systems connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Data Sync</span>
              </div>
              <div className="text-3xl font-bold">99.8%</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">Uptime last 30 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Users</span>
              </div>
              <div className="text-3xl font-bold">12</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">Across all venues</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Security Score</span>
              </div>
              <div className="text-3xl font-bold">A+</div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success">All checks passed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Integrations */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5" />
                <span>System Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {INTEGRATIONS.map((integration) => {
                const StatusIcon = getStatusIcon(integration.status)
                
                return (
                  <div key={integration.id} className={`p-4 rounded-lg border transition-all duration-300 ${getStatusColor(integration.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{integration.name}</div>
                          <Badge variant="secondary">{integration.category}</Badge>
                          <Badge 
                            variant="outline" 
                            className={integration.status === 'connected' ? 'border-success text-success' : 
                                     integration.status === 'pending' ? 'border-warning text-warning' : 
                                     'border-destructive text-destructive'}
                          >
                            {integration.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {integration.description}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant={integration.status === 'connected' ? 'outline' : 'default'}
                          className="gap-1"
                        >
                          {integration.status === 'connected' ? 'Configure' : 'Connect'}
                        </Button>
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

          {/* Notification Settings */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Daily Performance Reports</div>
                    <div className="text-sm text-muted-foreground">Receive daily summary of key metrics</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Labor Cost Alerts</div>
                    <div className="text-sm text-muted-foreground">Alert when labor costs exceed target</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Inventory Low Stock Alerts</div>
                    <div className="text-sm text-muted-foreground">Notify when items reach reorder point</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Growth Goal Updates</div>
                    <div className="text-sm text-muted-foreground">Monthly progress on expansion goals</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Marketing Insights</div>
                    <div className="text-sm text-muted-foreground">AI-powered marketing recommendations</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account & Security */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Plan</div>
                  <Badge variant="secondary" className="status-success">Business Pro</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Users</div>
                  <div className="text-sm font-medium">12 / 25</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Venues</div>
                  <div className="text-sm font-medium">5 / Unlimited</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Billing</div>
                  <div className="text-sm font-medium">Monthly</div>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Two-Factor Auth</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">SSL Encryption</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Data Backup</span>
                  </div>
                  <Badge variant="secondary" className="status-success">Daily</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Last security scan: 12 hours ago</div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Shield className="h-4 w-4" />
                  Security Audit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mobile App */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Smartphone className="h-5 w-5" />
                <span>Mobile App</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground mb-3">Get real-time insights on the go</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Smartphone className="h-4 w-4" />
                    Download iOS App
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Smartphone className="h-4 w-4" />
                    Download Android App
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Mobile apps coming Q2 2025
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}