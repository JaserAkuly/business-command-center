'use client'

import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error
  resetErrorBoundary: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Application Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Something went wrong:</p>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
              {error.message}
            </pre>
          </div>
          
          <div className="space-y-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>If this persists, it may be due to:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Missing environment variables</li>
              <li>Network connectivity issues</li>
              <li>Database connection problems</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}