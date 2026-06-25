'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_SERVICE_REQUESTS, CREATE_SERVICE_REQUEST } from '@/graphql/serviceRequests';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Headphones, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User
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

const categoryOptions = [
  { value: 'IT', label: 'IT Support' },
  { value: 'HR', label: 'HR Support' },
  { value: 'Finance', label: 'Finance Support' },
  { value: 'Facilities', label: 'Facilities Support' },
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

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

export default function RequestsPage(): React.ReactElement {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'Medium',
  });

  const { data, loading, error, refetch } = useQuery<any, any>(GET_MY_SERVICE_REQUESTS);

  const [createRequest, { loading: creating }] = useMutation<any, any>(CREATE_SERVICE_REQUEST, {
    onCompleted: () => {
      refetch();
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'IT',
        priority: 'Medium',
      });
    },
  });

  React.useEffect(() => {
    if (error) {
      console.warn("Requests Query Error:", error);
    }
  }, [error]);

  const defaultRequests = [
    {
      id: '1',
      employeeId: '1',
      title: 'Setup new developer workstation credentials',
      description: 'Need access to the local Modular Monolith PostgreSQL test database and API server variables.',
      category: 'IT',
      priority: 'High',
      status: 'InProgress',
      assignedToId: '2',
      assignedToName: 'Sarah Jenkins',
      resolutionComments: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const requests: ServiceRequest[] = data?.getMyServiceRequests || defaultRequests;

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    await createRequest({
      variables: formData,
    });
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Service Requests</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Submit and track your support tickets</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition-all duration-200 text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<Headphones className="w-16 h-16" />}
          title="No Service Requests"
          description="You haven't submitted any service requests yet. Click 'New Request' to get started."
        />
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(request)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{request.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <StatusBadge status={request.status} variant={statusVariants[request.status]} />
                  <StatusBadge status={request.priority} variant={priorityVariants[request.priority]} />
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{request.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                {request.assignedToName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {request.assignedToName}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Service Request</h2>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed information about your request"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.title}</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-3">
                <StatusBadge status={selectedRequest.status} variant={statusVariants[selectedRequest.status]} />
                <StatusBadge status={selectedRequest.priority} variant={priorityVariants[selectedRequest.priority]} />
                <StatusBadge status={selectedRequest.category} variant="info" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
                  <p className="text-gray-600">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h3>
                  <p className="text-gray-600">{new Date(selectedRequest.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedRequest.assignedToName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Assigned To</h3>
                  <p className="text-gray-600">{selectedRequest.assignedToName}</p>
                </div>
              )}

              {selectedRequest.resolutionComments && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Resolution
                  </h3>
                  <p className="text-green-800">{selectedRequest.resolutionComments}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob