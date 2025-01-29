import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={` rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t ${className}`}>{children}</div>
);

export const CardDescription: React.FC<CardProps> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
)

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);
