// ============================================================
// PORTFOLIO CMS — TypeScript Types
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================
// DATABASE ROW TYPES
// ============================================================

export interface Settings {
  id: string
  website_name: string
  website_title: string
  logo_url: string | null
  favicon_url: string | null
  primary_color: string
  secondary_color: string
  font_family: string
  dark_mode: boolean
  seo_title: string
  seo_description: string
  seo_keywords: string | null
  og_image_url: string | null
  social_github: string | null
  social_instagram: string | null
  social_linkedin: string | null
  social_twitter: string | null
  social_youtube: string | null
  social_behance: string | null
  email: string | null
  whatsapp: string | null
  updated_at: string
}

export interface Profile {
  id: string
  name: string
  nickname: string | null
  bio: string | null
  about_description: string | null
  photo_url: string | null
  location: string | null
  email: string | null
  whatsapp: string | null
  date_of_birth: string | null
  social_github: string | null
  social_instagram: string | null
  social_linkedin: string | null
  social_twitter: string | null
  social_behance: string | null
  social_youtube: string | null
  updated_at: string
}

export interface Hero {
  id: string
  greeting: string
  name: string
  headline: string
  subtitle: string | null
  description: string | null
  profile_image_url: string | null
  background_image_url: string | null
  primary_button_text: string | null
  primary_button_url: string | null
  secondary_button_text: string | null
  secondary_button_url: string | null
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  icon_url: string | null
  icon_name: string | null
  description: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string | null
  short_description: string | null
  full_description: string | null
  thumbnail_url: string | null
  project_date: string | null
  client: string | null
  tools: string[] | null
  technologies: string[] | null
  github_url: string | null
  live_url: string | null
  external_url: string | null
  featured: boolean
  published: boolean
  display_order: number
  created_at: string
  updated_at: string
  project_images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  caption: string | null
  display_order: number
  created_at: string
}

export interface Service {
  id: string
  icon: string
  title: string
  description: string | null
  featured: boolean
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  position: string
  organization: string
  description: string | null
  start_date: string | null
  end_date: string | null
  current: boolean
  logo_url: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  program: string
  description: string | null
  start_year: number | null
  end_year: number | null
  current: boolean
  logo_url: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

export interface Navigation {
  id: string
  label: string
  url: string
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Footer {
  id: string
  logo_url: string | null
  description: string | null
  copyright: string | null
  show_social_links: boolean
  updated_at: string
}

export interface Resume {
  id: string
  file_url: string
  file_name: string
  file_size: number | null
  uploaded_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  name: string | null
  created_at: string
}

// ============================================================
// FORM INPUT TYPES
// ============================================================

export type SettingsInput = Omit<Settings, 'id' | 'updated_at'>
export type ProfileInput = Omit<Profile, 'id' | 'updated_at'>
export type HeroInput = Omit<Hero, 'id' | 'updated_at'>
export type SkillInput = Omit<Skill, 'id' | 'created_at' | 'updated_at'>
export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'project_images'>
export type ServiceInput = Omit<Service, 'id' | 'created_at' | 'updated_at'>
export type ExperienceInput = Omit<Experience, 'id' | 'created_at' | 'updated_at'>
export type EducationInput = Omit<Education, 'id' | 'created_at' | 'updated_at'>
export type NavigationInput = Omit<Navigation, 'id' | 'created_at' | 'updated_at'>
export type FooterInput = Omit<Footer, 'id' | 'updated_at'>
export type MessageInput = Pick<Message, 'name' | 'email' | 'subject' | 'message'>

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  perPage: number
  totalPages: number
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export interface DashboardStats {
  totalProjects: number
  publishedProjects: number
  draftProjects: number
  totalSkills: number
  totalServices: number
  totalExperiences: number
  totalMessages: number
  unreadMessages: number
}

// ============================================================
// SKILL CATEGORIES
// ============================================================

export const SKILL_CATEGORIES = [
  'Design',
  'Programming',
  'Tools',
  'Soft Skills',
  'Languages',
  'Other',
] as const

export type SkillCategory = typeof SKILL_CATEGORIES[number]

// ============================================================
// PROJECT CATEGORIES
// ============================================================

export const PROJECT_CATEGORIES = [
  'Graphic Design',
  'Branding',
  'UI/UX',
  'Web Development',
  'Photography',
  'Video',
  'Other',
] as const

export type ProjectCategory = typeof PROJECT_CATEGORIES[number]

// ============================================================
// SUPABASE DATABASE TYPE
// ============================================================

export interface Database {
  public: {
    Tables: {
      settings: {
        Row: Settings
        Insert: Partial<Settings>
        Update: Partial<Settings>
      }
      profile: {
        Row: Profile
        Insert: Partial<Profile>
        Update: Partial<Profile>
      }
      hero: {
        Row: Hero
        Insert: Partial<Hero>
        Update: Partial<Hero>
      }
      skills: {
        Row: Skill
        Insert: Partial<Skill>
        Update: Partial<Skill>
      }
      projects: {
        Row: Project
        Insert: Partial<Project>
        Update: Partial<Project>
      }
      project_images: {
        Row: ProjectImage
        Insert: Partial<ProjectImage>
        Update: Partial<ProjectImage>
      }
      services: {
        Row: Service
        Insert: Partial<Service>
        Update: Partial<Service>
      }
      experiences: {
        Row: Experience
        Insert: Partial<Experience>
        Update: Partial<Experience>
      }
      education: {
        Row: Education
        Insert: Partial<Education>
        Update: Partial<Education>
      }
      messages: {
        Row: Message
        Insert: Partial<Message>
        Update: Partial<Message>
      }
      navigation: {
        Row: Navigation
        Insert: Partial<Navigation>
        Update: Partial<Navigation>
      }
      footer: {
        Row: Footer
        Insert: Partial<Footer>
        Update: Partial<Footer>
      }
      resume: {
        Row: Resume
        Insert: Partial<Resume>
        Update: Partial<Resume>
      }
      admin_users: {
        Row: AdminUser
        Insert: Partial<AdminUser>
        Update: Partial<AdminUser>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
