import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      showPasswordToggle,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const enablePasswordToggle = showPasswordToggle ?? isPassword;
    const [showPassword, setShowPassword] = useState(false);

    const effectiveType = isPassword && enablePasswordToggle
      ? (showPassword ? 'text' : 'password')
      : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={effectiveType}
            className={cn(
              "w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors",
              "focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              (enablePasswordToggle || rightElement) && "pr-10",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
          {enablePasswordToggle ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              className="absolute right-3 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none p-1 rounded-lg hover:bg-white/5"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : rightElement ? (
            <div className="absolute right-3 text-slate-400">
              {rightElement}
            </div>
          ) : null}
        </div>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
