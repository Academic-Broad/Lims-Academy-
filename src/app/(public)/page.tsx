import { HeroSection } from '@/components/landing/HeroSection'
import { StatsSection } from '@/components/landing/StatsSection'
import { ProgramsSection } from '@/components/landing/ProgramsSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CTASection } from '@/components/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
