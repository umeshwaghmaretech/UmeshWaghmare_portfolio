export type ThemeMode = 'professional' | 'modern-ai' | 'compact';

export interface CareerMilestone {
  id: string;
  phase: string;
  title: string;
  period: string;
  description: string;
  progress: number;
}

export interface Profile {
  name: string;
  title: string;
  summary: string;
  email: string;
  linkedIn: string;
  github?: string;
  phone?: string;
  profileImageUrl?: string;
  location?: string;
  careerNarrative: string;
  timeline: CareerMilestone[];
  resumePdfUrl: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  type: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  techStack: string[];
  features: string[];
  challenges: string[];
  learnings: string[];
  featured: boolean;
  bentoSize: 'small' | 'medium' | 'large';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
}

export interface NavSection {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface CommandItem {
  id: string;
  label: string;
  category: 'section' | 'skill' | 'project' | 'action';
  href?: string;
  action?: () => void;
}

export const DEFAULT_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/umeshwaghmaretech', external: true },
  { id: 'resume', label: 'Resume', href: '#resume' },
  { id: 'certifications', label: 'Education', href: '#certifications' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { id: 'work-with-me', label: 'Work With Me', href: '#work-with-me' },
];
