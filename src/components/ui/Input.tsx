
import React from 'react';

interface InputProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

export const Input = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  error, 
  className = "", 
  name, 
  id, 
  required 
}: InputProps) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={id} className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      className={`block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${error ? 'border-red-300' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);