export type EmployeeRole = 'Employee' | 'Manager' | 'HR' | 'Admin';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: EmployeeRole[];
}

// Icon names map to Heroicons or custom SVG icons
export const navigationConfig: Record<EmployeeRole, NavigationItem[]> = {
  Employee: [
    {
      id: 'home',
      label: 'Home',
      path: '/dashboard',
      icon: 'home',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      path: '/attendance',
      icon: 'calendar',
      roles: ['Employee'],
    },
    {
      id: 'performance',
      label: 'Performance',
      path: '/performance',
      icon: 'chart-bar',
      roles: ['Employee'],
    },
    {
      id: 'training',
      label: 'Training',
      path: '/training',
      icon: 'academic-cap',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'contributions',
      label: 'Contributions',
      path: '/contributions',
      icon: 'gift',
      roles: ['Employee'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      path: '/announcements',
      icon: 'megaphone',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'assets',
      label: 'Assets',
      path: '/assets',
      icon: 'folder',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'payroll',
      label: 'Payroll',
      path: '/payroll',
      icon: 'credit-card',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
  ],
  Manager: [
    {
      id: 'home',
      label: 'Home',
      path: '/dashboard',
      icon: 'home',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'team',
      label: 'Team',
      path: '/team',
      icon: 'users',
      roles: ['Manager', 'Admin'],
    },
    {
      id: 'leave',
      label: 'Leave',
      path: '/leave',
      icon: 'calendar-days',
      roles: ['Manager'],
    },
    {
      id: 'performance',
      label: 'Performance',
      path: '/performance',
      icon: 'chart-bar',
      roles: ['Manager'],
    },
    {
      id: 'training',
      label: 'Training',
      path: '/training',
      icon: 'academic-cap',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      path: '/announcements',
      icon: 'megaphone',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'assets',
      label: 'Assets',
      path: '/assets',
      icon: 'folder',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'payroll',
      label: 'Payroll',
      path: '/payroll',
      icon: 'credit-card',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
  ],
  HR: [
    {
      id: 'home',
      label: 'Home',
      path: '/dashboard',
      icon: 'home',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      path: '/recruitment',
      icon: 'user-plus',
      roles: ['HR'],
    },
    {
      id: 'leave',
      label: 'Leave',
      path: '/leave',
      icon: 'calendar-days',
      roles: ['Manager', 'HR', 'Admin'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: 'chart-pie',
      roles: ['HR', 'Admin'],
    },
    {
      id: 'training',
      label: 'Training',
      path: '/training',
      icon: 'academic-cap',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      path: '/announcements',
      icon: 'megaphone',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'assets',
      label: 'Assets',
      path: '/assets',
      icon: 'folder',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'payroll',
      label: 'Payroll',
      path: '/payroll',
      icon: 'credit-card',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
  ],
  Admin: [
    {
      id: 'home',
      label: 'Home',
      path: '/dashboard',
      icon: 'home',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'leave',
      label: 'Leave',
      path: '/leave',
      icon: 'calendar-days',
      roles: ['Manager', 'HR', 'Admin'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: 'chart-pie',
      roles: ['HR', 'Admin'],
    },
    {
      id: 'team',
      label: 'Team',
      path: '/team',
      icon: 'users',
      roles: ['Manager', 'Admin'],
    },
    {
      id: 'training',
      label: 'Training',
      path: '/training',
      icon: 'academic-cap',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      path: '/announcements',
      icon: 'megaphone',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'assets',
      label: 'Assets',
      path: '/assets',
      icon: 'folder',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
    {
      id: 'payroll',
      label: 'Payroll',
      path: '/payroll',
      icon: 'credit-card',
      roles: ['Employee', 'Manager', 'HR', 'Admin'],
    },
  ],
};

export const getNavigationForRole = (role: EmployeeRole): NavigationItem[] => {
  return navigationConfig[role] || navigationConfig.Employee;
};

export const isRouteAllowedForRole = (path: string, role: EmployeeRole): boolean => {
  const navItems = getNavigationForRole(role);
  return navItems.some((item) => item.path === path);
};

// Made with Bob
