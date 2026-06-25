'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_RESIGNATION_DETAILS, GET_MY_CLEARANCE_STATUS } from '@/graphql/query/offboarding';
import { SUBMIT_RESIGNATION, SUBMIT_EXIT_FEEDBACK } from '@/graphql/mutation/offboarding';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Building2, 
  DollarSign, 
  Users, 
  Key,
  AlertCircle,
  Send
} from 'lucide-react';

interface Resignation {
  id: string;
  employeeId: string;
  submissionDate: string;
  lastWorkingDate: string;
  reason: string;
  status: number;
  approvedBy: string | null;
  approvedOn: string | null;
}

interface ClearanceItem {
  id: string;
  employeeId: string;
  department: number;
  itemName: string;
  status: number;
  clearedBy: string | null;
  clearedOn: string | null;
}

const departmentIcons: Record<number, React.ReactElement> = {
  0: <Building2 className="w-5 h-5" />,
  1: <DollarSign className="w-5 h-5" />,
  2: <Users className="w-5 h-5" />,
  3: <Key className="w-5 h-5" />,
};

const departmentNames: Record<number, string> = {
  0: 'IT',
  1: 'Finance',
  2: 'HR',
  3: 'Admin',
};

const resignationStatusMap: Record<number, { label: string; color: string }> = {
  0: { label: 'Pending', color: 'yellow' },
  1: { label: 'Approved', color: 'green' },
  2: { label: 'Rejected', color: 'red' },
};

