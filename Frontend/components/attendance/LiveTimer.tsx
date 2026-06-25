"use client";

import { useEffect, useState } from "react";

interface LiveTimerProps {
  clockInTime: string | null;
}

export default function LiveTimer({ clockInTime }: LiveTimerProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  useEffect(() => {
    if (!clockInTime) {
      setElapsedTime("00:00:00");
      return;
    }

    const calculateElapsedTime = () => {
      const clockIn = new Date(clockInTime);
      const now = new Date();
      const diff = now.getTime() - clockIn.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    };

    // Initial calculation
    setElapsedTime(calculateElapsedTime());

    // Update every second
    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [clockInTime]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        Working Hours
      </div>
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
        {elapsedTime}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        Live Timer
      </div>
    </div>
  );
}

// Made with Bob
