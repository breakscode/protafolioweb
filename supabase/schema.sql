-- ==============================================================================
-- SCHEMA DEFINITION FOR JHAMPIER JUÁREZ PORTFOLIO & CMS
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Información Personal y Profesional)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Jhampier Iván Juárez Mauricio',
    headline TEXT NOT NULL DEFAULT 'Egresado de Ingeniería de Sistemas | Software Developer | IA',
    bio_short TEXT,
    bio_long TEXT,
    location TEXT DEFAULT 'Piura, Perú',
    email TEXT DEFAULT 'jhampierjuarez@example.com',
    github_url TEXT DEFAULT 'https://github.com/breakscode',
    linkedin_url TEXT,
    avatar_url TEXT,
    status_text TEXT DEFAULT 'Disponible para oportunidades remotas',
    availability_text TEXT DEFAULT 'Abierto a posiciones remotas o híbridas como Software Developer o Full Stack Developer. Interesado en proyectos desafiantes con tecnologías web modernas, arquitecturas escalables y soluciones con IA.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. HERO TABLE (Sección Principal de Impacto)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    greeting TEXT NOT NULL DEFAULT 'Hola, soy Jhampier',
    role_title TEXT NOT NULL DEFAULT 'Software Developer',
    subtitle TEXT NOT NULL DEFAULT 'Construyo soluciones web, sistemas inteligentes y experiencias digitales.',
    cta_primary_text TEXT DEFAULT 'Ver proyectos',
    cta_primary_link TEXT DEFAULT '#projects',
    cta_secondary_text TEXT DEFAULT 'Descargar CV',
    cta_secondary_link TEXT DEFAULT '#cv',
    cta_tertiary_text TEXT DEFAULT 'Contactarme',
    cta_tertiary_link TEXT DEFAULT '#contact',
    tech_badge TEXT DEFAULT 'Full Stack & AI Focused',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. SKILLS TABLE (Tecnologías y Habilidades agrupadas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'frontend', 'backend', 'database', 'ai_automation', 'tools', 'other'
    icon_name TEXT,
    highlight BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PROJECTS TABLE (Proyectos con detalle exhaustivo)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    problem_statement TEXT,
    solution_statement TEXT,
    results_statement TEXT,
    year TEXT NOT NULL,
    organization TEXT,
    location TEXT DEFAULT 'Piura',
    category TEXT NOT NULL, -- 'Full Stack', 'IA', 'Automatización', 'IoT', 'Redes', 'Investigación'
    technologies TEXT[] DEFAULT '{}',
    main_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    status TEXT DEFAULT 'Completado', -- 'Completado', 'En desarrollo', 'Investigación'
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. CERTIFICATIONS TABLE (Certificados profesionales verificables)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    description TEXT,
    image_url TEXT,
    verification_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. EDUCATION TABLE (Formación académica)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    period TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Egresado', 'Titulado', 'En curso'
    location TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. EXPERIENCE TABLE (Trayectoria y Proyectos cronológicos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'Trabajo', 'Proyecto profesional', 'Proyecto académico', 'Proyecto personal'
    organization TEXT,
    role_or_title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    year_label TEXT,
    location TEXT,
    modality TEXT, -- 'Remoto', 'Presencial', 'Híbrido'
    technologies TEXT[] DEFAULT '{}',
    url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. RESEARCH TABLE (Investigaciones científicas y experimentales)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organization_or_context TEXT,
    year TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    key_metric TEXT, -- Ej. '80.34% de precisión'
    metric_label TEXT,
    url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. NAVIGATION TABLE (Configuración del menú y visibilidad)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. DOCUMENTS TABLE (Gestión de CV y archivos descargables)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_type TEXT NOT NULL DEFAULT 'cv', -- 'cv', 'portfolio_pdf', etc.
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. CONTACT_MESSAGES TABLE (Bandeja de mensajes de reclutadores)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    ip_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. SITE_SETTINGS TABLE (Configuraciones SEO y globales)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT DEFAULT 'Jhampier Juárez | Software Developer',
    seo_title TEXT DEFAULT 'Jhampier Juárez | Software Developer',
    seo_description TEXT DEFAULT 'Portafolio profesional de Jhampier Juárez, Software Developer especializado en desarrollo Full Stack, inteligencia artificial, automatización y tecnologías web modernas.',
    og_image_url TEXT,
    favicon_url TEXT,
    contact_email TEXT DEFAULT 'jhampierjuarez@example.com',
    github_url TEXT DEFAULT 'https://github.com/breakscode',
    linkedin_url TEXT,
    copyright_text TEXT DEFAULT '© 2026 Jhampier Juárez. Todos los derechos reservados.',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. MEDIA TABLE (Registro de archivos subidos al Storage)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT,
    size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATIC TRIGGER REGISTRATION FOR updated_at
-- ==============================================================================
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('profiles', 'hero', 'skills', 'projects', 'certifications', 'education', 'experience', 'research', 'navigation', 'documents', 'contact_messages', 'site_settings')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_%I_updated_at ON public.%I;', t, t);
        EXECUTE format('CREATE TRIGGER tr_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t, t);
    END LOOP;
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ POLICIES (Allow anyone to view published/active content)
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public hero read" ON public.hero FOR SELECT USING (is_active = true);
CREATE POLICY "Public skills read" ON public.skills FOR SELECT USING (is_published = true);
CREATE POLICY "Public projects read" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public certifications read" ON public.certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Public education read" ON public.education FOR SELECT USING (is_published = true);
CREATE POLICY "Public experience read" ON public.experience FOR SELECT USING (is_published = true);
CREATE POLICY "Public research read" ON public.research FOR SELECT USING (is_published = true);
CREATE POLICY "Public navigation read" ON public.navigation FOR SELECT USING (is_visible = true);
CREATE POLICY "Public documents read" ON public.documents FOR SELECT USING (is_active = true);
CREATE POLICY "Public settings read" ON public.site_settings FOR SELECT USING (true);

-- 2. CONTACT FORM POLICY (Allow public to submit messages)
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- 3. ADMIN FULL ACCESS POLICIES (Only authenticated users have full CRUD)
CREATE POLICY "Admin all profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all hero" ON public.hero FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all research" ON public.research FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all navigation" ON public.navigation FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all media" ON public.media FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
('profile', 'profile', true),
('projects', 'projects', true),
('certificates', 'certificates', true),
('documents', 'documents', true),
('general', 'general', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public can view bucket files" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated admin can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated admin can update files" ON storage.objects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated admin can delete files" ON storage.objects FOR DELETE TO authenticated USING (true);
