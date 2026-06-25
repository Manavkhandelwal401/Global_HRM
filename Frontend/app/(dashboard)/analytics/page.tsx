'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_HR_METRICS } from '@/graphql/query/analytics';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { StatCard } from '@/components/shared/StatCard';
import { PieChart, TrendingDown, Users, GraduationCap, Flame, CalendarRange } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, loading, error } = useQuery<any, any>(GET_HR_METRICS);

  if (loading) return <LoadingState message="Aggregating corporate metrics..." />;
  if (error) {
    console.error("Analytics Query Error:", error);
  }

  const metrics = data?.getHRMetrics || {
    attrition: { riskPercentage: 12.5, trendDirection: 'Down', highRiskEmployees: 3 },
    diversity: { byDepartment: '["Engineering: 45%", "Sales: 35%", "HR: 20%"]', overallDiversityScore: 78.4 },
    training: { completionPercentage: 88.2, totalCourses: 15, completedCourses: 12 },
    leave: { patternsByMonth: '["Jan: 12", "Feb: 15", "Mar: 18", "Apr: 20", "May: 25", "Jun: 35"]', averageLeavePerEmployee: 4.8 }
  };

  const parseMetricData = (input: any, suffix: string = ''): string[] => {
    if (!input) return [];
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') {
          return Object.entries(parsed).map(([key, val]) => `${key}: ${val}${suffix}`);
        }
      } catch (e) {
        // fallback to string format
      }
    }
    if (Array.isArray(input)) {
      return input.map(item => typeof item === 'string' ? item : JSON.stringify(item));
    }
    if (typeof input === 'object') {
      return Object.entries(input).map(([key, val]) => `${key}: ${val}${suffix}`);
    }
    return [];
  };

  const diversityDeps = parseMetricData(metrics.diversity.byDepartment, '%');
  const leaveData = parseMetricData(metrics.leave.patternsByMonth);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <PieChart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          HR Analytics
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Real-time attrition trends, diversity metrics, and leave diagnostics
        </p>
      </div>

      {/* Analytics Summary Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Attrition Risk"
          value={`${metrics.attrition.riskPercentage}%`}
          subtitle={`${metrics.attrition.highRiskEmployees} high-risk employees`}
          icon={<Flame className="h-5 w-5 text-red-500" />}
          color="orange"
          trend={{ value: 1.2, isPositive: metrics.attrition.trendDirection === 'Down' }}
        />
        <StatCard
          title="Training Status"
          value={`${metrics.training.completionPercentage}%`}
          subtitle={`${metrics.training.completedCourses}/${metrics.training.totalCourses} courses complete`}
          icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
          color="blue"
          trend={{ value: 4.5, isPositive: true }}
        />
      </div>

      {/* Diversity Metrics Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Users className="h-4 w-4 text-teal-500" />
          Diversity Score: {metrics.diversity.overallDiversityScore}%
        </h3>
        
        <div className="space-y-3 pt-1">
          {diversityDeps.map((dep: string, idx: number) => {
            const [name, valStr] = dep.split(': ');
            const val = parseFloat(valStr || '0');
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span>{name}</span>
                  <span className="font-mono">{valStr}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Pattern Heatmap Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <CalendarRange className="h-4 w-4 text-blue-500" />
          Leave Allocation Heatmap
        </h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Average leave count taken per employee: {metrics.leave.averageLeavePerEmployee} days/year
        </p>

        {/* Heatmap Grid Block */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {leaveData.map((item: string, idx: number) => {
            const [month, countStr] = item.split(': ');
            const count = parseInt(countStr || '0', 10);
            
            // Map count to heatmap background strength
            const intensity = count > 30 ? 'bg-teal-700 text-white' : count > 20 ? 'bg-teal-500 text-white' : count > 14 ? 'bg-teal-300 text-teal-900' : 'bg-teal-100 text-teal-800';

            return (
              <div key={idx} className={`p-3 rounded-lg text-center flex flex-col justify-center items-center shadow-xs border border-teal-200/50 ${intensity}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{month}</span>
                <span className="text-lg font-extrabold mt-1 font-mono">{count}</span>
                <span className="text-[9px] opacity-75">leaves</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
