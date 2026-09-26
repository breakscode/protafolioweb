-- ==============================================================================
-- SCRIPT DE INSTALACIÓN COMPLETA PARA SUPABASE (SCHEMA + SEED DATA)
-- Portafolio y CMS Profesional de Jhampier Iván Juárez Mauricio
-- ==============================================================================

-- 1. EXTENSIONES Y FUNCIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. CREACIÓN DE TABLAS
-- ------------------------------------------------------------------------------

-- Perfil
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero
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

-- Tecnologías (Skills)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT,
    highlight BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proyectos
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
    category TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    main_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    status TEXT DEFAULT 'Completado',
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificaciones
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

-- Educación
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    period TEXT NOT NULL,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trayectoria / Experiencia
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    organization TEXT,
    role_or_title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    year_label TEXT,
    location TEXT,
    modality TEXT,
    technologies TEXT[] DEFAULT '{}',
    url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investigación
CREATE TABLE IF NOT EXISTS public.research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organization_or_context TEXT,
    year TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    key_metric TEXT,
    metric_label TEXT,
    url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Navegación
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

-- Documentos / CV
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_type TEXT NOT NULL DEFAULT 'cv',
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensajes de Contacto
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    ip_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuraciones Globales & SEO
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

-- Medios / Storage Metadata
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

-- ------------------------------------------------------------------------------
-- 3. TRIGGERS updated_at
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
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

-- Lectura pública
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

-- Envío público de mensajes
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Control total para administradores autenticados
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

