import React from 'react';

// Define the types for button variants and sizes
export type ButtonVariant = 'default' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'sm' | 'lg';

// Extend the default button attributes to include custom props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Create the Button component
export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default', // default variant
  size = 'default',    // default size
  ...props
}) => {
  const baseStyles = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finance-blue';
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-finance-blue text-white hover:bg-finance-blue/90',
    outline: 'border border-finance-blue text-finance-blue hover:bg-finance-blue/10',
    ghost: 'text-finance-blue hover:bg-finance-blue/10',
  };
  const sizeStyles: Record<ButtonSize, string> = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
