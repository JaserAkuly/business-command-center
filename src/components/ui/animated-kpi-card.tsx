'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface AnimatedKPICardProps {
  title: string
  value: string | number
  previousValue?: string | number
  change?: {
    value: number
    period: string
    positive: boolean
  }
  subtitle?: string
  icon?: LucideIcon
  status?: 'good' | 'warning' | 'alert'
  delay?: number
  className?: string
}

const statusColors = {
  good: 'border-green-200 bg-green-50/50 hover:bg-green-50/70',
  warning: 'border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50/70',
  alert: 'border-red-200 bg-red-50/50 hover:bg-red-50/70'
}

const statusIconColors = {
  good: 'text-green-600',
  warning: 'text-yellow-600',
  alert: 'text-red-600'
}

export function AnimatedKPICard({
  title,
  value,
  previousValue,
  change,
  subtitle,
  icon: Icon,
  status = 'good',
  delay = 0,
  className
}: AnimatedKPICardProps) {
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
      
      // Animate number counting if value is numeric
      if (typeof value === 'number' && typeof displayValue === 'number') {
        const start = displayValue
        const end = value
        const duration = 2000
        const startTime = Date.now()

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing function for smooth animation
          const easeOutQuad = 1 - (1 - progress) * (1 - progress)
          const current = start + (end - start) * easeOutQuad
          
          setDisplayValue(Math.round(current))
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            setIsAnimating(false)
          }
        }
        
        requestAnimationFrame(animate)
      } else {
        // For string values, just update immediately
        setTimeout(() => {
          setDisplayValue(value)
          setIsAnimating(false)
        }, 500)
      }
    }
  }, [isVisible, value, displayValue])

  return (
    <Card className={cn(
      "transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-lg",
      !isVisible && "opacity-0 translate-y-4",
      isVisible && "opacity-100 translate-y-0",
      status && statusColors[status],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn(
            "p-1 rounded-full transition-colors duration-500",
            status && statusIconColors[status],
            isAnimating && "animate-pulse"
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={cn(
            "text-2xl font-bold tracking-tight transition-all duration-500",
            isAnimating && "scale-110 text-primary"
          )}>
            {typeof displayValue === 'number' 
              ? displayValue.toLocaleString() 
              : displayValue
            }
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground animate-fade-in">
              {subtitle}
            </p>
          )}
          
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs transition-all duration-500",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            )}>
              {change.positive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={change.positive ? "text-green-600" : "text-red-600"}>
                {change.positive ? '+' : ''}{change.value}%
              </span>
              <span className="text-muted-foreground">vs {change.period}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}