-- ------------------------------------------------------------------------------
-- 5. BUCKETS DE ALMACENAMIENTO (Supabase Storage)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES 
('profile', 'profile', true),
('projects', 'projects', true),
('certificates', 'certificates', true),
('documents', 'documents', true),
('general', 'general', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view bucket files" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated admin can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated admin can update files" ON storage.objects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated admin can delete files" ON storage.objects FOR DELETE TO authenticated USING (true);

-- ------------------------------------------------------------------------------
-- 6. DATOS INICIALES (SEED DATA)
-- ------------------------------------------------------------------------------

-- Perfil de Jhampier
INSERT INTO public.profiles (
    id, full_name, headline, bio_short, bio_long, location, email, github_url, linkedin_url, status_text
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Jhampier Iván Juárez Mauricio',
    'Egresado de Ingeniería de Sistemas | Software Developer | IA',
    'Soy egresado de Ingeniería de Sistemas con sólida formación en análisis, diseño y desarrollo de software.',
    'Egresado de Ingeniería de Sistemas con enfoque en el desarrollo Full Stack, arquitecturas web modernas, integración de inteligencia artificial y automatización de procesos. Orientado a resolver problemas complejos mediante soluciones tecnológicas escalables, limpias y eficientes. Con experiencia en diseño de bases de datos, APIs RESTful, IoT y redes estructuradas.',
    'Piura, Perú',
    'jhampier.juarez@example.com',
    'https://github.com/breakscode',
    NULL,
    'Disponible para oportunidades como Software Developer / Full Stack Developer (Remoto)'
) ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    headline = EXCLUDED.headline,
    bio_short = EXCLUDED.bio_short,
    bio_long = EXCLUDED.bio_long;

-- Hero
INSERT INTO public.hero (
    id, greeting, role_title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, cta_tertiary_text, cta_tertiary_link, tech_badge, is_active
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Hola, soy Jhampier',
    'Software Developer',
    'Construyo soluciones web, sistemas inteligentes y experiencias digitales.',
    'Ver proyectos',
    '#projects',
    'Descargar CV',
    '#documents',
    'Contactarme',
    '#contact',
    'Full Stack & AI Focused',
    true
) ON CONFLICT (id) DO UPDATE SET 
    greeting = EXCLUDED.greeting,
    role_title = EXCLUDED.role_title,
    subtitle = EXCLUDED.subtitle;

-- Skills
INSERT INTO public.skills (name, category, icon_name, highlight, sort_order) VALUES
('React', 'frontend', 'Code2', true, 1),
('React 19', 'frontend', 'Sparkles', true, 2),
('TypeScript', 'frontend', 'FileCode', true, 3),
('JavaScript', 'frontend', 'FileCode', false, 4),
('Tailwind CSS', 'frontend', 'Palette', true, 5),
('Vite', 'frontend', 'Zap', false, 6),
('React Router', 'frontend', 'Compass', false, 7),
('React Hook Form', 'frontend', 'CheckSquare', false, 8),
('Zod', 'frontend', 'ShieldCheck', false, 9),
('Recharts', 'frontend', 'BarChart2', false, 10),
('HTML5', 'frontend', 'Layout', false, 11),
('CSS3', 'frontend', 'Layers', false, 12),
('Node.js', 'backend', 'Server', true, 1),
('NestJS', 'backend', 'Cpu', true, 2),
('PHP', 'backend', 'Code', false, 3),
('Java', 'backend', 'Coffee', false, 4),
('REST APIs', 'backend', 'Globe', true, 5),
('JWT', 'backend', 'Key', false, 6),
('Bcrypt', 'backend', 'Lock', false, 7),
('PostgreSQL', 'database', 'Database', true, 1),
('Supabase', 'database', 'Flame', true, 2),
('Prisma ORM', 'database', 'Boxes', true, 3),
('Redis', 'database', 'Zap', false, 4),
('MySQL', 'database', 'Database', false, 5),
('SQL Server', 'database', 'Server', false, 6),
('SQLite', 'database', 'HardDrive', false, 7),
('Google Gemini', 'ai_automation', 'Bot', true, 1),
('n8n', 'ai_automation', 'Workflow', true, 2),
('TensorFlow', 'ai_automation', 'Binary', true, 3),
('Inteligencia Artificial', 'ai_automation', 'Brain', true, 4),
('Automatización', 'ai_automation', 'Cog', true, 5),
('MCP', 'ai_automation', 'Network', false, 6),
('Git', 'tools', 'GitBranch', true, 1),
('GitHub', 'tools', 'Github', true, 2),
('Vercel', 'tools', 'UploadCloud', false, 3),
('Power BI', 'other', 'PieChart', false, 1),
('LAN', 'other', 'Network', false, 2),
('VLAN', 'other', 'Share2', false, 3),
('DHCP', 'other', 'Wifi', false, 4),
('IoT', 'other', 'Radio', true, 5);

-- Proyectos
INSERT INTO public.projects (
    title, slug, short_description, full_description, problem_statement, solution_statement, results_statement,
    year, organization, location, category, technologies, is_featured, sort_order
) VALUES
(
    'Sistema Integral de Gestión Patrimonial',
    'sistema-gestion-patrimonial',
    'Sistema web orientado a la gestión y control del inventario y patrimonio institucional.',
    'Plataforma integral diseñada para centralizar el registro, categorización, asignación, depreciación y auditoría de bienes patrimoniales institucionales con integración de análisis asistido por IA.',
    'La institución enfrentaba retrasos y riesgos de inconsistencia al manejar registros manuales y dispersos del inventario patrimonial.',
    'Desarrollo de un sistema web reactivo y seguro con backend en Supabase/PostgreSQL, visualización de métricas en Recharts e integración con Gemini 2.5 Flash para asistencia analítica.',
    'Centralización del 100% de los bienes institucionales con trazabilidad completa y generación automatizada de reportes.',
    '2026',
    'IESTP Juan José Farfán',
    'Sullana, Piura',
    'Full Stack',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'PostgreSQL', 'Gemini 2.5 Flash', 'Recharts'],
    true,
    1
),
(
    'Sistema Web para Optimización de Ventas',
    'sistema-optimizacion-ventas',
    'Sistema web desarrollado para optimizar procesos relacionados con ventas y gestión de información.',
    'Arquitectura Full Stack orientada a la agilización de ventas, control de inventario en tiempo real y autenticación segura con roles.',
    'Necesidad de optimizar los tiempos de atención en ventas y consolidar la información transaccional con baja latencia.',
    'Implementación de una arquitectura modular basada en React en frontend y NestJS en backend con Prisma ORM, caché en Redis y persistencia en PostgreSQL.',
    'Flujo de ventas optimizado y consultas de stock en tiempo real protegidas mediante tokens JWT.',
    '2025',
    'Comercial Rafael Norte S.A.C.',
    'Piura',
    'Full Stack',
    ARRAY['React', 'NestJS', 'Prisma', 'JWT', 'Redis', 'PostgreSQL'],
    true,
    2
),
(
    'Asistente Inteligente para Consultas y Agendas',
    'asistente-inteligente-consultas-agendas',
    'Proyecto de investigación orientado a automatizar consultas y coordinación de agendas mediante IA y automatización.',
    'Solución de automatización inteligente desarrollada como proyecto de investigación titulada: "Automatización de consultas y agendas mediante asistente inteligente usando inteligencia artificial para una institución educativa, Piura 2026".',
    'Sobrecarga en la atención de consultas frecuentes de estudiantes y dificultades en la coordinación fluida de agendas institucionales.',
    'Flujos automatizados creados con n8n orquestados con el modelo Google Gemini para comprender el contexto de las solicitudes y gestionar disponibilidad de horarios de manera desatendida.',
    'Automatización de respuestas inmediatas 24/7 y sincronización de citas sin fricción.',
    '2026',
    'Institución Educativa',
    'Piura',
    'IA / Automatización',
    ARRAY['n8n', 'Google Gemini', 'Inteligencia Artificial', 'Automatización'],
    true,
    3
),
(
    'Sistema Inteligente de Categorización de Artículos',
    'sistema-categorizacion-articulos',
    'Sistema orientado a la categorización inteligente de artículos utilizando técnicas de inteligencia artificial.',
    'Desarrollo y entrenamiento de un modelo neuronal con TensorFlow y Python para clasificación automatizada de prendas y artículos con alto índice de exactitud.',
    'Proceso manual y lento de clasificación de artículos susceptibles a errores humanos en la catalogación.',
    'Diseño de una red neuronal profunda con preprocesamiento de datos y ajuste de hiperparámetros con TensorFlow.',
    'Obtención de un 80.34% de precisión en la categorización del conjunto de prueba.',
    '2024',
    NULL,
    'Piura',
    'IA',
    ARRAY['Python', 'TensorFlow', 'Inteligencia Artificial'],
    false,
    4
),
(
    'Plataforma Integral para Seguimiento del Rendimiento Académico y Conductual',
    'plataforma-seguimiento-academico-conductual',
    'Plataforma web orientada al seguimiento y gestión de información relacionada con el rendimiento académico y conductual.',
    'Sistema de gestión escolar para docentes, tutores y directivos enfocado en el registro oportuno de calificaciones, asistencias e incidentes conductuales.',
    'Dificultad de los docentes para mantener un registro histórico unificado y comunicar oportunamente el estado conductual a directivos.',
    'Plataforma web modular que centraliza fichas de seguimiento, reportes consolidados y métricas por periodo escolar.',
    'Mejora en el monitoreo preventivo de incidentes escolares y centralización de la información evaluativa.',
    '2024',
    'I.E.P. Los Clavelitos',
    'Piura',
    'Full Stack',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    false,
    5
),
(
    'SmartBin IoT',
    'smartbin-iot',
    'Proyecto relacionado con Internet of Things y gestión inteligente de residuos.',
    'Prototipo IoT para la detección de nivel de llenado de contenedores de residuos y transmisión de datos a panel centralizado.',
    'Recolección ineficiente de residuos por rutas fijas sin conocimiento previo del estado de los contenedores.',
    'Integración de microcontroladores con sensores de proximidad y módulo de comunicación para emitir alertas de nivel crítico.',
    'Demostración funcional de recolección bajo demanda mediante telemetría IoT.',
    '2024',
    NULL,
    'Piura',
    'IoT',
    ARRAY['IoT', 'Sensores', 'Microcontroladores', 'C/C++'],
    false,
    6
),
(
    'Rediseño de una Red LAN Estructurada',
    'rediseno-red-lan-estructurada',
    'Proyecto relacionado con diseño y rediseño de infraestructura de red LAN.',
    'Diseño y segmentación lógica de infraestructura de red local para mejorar la seguridad, segmentación departamental y rendimiento.',
    'Congestión por dominios de broadcast amplios y falta de aislamiento entre departamentos organizacionales.',
    'Segmentación mediante VLANs, configuración de servidores DHCP con direccionamiento eficiente y esquemas de enrutamiento seguros.',
    'Topología de red optimizada, tráfico segmentado y control de accesos por subred.',
    '2025',
    NULL,
    'Piura',
    'Redes',
    ARRAY['LAN', 'VLAN', 'DHCP', 'Cisco Packet Tracer', 'Routing & Switching'],
    false,
    7
);

