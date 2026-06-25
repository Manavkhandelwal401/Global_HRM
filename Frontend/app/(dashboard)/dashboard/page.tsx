'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/shared/StatCard';
import { ModuleCard } from '@/components/shared/ModuleCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSession } from '@/context/SessionContext';
import { CheckCircle2, Calendar, Ban, UserX, Check, AlertCircle } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  date: string;
}

interface LeaveRequestItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSession();
  const currentRole = user?.role || 'Employee';
  const isManagement = currentRole === 'Manager' || currentRole === 'HR' || currentRole === 'Admin';

  // 1. Dynamic Interactive Tasks State with LocalStorage Persistence
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // 2. Dynamic Interactive Leave Request State with LocalStorage Persistence
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestItem[]>([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("dashboard-tasks");
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
      localStorage.setItem("dashboard-tasks", JSON.stringify(defaultTasks));
    }

    const savedLeaves = localStorage.getItem("dashboard-leaves");
    if (savedLeaves) {
      setLeaveRequests(JSON.parse(savedLeaves));
    } else {
      const defaultLeaves: LeaveRequestItem[] = [
        { id: 'leave-1', title: 'Leave Request', description: 'Annual leave for Dec 25-27', status: 'pending' }
      ];
      setLeaveRequests(defaultLeaves);
      localStorage.setItem("dashboard-leaves", JSON.stringify(defaultLeaves));
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        {/* Welcome Section */}
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          </div>
        </div>

        {/* Recent Activity & Pending Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-3">
              <div className="h-24 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
              <div className="h-20 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-3">
              <div className="h-20 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
              <div className="h-20 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-20 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            <div className="h-20 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleCompleteTask = (id: string) => {
    setTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, status: 'completed' as const } : t);
      localStorage.setItem("dashboard-tasks", JSON.stringify(next));
      return next;
    });
  };

  const handleUpdateLeave = (id: string, newStatus: LeaveRequestItem['status']) => {
    setLeaveRequests(prev => {
      const next = prev.map(l => l.id === id ? { ...l, status: newStatus } : l);
      localStorage.setItem("dashboard-leaves", JSON.stringify(next));
      return next;
    });
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalTasksCount = tasks.length;
  const pendingTasksCount = pendingTasks.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back! Here's what's happening with your work today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Quick Overview
        </h2>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Leave Requests (Interactive Activity) */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {leaveRequests.map((request) => (
              <div 
                key={request.id} 
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-soft space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {request.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {request.description}
                    </p>
                  </div>
                  <StatusBadge status={request.status} size="sm" />
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    {isManagement ? (
                      <>
                        <button
                          onClick={() => handleUpdateLeave(request.id, 'approved')}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-teal-50 dark:bg-teal-950/20 hover:bg-teal-100 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30 rounded-lg text-xs font-semibold transition-all duration-200"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateLeave(request.id, 'rejected')}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 rounded-lg text-xs font-semibold transition-all duration-200"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUpdateLeave(request.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold transition-all duration-200"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Cancel Leave
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 shadow-soft">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Performance Review
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Q4 2024 review completed
                  </p>
                </div>
                <StatusBadge status="completed" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Pending Tasks */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Pending Tasks
          </h2>
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
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{task.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="flex-shrink-0 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm"
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
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Quick Actions
        </h2>
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

// Made with Bob


