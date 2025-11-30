// ==========================================
// PORTFOLIO DATA MODELS
// ==========================================

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  images?: string[];
  technologies: string[];
  category: ProjectCategory;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  date: string;
  highlights?: string[];
  metrics?: ProjectMetric[];
}

export type ProjectCategory = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'mobile' 
  | 'design' 
  | 'other';

export interface ProjectMetric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number; // 1-100
  category: SkillCategory;
  description?: string;
  relatedProjects?: string[];
}

export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'tools' 
  | 'soft';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number; // 1-5
  date: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  resume?: string;
  socials: SocialLink[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  type: 'education' | 'work' | 'achievement' | 'project';
  icon?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
}

export interface ScrollState {
  scrollY: number;
  scrollProgress: number;
  direction: 'up' | 'down';
  isAtTop: boolean;
  isAtBottom: boolean;
}

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  enabled: boolean;
}
