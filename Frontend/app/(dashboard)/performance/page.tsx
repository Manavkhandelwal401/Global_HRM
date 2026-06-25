'use client';

import React, { useState } from 'react';
import { Target, Calendar, Award, CheckCircle2, AlertCircle, Edit, Star, Sparkles, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  progressPercentage: number;
  status: string;
  dueDate?: string;
}

interface PerformanceReview {
  id: string;
  period: string;
  rating: number;
  strengths?: string;
  improvements?: string;
  reviewerName: string;
  reviewDate?: string;
}

export default function PerformancePage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Increase Sales Revenue by 20%',
      targetValue: 100000,
      currentValue: 75000,
      progressPercentage: 75,
      status: 'InProgress',
      dueDate: '2024-12-31'
    },
    {
      id: '2',
      title: 'Complete Product Launch',
      targetValue: 100,
      currentValue: 85,
      progressPercentage: 85,
      status: 'InProgress',
      dueDate: '2024-11-30'
    }
  ]);

  const [reviews] = useState<PerformanceReview[]>([
    {
      id: '1',
      period: 'Q3 2024',
      rating: 4.5,
      strengths: 'Excellent leadership and communication skills',
      improvements: 'Could improve time management',
      reviewerName: 'John Manager',
      reviewDate: '2024-09-30'
    }
  ]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newValue, setNewValue] = useState('');

  const handleUpdateProgress = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewValue(goal.currentValue.toString());
    setShowUpdateModal(true);
  };

  const submitUpdate = () => {
    if (selectedGoal) {
      const val = parseFloat(newValue) || 0;
      setGoals(prev => prev.map(g => {
        if (g.id === selectedGoal.id) {
          const progress = Math.min(100, Math.round((val / g.targetValue) * 100));
          const updatedStatus = progress === 100 ? 'Completed' : 'InProgress';
          return { 
            ...g, 
            currentValue: val, 
            progressPercentage: progress,
            status: updatedStatus
          };
        }
        return g;
      }));
    }
    setShowUpdateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Performance Management
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track and manage your goals, OKRs, and performance reviews
        </p>
      </div>

        {/* Goals Section */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">My Goals & OKRs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800 rounded-xl p-5 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">{goal.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      goal.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30'
                    }`}>
                      {goal.status === 'Completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-indigo-500" /> Progress: {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}</span>
                      <span>{goal.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateProgress(goal)}
                  className="mt-5 w-full px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-all duration-200 text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Update Progress
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Reviews Section */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Performance Reviews</h2>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{review.period}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Reviewed by: {review.reviewerName}</p>
                    {review.reviewDate && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Date: {new Date(review.reviewDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1.5 rounded-xl">
                    <Star className="h-4 w-4 text-indigo-500 fill-indigo-500 dark:text-indigo-400 dark:fill-indigo-400" />
                    <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">{review.rating}</span>
                    <span className="text-xs text-indigo-500/70 dark:text-indigo-400/70">/ 5.0</span>
                  </div>
                </div>

                {review.strengths && (
                  <div className="mt-3 p-3 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-lg">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Strengths:
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{review.strengths}</p>
                  </div>
                )}

                {review.improvements && (
                  <div className="mt-3 p-3 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-lg">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      Areas for Improvement:
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{review.improvements}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Update Progress Modal */}
        {showUpdateModal && selectedGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Update Goal Progress</h3>
              <p className="text-gray-600 mb-4">{selectedGoal.title}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value (Target: {selectedGoal.targetValue})
                </label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current value"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitUpdate}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

// Made with Bob