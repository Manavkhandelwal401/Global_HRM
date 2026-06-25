'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSession } from '@/context/SessionContext';
import { GET_NEW_HIRE_CHECKLIST } from '@/graphql/query/onboarding';
import { TOGGLE_ONBOARDING_TASK } from '@/graphql/mutation/onboarding';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { CheckCircle2, Circle, Clock, Award } from 'lucide-react';

interface OnboardingTask {
  id: string;
  taskName: string;
  description: string;
  status: number;
  completedAt: string | null;
}

interface OnboardingProgress {
  employeeId: string;
  employeeName: string;
  department: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  startDate: string;
}

export default function OnboardingPage(): React.ReactElement {
  const { user } = useSession();
  const employeeId = user?.id || 'EMP-004';
  
  const { data, loading, error, refetch } = useQuery<any, any>(GET_NEW_HIRE_CHECKLIST, {
    variables: { employeeId },
    skip: process.env.NEXT_PUBLIC_DISABLE_AUTH === "true",
  });

  const [toggleTask] = useMutation<any, any>(TOGGLE_ONBOARDING_TASK, {
    onCompleted: () => {
      refetch();
    },
  });

  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  const [demoTasks, setDemoTasks] = useState<Record<string, OnboardingTask[]>>({});

  useEffect(() => {
    if (!useDemoMode) return;
    const saved = localStorage.getItem("demo-onboarding");
    if (saved) {
      try {
        setDemoTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse onboarding demo data", e);
      }
    } else {
      const initial: Record<string, OnboardingTask[]> = {
        "EMP-004": [
          { id: 'task-1', taskName: 'Complete HR Documentation', description: 'Fill in and upload all required tax documents and contract signatures.', status: 1, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'task-2', taskName: 'Setup Workstation & Credentials', description: 'Install required development environments and configure git access.', status: 0, completedAt: null },
          { id: 'task-3', taskName: 'Schedule Team Meet-and-Greet', description: 'Book a 15-minute quick call with each team member to introduce yourself.', status: 0, completedAt: null }
        ],
        "EMP-003": [
          { id: 'task-1', taskName: 'Management Onboarding Session', description: 'Meet with leadership team and align on department goals.', status: 0, completedAt: null },
          { id: 'task-2', taskName: 'Access Manager Dashboard', description: 'Request admin access to HR dashboard and approval workflows.', status: 1, completedAt: new Date().toISOString() }
        ],
        "EMP-002": [
          { id: 'task-1', taskName: 'HR Tools Training', description: 'Complete training for Workflow Global core system.', status: 1, completedAt: new Date().toISOString() },
          { id: 'task-2', taskName: 'Review Onboarding Dashboard', description: 'Verify new hire trackers and template layouts.', status: 1, completedAt: new Date().toISOString() }
        ],
        "EMP-001": [
          { id: 'task-1', taskName: 'System Security Alignment', description: 'Ensure SSO integration and permission matrices are validated.', status: 1, completedAt: new Date().toISOString() }
        ]
      };
      setDemoTasks(initial);
      localStorage.setItem("demo-onboarding", JSON.stringify(initial));
    }
  }, [useDemoMode]);

  const updateTrackerProgressInLocalStorage = (empId: string, updatedTasks: OnboardingTask[]) => {
    const saved = localStorage.getItem("demo-onboarding-progress");
    if (saved) {
      try {
        const progressList: OnboardingProgress[] = JSON.parse(saved);
        const completedTasks = updatedTasks.filter((t) => t.status === 1).length;
        const totalTasks = updatedTasks.length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        const nextList = progressList.map((p) => 
          p.employeeId === empId 
            ? { ...p, completedTasks, totalTasks, progressPercentage } 
            : p
        );
        localStorage.setItem("demo-onboarding-progress", JSON.stringify(nextList));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const tasks: OnboardingTask[] = useDemoMode 
    ? (demoTasks[employeeId] || []) 
    : (data?.getNewHireChecklist || []);

  const completedTasks = tasks.filter((t: OnboardingTask) => t.status === 1).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleToggleTask = async (taskId: string, currentStatus: number) => {
    const isCompleted = currentStatus === 0;

    if (useDemoMode) {
      const currentTasks = demoTasks[employeeId] || [];
      const updated = currentTasks.map((t) => 
        t.id === taskId 
          ? { ...t, status: isCompleted ? 1 : 0, completedAt: isCompleted ? new Date().toISOString() : null } 
          : t
      );
      const nextDemoTasks = {
        ...demoTasks,
        [employeeId]: updated
      };
      setDemoTasks(nextDemoTasks);
      localStorage.setItem("demo-onboarding", JSON.stringify(nextDemoTasks));
      updateTrackerProgressInLocalStorage(employeeId, updated);
      return;
    }

    await toggleTask({
      variables: {
        checklistId: taskId,
        isCompleted,
      },
    });
  };

  if (!useDemoMode && loading) return <LoadingState message="Loading checklist..." />;
  if (!useDemoMode && error) return <ErrorState message="Failed to load checklist" />;

  if (tasks.length === 0) {
    return (
      <div className="space-y-6 pb-20">
        <EmptyState
          title="No onboarding tasks found"
          description="Your onboarding checklist will appear here once it's created."
        />
      </div>
    );
  }

  const allCompleted = completedTasks === totalTasks && totalTasks > 0;

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome to Your Onboarding Journey! 🎉</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Complete these tasks to get started with your new role</p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
              <p className="text-gray-600 mt-1">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="relative w-32 h-32">
              {/* Circular Progress */}
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="var(--token-border)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={allCompleted ? 'var(--token-success)' : 'var(--token-primary)'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                allCompleted ? 'bg-success' : 'bg-primary'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {allCompleted && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Congratulations! 🎊</h3>
                <p className="text-sm text-green-700">
                  You've completed all onboarding tasks. Welcome to the team!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Checklist */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Onboarding Checklist</h2>
          
          <div className="space-y-4">
            {tasks.map((task: OnboardingTask) => {
              const isCompleted = task.status === 1;
              
              return (
                <div
                  key={task.id}
                  className={`border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isCompleted
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                  onClick={() => handleToggleTask(task.id, task.status)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-lg mb-1 ${
                          isCompleted ? 'text-green-900 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.taskName}
                      </h3>
                      <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                      
                      {task.completedAt && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            Completed on {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700">
            If you have any questions about your onboarding tasks, please reach out to your manager or HR team.
          </p>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
