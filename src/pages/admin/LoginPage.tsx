import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Terminal, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isForgotPath = location.pathname.includes('forgot-password');
  const initialMode = (queryParams.get('mode') === 'forgot' || isForgotPath) ? 'forgot' : 'login';

  const [mode, setMode] = useState<'login' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signIn, resetPasswordForEmail, user } = useAuth();
  const navigate = useNavigate();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message || 'Credenciales incorrectas.');
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresa tu correo electrónico registrado.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const { error: resetError } = await resetPasswordForEmail(email);

    if (resetError) {
      setError(resetError.message || 'Error al enviar el enlace de recuperación.');
    } else {
      setSuccessMessage(
        isSupabaseConfigured()
          ? `¡Enlace de recuperación enviado a ${email}! Revisa tu bandeja de entrada o spam para continuar.`
          : 'Modo Demostración: Simulación completada. En producción recibirás el correo de Supabase para cambiar tu contraseña.'
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="ambient-glow w-96 h-96 bg-cyan-500/10 top-1/4 -left-20" />
      <div className="ambient-glow w-96 h-96 bg-indigo-500/10 bottom-1/4 -right-20" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-glow-sm">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === 'login' ? 'Panel de Administración' : 'Recuperar Contraseña'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {mode === 'login'
              ? 'Acceso seguro CMS para Jhampier Juárez'
              : 'Enviaremos un enlace seguro a tu correo para restablecer el acceso'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-300" />
              <span>{successMessage}</span>
            </div>
          )}

          {!isSupabaseConfigured() && (
            <div className="p-3 mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Modo Demostración Activo
              </p>
              <p className="text-[11px] text-slate-300">
                {mode === 'login'
                  ? 'Puedes ingresar con cualquier email y contraseña de al menos 6 caracteres.'
                  : 'En modo demo la solicitud se simulará localmente.'}
              </p>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="admin@jhampier.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Iniciar Sesión
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <Input
                label="Correo Electrónico Registrado"
                type="email"
                placeholder="admin@jhampier.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Enviar Enlace de Recuperación
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
                >
                  ← Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
          >
            ← Volver al portafolio público
          </a>
        </div>

      </div>
    </div>
  );
};
