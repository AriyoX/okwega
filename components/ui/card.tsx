import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;  // Add onClick prop
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
      onClick={onClick}  // Add onClick handler
    >
      {children}
    </div>
  );
}