import React from 'react';
import { motion } from 'framer-motion';

interface AlertProps {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const typeStyles = {
  success: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const Alert: React.FC<AlertProps> = ({ title, description, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start p-4 border-l-4 rounded-md ${typeStyles[type]}`}
    >
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-semibold focus:outline-none"
        >
          &times;
        </button>
      )}
    </motion.div>
  );

  
};

export default Alert;
