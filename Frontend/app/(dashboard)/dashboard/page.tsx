'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { StatCard } from '@/components/shared/StatCard';
import { ModuleCard } from '@/components/shared/ModuleCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSession } from '@/context/SessionContext';
import { CheckCircle2, Calendar, Check, Ban, X, ChevronDown, UserPlus, Plus } from 'lucide-react';
import { GET_MY_LEAVE_REQUESTS, GET_PENDING_LEAVE_APPROVALS } from '@/graphql/query/leave';
import { APPROVE_LEAVE_REQUEST, REJECT_LEAVE_REQUEST, CANCEL_LEAVE_REQUEST } from '@/graphql/mutation/leave';
import { GET_MY_EXPENSES, GET_PENDING_EXPENSE_APPROVALS } from '@/graphql/query/expense';
import { APPROVE_EXPENSE, REJECT_EXPENSE } from '@/graphql/mutation/expense';
import { FormModal } from '@/components/shared/FormModal';

interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  date: string;
  assignedToId?: string;
  assignedToName?: string;
  description?: string; // long details
  completedByIds?: string[]; // track which employees completed this task
  createdById?: string;
  createdByName?: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  status: string;
  approvalComments: string | null;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedOn: string | null;
  createdAt: string;
}

interface ExpenseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  comments: string | null;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedOn: string | null;
  createdAt: string;
}

// Read/write the shared demo-leaves localStorage key (same as leave page)
function readDemoLeaves(): { requests: LeaveRequest[]; approvals: LeaveRequest[] } {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('demo-leaves') : null;
    if (!raw) return { requests: [], approvals: [] };
    const parsed = JSON.parse(raw);
    return { requests: parsed.requests ?? [], approvals: parsed.approvals ?? [] };
  } catch {
    return { requests: [], approvals: [] };
  }
}

function writeDemoLeaves(update: Partial<{ requests: LeaveRequest[]; approvals: LeaveRequest[]; balances: any[] }>) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('demo-leaves') : null;
    const current = raw ? JSON.parse(raw) : {};
    localStorage.setItem('demo-leaves', JSON.stringify({ ...current, ...update }));
  } catch { /* ignore */ }
}

// Read/write the shared demo-expenses localStorage key
function readDemoExpenses(): { requests: ExpenseRequest[]; approvals: ExpenseRequest[] } {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('demo-expenses') : null;
    if (!raw) return { requests: [], approvals: [] };
    const parsed = JSON.parse(raw);
    return { requests: parsed.requests ?? [], approvals: parsed.approvals ?? [] };
  } catch {
    return { requests: [], approvals: [] };
  }
}

