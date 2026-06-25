'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  GET_PENDING_OFFBOARDING_REQUESTS, 
  GET_ALL_CLEARANCE_ITEMS,
  GET_EXIT_INTERVIEW 
} from '@/graphql/query/offboarding';
import { 
  UPDATE_RESIGNATION_STATUS, 
  TOGGLE_CLEARANCE_STATUS 
} from '@/graphql/mutation/offboarding';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Building2,
  DollarSign,
  Users,
  Key
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

interface ExitInterview {
  id: string;
  employeeId: string;
  feedbackJson: string;
  createdAt: string;
}

const departmentIcons: Record<number, React.ReactElement> = {
  0: <Building2 className="w-4 h-4" />,
  1: <DollarSign className="w-4 h-4" />,
  2: <Users className="w-4 h-4" />,
  3: <Key className="w-4 h-4" />,
};

const departmentNames: Record<number, string> = {
  0: 'IT',
  1: 'Finance',
  2: 'HR',
  3: 'Admin',
};

export default function OffboardingTrackerPage(): React.ReactElement {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState<Resignation | null>(null);
  const [newLastWorkingDate, setNewLastWorkingDate] = useState('');
  const [showExitFeedback, setShowExitFeedback] = useState(false);

  const { data: resignationsData, loading: resignationsLoading, error: resignationsError, refetch: refetchResignations } = useQuery<any, any>(GET_PENDING_OFFBOARDING_REQUESTS);
  
  const { data: clearanceData, loading: clearanceLoading, refetch: refetchClearance } = useQuery<any, any>(
    GET_ALL_CLEARANCE_ITEMS,
    {
      variables: { employeeId: selectedEmployeeId || '' },
      skip: !selectedEmployeeId,
    }
  );

  const { data: exitInterviewData, refetch: refetchExitInterview } = useQuery<any, any>(
    GET_EXIT_INTERVIEW,
    {
      variables: { employeeId: selectedEmployeeId || '' },
      skip: !selectedEmployeeId,
    }
  );

  const [updateResignationStatus] = useMutation<any, any>(UPDATE_RESIGNATION_STATUS, {
    onCompleted: () => {
      refetchResignations();
      setShowApprovalModal(false);
      setSelectedResignation(null);
      setNewLastWorkingDate('');
    },
  });

  const [toggleClearanceStatus] = useMutation<any, any>(TOGGLE_CLEARANCE_STATUS, {
    onCompleted: () => {
      refetchClearance();
    },
  });

  const defaultResignations: Resignation[] = [
    {
      id: 'res-1',
      employeeId: 'EMP-002',
      submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastWorkingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Pursuing academic research opportunities full-time.',
      status: 0, // Pending
      approvedBy: null,
      approvedOn: null
    }
  ];

  const defaultClearanceItems: ClearanceItem[] = [
    {
      id: 'clear-1',
      employeeId: 'EMP-002',
      department: 0, // IT
      itemName: 'Laptop Return & Hardware Check',
      status: 0,
      clearedBy: null,
      clearedOn: null
    },
    {
      id: 'clear-2',
      employeeId: 'EMP-002',
      department: 1, // Finance
      itemName: 'Final Settlement Auditing',
      status: 0,
      clearedBy: null,
      clearedOn: null
    }
  ];

  const defaultExitFeedback = {
    overallExperience: 'Great learning experience overall, but the developer onboarding documentation could be improved.',
    reasonForLeaving: 'Going back to university for postgraduate studies.',
    workEnvironment: 'Excellent and highly collaborative.',
    managementSupport: 'Very supportive manager.',
    careerGrowth: 'Decent growth opportunities.',
    recommendations: 'Add more modular architectural diagrams to help newcomers.',
  };

  const defaultExitInterview: ExitInterview = {
    id: 'exit-1',
    employeeId: 'EMP-002',
    feedbackJson: JSON.stringify(defaultExitFeedback),
    createdAt: new Date().toISOString()
  };

  const resignations: Resignation[] = resignationsData?.getPendingOffboardingRequests || defaultResignations;
  const clearanceItems: ClearanceItem[] = clearanceData?.getAllClearanceItems || (selectedEmployeeId ? defaultClearanceItems : []);
  const exitInterview: ExitInterview | null = exitInterviewData?.getExitInterview || (selectedEmployeeId ? defaultExitInterview : null);

  const handleApprove = (resignation: Resignation) => {
    setSelectedResignation(resignation);
    setNewLastWorkingDate(resignation.lastWorkingDate.split('T')[0]);
    setShowApprovalModal(true);
  };

  const handleReject = async (resignationId: string) => {
    if (confirm('Are you sure you want to reject this resignation?')) {
      await updateResignationStatus({
        variables: {
          resignationId,
          status: 'Rejected',
          lastWorkingDate: null,
        },
      });
    }
  };

  const confirmApproval = async () => {
    if (!selectedResignation) return;
    await updateResignationStatus({
      variables: {
        resignationId: selectedResignation.id,
        status: 'Approved',
        lastWorkingDate: new Date(newLastWorkingDate).toISOString(),
      },
    });
  };

  const handleToggleClearance = async (clearanceId: string, currentStatus: number) => {
    await toggleClearanceStatus({
      variables: {
        clearanceId,
        isCleared: currentStatus === 0,
      },
    });
  };

  const handleViewDetails = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setShowExitFeedback(false);
  };

  const handleViewExitFeedback = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setShowExitFeedback(true);
    refetchExitInterview();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Offboarding Tracker
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage resignation approvals and clearance processes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Resignations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Resignation Approvals</h2>
              
              {resignations.length === 0 ? (
                <EmptyState
                  title="No pending resignations"
                  description="All resignation requests have been processed"
                />
              ) : (
                <div className="space-y-4">
                  {resignations.map((resignation: Resignation) => (
                    <div
                      key={resignation.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Employee ID: {resignation.employeeId}</h3>
                            <p className="text-sm text-gray-600">
                              Submitted on {new Date(resignation.submissionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status="Pending" variant="yellow" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Last Working Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-900">
                              {new Date(resignation.lastWorkingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Reason</p>
                        <p className="text-gray-900">{resignation.reason}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(resignation)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(resignation.id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleViewDetails(resignation.employeeId)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Clearance
                        </button>
                        <button
                          onClick={() => handleViewExitFeedback(resignation.employeeId)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clearance Status Panel */}
          <div className="lg:col-span-1">
            {selectedEmployeeId && !showExitFeedback && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Clearance Status</h2>
                  <button
                    onClick={() => setSelectedEmployeeId(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                  <p className="font-semibold text-gray-900">{selectedEmployeeId}</p>
                </div>

                {clearanceLoading ? (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-gray-600">Loading clearance items...</p>
                  </div>
                ) : clearanceItems.length === 0 ? (
                  <EmptyState
                    title="No clearance items"
                    description="Clearance items will appear here"
                  />
                ) : (
                  <div className="space-y-3">
                    {clearanceItems.map((item: ClearanceItem) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 ${
                          item.status === 1
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                item.status === 1
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {departmentIcons[item.department]}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {departmentNames[item.department]}
                            </span>
                          </div>
                          <button
                            onClick={() => handleToggleClearance(item.id, item.status)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.status === 1
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                            }`}
                          >
                            {item.status === 1 ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{item.itemName}</p>
                        {item.clearedBy && (
                          <p className="text-xs text-gray-500 mt-2">
                            Cleared by {item.clearedBy}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Exit Feedback Panel */}
            {selectedEmployeeId && showExitFeedback && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Exit Interview Feedback</h2>
                  <button
                    onClick={() => setShowExitFeedback(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {exitInterview ? (
                  <div className="space-y-4">
                    {Object.entries(JSON.parse(exitInterview.feedbackJson)).map(([key, value]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-gray-900">{value as string || 'No response'}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Submitted on {new Date(exitInterview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No feedback submitted"
                    description="Exit interview feedback has not been submitted yet"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedResignation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Approve Resignation</h2>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Employee ID: <span className="font-semibold text-gray-900">{selectedResignation.employeeId}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust Last Working Date (Optional)
                </label>
                <input
                  type="date"
                  value={newLastWorkingDate}
                  onChange={(e) => setNewLastWorkingDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmApproval}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Approval
                </button>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedResignation(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
