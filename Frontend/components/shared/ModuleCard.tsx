import React from 'react';

export interface ModuleCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  color?: 'teal' | 'orange' | 'blue' | 'purple' | 'green' | 'red';
  onClick?: () => void;
  disabled?: boolean;
}

const iconColorClasses = {
  teal: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  orange: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  blue: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  purple: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  green: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  red: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  badge,
  color = 'teal',
  onClick,
  disabled = false,
}) => {
  const baseClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/60 active:scale-[0.98]';

  return (
    <div
      className={`relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-soft transition-all duration-200 ${baseClasses}`}
      onClick={disabled ? undefined : onClick}
      role={onClick && !disabled ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {badge && (
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-start space-x-4">
        {icon && (
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Made with Bob

