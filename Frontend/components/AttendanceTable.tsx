import React, { useState, ChangeEvent } from 'react';

interface AttendanceRecord {
  employeeName: string;
  employeeId: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string;
  status: string;
}

type Props = {
  data: AttendanceRecord[];
};

export const AttendanceTable: React.FC<Props> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleDept = (e: ChangeEvent<HTMLSelectElement>) => {
    setDeptFilter(e.target.value);
    setPage(1);
  };
  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    setPage(1);
  };

  const filtered = data.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? r.department === deptFilter : true;
    const matchesDate = dateFilter ? r.date === dateFilter : true;
    return matchesSearch && matchesDept && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const departments = Array.from(new Set(data.map((r) => r.department)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={handleSearch}
          className="border rounded px-2 py-1 w-full sm:w-48"
        />
        <select
          value={deptFilter}
          onChange={handleDept}
          className="border rounded px-2 py-1 w-full sm:w-40"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDate}
          className="border rounded px-2 py-1 w-full sm:w-40"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium">Employee Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Employee ID</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Department</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Check‑in</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Check‑out</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Working Hours</th>
              <th className="px-3 py-2 text-left text-xs font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2 text-sm">{r.employeeName}</td>
                <td className="px-3 py-2 text-sm">{r.employeeId}</td>
                <td className="px-3 py-2 text-sm">{r.department}</td>
                <td className="px-3 py-2 text-sm">{r.date}</td>
                <td className="px-3 py-2 text-sm">{r.checkIn ?? '-'} </td>
                <td className="px-3 py-2 text-sm">{r.checkOut ?? '-'} </td>
                <td className="px-3 py-2 text-sm">{r.workingHours}</td>
                <td className="px-3 py-2 text-sm">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span>
          Showing {paginated.length} of {filtered.length} records
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
