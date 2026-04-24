import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  children: ReactNode
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 cursor-pointer'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
