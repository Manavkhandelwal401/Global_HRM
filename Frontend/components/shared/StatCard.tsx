import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'teal' | 'orange' | 'blue' | 'purple' | 'green' | 'red';
  onClick?: () => void;
}


const iconColorClasses = {
  teal: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  orange: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  blue: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  purple: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  green: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  red: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'teal',
  onClick,
}) => {
  const baseClasses = onClick
    ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/60 active:scale-[0.98]'
    : '';

  return (
    <div
      className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-soft transition-all duration-200 ${baseClasses}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          <span
            className={`flex items-center font-semibold rounded-full px-2 py-0.5 ${
              trend.isPositive 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="ml-2 text-zinc-500 dark:text-zinc-400">vs last period</span>
        </div>
      )}
    </div>
  );
};


// Made with Bob
