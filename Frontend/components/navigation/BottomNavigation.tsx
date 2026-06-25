'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationIcon } from './NavigationIcon';
import { getNavigationForRole, type EmployeeRole } from '@/lib/navigation/navigationConfig';

export interface BottomNavigationProps {
  role: EmployeeRole;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ role }) => {
  const pathname = usePathname();
  const navItems = getNavigationForRole(role);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-md md:left-1/2 md:max-w-2xl md:-translate-x-1/2 md:rounded-t-xl shadow-soft">
      <div className="flex items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-1 flex-col items-center justify-center py-2.5 transition-all duration-200 ${
                isActive
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
              }`}
            >
              <div
                className={`transform transition-transform duration-200 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              >
                <NavigationIcon icon={item.icon} className="h-5 w-5" />
              </div>
              <span
                className={`mt-1 text-[10px] font-medium tracking-tight ${
                  isActive ? 'font-semibold' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-8 rounded-t-full bg-zinc-900 dark:bg-zinc-50" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Made with Bob

