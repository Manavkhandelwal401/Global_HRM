"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSession } from "@/context/SessionContext";
import { GET_TODAY_ATTENDANCE, GET_MY_ATTENDANCE } from "@/graphql/query/attendance";
import { CLOCK_IN, CLOCK_OUT } from "@/graphql/mutation/attendance";
import LiveTimer from "@/components/attendance/LiveTimer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Clock, Calendar, TrendingUp, Coffee, Zap, CheckCircle2 } from "lucide-react";

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

export default function AttendancePage() {
  const { user } = useSession();
  const [selectedTab, setSelectedTab] = useState<"today" | "history">("today");
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  const [demoTodayRecord, setDemoTodayRecord] = useState<AttendanceRecord | null>(null);
  const [demoHistory, setDemoHistory] = useState<AttendanceRecord[]>([]);

  // Calculate date range for history (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Queries
  const {
    data: todayData,
    loading: todayLoading,
    error: todayError,
    refetch: refetchToday,
  } = useQuery<any, any>(GET_TODAY_ATTENDANCE, {
    variables: { employeeId: user?.id || "EMP-001" },
    skip: !user?.id || useDemoMode,
  });

  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = useQuery<any, any>(GET_MY_ATTENDANCE, {
    variables: {
      employeeId: user?.id || "EMP-001",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    skip: !user?.id || selectedTab !== "history" || useDemoMode,
  });

  // Mutations
  const [clockIn, { loading: clockInLoading }] = useMutation<any, any>(CLOCK_IN, {
    onCompleted: () => {
      refetchToday();
    },
  });

  const [clockOut, { loading: clockOutLoading }] = useMutation<any, any>(CLOCK_OUT, {
    onCompleted: () => {
      refetchToday();
    },
  });

  useEffect(() => {
    if (!useDemoMode) return;

    const saved = typeof window !== "undefined" ? localStorage.getItem("demo-attendance") : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDemoTodayRecord(parsed.today ?? null);
        setDemoHistory(parsed.history ?? []);
      } catch {
        // ignore malformed storage
      }
      return;
    }

    const seededHistory: AttendanceRecord[] = [
      {
        id: "demo-1",
        employeeId: user?.id || "EMP-001",
        employeeName: user?.name || "Demo User",
        date: new Date().toISOString(),
        clockIn: "2024-01-10T09:00:00.000Z",
        clockOut: "2024-01-10T18:00:00.000Z",
        productiveHours: 8,
        breakHours: 1,
        overtimeHours: 0,
        status: "Present",
      },
      {
        id: "demo-2",
        employeeId: user?.id || "EMP-001",
        employeeName: user?.name || "Demo User",
        date: new Date(Date.now() - 86400000).toISOString(),
        clockIn: "2024-01-09T09:30:00.000Z",
        clockOut: "2024-01-09T17:30:00.000Z",
        productiveHours: 7.5,
        breakHours: 1,
        overtimeHours: 0,
        status: "Late",
      },
    ];
    setDemoHistory(seededHistory);
    localStorage.setItem("demo-attendance", JSON.stringify({ today: null, history: seededHistory }));
  }, [useDemoMode, user?.id, user?.name]);

  const todayAttendance: AttendanceRecord | null = useDemoMode ? demoTodayRecord ?? null : todayData?.getTodayAttendance;
  const attendanceHistory: AttendanceRecord[] = useDemoMode ? demoHistory : historyData?.getMyAttendance || [];

  const handleClockIn = async () => {
    if (useDemoMode) {
      const now = new Date();
      const record: AttendanceRecord = {
        id: `demo-${Date.now()}`,
        employeeId: user?.id || "EMP-001",
        employeeName: user?.name || "Demo User",
        date: now.toISOString(),
        clockIn: now.toISOString(),
        clockOut: null,
        productiveHours: 0,
        breakHours: 0,
        overtimeHours: 0,
        status: "Present",
      };
      const nextHistory = [record, ...demoHistory].slice(0, 10);
      setDemoTodayRecord(record);
      setDemoHistory(nextHistory);
      localStorage.setItem("demo-attendance", JSON.stringify({ today: record, history: nextHistory }));
      return;
    }

    try {
      await clockIn({ variables: { employeeId: user?.id || "EMP-001" } });
    } catch (error) {
      console.error("Clock in error:", error);
    }
  };

  const handleClockOut = async () => {
    if (useDemoMode && demoTodayRecord) {
      const now = new Date();
      const clockIn = new Date(demoTodayRecord.clockIn!);
      const diffHours = Math.max(0, (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60));
      const completedRecord: AttendanceRecord = {
        ...demoTodayRecord,
        clockOut: now.toISOString(),
        productiveHours: Math.max(0, Number((diffHours - 1).toFixed(1))),
        breakHours: 1,
        overtimeHours: Math.max(0, Number((diffHours - 8).toFixed(1))),
        status: diffHours < 8 ? "HalfDay" : "Present",
      };
      const nextHistory = [completedRecord, ...demoHistory.filter((entry) => entry.id !== demoTodayRecord.id)].slice(0, 10);
      setDemoTodayRecord(completedRecord);
      setDemoHistory(nextHistory);
      localStorage.setItem("demo-attendance", JSON.stringify({ today: completedRecord, history: nextHistory }));
      return;
    }

    try {
      await clockOut({ variables: { employeeId: user?.id || "EMP-001" } });
    } catch (error) {
      console.error("Clock out error:", error);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
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

  if (!useDemoMode && todayLoading && selectedTab === "today") {
    return <LoadingState message="Loading attendance..." />;
  }

  if (!useDemoMode && todayError) {
    console.error("Attendance Today Query Error:", todayError);
  }

  const isClockedIn = todayAttendance?.clockIn && !todayAttendance?.clockOut;
  const isClockedOut = todayAttendance?.clockIn && todayAttendance?.clockOut;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Attendance
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track your working hours and attendance records
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-6">
          <button
            onClick={() => setSelectedTab("today")}
            className={`relative py-3 px-1 font-medium text-sm transition-colors ${
              selectedTab === "today"
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Today
            {selectedTab === "today" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-50" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`relative py-3 px-1 font-medium text-sm transition-colors ${
              selectedTab === "history"
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            History
            {selectedTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-50" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {selectedTab === "today" && (
          <>
            {/* Clock In/Out Section */}
            <div className="bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-soft">
              {!isClockedIn && !isClockedOut && (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                      <Clock className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      Ready to start your day?
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Clock in to begin tracking your work hours
                    </p>
                  </div>
                  <button
                    onClick={handleClockIn}
                    disabled={clockInLoading}
                    className="w-full h-11 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {clockInLoading ? "Clocking In..." : "Clock In"}
                  </button>
                </div>
              )}

              {isClockedIn && (
                <div className="space-y-6">
                  <LiveTimer clockInTime={todayAttendance?.clockIn || null} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        Clock In
                      </div>
                      <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatTime(todayAttendance?.clockIn || null)}
                      </div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Status
                      </div>
                      <StatusBadge
                        status={todayAttendance?.status || "Present"}
                        variant={getStatusColor(todayAttendance?.status || "Present")}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleClockOut}
                    disabled={clockOutLoading}
                    className="w-full h-11 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {clockOutLoading ? "Clocking Out..." : "Clock Out"}
                  </button>
                </div>
              )}

              {isClockedOut && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      Day Complete!
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Great work today
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        Clock In
                      </div>
                      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatTime(todayAttendance?.clockIn || null)}
                      </div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        Clock Out
                      </div>
                      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {formatTime(todayAttendance?.clockOut || null)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 text-center">
                      <TrendingUp className="w-5 h-5 mx-auto text-zinc-600 dark:text-zinc-400 mb-2" />
                      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Productive
                      </div>
                      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {todayAttendance?.productiveHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 text-center">
                      <Coffee className="w-5 h-5 mx-auto text-zinc-600 dark:text-zinc-400 mb-2" />
                      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Break
                      </div>
                      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {todayAttendance?.breakHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 text-center">
                      <Zap className="w-5 h-5 mx-auto text-zinc-600 dark:text-zinc-400 mb-2" />
                      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Overtime
                      </div>
                      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {todayAttendance?.overtimeHours.toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shift Schedule */}
            <div className="bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-soft">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Shift Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Working Hours
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Lunch Break
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    1 hour
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Hours
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    8 hours
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === "history" && (
          <div className="space-y-3">
            {historyLoading && <LoadingState message="Loading history..." />}
            
            {!historyLoading && attendanceHistory.length === 0 && (
              <EmptyState
                icon={<Calendar className="h-12 w-12 text-zinc-400" />}
                title="No attendance records"
                description="Your attendance history will appear here"
              />
            )}

            {!historyLoading &&
              attendanceHistory.map((record, index) => (
                <div
                  key={`${record.id}-${index}`}
                  className="bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-soft"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                        {formatDate(record.date)}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {formatTime(record.clockIn)} - {formatTime(record.clockOut)}
                      </div>
                    </div>
                    <StatusBadge
                      status={record.status}
                      variant={getStatusColor(record.status)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        Productive
                      </div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {record.productiveHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        Break
                      </div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {record.breakHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        Overtime
                      </div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {record.overtimeHours.toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
