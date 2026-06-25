'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ONBOARDING_PROGRESS_SUMMARY } from '@/graphql/query/onboarding';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Search, Users, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

interface OnboardingProgress {
  employeeId: string;
  employeeName: string;
  department: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  startDate: string;
}

export default function OnboardingTrackerPage(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

  const { data, loading, error } = useQuery<any, any>(GET_ONBOARDING_PROGRESS_SUMMARY, {
    skip: useDemoMode,
  });

  const [demoProgress, setDemoProgress] = useState<OnboardingProgress[]>([]);

  React.useEffect(() => {
    if (!useDemoMode) return;
    const saved = localStorage.getItem("demo-onboarding-progress");
    if (saved) {
      try {
        setDemoProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse onboarding tracker progress", e);
      }
    } else {
      const baseline: OnboardingProgress[] = [
        { employeeId: 'EMP-001', employeeName: 'Admin User', department: 'Executive', totalTasks: 1, completedTasks: 1, progressPercentage: 100, startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { employeeId: 'EMP-002', employeeName: 'HR User', department: 'Human Resources', totalTasks: 2, completedTasks: 2, progressPercentage: 100, startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { employeeId: 'EMP-003', employeeName: 'Manager User', department: 'Management', totalTasks: 2, completedTasks: 1, progressPercentage: 50, startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        { employeeId: 'EMP-004', employeeName: 'John Doe', department: 'Engineering', totalTasks: 3, completedTasks: 1, progressPercentage: 33.3, startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      setDemoProgress(baseline);
      localStorage.setItem("demo-onboarding-progress", JSON.stringify(baseline));
    }
  }, [useDemoMode]);

  const allProgress: OnboardingProgress[] = useDemoMode ? demoProgress : (data?.getOnboardingProgressSummary || []);

  if (!useDemoMode && loading) return <LoadingState message="Loading progress tracker..." />;
  if (!useDemoMode && error) return <ErrorState message="Failed to load progress tracker" />;

  // Filter logic
  const filteredProgress = allProgress.filter((progress: OnboardingProgress) => {
    const matchesSearch =
      progress.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      progress.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && progress.progressPercentage === 100) ||
      (statusFilter === 'in-progress' && progress.progressPercentage < 100);

    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalEmployees = allProgress.length;
  const completedEmployees = allProgress.filter((p: OnboardingProgress) => p.progressPercentage === 100).length;
  const inProgressEmployees = totalEmployees - completedEmployees;
  const averageProgress =
    totalEmployees > 0
      ? allProgress.reduce((sum: number, p: OnboardingProgress) => sum + p.progressPercentage, 0) / totalEmployees
      : 0;

  if (allProgress.length === 0) {
    return (
      <div className="space-y-6 pb-20">
        <EmptyState
          title="No onboarding data available"
          description="New hire onboarding progress will appear here once employees start their onboarding journey."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Onboarding Tracker
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitor new hire onboarding progress across the organization</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total New Hires</p>
            <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{completedEmployees}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-gray-900">{inProgressEmployees}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg. Progress</p>
            <p className="text-3xl font-bold text-gray-900">{Math.round(averageProgress)}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'in-progress'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Progress Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProgress.map((progress: OnboardingProgress) => {
                  const isCompleted = progress.progressPercentage === 100;

                  return (
                    <tr key={progress.employeeId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {progress.employeeName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{progress.employeeName}</div>
                            <div className="text-sm text-gray-500">{progress.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{progress.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(progress.startDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {progress.completedTasks} / {progress.totalTasks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCompleted ? 'bg-success' : 'bg-primary'
                              }`}
                              style={{ width: `${progress.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {Math.round(progress.progressPercentage)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isCompleted ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProgress.length === 0 && (
            <div className="py-12">
              <EmptyState
                title="No results found"
                description="Try adjusting your search or filter criteria"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
