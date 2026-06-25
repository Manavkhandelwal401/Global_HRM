'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  GET_ALL_SERVICE_REQUESTS, 
  ASSIGN_SERVICE_REQUEST, 
  RESOLVE_SERVICE_REQUEST 
} from '@/graphql/serviceRequests';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Headphones, 
  Filter,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  X
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedToId: string | null;
  assignedToName: string | null;
  resolutionComments: string | null;
  createdAt: string;
  updatedAt: string;
}

const categoryOptions = ['All', 'IT', 'HR', 'Finance', 'Facilities'];
const statusOptions = ['All', 'Open', 'InProgress', 'Resolved', 'Closed'];
const priorityOptions = ['All', 'Low', 'Medium', 'High'];

const statusVariants: Record<string, string> = {
  Open: 'info',
  InProgress: 'warning',
  Resolved: 'success',
  Closed: 'default',
};

const priorityVariants: Record<string, string> = {
  Low: 'default',
  Medium: 'warning',
  High: 'error',
};

export default function RequestsTrackerPage(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [assigneeId, setAssigneeId] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [resolutionComments, setResolutionComments] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error, refetch } = useQuery<any, any>(GET_ALL_SERVICE_REQUESTS, {
    variables: {
      category: selectedCategory === 'All' ? null : selectedCategory,
      status: selectedStatus === 'All' ? null : selectedStatus,
      priority: selectedPriority === 'All' ? null : selectedPriority,
    },
  });

  const [assignRequest, { loading: assigning }] = useMutation<any, any>(ASSIGN_SERVICE_REQUEST, {
    onCompleted: () => {
      refetch();
      setShowAssignModal(false);
      setSelectedRequest(null);
      setAssigneeId('');
      setAssigneeName('');
    },
  });

  const [resolveRequest, { loading: resolving }] = useMutation<any, any>(RESOLVE_SERVICE_REQUEST, {
    onCompleted: () => {
      refetch();
      setShowResolveModal(false);
      setSelectedRequest(null);
      setResolutionComments('');
    },
  });

  const defaultRequests: ServiceRequest[] = [
    {
      id: 'req-1',
      employeeId: 'EMP-001',
      title: 'MacBook Keyboard Replacement',
      description: 'The spacebar on my work laptop is double-typing or not registering at all.',
      category: 'IT',
      priority: 'Medium',
      status: 'InProgress',
      assignedToId: 'IT-002',
      assignedToName: 'Alex Mercer',
      resolutionComments: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-2',
      employeeId: 'EMP-004',
      title: 'New Office Chair Request',
      description: 'Need an ergonomic chair as the current one has a broken height adjustment lever.',
      category: 'Facilities',
      priority: 'Low',
      status: 'Open',
      assignedToId: null,
      assignedToName: null,
      resolutionComments: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-3',
      employeeId: 'EMP-003',
      title: 'Salary Slip Discrepancy - May 2026',
      description: 'The deduction for health insurance seems incorrect compared to the plan selection.',
      category: 'Finance',
      priority: 'High',
      status: 'Resolved',
      assignedToId: 'FIN-009',
      assignedToName: 'Sarah Jenkins',
      resolutionComments: 'Re-processed the payroll deduction and adjusted in the next cycle.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  if (loading) return <LoadingState message="Loading service requests..." />;

  const allRequests: ServiceRequest[] = data?.getAllServiceRequests || (error ? defaultRequests : []);
  
  // Filter by search term
  const filteredRequests = allRequests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !assigneeId.trim() || !assigneeName.trim()) return;

    await assignRequest({
      variables: {
        requestId: selectedRequest.id,
        assignedToId: assigneeId,
        assignedToName: assigneeName,
      },
    });
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !resolutionComments.trim()) return;

    await resolveRequest({
      variables: {
        requestId: selectedRequest.id,
        resolutionComments: resolutionComments,
      },
    });
  };

  const openRequests = filteredRequests.filter(r => r.status === 'Open');
  const inProgressRequests = filteredRequests.filter(r => r.status === 'InProgress');
  const resolvedRequests = filteredRequests.filter(r => r.status === 'Resolved');

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Headphones className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          Service Request Tracker
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage and resolve employee support tickets
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Open Requests</p>
              <p className="text-2xl font-bold text-blue-900">{openRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900">{inProgressRequests.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Resolved</p>
              <p className="text-2xl font-bold text-green-900">{resolvedRequests.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={<Headphones className="w-16 h-16" />}
          title="No Service Requests"
          description="No service requests match your current filters."
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{request.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{request.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.category} variant="info" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.priority} variant={priorityVariants[request.priority]} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} variant={statusVariants[request.status]} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {request.assignedToName || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!request.assignedToId && request.status === 'Open' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAssignModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Assign"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        {request.status === 'InProgress' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowResolveModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Resolve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Assign Request</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request
                </label>
                <p className="text-gray-900 font-medium">{selectedRequest.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee ID *
                </label>
                <input
                  type="text"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee Name *
                </label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={assigning}
                >
                  {assigning ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Resolve Request</h2>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleResolve} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request
                </label>
                <p className="text-gray-900 font-medium">{selectedRequest.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Comments *
                </label>
                <textarea
                  value={resolutionComments}
                  onChange={(e) => setResolutionComments(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe how the issue was resolved"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={resolving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={resolving}
                >
                  {resolving ? 'Resolving...' : 'Mark as Resolved'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob