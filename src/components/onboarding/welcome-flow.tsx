'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronRight, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Brain,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeFlowProps {
  onComplete: () => void
  className?: string
}

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Business Command Center',
    subtitle: 'Your AI-powered restaurant portfolio management system',
    icon: Brain,
    content: 'Get real-time insights, automated cash management, and growth planning for all your venues in one place.',
    duration: 3000
  },
  {
    id: 'portfolio',
    title: 'Your Portfolio Overview',
    subtitle: '5 venues generating $180K+ monthly revenue',
    icon: DollarSign,
    content: 'Monitor daily performance, track labor costs, and optimize operations across all locations.',
    duration: 4000
  },
  {
    id: 'ai-insights',
    title: 'AI Daily Brief',
    subtitle: 'Smart recommendations updated every morning',
    icon: Brain,
    content: 'Get actionable insights on labor optimization, inventory management, and growth opportunities.',
    duration: 4000
  },
  {
    id: 'growth',
    title: 'Growth Tracker',
    subtitle: 'Automated savings for expansion',
    icon: TrendingUp,
    content: 'Track progress toward your expansion goals with automated envelope budgeting.',
    duration: 3000
  }
]

export function WelcomeFlow({ onComplete, className }: WelcomeFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentStepData = ONBOARDING_STEPS[currentStep]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + (100 / (currentStepData.duration / 100))
      })
    }, 100)

    return () => clearInterval(timer)
  }, [currentStep, currentStepData.duration])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setProgress(0)
        setIsAnimating(false)
      }, 300)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className={cn("fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center", className)}>
      <Card className={cn(
        "max-w-lg w-full mx-4 transition-all duration-300",
        isAnimating && "scale-95 opacity-50"
      )}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <currentStepData.icon className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{currentStepData.subtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-foreground leading-relaxed">
            {currentStepData.content}
          </p>

          <div className="space-y-2">
            <Progress value={progress} className="h-1" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentStep ? "bg-primary" : 
                  index < currentStep ? "bg-primary/50" : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <Button variant="ghost" onClick={handleSkip} size="sm">
              Skip Tour
            </Button>
            <Button onClick={handleNext} size="sm" className="gap-1">
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>Get Started <CheckCircle className="h-4 w-4" /></>
              ) : (
                <>Next <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}