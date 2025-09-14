'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface PremiumKPICardProps {
  title: string
  value: string | number
  previousValue?: string | number
  change?: {
    value: number
    period: string
    positive: boolean
  }
  icon?: LucideIcon
  status?: 'success' | 'warning' | 'error' | 'neutral'
  delay?: number
  className?: string
}

// Utility to format numbers elegantly
const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]/g, '')) : num
  
  if (isNaN(n)) return String(num)
  
  // Format large numbers elegantly
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  
  // Format percentages
  if (Math.abs(n) < 1 && String(num).includes('%')) return `${n.toFixed(1)}%`
  
  // Format currency
  if (String(num).includes('$')) return `$${n.toLocaleString()}`
  
  return n.toLocaleString()
}

// Utility to format change percentages elegantly
const formatChange = (change: number): string => {
  const abs = Math.abs(change)
  if (abs >= 10) return abs.toFixed(0)
  if (abs >= 1) return abs.toFixed(1) 
  return abs.toFixed(2)
}

export function PremiumKPICard({
  title,
  value,
  previousValue,
  change,
  icon: Icon,
  status = 'neutral',
  delay = 0,
  className
}: PremiumKPICardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState(previousValue || 0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (isVisible && value !== displayValue) {
      setIsAnimating(true)
      
      if (typeof value === 'number' && typeof displayValue === 'number') {
        const start = displayValue
        const end = value
        const duration = 1500
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          const current = start + (end - start) * easeOutCubic
          
          setDisplayValue(current)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            setIsAnimating(false)
          }
        }
        
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setDisplayValue(value)
          setIsAnimating(false)
        }, 300)
      }
    }
  }, [isVisible, value, displayValue])

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'status-success border'
      case 'warning': 
        return 'status-warning border'
      case 'error':
        return 'status-error border'
      default:
        return 'bg-card border border-border hover:shadow-sm'
    }
  }

  return (
    <Card className={cn(
      "hover-lift animate-scale-in",
      !isVisible && "opacity-0 scale-95",
      getStatusStyles(),
      className
    )} style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              {title}
            </h3>
            {Icon && (
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300",
                status === 'success' && "bg-success/10 text-success",
                status === 'warning' && "bg-warning/10 text-warning", 
                status === 'error' && "bg-destructive/10 text-destructive",
                status === 'neutral' && "bg-muted text-muted-foreground",
                isAnimating && "scale-110"
              )}>
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
          
          {/* Value */}
          <div className={cn(
            "text-3xl font-semibold tracking-tight transition-all duration-300",
            isAnimating && "animate-number-count"
          )}>
            {formatNumber(displayValue)}
          </div>
          
          {/* Change Indicator */}
          {change && (
            <div className={cn(
              "flex items-center gap-2 text-sm transition-all duration-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full",
                change.positive 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}>
                {change.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">
                  {formatChange(change.value)}%
                </span>
              </div>
              <span className="text-muted-foreground">
                vs {change.period}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}