-- Certificaciones
INSERT INTO public.certifications (name, issuer, issue_date, description, sort_order) VALUES
('Claude Certified Architect', 'Anthropic', '2026', 'Certificación en arquitectura y diseño de soluciones avanzadas con modelos Claude de Anthropic.', 1),
('Claude Code in Action', 'Anthropic Academy', '2026', 'Especialización en desarrollo asistido y flujos de trabajo avanzados de codificación con Claude.', 2),
('Google AI Essentials', 'Google', NULL, 'Fundamentos de inteligencia artificial, prompts efectivos y aplicaciones en productividad.', 3),
('GitHub Foundations', 'GitHub', NULL, 'Dominio de control de versiones, colaboración en GitHub, flujos de trabajo y buenas prácticas.', 4),
('CyberOps Associate', 'Cisco', NULL, 'Operaciones y fundamentos de ciberseguridad, monitoreo y respuesta ante incidentes.', 5),
('Red Hat System Administration I (RH124)', 'Red Hat', NULL, 'Administración de sistemas Linux Red Hat Enterprise, gestión de usuarios, almacenamiento y servicios.', 6),
('SQL Server Fundamentals', 'Microsoft', NULL, 'Administración, consultas T-SQL y modelado de bases de datos relacionales en SQL Server.', 7),
('Power BI', 'Microsoft / Certificación Especializada', NULL, 'Modelado de datos DAX, visualización de métricas y construcción de dashboards de inteligencia de negocios.', 8),
('CCNAv7', 'Cisco', NULL, 'Fundamentos de redes, enrutamiento, conmutación y seguridad de infraestructura IP.', 9),
('IBM SkillsBuild', 'IBM', NULL, 'Habilidades tecnológicas e innovación digital.', 10),
('HubSpot Content Marketing', 'HubSpot Academy', NULL, 'Estrategias de contenido digital y optimización de canales de comunicación.', 11),
('Certificado de Asistencia al Curso de IA 2026', 'BIG school', '2026', 'Actualización en tendencias, modelos de lenguaje y herramientas de inteligencia artificial aplicada.', 12);

