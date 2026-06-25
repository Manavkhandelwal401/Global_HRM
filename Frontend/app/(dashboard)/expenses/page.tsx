'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSession } from '@/context/SessionContext';
import { useToast } from '@/context/ToastContext';
import { GET_MY_EXPENSES, GET_PENDING_EXPENSE_APPROVALS } from '@/graphql/query/expense';
import { SUBMIT_EXPENSE, APPROVE_EXPENSE, REJECT_EXPENSE } from '@/graphql/mutation/expense';
import { StatCard } from '@/components/shared/StatCard';
import { FormModal } from '@/components/shared/FormModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { 
  DollarSign, 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Car, 
  FileCheck, 
  TrendingUp, 
  Info,
  Clock
} from 'lucide-react';

interface ExpenseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  comments: string | null;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedOn: string | null;
  createdAt: string;
}

export default function ExpensesPage(): React.ReactElement {
  const { user } = useSession();
  const { showToast } = useToast();
  const currentRole = user?.role || 'Employee';
  const currentEmployeeId = user?.id || '';
  const isManagement = currentRole === 'Manager' || currentRole === 'HR' || currentRole === 'Admin';
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

  const [activeTab, setActiveTab] = useState<'my-expenses' | 'approvals'>('my-expenses');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRequest | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comments, setComments] = useState('');
  const [approvalComments, setApprovalComments] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Mileage Calculator states
  const [useMileage, setUseMileage] = useState(false);
  const [distance, setDistance] = useState('');
  const [ratePerUnit, setRatePerUnit] = useState('7.00'); // defaults for INR

  // Demo mode local states
  const [demoExpenses, setDemoExpenses] = useState<ExpenseRequest[]>([]);
  const [demoExpenseApprovals, setDemoExpenseApprovals] = useState<ExpenseRequest[]>([]);

  // Real mode: Apollo queries
  const { data: myData, loading: myLoading, error: myError, refetch: refetchMy } = useQuery<any, any>(GET_MY_EXPENSES, {
    variables: { employeeId: currentEmployeeId },
    skip: !currentEmployeeId || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  const { data: pendingData, loading: pendingLoading, error: pendingError, refetch: refetchPending } = useQuery<any, any>(GET_PENDING_EXPENSE_APPROVALS, {
    variables: { managerId: currentEmployeeId },
    skip: !currentEmployeeId || !isManagement || useDemoMode,
    fetchPolicy: 'cache-and-network',
  });

  // Real mode mutations
  const [submitExpenseMutation] = useMutation<any, any>(SUBMIT_EXPENSE, {
    onCompleted: () => {
      refetchMy();
      showToast('Expense claim submitted successfully', 'success');
      setShowSubmitModal(false);
      resetForm();
    },
    onError: (err) => {
      showToast(err.message || 'Failed to submit expense', 'error');
    }
  });

  const [approveExpenseMutation] = useMutation<any, any>(APPROVE_EXPENSE, {
    onCompleted: () => {
      refetchPending();
      showToast('Expense claim approved', 'success');
      setShowApprovalModal(false);
      setApprovalComments('');
    },
    onError: (err) => {
      showToast(err.message || 'Failed to approve expense', 'error');
    }
  });

  const [rejectExpenseMutation] = useMutation<any, any>(REJECT_EXPENSE, {
    onCompleted: () => {
      refetchPending();
      showToast('Expense claim rejected', 'success');
      setShowApprovalModal(false);
      setApprovalComments('');
    },
    onError: (err) => {
      showToast(err.message || 'Failed to reject expense', 'error');
    }
  });

  // Sync demo data from localStorage
  const syncDemoData = () => {
    if (!useDemoMode) return;
    const raw = localStorage.getItem('demo-expenses');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDemoExpenses(parsed.requests ?? []);
        setDemoExpenseApprovals(parsed.approvals ?? []);
      } catch { /* ignore */ }
    } else {
      // Default baseline data
      const defaultRequests: ExpenseRequest[] = [
        {
          id: 'exp-1',
          employeeId: 'EMP-004',
          employeeName: 'John Doe',
          category: 'Travel',
          amount: 1400,
          currency: 'INR',
          date: '2026-06-24T00:00:00.000Z',
          status: 'Pending',
          comments: 'Client site visit mileage reimbursement',
          approvedBy: null,
          approvedByName: null,
          approvedOn: null,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'exp-2',
          employeeId: 'EMP-004',
          employeeName: 'John Doe',
          category: 'Food',
          amount: 750,
          currency: 'INR',
          date: '2026-06-23T00:00:00.000Z',
          status: 'Approved',
          comments: 'Client lunch meeting',
          approvedBy: 'EMP-003',
          approvedByName: 'Manager User',
          approvedOn: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setDemoExpenses(defaultRequests);
      setDemoExpenseApprovals(defaultRequests.filter(r => r.status === 'Pending'));
      localStorage.setItem('demo-expenses', JSON.stringify({ requests: defaultRequests, approvals: defaultRequests.filter(r => r.status === 'Pending') }));
    }
  };

  useEffect(() => {
    syncDemoData();
    setMounted(true);

    const onUpdate = () => syncDemoData();
    window.addEventListener('demo-expenses-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('demo-expenses-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  // Update default rate when currency changes
  useEffect(() => {
    setRatePerUnit(currency === 'USD' ? '0.67' : '7.00');
  }, [currency]);

  // Update amount automatically when mileage distance changes
  useEffect(() => {
    if (useMileage && distance) {
      const calculated = parseFloat(distance) * parseFloat(ratePerUnit);
      if (!isNaN(calculated)) {
        setAmount(calculated.toFixed(2));
      }
    }
  }, [useMileage, distance, ratePerUnit]);

  // Derive display list
  const expensesList: ExpenseRequest[] = useDemoMode
    ? demoExpenses.filter(r => r.employeeId === currentEmployeeId)
    : (myData?.getMyExpenses ?? []);

  const pendingApprovals: ExpenseRequest[] = useDemoMode
    ? demoExpenseApprovals
    : (pendingData?.getPendingExpenseApprovals ?? []).filter((r: any) => r.employeeId !== currentEmployeeId);

  const activeExpensesList = activeTab === 'my-expenses' ? expensesList : pendingApprovals;

  // Stats calculation
  const totalClaims = expensesList.length;
  const approvedTotal = expensesList
    .filter(r => r.status === 'Approved' || r.status === 'Paid')
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingTotal = expensesList
    .filter(r => r.status === 'Pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const resetForm = () => {
    setCategory('Food');
    setAmount('');
    setComments('');
    setDate(new Date().toISOString().split('T')[0]);
    setReceiptFile(null);
    setUseMileage(false);
    setDistance('');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (useDemoMode) {
      const newClaim: ExpenseRequest = {
        id: `exp-${Date.now()}`,
        employeeId: currentEmployeeId || 'EMP-004',
        employeeName: user?.name || 'John Doe',
        category,
        amount: parseFloat(amount),
        currency,
        date: new Date(date).toISOString(),
        status: 'Pending',
        comments: useMileage ? `${comments} (Mileage: ${distance} units at ${currency} ${ratePerUnit}/unit)` : comments,
        approvedBy: null,
        approvedByName: null,
        approvedOn: null,
        createdAt: new Date().toISOString()
      };

      const updatedRequests = [newClaim, ...demoExpenses];
      const updatedApprovals = [newClaim, ...demoExpenseApprovals];

      setDemoExpenses(updatedRequests);
      setDemoExpenseApprovals(updatedApprovals);
      localStorage.setItem('demo-expenses', JSON.stringify({ requests: updatedRequests, approvals: updatedApprovals }));
      window.dispatchEvent(new Event('demo-expenses-updated'));
      showToast('Expense claim submitted successfully', 'success');
      setShowSubmitModal(false);
      resetForm();
      return;
    }

    try {
      await submitExpenseMutation({
        variables: {
          employeeId: currentEmployeeId,
          category,
          amount: parseFloat(amount),
          currency,
          date: new Date(date).toISOString(),
          comments
        }
      });
    } catch { /* ignore */ }
  };

  // Approve handler
  const handleApprove = async () => {
    if (!selectedExpense) return;
    if (useDemoMode) {
      const nextRequests = demoExpenses.map(r => 
        r.id === selectedExpense.id 
          ? { ...r, status: 'Approved', approvedBy: currentEmployeeId, approvedByName: user?.name ?? 'Manager', approvedOn: new Date().toISOString(), comments: approvalComments || r.comments } 
          : r
      );
      const nextApprovals = demoExpenseApprovals.filter(r => r.id !== selectedExpense.id);
      setDemoExpenses(nextRequests);
      setDemoExpenseApprovals(nextApprovals);
      localStorage.setItem('demo-expenses', JSON.stringify({ requests: nextRequests, approvals: nextApprovals }));
      window.dispatchEvent(new Event('demo-expenses-updated'));
      showToast('Expense claim approved', 'success');
      setShowApprovalModal(false);
      setApprovalComments('');
      return;
    }

    try {
      await approveExpenseMutation({
        variables: {
          expenseId: selectedExpense.id,
          approverId: currentEmployeeId,
          comments: approvalComments
        }
      });
    } catch { /* ignore */ }
  };

  // Reject handler
  const handleReject = async () => {
    if (!selectedExpense) return;
    if (useDemoMode) {
      const nextRequests = demoExpenses.map(r => 
        r.id === selectedExpense.id 
          ? { ...r, status: 'Rejected', comments: approvalComments || 'Rejected by manager' } 
          : r
      );
      const nextApprovals = demoExpenseApprovals.filter(r => r.id !== selectedExpense.id);
      setDemoExpenses(nextRequests);
      setDemoExpenseApprovals(nextApprovals);
      localStorage.setItem('demo-expenses', JSON.stringify({ requests: nextRequests, approvals: nextApprovals }));
      window.dispatchEvent(new Event('demo-expenses-updated'));
      showToast('Expense claim rejected', 'success');
      setShowApprovalModal(false);
      setApprovalComments('');
      return;
    }

    try {
      await rejectExpenseMutation({
        variables: {
          expenseId: selectedExpense.id,
          approverId: currentEmployeeId,
          comments: approvalComments
        }
      });
    } catch { /* ignore */ }
  };

  // Cancel claim (Employee personal action)
  const handleCancel = (requestId: string) => {
    if (useDemoMode) {
      const nextRequests = demoExpenses.map(r => 
        r.id === requestId 
          ? { ...r, status: 'Rejected', comments: 'Cancelled by employee' } 
          : r
      );
      const nextApprovals = demoExpenseApprovals.filter(r => r.id !== requestId);
      setDemoExpenses(nextRequests);
      setDemoExpenseApprovals(nextApprovals);
      localStorage.setItem('demo-expenses', JSON.stringify({ requests: nextRequests, approvals: nextApprovals }));
      window.dispatchEvent(new Event('demo-expenses-updated'));
      showToast('Expense claim cancelled', 'success');
      return;
    }
    // Real mode cancel is not mapped in backend GraphQL schema, so we just log a message
    showToast('Cancel is not supported in real mode database', 'info');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Travel': return <Car className="w-5 h-5 text-sky-500" />;
      case 'Food': return <FileText className="w-5 h-5 text-emerald-500" />;
      default: return <DollarSign className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Expenses & Reimbursements
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Submit expense reports, calculate mileage, and track reimbursement status
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          New Expense Claim
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Claims"
          value={totalClaims.toString()}
          icon={<FileCheck className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Approved Total"
          value={`₹${approvedTotal.toLocaleString()}`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="teal"
        />
        <StatCard
          title="Pending Total"
          value={`₹${pendingTotal.toLocaleString()}`}
          icon={<Clock className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Tabs */}
      {mounted && isManagement && (
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 my-6">
          <button
            onClick={() => setActiveTab('my-expenses')}
            className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my-expenses'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            My Expenses
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            Pending Approvals
            {pendingApprovals.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Claims Listing */}
      <div className="space-y-4">
        {activeExpensesList.length === 0 ? (
          <EmptyState
            title={activeTab === 'my-expenses' ? "No expense reports" : "No pending approvals"}
            description={activeTab === 'my-expenses' ? "You haven't submitted any reimbursement claims yet." : "You have cleared all pending expense claims."}
            icon={<DollarSign className="w-12 h-12 text-zinc-300" />}
          />
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {activeExpensesList.map((expense) => {
                const isPending = expense.status.toLowerCase() === 'pending';
                const isPersonal = useDemoMode ? activeTab === 'my-expenses' : expense.employeeId === currentEmployeeId;
                return (
                  <div
                    key={expense.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                          {expense.category} Claim
                          <span className="text-xs font-normal text-zinc-400">
                            {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </p>
                        {!isPersonal && (
                          <p className="text-xs text-orange-500 font-medium">Submitted by: {expense.employeeName}</p>
                        )}
                        {expense.comments && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 italic">
                            "{expense.comments}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                          {expense.currency === 'USD' ? '$' : '₹'}{expense.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-zinc-400">Amount</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={expense.status.toLowerCase()} />

                        {isPending && (
                          <div className="flex gap-1.5">
                            {isPersonal ? (
                              <button
                                onClick={() => handleCancel(expense.id)}
                                className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                              >
                                Cancel
                              </button>
                            ) : isManagement ? (
                              <button
                                onClick={() => {
                                  setSelectedExpense(expense);
                                  setShowApprovalModal(true);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:opacity-90 shadow-sm"
                              >
                                Review
                              </button>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Submit Expense Form Modal */}
      {showSubmitModal && (
        <FormModal
          title="Submit Expense Report"
          isOpen={showSubmitModal}
          onClose={() => {
            setShowSubmitModal(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Expense Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value !== 'Travel') setUseMileage(false);
                }}
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
              >
                <option value="Food">Food & Dining</option>
                <option value="Travel">Travel & Mileage</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Communication">Communication & Internet</option>
                <option value="OfficeSupplies">Office Supplies</option>
                <option value="Medical">Medical Reimbursements</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                  required
                />
              </div>
            </div>

            {/* Travel-specific Mileage Calculator */}
            {category === 'Travel' && (
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-sky-500" />
                    Mileage Calculator
                  </span>
                  <input
                    type="checkbox"
                    checked={useMileage}
                    onChange={(e) => setUseMileage(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {useMileage && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="block text-[10px] font-semibold text-zinc-500 mb-1">
                        Distance (Km/Miles)
                      </span>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-zinc-500 mb-1">
                        Rate per Unit
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={ratePerUnit}
                        onChange={(e) => setRatePerUnit(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Claim Amount
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-zinc-400 text-sm font-medium">
                  {currency === 'USD' ? '$' : '₹'}
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    if (!useMileage) setAmount(e.target.value);
                  }}
                  disabled={useMileage}
                  className={`w-full text-sm pl-7 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 ${useMileage ? 'opacity-70 bg-zinc-50' : ''}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Receipt Attachment (Simulated)
              </label>
              <input
                type="file"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="w-full text-xs p-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Description & Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Details of the business expense..."
                rows={3}
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                required
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 shadow-sm"
              >
                Submit Claim
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </FormModal>
      )}

      {/* Review & Action Modal for Management */}
      {showApprovalModal && selectedExpense && (
        <FormModal
          title="Review Expense Claim"
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setApprovalComments('');
          }}
        >
          <div className="space-y-4 pt-2">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-500">Employee:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">{selectedExpense.employeeName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-500">Category:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">{selectedExpense.category}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-500">Amount:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  {selectedExpense.currency === 'USD' ? '$' : '₹'}{selectedExpense.amount.toLocaleString()}
                </span>
              </div>
              {selectedExpense.comments && (
                <div className="text-xs pt-1 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-500 block mb-0.5">Details:</span>
                  <span className="italic text-zinc-600 dark:text-zinc-400">"{selectedExpense.comments}"</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Review Comments (Optional)
              </label>
              <textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Reason for approval or rejection..."
                rows={2}
                className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
              />
            </div>

            <div className="flex gap-2.5 pt-3">
              <button
                onClick={handleApprove}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComments('');
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
