'use client';

import React from 'react';
import { TopHeader } from '../navigation/TopHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { type EmployeeRole } from '@/lib/navigation/navigationConfig';
import HrCopilotPanel from '../copilot/HrCopilotPanel';

export interface AppShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: EmployeeRole;
    designation?: string;
    avatarUrl?: string;
  };
  onRoleSwitch: (newRole: EmployeeRole) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, user, onRoleSwitch }) => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Top Header */}
      <TopHeader user={user} onRoleSwitch={onRoleSwitch} />

      {/* Main Content Area - Standard Responsive Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 pb-24 pt-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation role={user.role} />

      {/* Floating AI HR Copilot */}
      <HrCopilotPanel />
    </div>

  );
};

// Made with Bob