-- Educación
INSERT INTO public.education (institution, degree, field_of_study, period, status, location, description, sort_order) VALUES
(
    'Universidad César Vallejo',
    'Ingeniería de Sistemas',
    'Análisis, diseño, arquitectura de software, bases de datos, redes e inteligencia artificial',
    '2020 — 2026',
    'Egresado',
    'Piura, Perú',
    'Formación académica orientada a la ingeniería de software, gestión de proyectos tecnológicos, desarrollo de sistemas de información, redes y modelos inteligentes.',
    1
);

-- Trayectoria
INSERT INTO public.experience (type, organization, role_or_title, description, start_date, end_date, year_label, location, modality, technologies, sort_order) VALUES
(
    'Proyecto profesional',
    'IESTP Juan José Farfán',
    'Sistema Integral de Gestión Patrimonial & IA',
    'Desarrollo full stack de sistema web para inventario patrimonial con Supabase, PostgreSQL y análisis automatizado con Gemini 2.5 Flash. Culminación de estudios de Ingeniería de Sistemas.',
    '2026',
    '2026',
    '2026',
    'Sullana, Piura',
    'Híbrido',
    ARRAY['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Gemini 2.5 Flash', 'Tailwind CSS'],
    1
),
(
    'Proyecto académico',
    'Institución Educativa',
    'Automatización con IA y n8n',
    'Investigación y desarrollo de asistente inteligente para automatización de consultas y gestión de agendas académicas.',
    '2026',
    '2026',
    '2026',
    'Piura, Perú',
    'Remoto',
    ARRAY['n8n', 'Google Gemini', 'Inteligencia Artificial', 'Automatización'],
    2
),
(
    'Proyecto profesional',
    'Comercial Rafael Norte S.A.C.',
    'Sistema Web para Optimización de Ventas',
    'Desarrollo de plataforma web para agilización de ventas y control de stock con React, NestJS, Prisma ORM, Redis y PostgreSQL.',
    '2025',
    '2025',
    '2025',
    'Piura',
    'Remoto',
    ARRAY['React', 'NestJS', 'Prisma', 'Redis', 'PostgreSQL', 'JWT'],
    3
),
(
    'Proyecto académico',
    NULL,
    'Rediseño e Infraestructura de Red LAN',
    'Segmentación de red corporativa con VLANs, esquemas de direccionamiento dinámico DHCP y directivas de seguridad.',
    '2025',
    '2025',
    '2025',
    'Piura',
    'Presencial',
    ARRAY['LAN', 'VLAN', 'DHCP', 'Cisco Packet Tracer'],
    4
),
(
    'Proyecto profesional',
    'I.E.P. Los Clavelitos',
    'Plataforma de Rendimiento Académico y Conductual',
    'Diseño y desarrollo de sistema web para seguimiento de rendimiento escolar y registro conductual de estudiantes.',
    '2024',
    '2024',
    '2024',
    'Piura',
    'Híbrido',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    5
),
(
    'Proyecto académico',
    NULL,
    'Investigación en Clasificación Inteligente con TensorFlow',
    'Entrenamiento de modelo de visión / categorización de prendas obteniendo 80.34% de precisión en el set de validación.',
    '2024',
    '2024',
    '2024',
    'Piura',
    'Remoto',
    ARRAY['Python', 'TensorFlow', 'Inteligencia Artificial'],
    6
);

