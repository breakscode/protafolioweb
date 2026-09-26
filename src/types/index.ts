export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'database' 
  | 'ai_automation' 
  | 'tools' 
  | 'other';

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio_short: string;
  bio_long: string;
  location: string;
  email: string;
  github_url: string;
  linkedin_url?: string | null;
  avatar_url?: string | null;
  status_text: string;
  availability_text?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HeroData {
  id: string;
  greeting: string;
  role_title: string;
  subtitle: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  cta_tertiary_text: string;
  cta_tertiary_link: string;
  tech_badge: string;
  is_active: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon_name?: string;
  highlight: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  problem_statement?: string;
  solution_statement?: string;
  results_statement?: string;
  year: string;
  organization?: string | null;
  location?: string | null;
  category: 'Full Stack' | 'IA' | 'Automatización' | 'IA / Automatización' | 'IoT' | 'Redes' | 'Investigación';
  technologies: string[];
  main_image_url?: string | null;
  gallery_images?: string[];
  github_url?: string | null;
  demo_url?: string | null;
  status: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date?: string | null;
  description?: string | null;
  image_url?: string | null;
  verification_url?: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  period: string;
  status: string;
  location: string;
  description?: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Experience {
  id: string;
  type: 'Trabajo' | 'Proyecto profesional' | 'Proyecto académico' | 'Proyecto personal';
  organization?: string | null;
  role_or_title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  year_label?: string | null;
  location?: string | null;
  modality?: 'Remoto' | 'Presencial' | 'Híbrido' | null;
  technologies?: string[];
  url?: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  organization_or_context?: string | null;
  year: string;
  technologies: string[];
  key_metric?: string | null;
  metric_label?: string | null;
  url?: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface NavigationItem {
  id: string;
  section_id: string;
  label: string;
  href: string;
  is_visible: boolean;
  sort_order: number;
}

export interface DocumentItem {
  id: string;
  doc_type: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size?: string | null;
  is_active: boolean;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  seo_title: string;
  seo_description: string;
  og_image_url?: string | null;
  favicon_url?: string | null;
  contact_email: string;
  github_url: string;
  linkedin_url?: string | null;
  copyright_text: string;
  maintenance_mode: boolean;
}

export interface MediaItem {
  id: string;
  bucket: string;
  file_name: string;
  file_path: string;
  public_url: string;
  mime_type?: string;
  size_bytes?: number;
  created_at: string;
}