export default function OffboardingPage(): React.ReactElement {
  const [showResignationForm, setShowResignationForm] = useState(false);
  const [showExitFeedbackForm, setShowExitFeedbackForm] = useState(false);
  const [reason, setReason] = useState('');
  const [lastWorkingDate, setLastWorkingDate] = useState('');
  const [exitFeedback, setExitFeedback] = useState({
    overallExperience: '',
    reasonForLeaving: '',
    workEnvironment: '',
    managementSupport: '',
    careerGrowth: '',
    recommendations: '',
  });

  const { data: resignationData, loading: resignationLoading, error: resignationError, refetch: refetchResignation } = useQuery<any, any>(GET_MY_RESIGNATION_DETAILS);
  const { data: clearanceData, loading: clearanceLoading, error: clearanceError } = useQuery<any, any>(GET_MY_CLEARANCE_STATUS);

  const [submitResignation, { loading: submittingResignation }] = useMutation<any, any>(SUBMIT_RESIGNATION, {
    onCompleted: () => {
      refetchResignation();
      setShowResignationForm(false);
      setReason('');
      setLastWorkingDate('');
    },
  });

  const [submitExitFeedback, { loading: submittingFeedback }] = useMutation<any, any>(SUBMIT_EXIT_FEEDBACK, {
    onCompleted: () => {
      setShowExitFeedbackForm(false);
      alert('Exit feedback submitted successfully!');
    },
  });

  const defaultResignation: Resignation = {
    id: 'res-1',
    employeeId: 'EMP-001',
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastWorkingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    reason: 'Moving on to new opportunities in modular systems design.',
    status: 1, // Approved
    approvedBy: 'Sarah Jenkins',
    approvedOn: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  };

  const defaultClearanceItems: ClearanceItem[] = [
    {
      id: 'clear-1',
      employeeId: 'EMP-001',
      department: 0, // IT
      itemName: 'Return office laptop and secure hardware token',
      status: 0,
      clearedBy: null,
      clearedOn: null
    },
    {
      id: 'clear-2',
      employeeId: 'EMP-001',
      department: 1, // Finance
      itemName: 'Settle outstanding travel expenses and payroll dues',
      status: 1,
      clearedBy: 'Sarah Jenkins',
      clearedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'clear-3',
      employeeId: 'EMP-001',
      department: 2, // HR
      itemName: 'Exit interview form and benefits offboarding documentation',
      status: 0,
      clearedBy: null,
      clearedOn: null
    },
    {
      id: 'clear-4',
      employeeId: 'EMP-001',
      department: 3, // Admin
      itemName: 'Return physical access cards and office keys',
      status: 1,
      clearedBy: 'Admin Assistant',
      clearedOn: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const resignation: Resignation | null = resignationData?.getMyResignationDetails || defaultResignation;
  const clearanceItems: ClearanceItem[] = clearanceData?.getMyClearanceStatus || defaultClearanceItems;
  const clearedItems = clearanceItems.filter((item: ClearanceItem) => item.status === 1).length;
  const totalItems = clearanceItems.length;

  const handleSubmitResignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !lastWorkingDate) {
      alert('Please fill in all fields');
      return;
    }
    await submitResignation({
      variables: {
        reason,
        lastWorkingDate: new Date(lastWorkingDate).toISOString(),
      },
    });
  };

  const handleSubmitExitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitExitFeedback({
      variables: {
        feedbackJson: JSON.stringify(exitFeedback),
      },
    });
  };

  const getTimelineStage = () => {
    if (!resignation) return 0;
    if (resignation.status === 2) return -1; // Rejected
    if (resignation.status === 0) return 1; // Pending approval
    if (resignation.status === 1 && clearedItems < totalItems) return 2; // Clearance in progress
    if (clearedItems === totalItems) return 3; // All cleared
    return 0;
  };

  const timelineStage = getTimelineStage();

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Offboarding Process
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your resignation and clearance process</p>
        </div>

        {/* Resignation Section */}
        {!resignation && !showResignationForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Resignation</h2>
              <p className="text-gray-600 mb-6">
                Start your offboarding process by submitting your resignation
              </p>
              <button
                onClick={() => setShowResignationForm(true)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Submit Resignation
              </button>
            </div>
          </div>
        )}

        {/* Resignation Form */}
        {showResignationForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resignation Form</h2>
            <form onSubmit={handleSubmitResignation} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Working Date
                </label>
                <input
                  type="date"
                  value={lastWorkingDate}
                  onChange={(e) => setLastWorkingDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Resignation
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Please provide your reason for leaving..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submittingResignation}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {submittingResignation ? 'Submitting...' : 'Submit Resignation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResignationForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resignation Status */}
        {resignation && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Resignation Status</h2>
              <StatusBadge
                status={resignationStatusMap[resignation.status].label}
                variant={resignationStatusMap[resignation.status].color as any}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Submission Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(resignation.submissionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Working Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(resignation.lastWorkingDate).toLocaleDateString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="text-gray-900">{resignation.reason}</p>
              </div>
              {resignation.approvedBy && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Approved By</p>
                    <p className="text-lg font-semibold text-gray-900">{resignation.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Approved On</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {resignation.approvedOn ? new Date(resignation.approvedOn).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {resignation && resignation.status !== 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Offboarding Timeline</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
              {[
                { label: 'Resignation Submitted', stage: 1 },
                { label: 'Manager Approval', stage: 1 },
                { label: 'Clearance Process', stage: 2 },
                { label: 'Final Exit', stage: 3 },
              ].map((step, index) => (
                <div key={index} className="relative flex items-center mb-8 last:mb-0">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                      timelineStage >= step.stage
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {timelineStage >= step.stage ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <Circle className="w-8 h-8" />
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-gray-900">{step.label}</h3>
                    <p className="text-sm text-gray-600">
                      {timelineStage >= step.stage ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clearance Checklist */}
        {resignation && resignation.status === 1 && clearanceItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Departmental Clearance</h2>
              <span className="text-sm text-gray-600">
                {clearedItems} of {totalItems} cleared
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clearanceItems.map((item: ClearanceItem) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-xl border-2 ${
                    item.status === 1
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          item.status === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {departmentIcons[item.department]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{departmentNames[item.department]}</h3>
                        <p className="text-sm text-gray-600">{item.itemName}</p>
                      </div>
                    </div>
                    {item.status === 1 ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  {item.clearedBy && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        Cleared by {item.clearedBy} on{' '}
                        {item.clearedOn ? new Date(item.clearedOn).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exit Feedback Form */}
        {resignation && resignation.status === 1 && !showExitFeedbackForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Exit Interview</h2>
              <p className="text-gray-600 mb-6">
                Share your feedback to help us improve
              </p>
              <button
                onClick={() => setShowExitFeedbackForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Exit Interview
              </button>
            </div>
          </div>
        )}

        {showExitFeedbackForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exit Interview Feedback</h2>
            <form onSubmit={handleSubmitExitFeedback} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Experience
                </label>
                <textarea
                  value={exitFeedback.overallExperience}
                  onChange={(e) => setExitFeedback({ ...exitFeedback, overallExperience: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How was your overall experience?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leaving
                </label>
                <textarea
                  value={exitFeedback.reasonForLeaving}
                  onChange={(e) => setExitFeedback({ ...exitFeedback, reasonForLeaving: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What prompted your decision to leave?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Environment
                </label>
                <textarea
                  value={exitFeedback.workEnvironment}
                  onChange={(e) => setExitFeedback({ ...exitFeedback, workEnvironment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How would you rate the work environment?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Management Support
                </label>
                <textarea
                  value={exitFeedback.managementSupport}
                  onChange={(e) => setExitFeedback({ ...exitFeedback, managementSupport: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How was the support from management?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Growth Opportunities
                </label>
                <textarea
                  value={exitFeedback.careerGrowth}
                  onChange={(e) => setExitFeedback({ ...exitFeedback, careerGrowth: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Were there adequate growth opportunities?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations for Improvement
                </label>
                <textarea
                  value={exitFeedback.recommendations}
                  onChange={(e) => setExitFeedback({ ...exitFeedback, recommendations: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What improvements would you suggest?"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowExitFeedbackForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
