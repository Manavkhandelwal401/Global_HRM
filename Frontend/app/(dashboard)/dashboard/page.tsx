'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { StatCard } from '@/components/shared/StatCard';
import { ModuleCard } from '@/components/shared/ModuleCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSession } from '@/context/SessionContext';
import { CheckCircle2, Calendar, Check, Ban, X, ChevronDown } from 'lucide-react';
import { GET_MY_LEAVE_REQUESTS, GET_PENDING_LEAVE_APPROVALS } from '@/graphql/query/leave';
import { APPROVE_LEAVE_REQUEST, REJECT_LEAVE_REQUEST, CANCEL_LEAVE_REQUEST } from '@/graphql/mutation/leave';

interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  date: string;
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

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const currentRole = user?.role || 'Employee';
  const isManagement = currentRole === 'Manager' || currentRole === 'HR' || currentRole === 'Admin';
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAllLeaves, setShowAllLeaves] = useState(false);

  // Demo mode: local state synced with localStorage
  const [demoRequests, setDemoRequests] = useState<LeaveRequest[]>([]);
  const [demoApprovals, setDemoApprovals] = useState<LeaveRequest[]>([]);

  // Real mode: Apollo queries
  const employeeId = user?.id || '';

  const { data: myLeavesData, loading: myLeavesLoading, refetch: refetchMyLeaves } = useQuery(GET_MY_LEAVE_REQUESTS, {
    variables: { employeeId },
    skip: !employeeId || isManagement || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  const { data: pendingLeavesData, loading: pendingLeavesLoading, refetch: refetchPending } = useQuery(GET_PENDING_LEAVE_APPROVALS, {
    variables: { managerId: employeeId },
    skip: !employeeId || !isManagement || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  // Real mode mutations
  const [approveLeave] = useMutation(APPROVE_LEAVE_REQUEST, {
    onCompleted: () => { refetchPending(); },
  });
  const [rejectLeave] = useMutation(REJECT_LEAVE_REQUEST, {
    onCompleted: () => { refetchPending(); },
  });
  const [cancelLeave] = useMutation(CANCEL_LEAVE_REQUEST, {
    onCompleted: () => { refetchMyLeaves(); },
  });

  // Load demo data from shared localStorage on mount + on storage changes
  const syncDemoData = useCallback(() => {
    if (!useDemoMode) return;
    const { requests, approvals } = readDemoLeaves();
    setDemoRequests(requests);
    setDemoApprovals(approvals);
  }, [useDemoMode]);

  useEffect(() => {
    syncDemoData();
    // Listen for changes from leave page (same tab via custom event)
    const onStorage = () => syncDemoData();
    window.addEventListener('storage', onStorage);
    window.addEventListener('demo-leaves-updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('demo-leaves-updated', onStorage);
    };
  }, [syncDemoData]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('dashboard-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaultTasks: TaskItem[] = [
        { id: 'task-1', title: 'Submit Q4 Self-Assessment', status: 'pending', date: 'Due by Dec 30' },
        { id: 'task-2', title: 'Complete Compliance Training', status: 'pending', date: 'Due by Dec 31' },
        { id: 'task-3', title: 'Update Relocation Form', status: 'pending', date: 'Due by Jan 05' },
        { id: 'task-4', title: 'Onboarding Checklist', status: 'completed', date: 'Completed Dec 15' },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('dashboard-tasks', JSON.stringify(defaultTasks));
    }
    setMounted(true);
  }, []);

  // Derive the leave list based on role + mode
  const allLeaveRequests: LeaveRequest[] = useDemoMode
    ? isManagement
      ? demoApprovals.filter(r => r.employeeId !== user?.id)
      : demoRequests.filter(r => r.employeeId === user?.id)
    : isManagement
      ? (pendingLeavesData?.getPendingLeaveApprovals ?? [])
      : (myLeavesData?.getMyLeaveRequests ?? []);

  const leavesLoading = useDemoMode ? false : (isManagement ? pendingLeavesLoading : myLeavesLoading);

  // Sort by newest first
  const sortedLeaves = [...allLeaveRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const displayedLeaves = showAllLeaves ? sortedLeaves : sortedLeaves.slice(0, 3);

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

  const handleCompleteTask = (id: string) => {
    setTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, status: 'completed' as const } : t);
      localStorage.setItem('dashboard-tasks', JSON.stringify(next));
      return next;
    });
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalTasksCount = tasks.length;
  const pendingTasksCount = pendingTasks.length;

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
            subtitle={`${pendingTasksCount} pending`}
          />
        </div>
      </div>

      {/* Recent Activity + Pending Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Activity — Leave Requests with Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Recent Activity
            </h2>
            {sortedLeaves.length > 3 && (
              <button
                onClick={() => setShowAllLeaves(v => !v)}
                className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                {showAllLeaves ? 'Show less' : `View all (${sortedLeaves.length})`}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllLeaves ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {leavesLoading ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 text-xs text-zinc-400 text-center animate-pulse h-20" />
            ) : displayedLeaves.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center space-y-2 min-h-[80px]">
                <Calendar className="w-7 h-7 text-zinc-300" />
                <span>
                  {isManagement
                    ? 'No pending leave approvals'
                    : 'No recent leave activity'}
                </span>
              </div>
            ) : (
              displayedLeaves.map((req) => {
                const status = normalizeStatus(req.status, req.approvalComments);
                const isPending = req.status.toLowerCase() === 'pending';
                return (
                  <div
                    key={req.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-soft space-y-2"
                  >
                    {/* Header: type + status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                          {req.leaveType} Leave
                        </p>
                        {isManagement && (
                          <p className="text-xs text-orange-500 font-medium truncate">{req.employeeName}</p>
                        )}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {formatDateRange(req.startDate, req.endDate, req.totalDays)}
                        </p>
                        {req.reason && (
                          <p className="text-xs text-zinc-400 truncate mt-0.5 italic">{req.reason}</p>
                        )}
                      </div>
                      <StatusBadge status={status} size="sm" />
                    </div>

                    {/* Action buttons — only for pending */}
                    {isPending && (
                      <div className="flex gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        {isManagement ? (
                          <>
                            <button
                              onClick={() => handleApprove(req)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/30 dark:text-teal-400 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleCancel(req.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-850 dark:border-zinc-700 dark:text-zinc-300 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel Leave
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pending Tasks</h2>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center space-y-2 min-h-[120px]">
                <CheckCircle2 className="w-8 h-8 text-teal-500" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">All tasks completed!</span>
                <span>You are completely caught up.</span>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-soft flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">{task.title}</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{task.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="flex-shrink-0 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Complete
                  </button>
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
    </div>
  );
}
