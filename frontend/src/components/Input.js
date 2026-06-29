import React, { useId } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#0F172A] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#94A3B8] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg bg-white border py-2.5 px-3.5 text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1]/20 transition-all ${
            icon ? 'pl-11' : 'pl-3.5'
          } ${
            error
              ? 'border-[#DC2626] focus:border-[#DC2626]'
              : 'border-[#E2E8F0] focus:border-[#0369A1]'
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#DC2626] font-medium flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
