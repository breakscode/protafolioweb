import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Terminal, Lock, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If there's an error in URL hash from Supabase (e.g. expired link)
  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const errorDescription = params.get('error_description');
      setError(errorDescription || 'El enlace de recuperación es inválido o ha expirado.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await updatePassword(newPassword);

    if (updateError) {
      setError(updateError.message || 'No se pudo actualizar la contraseña. El enlace pudo haber expirado.');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 2500);
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
            Nueva Contraseña
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Establece tus nuevas credenciales de acceso al CMS
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">¡Contraseña Actualizada!</h3>
                <p className="text-xs text-slate-400">
                  Tu contraseña se ha restablecido correctamente. Redirigiendo al panel de administración...
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center mt-2"
                onClick={() => navigate('/admin/dashboard', { replace: true })}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Ir al Dashboard Ahora
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Introduce una contraseña segura de al menos 6 caracteres.
                </span>
              </div>

              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                minLength={6}
              />

              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                minLength={6}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Actualizar Contraseña
              </Button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/admin/login"
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
          >
            ← Volver a Iniciar Sesión
          </a>
        </div>

      </div>
    </div>
  );
};