function writeDemoExpenses(update: Partial<{ requests: ExpenseRequest[]; approvals: ExpenseRequest[] }>) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('demo-expenses') : null;
    const current = raw ? JSON.parse(raw) : {};
    localStorage.setItem('demo-expenses', JSON.stringify({ ...current, ...update }));
  } catch { /* ignore */ }
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const currentRole = user?.role || 'Employee';
  const isManagement = currentRole === 'Manager' || currentRole === 'HR' || currentRole === 'Admin';
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAllLeaves, setShowAllLeaves] = useState(false);

  // Task creation states
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('EMP-004'); // default John Doe

  // Task details viewer modal state
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const employees = [
    { id: 'EMP-004', name: 'John Doe' },
    { id: 'EMP-005', name: 'Mayank Khandelwal' },
    { id: 'EMP-006', name: 'Jane Smith' },
  ];

  // Demo mode: local state synced with localStorage
  const [demoRequests, setDemoRequests] = useState<LeaveRequest[]>([]);
  const [demoApprovals, setDemoApprovals] = useState<LeaveRequest[]>([]);
  const [demoExpenses, setDemoExpenses] = useState<ExpenseRequest[]>([]);
  const [demoExpenseApprovals, setDemoExpenseApprovals] = useState<ExpenseRequest[]>([]);

  // Real mode: Apollo queries
  const employeeId = user?.id || '';

  const { data: myLeavesData, loading: myLeavesLoading, refetch: refetchMyLeaves } = useQuery<any, any>(GET_MY_LEAVE_REQUESTS, {
    variables: { employeeId },
    skip: !employeeId || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  const { data: pendingLeavesData, loading: pendingLeavesLoading, refetch: refetchPending } = useQuery<any, any>(GET_PENDING_LEAVE_APPROVALS, {
    variables: { managerId: employeeId },
    skip: !employeeId || !isManagement || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  const { data: myExpensesData, loading: myExpensesLoading, refetch: refetchMyExpenses } = useQuery<any, any>(GET_MY_EXPENSES, {
    variables: { employeeId },
    skip: !employeeId || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  const { data: pendingExpensesData, loading: pendingExpensesLoading, refetch: refetchPendingExpenses } = useQuery<any, any>(GET_PENDING_EXPENSE_APPROVALS, {
    variables: { managerId: employeeId },
    skip: !employeeId || !isManagement || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  // Real mode mutations
  const [approveLeave] = useMutation<any, any>(APPROVE_LEAVE_REQUEST, {
    onCompleted: () => { refetchPending(); },
  });
  const [rejectLeave] = useMutation<any, any>(REJECT_LEAVE_REQUEST, {
    onCompleted: () => { refetchPending(); },
  });
  const [cancelLeave] = useMutation<any, any>(CANCEL_LEAVE_REQUEST, {
    onCompleted: () => { refetchMyLeaves(); },
  });

  const [approveExpense] = useMutation<any, any>(APPROVE_EXPENSE, {
    onCompleted: () => { refetchPendingExpenses(); },
  });
  const [rejectExpense] = useMutation<any, any>(REJECT_EXPENSE, {
    onCompleted: () => { refetchPendingExpenses(); },
  });

  // Load demo data from shared localStorage on mount + on storage changes
  const syncDemoData = useCallback(() => {
    if (!useDemoMode) return;
    const { requests: lRequests, approvals: lApprovals } = readDemoLeaves();
    setDemoRequests(lRequests);
    setDemoApprovals(lApprovals);

    const { requests: eRequests, approvals: eApprovals } = readDemoExpenses();
    setDemoExpenses(eRequests);
    setDemoExpenseApprovals(eApprovals);
  }, [useDemoMode]);

  useEffect(() => {
    syncDemoData();
    // Listen for changes from leave & expense pages (same tab via custom events)
    const onStorage = () => syncDemoData();
    window.addEventListener('storage', onStorage);
    window.addEventListener('demo-leaves-updated', onStorage);
    window.addEventListener('demo-expenses-updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('demo-leaves-updated', onStorage);
      window.removeEventListener('demo-expenses-updated', onStorage);
    };
  }, [syncDemoData]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('dashboard-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaultTasks: TaskItem[] = [
        { id: 'task-1', title: 'Submit Q4 Self-Assessment', status: 'pending', date: 'Due by Dec 30', description: 'Review your achievements for Q4, map them to company objectives, and rate your core performance areas.', completedByIds: [], assignedToId: 'EMP-004', assignedToName: 'John Doe', createdById: 'EMP-001', createdByName: 'Manager User' },
        { id: 'task-2', title: 'Complete Compliance Training', status: 'pending', date: 'Due by Dec 31', description: 'Ensure mandatory security, code of conduct, and privacy training modules are finished to meet audit checks.', completedByIds: [], assignedToId: 'EMP-004', assignedToName: 'John Doe', createdById: 'EMP-001', createdByName: 'Manager User' },
        { id: 'task-3', title: 'Update Relocation Form', status: 'pending', date: 'Due by Jan 05', description: 'Submit relocation expense claims and supporting proof files if you relocated in the previous quarter.', completedByIds: [], assignedToId: 'EMP-005', assignedToName: 'Mayank Khandelwal', createdById: 'EMP-001', createdByName: 'Manager User' },
        { id: 'task-4', title: 'Onboarding Checklist', status: 'completed', date: 'Completed Dec 15', description: 'Initial onboarding checklist steps including IT allocation and desk setup.', completedByIds: ['EMP-004'], assignedToId: 'EMP-004', assignedToName: 'John Doe', createdById: 'EMP-001', createdByName: 'Manager User' },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('dashboard-tasks', JSON.stringify(defaultTasks));
    }
    setMounted(true);
  }, []);

  // Derive the leave list based on role + mode
  const allLeaveRequests: LeaveRequest[] = useDemoMode
    ? isManagement
      ? [
          ...demoApprovals,
          ...demoRequests.filter(r => r.employeeId === user?.id && !demoApprovals.some(a => a.id === r.id))
        ]
      : demoRequests.filter(r => r.employeeId === user?.id)
    : isManagement
      ? [
          ...(pendingLeavesData?.getPendingLeaveApprovals ?? []),
          ...(myLeavesData?.getMyLeaveRequests ?? [])
        ]
      : (myLeavesData?.getMyLeaveRequests ?? []);

  const allExpenseRequests: ExpenseRequest[] = useDemoMode
    ? isManagement
      ? [
          ...demoExpenseApprovals,
          ...demoExpenses.filter(r => r.employeeId === user?.id && !demoExpenseApprovals.some(a => a.id === r.id))
        ]
      : demoExpenses.filter(r => r.employeeId === user?.id)
    : isManagement
      ? [
          ...(pendingExpensesData?.getPendingExpenseApprovals ?? []),
          ...(myExpensesData?.getMyExpenses ?? [])
        ]
      : (myExpensesData?.getMyExpenses ?? []);

  const formatDateRange = (start: string, end: string, totalDays: number) => {
    const s = new Date(start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return s === e ? `${s}  (1 day)` : `${s} - ${e}  (${totalDays} days)`;
  };

  const normalizeStatus = (s: string, comments?: string | null): 'pending' | 'approved' | 'rejected' | 'cancelled' => {
    const lower = s.toLowerCase();
    if (lower === 'approved') return 'approved';
    if (lower === 'rejected') {
      if (comments?.toLowerCase().includes('cancel')) return 'cancelled';
      return 'rejected';
    }
    if (lower === 'cancelled') return 'cancelled';
    return 'pending';
  };

  // Filter tasks based on role:
  // - Employees only see tasks assigned to them.
  // - Management roles (HR, Manager, Admin) see tasks they created/assigned.
  const myUserId = user?.id || 'EMP-004';
  const visibleTasks = tasks.filter(t => {
    if (!isManagement) {
      return t.assignedToId === myUserId || (!t.assignedToId && myUserId === 'EMP-004'); 
    }
    // For management, only show tasks they created/assigned
    return t.createdById === myUserId || (!t.createdById && myUserId === 'EMP-001'); 
  });

  // For employees, pendingTasks lists tasks they need to complete.
  // For managers/HR/admin, they don't have pending tasks to do themselves, but they track tasks they assigned that are still pending.
  const pendingTasks = visibleTasks.filter(t => t.status === 'pending');
  const totalTasksCount = visibleTasks.length;
  // If isManagement, we display "assigned" instead of "pending" tasks to do, or 0 pending.
  const pendingTasksCount = isManagement 
    ? visibleTasks.filter(t => !t.completedByIds || t.completedByIds.length === 0).length 
    : pendingTasks.length;

  // Map to a unified activity list
  const leaveActivities = allLeaveRequests.map(r => ({
    id: r.id,
    type: 'leave' as const,
    title: `${r.leaveType} Leave`,
    employeeId: r.employeeId,
    employeeName: r.employeeName,
    dateText: formatDateRange(r.startDate, r.endDate, r.totalDays),
    detailsText: r.reason || '',
    status: r.status,
    createdAt: r.createdAt,
    originalItem: r
  }));

  const expenseActivities = allExpenseRequests.map(r => ({
    id: r.id,
    type: 'expense' as const,
    title: `Expense: ${r.category}`,
    employeeId: r.employeeId,
    employeeName: r.employeeName,
    dateText: new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    detailsText: `${r.currency} ${r.amount.toLocaleString()} - ${r.comments || ''}`,
    status: r.status,
    createdAt: r.createdAt,
    originalItem: r
  }));

  const taskActivities = visibleTasks.map(t => ({
    id: t.id,
    type: 'task' as const,
    title: `Task: ${t.title}`,
    employeeId: t.assignedToId || 'EMP-004',
    employeeName: t.assignedToName || 'John Doe',
    dateText: t.date,
    detailsText: `Instructions: ${t.description || 'No detailed instructions.'}`,
    status: t.status,
    createdAt: t.id.startsWith('task-17') ? new Date(Number(t.id.split('-')[1])).toISOString() : new Date().toISOString(), // Use creation time if generated
    originalItem: t
  }));

  const allActivities = [...leaveActivities, ...expenseActivities, ...taskActivities];
  const leavesLoading = useDemoMode ? false : (isManagement ? pendingLeavesLoading : myLeavesLoading);
  const expensesLoading = useDemoMode ? false : (isManagement ? pendingExpensesLoading : myExpensesLoading);
  const activitiesLoading = leavesLoading || expensesLoading;

  // Sort by newest first
  const sortedActivities = allActivities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const displayedActivities = showAllLeaves ? sortedActivities : sortedActivities.slice(0, 3);


  // ---- Demo mode action handlers ----
  const handleDemoCancel = (requestId: string) => {
    const req = demoRequests.find(r => r.id === requestId);
    if (!req) return;
    const nextRequests = demoRequests.map(r =>
      r.id === requestId
        ? { ...r, status: 'Rejected', approvalComments: 'Cancelled by employee' }
        : r
    );
    setDemoRequests(nextRequests);
    writeDemoLeaves({ requests: nextRequests });
    window.dispatchEvent(new Event('demo-leaves-updated'));
  };

  const handleDemoApprove = (req: LeaveRequest) => {
    const nextApprovals = demoApprovals.map(r =>
      r.id === req.id ? { ...r, status: 'Approved', approvedBy: user?.id ?? null, approvedByName: user?.name ?? null, approvedOn: new Date().toISOString() } : r
    );
    const nextRequests = demoRequests.map(r =>
      r.id === req.id ? { ...r, status: 'Approved', approvedBy: user?.id ?? null, approvedByName: user?.name ?? null, approvedOn: new Date().toISOString() } : r
    );
    setDemoApprovals(nextApprovals);
    setDemoRequests(nextRequests);
    writeDemoLeaves({ requests: nextRequests, approvals: nextApprovals });
    window.dispatchEvent(new Event('demo-leaves-updated'));
  };

  const handleDemoReject = (req: LeaveRequest) => {
    const nextApprovals = demoApprovals.map(r =>
      r.id === req.id ? { ...r, status: 'Rejected', approvalComments: 'Rejected by manager' } : r
    );
    const nextRequests = demoRequests.map(r =>
      r.id === req.id ? { ...r, status: 'Rejected', approvalComments: 'Rejected by manager' } : r
    );
    setDemoApprovals(nextApprovals);
    setDemoRequests(nextRequests);
    writeDemoLeaves({ requests: nextRequests, approvals: nextApprovals });
    window.dispatchEvent(new Event('demo-leaves-updated'));
  };

  // ---- Real mode action handlers ----
  const handleCancel = async (requestId: string) => {
    if (useDemoMode) { handleDemoCancel(requestId); return; }
    try {
      await cancelLeave({ variables: { requestId, employeeId } });
    } catch (e) { console.error(e); }
  };

  const handleApprove = async (req: LeaveRequest) => {
    if (useDemoMode) { handleDemoApprove(req); return; }
    try {
      await approveLeave({ variables: { request: { requestId: req.id, approverId: user?.id, comments: '' } } });
    } catch (e) { console.error(e); }
  };

  const handleReject = async (req: LeaveRequest) => {
    if (useDemoMode) { handleDemoReject(req); return; }
    try {
      await rejectLeave({ variables: { request: { requestId: req.id, approverId: user?.id, comments: 'Rejected' } } });
    } catch (e) { console.error(e); }
  };

  // ---- Demo mode expense action handlers ----
  const handleDemoCancelExpense = (expenseId: string) => {
    const nextRequests = demoExpenses.map(r =>
      r.id === expenseId ? { ...r, status: 'Rejected', comments: 'Cancelled by employee' } : r
    );
    const nextApprovals = demoExpenseApprovals.filter(r => r.id !== expenseId);
    setDemoExpenses(nextRequests);
    setDemoExpenseApprovals(nextApprovals);
    writeDemoExpenses({ requests: nextRequests, approvals: nextApprovals });
    window.dispatchEvent(new Event('demo-expenses-updated'));
  };

  const handleDemoApproveExpense = (req: ExpenseRequest) => {
    const nextRequests = demoExpenses.map(r =>
      r.id === req.id ? { ...r, status: 'Approved', approvedBy: user?.id ?? null, approvedByName: user?.name ?? null, approvedOn: new Date().toISOString() } : r
    );
    const nextApprovals = demoExpenseApprovals.filter(r => r.id !== req.id);
    setDemoExpenses(nextRequests);
    setDemoExpenseApprovals(nextApprovals);
    writeDemoExpenses({ requests: nextRequests, approvals: nextApprovals });
    window.dispatchEvent(new Event('demo-expenses-updated'));
  };

  const handleDemoRejectExpense = (req: ExpenseRequest) => {
    const nextRequests = demoExpenses.map(r =>
      r.id === req.id ? { ...r, status: 'Rejected', comments: 'Rejected by manager' } : r
    );
    const nextApprovals = demoExpenseApprovals.filter(r => r.id !== req.id);
    setDemoExpenses(nextRequests);
    setDemoExpenseApprovals(nextApprovals);
    writeDemoExpenses({ requests: nextRequests, approvals: nextApprovals });
    window.dispatchEvent(new Event('demo-expenses-updated'));
  };

  // ---- Real mode expense action handlers ----
  const handleCancelExpense = async (expenseId: string) => {
    if (useDemoMode) { handleDemoCancelExpense(expenseId); return; }
    console.warn("Cancel Expense is not supported in real mode schema");
  };

  const handleApproveExpense = async (req: ExpenseRequest) => {
    if (useDemoMode) { handleDemoApproveExpense(req); return; }
    try {
      await approveExpense({ variables: { expenseId: req.id, approverId: user?.id, comments: '' } });
    } catch (e) { console.error(e); }
  };

  const handleRejectExpense = async (req: ExpenseRequest) => {
    if (useDemoMode) { handleDemoRejectExpense(req); return; }
    try {
      await rejectExpense({ variables: { expenseId: req.id, approverId: user?.id, comments: 'Rejected' } });
    } catch (e) { console.error(e); }
  };

  const handleCompleteTask = (id: string) => {
    const activeUserId = user?.id || 'EMP-004';
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          const alreadyCompleted = t.completedByIds || [];
          const updatedCompleted = alreadyCompleted.includes(activeUserId) 
            ? alreadyCompleted 
            : [...alreadyCompleted, activeUserId];
          return {
            ...t,
            status: 'completed' as const,
            completedByIds: updatedCompleted
          };
        }
        return t;
      });
      localStorage.setItem('dashboard-tasks', JSON.stringify(next));
      return next;
    });
    // If the currently viewed details modal is for this task, update it
    setSelectedTask(prev => prev && prev.id === id ? { ...prev, status: 'completed' as const, completedByIds: [...(prev.completedByIds || []), activeUserId] } : prev);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem('dashboard-tasks', JSON.stringify(next));
      return next;
    });
    setSelectedTask(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDate) {
      alert("Please fill all task fields.");
      return;
    }

    const assignedEmployee = employees.find(emp => emp.id === newTaskAssigneeId);

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      status: 'pending',
      date: `Due by ${new Date(newTaskDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`,
      assignedToId: newTaskAssigneeId,
      assignedToName: assignedEmployee?.name || 'Unknown',
      description: newTaskDescription,
      completedByIds: [],
      createdById: user?.id || 'EMP-001',
      createdByName: user?.name || 'Manager User',
    };

    setTasks(prev => {
      const next = [newTask, ...prev];
      localStorage.setItem('dashboard-tasks', JSON.stringify(next));
      return next;
    });

    // Reset inputs
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDate('');
    setNewTaskAssigneeId('EMP-004');
    setShowCreateTaskModal(false);
  };



  if (!mounted) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="h-24 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back! Here is what is happening with your work today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Quick Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Attendance"
            value="95%"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="teal"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Tasks"
            value={totalTasksCount.toString()}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            color="orange"
            subtitle={isManagement ? `${pendingTasksCount} active` : `${pendingTasksCount} pending`}
          />
        </div>
      </div>

      {/* Recent Activity + Pending Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Activity — Leave & Expense Requests with Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Recent Activity
            </h2>
            {sortedActivities.length > 3 && (
              <button
                onClick={() => setShowAllLeaves(v => !v)}
                className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                {showAllLeaves ? 'Show less' : `View all (${sortedActivities.length})`}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllLeaves ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {activitiesLoading ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 text-xs text-zinc-400 text-center animate-pulse h-20" />
            ) : displayedActivities.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center space-y-2 min-h-[80px]">
                <Calendar className="w-7 h-7 text-zinc-300" />
                <span>No recent activity</span>
              </div>
            ) : (
              displayedActivities.map((act) => {
                const item = act.originalItem as any;
                const comments = item.comments || item.approvalComments;
                const status = normalizeStatus(act.status, comments);
                const isPending = act.status.toLowerCase() === 'pending';
                const isPersonal = useDemoMode ? !isManagement : act.employeeId === user?.id;
                return (
                  <div
                    key={act.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-soft space-y-2"
                  >
                    {/* Header: type + status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                          {act.title}
                        </p>
                        {!isPersonal && (
                          <p className="text-xs text-orange-500 font-medium truncate">{act.employeeName}</p>
                        )}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {act.dateText}
                        </p>
                        {act.detailsText && (
                          <p className="text-xs text-zinc-400 truncate mt-0.5 italic">{act.detailsText}</p>
                        )}
                      </div>
                      <StatusBadge status={status} size="sm" />
                    </div>

                    {/* Action buttons — only for pending */}
                    {isPending && (
                      <div className="flex gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        {act.type === 'task' ? (
                          <>
                            <button
                              onClick={() => setSelectedTask(act.originalItem as any)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-850 dark:border-zinc-700 dark:text-zinc-300 transition-colors"
                            >
                              Details
                            </button>
                            {isManagement && (
                              <>
                                <button
                                  onClick={() => setSelectedTask(act.originalItem as any)}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
                                >
                                  Check Status
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(act.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        ) : isPersonal ? (
                          <button
                            onClick={() => act.type === 'leave' ? handleCancel(act.id) : handleCancelExpense(act.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-850 dark:border-zinc-700 dark:text-zinc-300 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel Request
                          </button>
                        ) : isManagement ? (
                          <>
                            <button
                              onClick={() => act.type === 'leave' ? handleApprove(act.originalItem as any) : handleApproveExpense(act.originalItem as any)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/30 dark:text-teal-400 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => act.type === 'leave' ? handleReject(act.originalItem as any) : handleRejectExpense(act.originalItem as any)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending / Assigned Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {isManagement ? 'Assigned Tasks' : 'Pending Tasks'}
            </h2>
            {isManagement && (
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Assign Task
              </button>
            )}
          </div>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
                <CheckCircle2 className="w-8 h-8 text-teal-500" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {isManagement ? 'No pending assignments' : 'All tasks completed!'}
                </span>
                <span>
                  {isManagement ? 'Click "Assign Task" to create one.' : 'You are completely caught up.'}
                </span>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-soft flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{task.date}</span>
                      </div>
                      {task.assignedToName && (
                        <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-600 dark:text-zinc-300 font-medium">
                          Assigned to: {task.assignedToName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold"
                    >
                      Details
                    </button>
                    {!isManagement ? (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-all"
                      >
                        Complete
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold"
                        >
                          Check Status
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ModuleCard
            title="Mark Attendance"
            description="Clock in for today"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="teal"
            onClick={() => router.push('/attendance')}
          />
          <ModuleCard
            title="Request Leave"
            description="Submit a new leave request"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="orange"
            onClick={() => router.push('/leave')}
          />
        </div>
      </div>

      {/* Assign Task Modal */}
      {showCreateTaskModal && (
        <FormModal
          title="Assign New Task"
          isOpen={showCreateTaskModal}
          onClose={() => {
            setShowCreateTaskModal(false);
            setNewTaskTitle('');
            setNewTaskDate('');
            setNewTaskAssigneeId('EMP-004');
          }}
        >
          <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Task Description / Title
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Complete compliance module"
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Detailed Instructions
              </label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Describe detailed steps or instructions for the assignee..."
                rows={3}
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Assign to Employee
              </label>
              <select
                value={newTaskAssigneeId}
                onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Assign Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateTaskModal(false);
                  setNewTaskTitle('');
                  setNewTaskDate('');
                  setNewTaskAssigneeId('EMP-004');
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </FormModal>
      )}

      {/* Task Details and Status Auditing Modal */}
      {selectedTask && (
        <FormModal
          title="Task Overview & Details"
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        >
          <div className="space-y-4 pt-2 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-500">Task Title:</span>
                <span className="font-bold text-zinc-950 dark:text-zinc-50">{selectedTask.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-500">Timeline:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">{selectedTask.date}</span>
              </div>
              {selectedTask.assignedToName && (
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-500">Assigned To:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{selectedTask.assignedToName} ({selectedTask.assignedToId})</span>
                </div>
              )}
            </div>

            {selectedTask.description && (
              <div className="space-y-1">
                <span className="block font-semibold text-zinc-500">Detailed Instructions:</span>
                <p className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg italic">
                  "{selectedTask.description}"
                </p>
              </div>
            )}

            {/* Audit view for Managers/HR/Admin: show who completed it */}
            {isManagement ? (
              <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                <span className="block font-semibold text-zinc-500">Completion Status:</span>
                {(!selectedTask.completedByIds || selectedTask.completedByIds.length === 0) ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Not Completed Yet
                  </span>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Completed by employee:
                    </span>
                    <ul className="list-disc pl-5 text-xs space-y-0.5">
                      {selectedTask.completedByIds.map(id => {
                        const matchedEmp = employees.find(e => e.id === id);
                        return (
                          <li key={id} className="font-medium text-zinc-900 dark:text-zinc-100">
                            {matchedEmp ? matchedEmp.name : "Employee"} ({id})
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                <span className="block font-semibold text-zinc-500">Your Action:</span>
                {selectedTask.completedByIds?.includes(user?.id || 'EMP-004') ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    You Marked Completed
                  </span>
                ) : (
                  <button
                    onClick={() => handleCompleteTask(selectedTask.id)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Mark Complete Now
                  </button>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedTask(null)}
                className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
