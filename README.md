# Portafolio Web Profesional & Panel CMS Dinámico — Jhampier Juárez

Aplicación web profesional completa, moderna, responsive y funcional construida para **Jhampier Iván Juárez Mauricio** (*Software Developer | Egresado de Ingeniería de Sistemas | IA*).

El proyecto consta de:
1. **Portafolio Público Premium**: Experiencia visual tecnológica en *Dark Mode*, con navegación fluida, terminal interactiva en el Hero, filtros de proyectos en tiempo real, modales de arquitectura detallada, trayectoria cronológica, sección de investigación con métricas y formulario de contacto funcional.
2. **Panel de Administración CMS (`/admin`)**: Panel de gestión privado conectado a **Supabase** (Auth, PostgreSQL, Storage, Row Level Security) para administrar el 100% de los datos sin editar código fuente.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 / 19, TypeScript, Vite, Tailwind CSS
- **Iconografía & Animaciones**: Lucide React, CSS Transitions & Keyframes
- **Backend / BaaS**: Supabase
- **Base de Datos**: PostgreSQL con extensiones UUID y triggers `updated_at`
- **Seguridad**: Row Level Security (RLS) en todas las tablas y políticas granulares
- **Autenticación**: Supabase Auth (Email + Password con persistencia)
- **Almacenamiento**: Supabase Storage (Buckets para `projects`, `profile`, `certificates`, `documents`, `general`)
- **Enrutamiento**: React Router v7

---

## 📁 Estructura del Proyecto

```
├── .env.example                     # Plantilla de credenciales Supabase
├── index.html                       # Meta tags SEO, fuentes tipográficas (Plus Jakarta Sans / JetBrains Mono)
├── package.json                     # Dependencias y scripts de construcción
├── tailwind.config.js               # Tokens de diseño, colores surface y temas oscuros
├── vite.config.ts                   # Configuración de Vite y path aliases (@/*)
├── supabase/
│   ├── schema.sql                   # DDL completo (Tablas, RLS, Storage, Triggers)
│   └── seed.sql                     # Datos iniciales reales de Jhampier Juárez
└── src/
    ├── main.tsx                     # Entrypoint con React Router y AuthProvider
    ├── App.tsx                      # Enrutamiento de páginas públicas y admin
    ├── index.css                    # Glassmorphism, scrollbars y estilos globales
    ├── types/                       # Definiciones TypeScript de todos los modelos
    ├── lib/
    │   ├── supabase.ts              # Cliente Supabase con detección de estado
    │   ├── mockData.ts              # Semilla y fallback local reactivo
    │   └── utils.ts                 # Helpers de formato de fechas, bytes y clases
    ├── context/
    │   └── AuthContext.tsx          # Contexto de autenticación y sesiones
    ├── services/                    # 13 servicios CRUD modulares
    ├── components/
    │   ├── ui/                      # Button, Input, Textarea, Select, Switch, Modal, Badge
    │   ├── public/                  # Navbar, Hero, About, Skills, Projects, Experience, Research, Certifications, Education, Contact, Footer
    │   └── admin/                   # Sidebar, Header, StatCard, ImageUploader, ConfirmDialog
    └── pages/
        ├── public/                  # HomePage
        └── admin/                   # 15 páginas y modales de administración
```

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio e instalar dependencias:
```bash
npm install
```

### 2. Configurar Variables de Entorno:
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
```bash
cp .env.example .env
```

Edita `.env` con las claves de tu proyecto en Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

> **Nota:** La aplicación cuenta con un *Modo Demo / Local Fallback*. Si ejecutas el proyecto sin configurar Supabase inicialmente, cargará todos los datos reales por defecto y podrás probar el panel `/admin` de inmediato.

### 3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

### 4. Compilar para Producción:
```bash
npm run build
```

---

## 🗄️ Configuración de Supabase (Paso a Paso)

1. **Crear Proyecto en Supabase**:
   - Ingresa a [supabase.com](https://supabase.com) y crea un nuevo proyecto.

2. **Ejecutar el Esquema SQL**:
   - En el panel de Supabase, dirígete a **SQL Editor**.
   - Abre el archivo `supabase/schema.sql`, copia su contenido y ejecútalo (**Run**). Esto creará todas las tablas, índices, triggers `updated_at`, políticas RLS y buckets de Storage.

3. **Cargar los Datos Iniciales (Seed)**:
   - En el **SQL Editor**, copia y ejecuta el contenido de `supabase/seed.sql`. Se insertarán automáticamente tus 7 proyectos, todas las tecnologías clasificadas, certificaciones, trayectoria, investigación y educación.

4. **Crear tu Usuario Administrador**:
   - En Supabase, ve a **Authentication** -> **Users**.
   - Haz clic en **Add User** -> **Create User**.
   - Ingresa tu correo (ej. `admin@jhampier.dev`) y una contraseña segura.
   - ¡Listo! Usa estas credenciales para iniciar sesión en `http://localhost:5173/admin/login`.

---

## 🛡️ Seguridad & Row Level Security (RLS)

- **Lectura Pública (`SELECT`)**: Solo se devuelven registros con `is_published = true` a los visitantes del portafolio.
- **Inserción Pública (`INSERT`)**: Exclusiva para la tabla `contact_messages`, permitiendo a reclutadores enviar mensajes de forma segura.
- **Control Total (`CRUD`)**: Requiere sesión activa mediante token JWT validado por Supabase Auth (`auth.uid() IS NOT NULL`).

---

## ☁️ Despliegue en Vercel

1. Sube el repositorio a tu cuenta de **GitHub** (`github.com/breakscode/...`).
2. En [Vercel](https://vercel.com), haz clic en **Add New** -> **Project** e importa el repositorio.
3. En la sección **Environment Variables**, añade:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**. ¡Tu portafolio estará online con CDN global y HTTPS automático!

---

## 👤 Autor

**Jhampier Iván Juárez Mauricio**
- **GitHub**: [github.com/breakscode](https://github.com/breakscode)
- **Ubicación**: Piura, Perú
- **Especialidad**: Software Developer | Full Stack | IA
