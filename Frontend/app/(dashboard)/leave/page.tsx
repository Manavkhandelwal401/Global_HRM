"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSession } from "@/context/SessionContext";
import { GET_MY_LEAVE_BALANCES, GET_MY_LEAVE_REQUESTS, GET_PENDING_LEAVE_APPROVALS } from "@/graphql/query/leave";
import { SUBMIT_LEAVE_REQUEST, APPROVE_LEAVE_REQUEST, REJECT_LEAVE_REQUEST, CANCEL_LEAVE_REQUEST } from "@/graphql/mutation/leave";
import { StatCard } from "@/components/shared/StatCard";
import { FormModal } from "@/components/shared/FormModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar, Umbrella, Heart, User, Plus, CheckCircle, XCircle } from "lucide-react";

interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: "Casual" | "Sick" | "Personal" | "LWP" | "CompOff";
  totalAllowed: number;
  used: number;
  pending: number;
  available: number;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "Casual" | "Sick" | "Personal" | "LWP" | "CompOff";
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  status: "Pending" | "Approved" | "Rejected";
  approvalComments: string | null;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedOn: string | null;
  createdAt: string;
}

export default function LeavePage() {
  const { user } = useSession();
  const [selectedTab, setSelectedTab] = useState<"my-leaves" | "approvals">("my-leaves");
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  const [demoBalances, setDemoBalances] = useState<LeaveBalance[]>([]);
  const [demoRequests, setDemoRequests] = useState<LeaveRequest[]>([]);
  const [demoApprovals, setDemoApprovals] = useState<LeaveRequest[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState<"Casual" | "Sick" | "Personal">("Casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  // Queries
  const {
    data: balancesData,
    loading: balancesLoading,
    error: balancesError,
    refetch: refetchBalances,
  } = useQuery<any, any>(GET_MY_LEAVE_BALANCES, {
    variables: { employeeId: user?.id || "EMP-001" },
    skip: !user?.id || useDemoMode,
  });

  const {
    data: requestsData,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useQuery<any, any>(GET_MY_LEAVE_REQUESTS, {
    variables: { employeeId: user?.id || "EMP-001" },
    skip: !user?.id || selectedTab !== "my-leaves" || useDemoMode,
  });

  const {
    data: approvalsData,
    loading: approvalsLoading,
    error: approvalsError,
    refetch: refetchApprovals,
  } = useQuery<any, any>(GET_PENDING_LEAVE_APPROVALS, {
    variables: { managerId: user?.id || "EMP-001" },
    skip: !user?.id || selectedTab !== "approvals" || user?.role === "Employee" || useDemoMode,
  });

  // Mutations
  const [submitLeaveRequest, { loading: submitting }] = useMutation<any, any>(SUBMIT_LEAVE_REQUEST, {
    onCompleted: () => {
      setIsRequestModalOpen(false);
      resetForm();
      refetchBalances();
      refetchRequests();
    },
  });

  const [approveLeaveRequest, { loading: approving }] = useMutation<any, any>(APPROVE_LEAVE_REQUEST, {
    onCompleted: () => {
      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
      setApprovalComments("");
      refetchApprovals();
    },
  });

  const [rejectLeaveRequest, { loading: rejecting }] = useMutation<any, any>(REJECT_LEAVE_REQUEST, {
    onCompleted: () => {
      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
      setApprovalComments("");
      refetchApprovals();
    },
  });

  const [cancelLeaveRequest] = useMutation<any, any>(CANCEL_LEAVE_REQUEST, {
    onCompleted: () => {
      refetchBalances();
      refetchRequests();
    },
  });
  const leaveBalances: LeaveBalance[] = useDemoMode 
    ? demoBalances.filter((b) => b.employeeId === user?.id) 
    : (balancesData?.getMyLeaveBalances || []);
  const leaveRequests: LeaveRequest[] = useDemoMode 
    ? demoRequests.filter((r) => r.employeeId === user?.id) 
    : (requestsData?.getMyLeaveRequests || []);
  const pendingApprovals: LeaveRequest[] = useDemoMode
    ? demoApprovals.filter((r) => r.status === "Pending")
    : (approvalsData?.getPendingLeaveApprovals || []).filter((request: LeaveRequest) => request.employeeId !== user?.id);

  useEffect(() => {
    setMounted(true);
    if (!useDemoMode) return;

    const saved = typeof window !== "undefined" ? localStorage.getItem("demo-leaves") : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasValidBalances = parsed.balances &&
          parsed.balances.some((b: any) => b.leaveType === "Casual") &&
          parsed.balances.some((b: any) => b.leaveType === "Sick") &&
          parsed.balances.some((b: any) => b.leaveType === "Personal");

        if (hasValidBalances) {
          setDemoBalances(parsed.balances ?? []);
          setDemoRequests(parsed.requests ?? []);
          setDemoApprovals(parsed.approvals ?? []);
          return;
        }
      } catch {
        // ignore malformed storage
      }
    }

    const baselineBalances: LeaveBalance[] = [
      { id: "bal-1", employeeId: "EMP-004", leaveType: "Casual", totalAllowed: 12, used: 4, pending: 1, available: 7 },
      { id: "bal-2", employeeId: "EMP-004", leaveType: "Sick", totalAllowed: 8, used: 2, pending: 0, available: 6 },
      { id: "bal-3", employeeId: "EMP-004", leaveType: "Personal", totalAllowed: 6, used: 1, pending: 0, available: 5 },
      { id: "bal-4", employeeId: "EMP-003", leaveType: "Casual", totalAllowed: 12, used: 2, pending: 0, available: 10 },
      { id: "bal-5", employeeId: "EMP-003", leaveType: "Sick", totalAllowed: 8, used: 1, pending: 0, available: 7 },
      { id: "bal-6", employeeId: "EMP-003", leaveType: "Personal", totalAllowed: 6, used: 0, pending: 0, available: 6 },
      { id: "bal-7", employeeId: "EMP-002", leaveType: "Casual", totalAllowed: 12, used: 3, pending: 0, available: 9 },
      { id: "bal-8", employeeId: "EMP-002", leaveType: "Sick", totalAllowed: 8, used: 2, pending: 0, available: 6 },
      { id: "bal-9", employeeId: "EMP-002", leaveType: "Personal", totalAllowed: 6, used: 1, pending: 0, available: 5 },
      { id: "bal-10", employeeId: "EMP-001", leaveType: "Casual", totalAllowed: 12, used: 1, pending: 0, available: 11 },
      { id: "bal-11", employeeId: "EMP-001", leaveType: "Sick", totalAllowed: 8, used: 1, pending: 0, available: 7 },
      { id: "bal-12", employeeId: "EMP-001", leaveType: "Personal", totalAllowed: 6, used: 0, pending: 0, available: 6 },
    ];
    const baselineRequests: LeaveRequest[] = [
      { id: "req-1", employeeId: "EMP-004", employeeName: "John Doe", leaveType: "Casual", startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString(), totalDays: 1, reason: "Personal appointment", status: "Pending", approvalComments: null, approvedBy: null, approvedByName: null, approvedOn: null, createdAt: new Date().toISOString() },
    ];
    const baselineApprovals: LeaveRequest[] = [
      { id: "apr-1", employeeId: "EMP-004", employeeName: "John Doe", leaveType: "Casual", startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString(), totalDays: 1, reason: "Personal appointment", status: "Pending", approvalComments: null, approvedBy: null, approvedByName: null, approvedOn: null, createdAt: new Date().toISOString() },
      { id: "apr-2", employeeId: "EMP-004", employeeName: "John Doe", leaveType: "Sick", startDate: new Date(Date.now() + 172800000).toISOString(), endDate: new Date(Date.now() + 259200000).toISOString(), totalDays: 2, reason: "Medical follow-up", status: "Pending", approvalComments: null, approvedBy: null, approvedByName: null, approvedOn: null, createdAt: new Date().toISOString() },
    ];
    setDemoBalances(baselineBalances);
    setDemoRequests(baselineRequests);
    setDemoApprovals(baselineApprovals);
    localStorage.setItem("demo-leaves", JSON.stringify({ balances: baselineBalances, requests: baselineRequests, approvals: baselineApprovals }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-leaves-updated"));
  }, [useDemoMode, user?.id, user?.name]);

  useEffect(() => {
    if (user?.role === "Employee") {
      setSelectedTab("my-leaves");
    } else if (user?.role) {
      setSelectedTab("approvals");
    }
  }, [user?.role]);

  const resetForm = () => {
    setLeaveType("Casual");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      alert("End date must be after start date");
      return;
    }

    if (useDemoMode) {
      const request: LeaveRequest = {
        id: `req-${Date.now()}`,
        employeeId: user?.id || "EMP-001",
        employeeName: user?.name || "Demo User",
        leaveType,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalDays: Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1),
        reason,
        status: "Pending",
        approvalComments: null,
        approvedBy: null,
        approvedByName: null,
        approvedOn: null,
        createdAt: new Date().toISOString(),
      };
      const nextRequests = [request, ...demoRequests];
      const nextApprovals = [request, ...demoApprovals];
      const nextBalances = demoBalances.map((balance) => 
        balance.leaveType === leaveType 
          ? { ...balance, pending: balance.pending + request.totalDays, available: balance.available - request.totalDays } 
          : balance
      );
      setDemoRequests(nextRequests);
      setDemoApprovals(nextApprovals);
      setDemoBalances(nextBalances);
      localStorage.setItem("demo-leaves", JSON.stringify({ balances: nextBalances, requests: nextRequests, approvals: nextApprovals }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-leaves-updated"));
      setIsRequestModalOpen(false);
      resetForm();
      return;
    }

    try {
      const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      await submitLeaveRequest({
        variables: {
          request: {
            employeeId: user?.id || "EMP-001",
            leaveType,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            totalDays,
            reason,
          },
        },
      });
    } catch (error) {
      console.error("Submit leave request error:", error);
      alert("Failed to submit leave request. Please check your available balance.");
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    if (useDemoMode) {
      const nextApprovals = demoApprovals.filter((r) => r.id !== selectedRequest.id);
      const nextRequests = demoRequests.map((r) => r.id === selectedRequest.id ? { ...r, status: "Approved" as const, approvedBy: user?.id ?? null, approvedByName: user?.name ?? null, approvedOn: new Date().toISOString() } : r);
      setDemoApprovals(nextApprovals);
      setDemoRequests(nextRequests);
      localStorage.setItem("demo-leaves", JSON.stringify({ balances: demoBalances, requests: nextRequests, approvals: nextApprovals }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-leaves-updated"));
      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
      setApprovalComments("");
      return;
    }

    try {
      await approveLeaveRequest({
        variables: {
          request: {
            requestId: selectedRequest.id,
            approverId: user?.id || "EMP-002",
            comments: approvalComments,
          },
        },
      });
    } catch (error) {
      console.error("Approve leave request error:", error);
      alert("Failed to approve leave request");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    if (useDemoMode) {
      const nextApprovals = demoApprovals.filter((r) => r.id !== selectedRequest.id);
      const nextRequests = demoRequests.map((r) => r.id === selectedRequest.id ? { ...r, status: "Rejected" as const, approvalComments } : r);
      setDemoApprovals(nextApprovals);
      setDemoRequests(nextRequests);
      localStorage.setItem("demo-leaves", JSON.stringify({ balances: demoBalances, requests: nextRequests, approvals: nextApprovals }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-leaves-updated"));
      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
      setApprovalComments("");
      return;
    }

    try {
      await rejectLeaveRequest({
        variables: {
          request: {
            requestId: selectedRequest.id,
            approverId: user?.id || "EMP-002",
            comments: approvalComments,
          },
        },
      });
    } catch (error) {
      console.error("Reject leave request error:", error);
      alert("Failed to reject leave request");
    }
  };

  const handleCancel = async (requestId: string) => {
    if (useDemoMode) {
      const requestToCancel = demoRequests.find((r) => r.id === requestId);
      if (!requestToCancel) return;

      const nextRequests = demoRequests.map((r) => 
        r.id === requestId 
          ? { ...r, status: "Rejected" as const, approvalComments: "Cancelled by employee" } 
          : r
      );
      const nextApprovals = demoApprovals.filter((r) => r.id !== requestId);
      const nextBalances = demoBalances.map((balance) => 
        balance.leaveType === requestToCancel.leaveType 
          ? { ...balance, pending: Math.max(0, balance.pending - requestToCancel.totalDays), available: balance.available + requestToCancel.totalDays } 
          : balance
      );
      setDemoRequests(nextRequests);
      setDemoApprovals(nextApprovals);
      setDemoBalances(nextBalances);
      localStorage.setItem("demo-leaves", JSON.stringify({ balances: nextBalances, requests: nextRequests, approvals: nextApprovals }));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("demo-leaves-updated"));
      return;
    }

    try {
      await cancelLeaveRequest({
        variables: {
          requestId,
          employeeId: user?.id || "EMP-001",
        },
      });
    } catch (error) {
      console.error("Cancel leave request error:", error);
      alert("Failed to cancel leave request");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLeaveIcon = (type: string) => {
    switch (type) {
      case "Casual":
        return <Umbrella className="h-6 w-6" />;
      case "Sick":
        return <Heart className="h-6 w-6" />;
      case "Personal":
        return <User className="h-6 w-6" />;
      default:
        return <Calendar className="h-6 w-6" />;
    }
  };

  const getLeaveColor = (type: string): "teal" | "orange" | "blue" | "purple" => {
    switch (type) {
      case "Casual":
        return "teal";
      case "Sick":
        return "orange";
      case "Personal":
        return "blue";
      default:
        return "purple";
    }
  };

  const getStatusType = (status: string, comments?: string | null): "approved" | "pending" | "rejected" | "cancelled" => {
    if (status === "Rejected" && (comments === "Cancelled by employee" || comments?.toLowerCase().includes("cancel"))) {
      return "cancelled";
    }
    return status.toLowerCase() as any;
  };

  if (!useDemoMode && balancesLoading) return <LoadingState message="Loading leave balances..." />;
  if (!useDemoMode && balancesError) return <ErrorState message="Failed to load leave balances" />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your leave requests and balances
            </p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Request Leave
          </button>
        </div>
      </div>

      {/* Leave Balances */}
      <div className="px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Leave Balances</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leaveBalances.map((balance) => (
            <StatCard
              key={balance.id}
              title={`${balance.leaveType} Leave`}
              value={balance.available}
              subtitle={`Total: ${balance.totalAllowed} | Used: ${balance.used} | Pending: ${balance.pending}`}
              icon={getLeaveIcon(balance.leaveType)}
              color={getLeaveColor(balance.leaveType)}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      {mounted && user && user.role !== "Employee" && (
        <div className="border-b border-gray-200 px-4 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("my-leaves")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === "my-leaves"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              My Leaves
            </button>
            <button
              onClick={() => setSelectedTab("approvals")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === "approvals"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Pending Approvals ({pendingApprovals.length})
            </button>
          </div>
        </div>
      )}
      {mounted && user && user.role === "Employee" && (
        <div className="border-b border-gray-200 px-4 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("my-leaves")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === "my-leaves"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              My Leaves
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6">
        {selectedTab === "my-leaves" ? (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">My Leave Requests</h2>
            {requestsLoading ? (
              <LoadingState message="Loading leave requests..." />
            ) : requestsError ? (
              <ErrorState message="Failed to load leave requests" />
            ) : leaveRequests.length === 0 ? (
              <EmptyState
                title="No leave requests"
                description="You haven't submitted any leave requests yet"
                icon={<Calendar className="h-12 w-12" />}
              />
            ) : (
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {request.leaveType} Leave
                          </h3>
                          <StatusBadge status={getStatusType(request.status, request.approvalComments)} />
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.totalDays} days)
                        </p>
                        {request.reason && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                        )}
                        {request.approvalComments && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Comments:</span> {request.approvalComments}
                          </p>
                        )}
                      </div>
                      {request.status === "Pending" && user?.role === "Employee" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancel(request.id);
                          }}
                          className="ml-4 text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors relative z-50 cursor-pointer pointer-events-auto shadow-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Pending Approvals</h2>
            {approvalsLoading ? (
              <LoadingState message="Loading pending approvals..." />
            ) : approvalsError ? (
              <ErrorState message="Failed to load pending approvals" />
            ) : pendingApprovals.length === 0 ? (
              <EmptyState
                title="No pending approvals"
                description="There are no leave requests waiting for your approval"
                icon={<CheckCircle className="h-12 w-12" />}
              />
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {request.employeeName} - {request.leaveType} Leave
                          </h3>
                          <StatusBadge status="pending" />
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.totalDays} days)
                        </p>
                        {request.reason && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsApprovalModalOpen(true);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Leave Modal */}
      <FormModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          resetForm();
        }}
        title="Request Leave"
        size="lg"
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as "Casual" | "Sick" | "Personal")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Personal">Personal Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {startDate && endDate && (() => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end >= start) {
              const requestedDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
              const balanceObj = leaveBalances.find(b => b.leaveType === leaveType);
              const available = balanceObj ? balanceObj.available : 0;
              if (requestedDays > available) {
                return (
                  <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Umbrella className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Exceeding Limit Warning
                        </h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                          <p>
                            You are requesting {requestedDays} days of leave, but you only have {available} days available. You are exceeding the limit!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            }
            return null;
          })()}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter reason for leave..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsRequestModalOpen(false);
                resetForm();
              }}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (() => {
                if (startDate && endDate) {
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  if (end >= start) {
                    const requestedDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                    const balanceObj = leaveBalances.find(b => b.leaveType === leaveType);
                    const available = balanceObj ? balanceObj.available : 0;
                    return requestedDays > available;
                  }
                }
                return false;
              })()}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Approval Modal */}
      <FormModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedRequest(null);
          setApprovalComments("");
        }}
        title="Review Leave Request"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedRequest.employeeName} - {selectedRequest.leaveType} Leave
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)} ({selectedRequest.totalDays} days)
              </p>
              {selectedRequest.reason && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Reason:</span> {selectedRequest.reason}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments (Optional)
              </label>
              <textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Add comments..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReject}
                disabled={rejecting || approving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                {rejecting ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={handleApprove}
                disabled={approving || rejecting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                {approving ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}

// Made with Bob