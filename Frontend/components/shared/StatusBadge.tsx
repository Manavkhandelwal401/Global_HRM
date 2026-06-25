import React from 'react';

export type StatusType = 
  | 'approved' 
  | 'pending' 
  | 'rejected' 
  | 'active' 
  | 'inactive' 
  | 'completed' 
  | 'in-progress' 
  | 'cancelled'
  | 'Present'
  | 'Late'
  | 'HalfDay'
  | 'Absent'
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'default' | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantConfig: Record<string, { color: string; bgColor: string; borderColor: string; dotColor: string }> = {
  success: {
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    borderColor: 'border-green-200 dark:border-green-900',
    dotColor: 'bg-green-500',
  },
  warning: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    borderColor: 'border-amber-200 dark:border-amber-900',
    dotColor: 'bg-amber-500',
  },
  info: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    borderColor: 'border-blue-200 dark:border-blue-900',
    dotColor: 'bg-blue-500',
  },
  error: {
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
    borderColor: 'border-red-200 dark:border-red-900',
    dotColor: 'bg-red-500',
  },
  default: {
    color: 'text-zinc-700 dark:text-zinc-400',
    bgColor: 'bg-zinc-50 dark:bg-zinc-900/50',
    borderColor: 'border-zinc-200 dark:border-zinc-800',
    dotColor: 'bg-zinc-500',
  },
};

const statusToVariant: Record<string, string> = {
  approved: 'success',
  completed: 'success',
  present: 'success',
  
  pending: 'warning',
  late: 'warning',
  
  active: 'info',
  'in-progress': 'info',
  halfday: 'info',
  
  rejected: 'error',
  absent: 'error',
  
  inactive: 'default',
  cancelled: 'default',
};

const sizeClasses = {
  sm: 'h-5 px-2 text-xs gap-1',
  md: 'h-6 px-2.5 text-xs gap-1.5',
  lg: 'h-7 px-3 text-sm gap-1.5',
};

const dotSizeClasses = {
  sm: 'h-1 w-1',
  md: 'h-1.5 w-1.5',
  lg: 'h-2 w-2',
};

const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  label,
  size = 'md',
}) => {
  // Determine variant based on explicitly passed variant, or status mapping
  const normalizedStatus = String(status).toLowerCase();
  const resolvedVariant = variant || statusToVariant[normalizedStatus] || 'default';
  
  const config = variantConfig[resolvedVariant] || variantConfig.default;
  const displayLabel = capitalizeFirstLetter(label || status);

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses[size]}`}
    >
      <span className={`mr-1.5 rounded-full ${config.dotColor} ${dotSizeClasses[size]}`}></span>
      {displayLabel}
    </span>
  );
};

// Made with Bob
