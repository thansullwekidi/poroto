import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import SkillsSection from '@/components/public/SkillsSection'
import ServicesSection from '@/components/public/ServicesSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import ExperienceSection from '@/components/public/ExperienceSection'
import EducationSection from '@/components/public/EducationSection'
import ContactSection from '@/components/public/ContactSection'

export default async function HomePage() {
  const supabase = await createClient()

  const [heroRes, profileRes, skillsRes, servicesRes, projectsRes, experiencesRes, educationRes, settingsRes] =
    await Promise.all([
      supabase.from('hero').select('*').single(),
      supabase.from('profile').select('*').single(),
      supabase.from('skills').select('*').eq('published', true).order('display_order'),
      supabase.from('services').select('*').eq('published', true).order('display_order'),
      supabase.from('projects').select('*, project_images(*)').eq('published', true).order('featured', { ascending: false }).order('display_order'),
      supabase.from('experiences').select('*').eq('published', true).order('display_order'),
      supabase.from('education').select('*').eq('published', true).order('display_order'),
      supabase.from('settings').select('*').single(),
    ])

  return (
    <>
      <HeroSection hero={heroRes.data} profile={profileRes.data} />
      <AboutSection profile={profileRes.data} />
      <SkillsSection skills={skillsRes.data || []} />
      <ServicesSection services={servicesRes.data || []} />
      <ProjectsSection projects={projectsRes.data || []} />
      <ExperienceSection experiences={experiencesRes.data || []} />
      <EducationSection education={educationRes.data || []} />
      <ContactSection settings={settingsRes.data} />
    </>
  )
}
