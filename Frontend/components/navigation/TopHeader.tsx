'use client';

import React, { useState, useEffect, useRef } from 'react';
import { type EmployeeRole } from '@/lib/navigation/navigationConfig';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/SessionContext';

export interface TopHeaderProps {
  user: {
    name: string;
    email: string;
    role: EmployeeRole;
    designation?: string;
    avatarUrl?: string;
  };
  onRoleSwitch: (newRole: EmployeeRole) => void;
}

const roleOptions: EmployeeRole[] = ['Employee', 'Manager', 'HR', 'Admin'];

export const TopHeader: React.FC<TopHeaderProps> = ({ user, onRoleSwitch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);


  const handleRoleChange = (newRole: EmployeeRole) => {
    onRoleSwitch(newRole);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-soft">
      <div className="w-full px-4 md:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 font-bold">
              WF
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                WorkFlow HRMS
              </h1>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                Global HR Management
              </p>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={dropdownRef}>
            {!mounted ? (
              <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-1.5 w-[140px] h-[38px] animate-pulse">
                <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-850" />
                <div className="hidden sm:block flex-1 space-y-1">
                  <div className="h-2.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-2 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-1.5 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                {/* Avatar */}
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {getInitials(user.name)}
                  </div>
                )}

                {/* User Info */}
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {user.designation || user.role}
                  </p>
                </div>

                {/* Dropdown Icon */}
                <svg
                  className={`h-3 w-3 text-zinc-500 transition-transform dark:text-zinc-400 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md z-50">
                <div className="border-b border-zinc-200 dark:border-zinc-800 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Switch Demo Role
                  </p>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                    Current: {user.role}
                  </p>
                </div>
                <div className="p-1">
                  {roleOptions.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                        user.role === role
                          ? 'bg-zinc-100 text-zinc-900 font-semibold dark:bg-zinc-800 dark:text-zinc-50'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{role}</span>
                        {user.role === role && (
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Theme Selector */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-b-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                    Theme
                  </p>
                  <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                    {(['teal', 'orange'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold capitalize transition-all ${
                          theme === t
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                  <button onClick={logout} className="w-full py-1 text-xs font-semibold text-red-600 hover:bg-red-100 rounded-md mt-2">
                    Logout
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Made with Bob
