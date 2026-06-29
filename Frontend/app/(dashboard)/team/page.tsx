'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TEAM_DIRECTORY, GET_ORG_CHART } from '@/graphql/query/team';
import { CREATE_EMPLOYEE } from '@/graphql/mutation/createEmployee';
import { useSession } from '@/context/SessionContext';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Users, GitPullRequest, Search, Mail, Briefcase, Network, User, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormModal } from '@/components/shared/FormModal';
import { useToast } from '@/context/ToastContext';

export default function TeamPage() {
  const { user } = useSession();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'directory' | 'org-chart'>('directory');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Queries
  const { data: dirData, loading: dirLoading, error: dirError } = useQuery<any, any>(GET_TEAM_DIRECTORY, {
    variables: { search: search || null, statusFilter: statusFilter || null }
  });

  const { data: orgData, loading: orgLoading, error: orgError } = useQuery<any, any>(GET_ORG_CHART, {
    variables: { rootEmployeeId: user?.id || 'demo-employee-id' },
    skip: activeTab !== 'org-chart' || !user?.id
  });

  const defaultTeamMembers = [
    { id: '1', fullName: 'Sarah Jenkins', position: 'HR Director', department: 'Human Resources', email: 'sarah.j@workflow.com', status: 'Active', managerName: 'CEO' },
    { id: '2', fullName: 'John Doe', position: 'Software Engineer', department: 'Engineering', email: 'john.doe@workflow.com', status: 'Active', managerName: 'Sarah Jenkins' },
    { id: '3', fullName: 'Jane Smith', position: 'Product Manager', department: 'Product', email: 'jane.smith@workflow.com', status: 'On-Leave', managerName: 'CEO' }
  ];

  const defaultOrgChartNodes = [
    {
      employeeId: '1',
      employeeName: 'Sarah Jenkins',
      position: 'HR Director',
      managerId: '0',
      managerName: 'CEO',
      directReports: [
        { employeeId: '2', employeeName: 'John Doe', position: 'Software Engineer' }
      ]
    }
  ];

  // Demo mode support
  const [demoMembers, setDemoMembers] = useState<any[]>([]);
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

  useEffect(() => {
    if (!useDemoMode) return;
    const saved = localStorage.getItem("demo-team-members");
    if (saved) {
      setDemoMembers(JSON.parse(saved));
    } else {
      localStorage.setItem("demo-team-members", JSON.stringify(defaultTeamMembers));
      setDemoMembers(defaultTeamMembers);
    }
  }, [useDemoMode]);

  // Form states for adding new employee
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmpId, setNewEmpId] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpPosition, setNewEmpPosition] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Employee');
  const [newEmpActivationCode, setNewEmpActivationCode] = useState('');
  const [newEmpManagerId, setNewEmpManagerId] = useState('');

  const [createEmployeeMutation] = useMutation<any, any>(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_TEAM_DIRECTORY, variables: { search: search || null, statusFilter: statusFilter || null } }],
    onError: (err) => {
      showToast(err.message, "error");
    }
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpId || !newEmpName || !newEmpPosition || !newEmpDept || !newEmpEmail || !newEmpActivationCode) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (!useDemoMode) {
      try {
        const response = await createEmployeeMutation({
          variables: {
            employeeId: newEmpId,
            name: newEmpName,
            email: newEmpEmail,
            position: newEmpPosition,
            department: newEmpDept,
            role: newEmpRole,
            activationCode: newEmpActivationCode,
            managerId: newEmpManagerId || null
          }
        });
        if (response.data?.createEmployee) {
          showToast(`Successfully recruited ${newEmpName} with ID ${newEmpId}!`, "success");
          setIsAddModalOpen(false);
          setNewEmpId('');
          setNewEmpName('');
          setNewEmpPosition('');
          setNewEmpDept('');
          setNewEmpEmail('');
          setNewEmpRole('Employee');
          setNewEmpActivationCode('');
          setNewEmpManagerId('');
        }
      } catch (err) {
        // Handled by onError callback or try/catch
      }
      return;
    }

    const newId = newEmpId;
    const newMember = {
      id: newId,
      fullName: newEmpName,
      position: newEmpPosition,
      department: newEmpDept,
      email: newEmpEmail,
      status: 'Active',
      managerName: user?.name || 'HR Director'
    };

    const nextMembers = [...demoMembers, newMember];
    setDemoMembers(nextMembers);
    localStorage.setItem("demo-team-members", JSON.stringify(nextMembers));

    // Initiate onboarding progress in tracker
    const savedProgress = localStorage.getItem("demo-onboarding-progress");
    const progressList = savedProgress ? JSON.parse(savedProgress) : [];
    const newProgress = {
      employeeId: newId,
      employeeName: newEmpName,
      department: newEmpDept,
      totalTasks: newEmpRole === "Employee" ? 3 : 2,
      completedTasks: 0,
      progressPercentage: 0,
      startDate: new Date().toISOString()
    };
    const nextProgressList = [...progressList, newProgress];
    localStorage.setItem("demo-onboarding-progress", JSON.stringify(nextProgressList));

    // Seed onboarding tasks
    const savedChecklist = localStorage.getItem("demo-onboarding");
    const checklistMap = savedChecklist ? JSON.parse(savedChecklist) : {};
    const tasks = newEmpRole === "Employee" ? [
      { id: 'task-1', taskName: 'Complete HR Documentation', description: 'Fill in and upload all required tax documents and contract signatures.', status: 0, completedAt: null },
      { id: 'task-2', taskName: 'Setup Workstation & Credentials', description: 'Install required development environments and configure git access.', status: 0, completedAt: null },
      { id: 'task-3', taskName: 'Schedule Team Meet-and-Greet', description: 'Book a 15-minute quick call with each team member to introduce yourself.', status: 0, completedAt: null }
    ] : [
      { id: 'task-1', taskName: 'Management Onboarding Session', description: 'Meet with leadership team and align on department goals.', status: 0, completedAt: null },
      { id: 'task-2', taskName: 'Access Manager Dashboard', description: 'Request admin access to HR dashboard and approval workflows.', status: 0, completedAt: null }
    ];
    checklistMap[newId] = tasks;
    localStorage.setItem("demo-onboarding", JSON.stringify(checklistMap));

    // Reset form states
    setNewEmpId('');
    setNewEmpName('');
    setNewEmpPosition('');
    setNewEmpDept('');
    setNewEmpEmail('');
    setNewEmpRole('Employee');
    setNewEmpActivationCode('');
    setNewEmpManagerId('');
    setIsAddModalOpen(false);
    showToast(`Successfully added ${newEmpName} with ID ${newId}! Onboarding initiated.`, "success");
  };

  const teamMembers = useDemoMode ? demoMembers : (dirData?.getTeamDirectory || (dirError ? defaultTeamMembers : []));
  const orgChartNodes = orgData?.getOrgChart || (orgError ? defaultOrgChartNodes : []);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            Team & Organization
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Browse directory and discover direct report alignments
          </p>
        </div>
        {user && user.role !== "Employee" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-xl p-1.5 flex gap-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'directory'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
        >
          <Users className="h-4 w-4" />
          Team Directory
        </button>
        <button
          onClick={() => setActiveTab('org-chart')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'org-chart'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
        >
          <Network className="h-4 w-4" />
          Org Chart
        </button>
      </div>

      {/* Directory Content */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, position..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg pl-9 p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On-Leave">On Leave</option>
              <option value="In-Meeting">In Meeting</option>
            </select>
          </div>

          {dirLoading ? (
            <LoadingState message="Searching team directory..." />
          ) : dirError && teamMembers.length === 0 ? (
            <ErrorState message="Failed to load team directory" />
          ) : teamMembers.length === 0 ? (
            <EmptyState title="No colleagues found" description="Try adjusting your query or filters." />
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member: any) => (
                <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold uppercase border border-teal-200 dark:border-teal-800">
                      {member.profilePictureUrl ? (
                        <img src={member.profilePictureUrl} alt={member.fullName} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{member.fullName}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" /> {member.position} • {member.department}
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Mail className="h-3 w-3 shrink-0" /> {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={member.status} size="sm" />
                    {member.managerName && (
                      <span className="text-[10px] text-gray-500 font-medium">Rep. to {member.managerName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Org Chart Content */}
      {activeTab === 'org-chart' && (
        <div className="space-y-4">
          {orgLoading ? (
            <LoadingState message="Generating organizational relationships..." />
          ) : orgError && orgChartNodes.length === 0 ? (
            <ErrorState message="Failed to construct org relationships" />
          ) : orgChartNodes.length === 0 ? (
            <EmptyState title="Org chart unavailable" description="No direct manager or team linkages mapped." />
          ) : (
            <div className="space-y-6">
              {orgChartNodes.map((node: any) => (
                <div key={node.employeeId} className="space-y-4">
                  {/* Manager/Root Node */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl p-4 text-white shadow-md text-center max-w-xs w-full">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Line Manager</p>
                      <h4 className="font-extrabold mt-1 text-sm">{node.employeeName}</h4>
                      <p className="text-xs opacity-90 mt-0.5">{node.position} • {node.department}</p>
                    </div>
                  </div>

                  {/* Connective Line */}
                  {node.directReports && node.directReports.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600" />
                      <div className="h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" style={{ width: `${(node.directReports.length - 1) * 60}px`, maxWidth: '90%' }} />
                    </div>
                  )}

                  {/* Direct Reports Row */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {node.directReports?.map((report: any) => (
                      <div key={report.employeeId} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm text-center w-36 shrink-0 relative">
                        {/* Connecting Line to Node */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-300 dark:bg-gray-600" />
                        
                        <div className="h-8 w-8 bg-gray-100 dark:bg-gray-900 rounded-full mx-auto flex items-center justify-center text-teal-600 mb-1.5 border border-gray-200 dark:border-gray-700">
                          <User className="h-4 w-4" />
                        </div>
                        <h5 className="font-bold text-gray-950 dark:text-white text-xs truncate">{report.employeeName}</h5>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{report.position}</p>
                        <p className="text-[9px] text-gray-400 truncate">{report.department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Add Employee Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        size="lg"
      >
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee ID
              </label>
              <input
                type="text"
                value={newEmpId}
                onChange={(e) => setNewEmpId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. emp-005"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Activation Code
              </label>
              <input
                type="text"
                value={newEmpActivationCode}
                onChange={(e) => setNewEmpActivationCode(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. REG-DONALD-123"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={newEmpName}
              onChange={(e) => setNewEmpName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Donald Duck"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Position / Job Title
              </label>
              <input
                type="text"
                value={newEmpPosition}
                onChange={(e) => setNewEmpPosition(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Frontend Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <input
                type="text"
                value={newEmpDept}
                onChange={(e) => setNewEmpDept(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Engineering"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Official Company Email
              </label>
              <input
                type="email"
                value={newEmpEmail}
                onChange={(e) => setNewEmpEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. donald.duck@workflow.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reports To (Manager ID - Optional)
              </label>
              <input
                type="text"
                value={newEmpManagerId}
                onChange={(e) => setNewEmpManagerId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. emp-mgr-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              System Role (For Onboarding Template)
            </label>
            <select
              value={newEmpRole}
              onChange={(e) => setNewEmpRole(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Employee">Employee (Common checklist + Dev workstation setup)</option>
              <option value="Manager">Manager (Common checklist + Leadership training)</option>
              <option value="HR">HR Manager</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Add & Start Onboarding
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
