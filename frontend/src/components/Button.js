import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1';

  const variants = {
    primary: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626]/40',
    secondary: 'border border-[#DC2626] text-[#DC2626] bg-white hover:bg-[#FEF2F2] focus:ring-[#DC2626]/40',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626]/40',
    ghost: 'bg-transparent text-[#DC2626] hover:bg-[#F1F5F9] focus:ring-[#DC2626]/40',
  };

  const sizes = {
    sm: 'py-2 px-4 text-xs',
    md: 'py-2.5 px-5 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
