import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Terminal, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message || 'Credenciales incorrectas.');
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
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
            Panel de Administración
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Acceso seguro CMS para Jhampier Juárez
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isSupabaseConfigured() && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Modo Demostración Activo
                </p>
                <p className="text-[11px] text-slate-300">
                  Supabase no está configurado en <code>.env</code> aún. Puedes ingresar con cualquier email y contraseña de al menos 6 caracteres para probar todas las funciones.
                </p>
              </div>
            )}

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="admin@jhampier.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
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
              Iniciar Sesión
            </Button>
          </form>
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
