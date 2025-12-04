
import React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
}

export const Button = ({ children, onClick, type = 'button', className = '', loading = false, variant = 'primary' }: ButtonProps) => {
  const baseStyle = "w-full flex justify-center py-2.5 px-4 border text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const variants = {
    primary: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-sm",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-red-500",
    outline: "border-red-600 text-red-600 bg-transparent hover:bg-red-50 focus:ring-red-500",
    dark: "border-transparent text-white bg-[#363740] hover:bg-gray-800 focus:ring-gray-500 shadow-sm"
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};
