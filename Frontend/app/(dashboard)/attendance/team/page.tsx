"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useSession } from "@/context/SessionContext";
import { GET_TEAM_ATTENDANCE } from "@/graphql/query/attendance";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users, Filter, Calendar } from "lucide-react";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  productiveHours: number;
  breakHours: number;
  overtimeHours: number;
  status: "Present" | "Late" | "HalfDay" | "Absent";
}

type StatusFilter = "Present" | "Late" | "HalfDay" | "Absent" | null;

export default function TeamAttendancePage() {
  const { user } = useSession();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Only allow managers, HR, and admins to access this page
  const canViewTeam = user?.role && ["Manager", "HR", "Admin"].includes(user.role);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<any, any>(GET_TEAM_ATTENDANCE, {
    variables: {
      managerId: user?.id || "",
      date: new Date(selectedDate).toISOString(),
      statusFilter: statusFilter,
    },
    skip: !user?.id || !canViewTeam,
  });

  const teamAttendance: AttendanceRecord[] = data?.getTeamAttendance || [];

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "success";
      case "Late":
        return "warning";
      case "HalfDay":
        return "info";
      case "Absent":
        return "error";
      default:
        return "default";
    }
  };

  const statusCounts = {
    Present: teamAttendance.filter((r) => r.status === "Present").length,
    Late: teamAttendance.filter((r) => r.status === "Late").length,
    HalfDay: teamAttendance.filter((r) => r.status === "HalfDay").length,
    Absent: teamAttendance.filter((r) => r.status === "Absent").length,
  };

  if (!canViewTeam) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="p-4">
          <ErrorState message="You don't have permission to view team attendance" />
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading team attendance..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load team attendance data" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6" />
          Team Attendance
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Monitor your team's attendance
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {/* Date Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All ({teamAttendance.length})
            </button>
            <button
              onClick={() => setStatusFilter("Present")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "Present"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Present ({statusCounts.Present})
            </button>
            <button
              onClick={() => setStatusFilter("Late")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "Late"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Late ({statusCounts.Late})
            </button>
            <button
              onClick={() => setStatusFilter("HalfDay")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "HalfDay"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Half Day ({statusCounts.HalfDay})
            </button>
            <button
              onClick={() => setStatusFilter("Absent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "Absent"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Absent ({statusCounts.Absent})
            </button>
          </div>
        </div>
      </div>

      {/* Team List */}
      <div className="p-4 space-y-3">
        {teamAttendance.length === 0 && (
          <EmptyState
            icon={<Users className="h-12 w-12 text-gray-400" />}
            title="No team members found"
            description="No attendance records match your filters"
          />
        )}

        {teamAttendance.map((record) => (
          <div
            key={record.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all ${
              record.status === "Absent"
                ? "border-red-300 dark:border-red-700"
                : record.status === "Late"
                ? "border-yellow-300 dark:border-yellow-700"
                : "border-gray-200 dark:border-gray-700"
            } p-4`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {record.employeeName || `Employee ${record.employeeId}`}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  ID: {record.employeeId}
                </div>
              </div>
              <StatusBadge
                status={record.status}
                variant={getStatusColor(record.status)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Clock In
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTime(record.clockIn)}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Clock Out
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTime(record.clockOut)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-blue-50 dark:bg-blue-950 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Productive
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {record.productiveHours.toFixed(1)}h
                </div>
              </div>
              <div className="text-center bg-amber-50 dark:bg-amber-950 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Break
                </div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {record.breakHours.toFixed(1)}h
                </div>
              </div>
              <div className="text-center bg-purple-50 dark:bg-purple-950 rounded-lg p-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Overtime
                </div>
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {record.overtimeHours.toFixed(1)}h
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Made with Bob