-- Investigación
INSERT INTO public.research (title, description, organization_or_context, year, technologies, key_metric, metric_label, sort_order) VALUES
(
    'Automatización de consultas y agendas mediante asistente inteligente usando inteligencia artificial para una institución educativa, Piura 2026',
    'Proyecto de investigación enfocado en la implementación de agentes inteligentes y flujos autónomos con n8n y Google Gemini para atender consultas estudiantiles e interconectar agendas institucionales de manera reactiva.',
    'Proyecto de Investigación Institucional',
    '2026',
    ARRAY['n8n', 'Google Gemini', 'Inteligencia Artificial', 'Automatización'],
    '24/7',
    'Disponibilidad automatizada de atención',
    1
),
(
    'Sistema Inteligente de Categorización de Artículos mediante Redes Neuronales',
    'Investigación aplicada al procesamiento y clasificación de artículos y prendas mediante técnicas de Deep Learning con TensorFlow, logrando un porcentaje representativo de exactitud experimental.',
    'Investigación Aplicada en IA',
    '2024',
    ARRAY['Python', 'TensorFlow', 'Deep Learning', 'Computer Vision'],
    '80.34%',
    'Precisión lograda en el modelo experimental',
    2
);

-- Navegación
INSERT INTO public.navigation (section_id, label, href, is_visible, sort_order) VALUES
('hero', 'Inicio', '#hero', true, 1),
('about', 'Sobre mí', '#about', true, 2),
('skills', 'Stack', '#skills', true, 3),
('projects', 'Proyectos', '#projects', true, 4),
('experience', 'Trayectoria', '#experience', true, 5),
('research', 'Investigación', '#research', true, 6),
('certifications', 'Certificaciones', '#certifications', true, 7),
('education', 'Educación', '#education', true, 8),
('contact', 'Contacto', '#contact', true, 9);

-- Configuración SEO
INSERT INTO public.site_settings (
    id, site_name, seo_title, seo_description, contact_email, github_url, linkedin_url, copyright_text, maintenance_mode
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    'Jhampier Juárez | Software Developer',
    'Jhampier Juárez | Software Developer',
    'Portafolio profesional de Jhampier Juárez, Software Developer especializado en desarrollo Full Stack, inteligencia artificial, automatización y tecnologías web modernas.',
    'jhampier.juarez@example.com',
    'https://github.com/breakscode',
    NULL,
    '© 2026 Jhampier Iván Juárez Mauricio. Todos los derechos reservados.',
    false
) ON CONFLICT (id) DO UPDATE SET 
    site_name = EXCLUDED.site_name,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description;
