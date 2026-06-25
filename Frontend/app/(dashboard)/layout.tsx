'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { type EmployeeRole } from '@/lib/navigation/navigationConfig';
import { useSession } from '@/context/SessionContext';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Protect all dashboard routes
  useAuthGuard();
  children: React.ReactNode;
}) {
  const { user, switchRole } = useSession();

  const handleRoleSwitch = async (newRole: EmployeeRole) => {
    await switchRole(newRole);
    console.log('Switching role to:', newRole);
  };

  // Provide a safe fallback if user is null
  const currentUser = user
    ? {
        name: user.name ?? 'John Doe',
        email: user.email ?? 'john.doe@workflow.com',
        role: (user.role ?? 'Employee') as EmployeeRole,
        designation: undefined as string | undefined,
      }
    : {
        name: 'John Doe',
        email: 'john.doe@workflow.com',
        role: 'Employee' as EmployeeRole,
        designation: 'Software Engineer',
      };

  return (
    <AppShell user={currentUser} onRoleSwitch={handleRoleSwitch}>
      {children}
    </AppShell>
  );
}

// Made with Bob
