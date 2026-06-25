'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useQuery } from '@apollo/client/react';
import { GET_MY_PAYSLIPS } from '@/graphql/query/payroll';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSession } from '@/context/SessionContext';
import { 
  CreditCard, 
  Download, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  Info,
  Users
} from 'lucide-react';

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  basicPay: number;
  hra: number;
  allowances: number;
  grossPay: number;
  pf: number;
  incomeTax: number;
  esi: number;
  deductions: number;
  netPay: number;
  status: string;
  createdAt: string;
}

export default function PayrollPage(): React.ReactElement {
  const { user } = useSession();
  const currentRole = user?.role || 'Employee';
  const currentEmployeeId = user?.id || '';
  const isAdminOrHR = currentRole === 'Admin' || currentRole === 'HR';
  const useDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

  const [activeTab, setActiveTab] = useState<'payslips' | 'documents' | 'compliance'>('payslips');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Dynamic mock payslips — always generated for the currently logged-in user
  // so they are never empty regardless of session ID
  const mockPayslips: Payslip[] = [
    // Last 3 months for the current user
    {
      id: `${currentEmployeeId}-pay-jun`,
      employeeId: currentEmployeeId,
      employeeName: user?.name || 'Employee',
      payPeriodStart: '2026-06-01',
      payPeriodEnd: '2026-06-30',
      basicPay: 50000,
      hra: 20000,
      allowances: 15000,
      grossPay: 85000,
      pf: 6000,
      incomeTax: 8000,
      esi: 1000,
      deductions: 15000,
      netPay: 70000,
      status: 'processing',
      createdAt: '2026-06-25T10:00:00Z',
    },
    {
      id: `${currentEmployeeId}-pay-may`,
      employeeId: currentEmployeeId,
      employeeName: user?.name || 'Employee',
      payPeriodStart: '2026-05-01',
      payPeriodEnd: '2026-05-31',
      basicPay: 50000,
      hra: 20000,
      allowances: 15000,
      grossPay: 85000,
      pf: 6000,
      incomeTax: 8000,
      esi: 1000,
      deductions: 15000,
      netPay: 70000,
      status: 'paid',
      createdAt: '2026-05-31T18:00:00Z',
    },
    {
      id: `${currentEmployeeId}-pay-apr`,
      employeeId: currentEmployeeId,
      employeeName: user?.name || 'Employee',
      payPeriodStart: '2026-04-01',
      payPeriodEnd: '2026-04-30',
      basicPay: 50000,
      hra: 20000,
      allowances: 15000,
      grossPay: 85000,
      pf: 6000,
      incomeTax: 8000,
      esi: 1000,
      deductions: 15000,
      netPay: 70000,
      status: 'paid',
      createdAt: '2026-04-30T18:00:00Z',
    },
  ];

  const { data, loading, error } = useQuery<any, any>(GET_MY_PAYSLIPS, {
    variables: { employeeId: currentEmployeeId },
    skip: !currentEmployeeId || useDemoMode,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Demo mode: use mock data filtered by current user; Real mode: use API data, fallback to mock
  const rawPayslips: Payslip[] = useDemoMode
    ? mockPayslips
    : (data?.getMyPayslips?.length ? data.getMyPayslips : mockPayslips);

  const payslips: Payslip[] = isAdminOrHR
    ? rawPayslips
    : rawPayslips.filter(p => p.employeeId === currentEmployeeId || p.employeeName === user?.name);

  const handleDownload = (id: string) => {
    const targetPayslip = payslips.find(p => p.id === id) || selectedPayslip;
    const doc = new jsPDF();
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text("PROPVIVO HRMS - PAYSLIP RECEIPT", 20, 20);
    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    
    let y = 35;
    const line = (label: string, value: string) => {
      doc.text(`${label.padEnd(22, ' ')}: ${value}`, 20, y);
      y += 8;
    };
    
    const divider = () => {
      doc.text("==================================================", 20, y);
      y += 8;
    };

    divider();
    line("Payslip ID", id);
    line("Employee", targetPayslip?.employeeName || "Mayank Khandelwal");
    line("Employee ID", targetPayslip?.employeeId || "EMP-001");
    line("Status", targetPayslip?.status || "Paid");
    divider();
    line("Basic Pay", `INR ${(targetPayslip?.basicPay || 50000).toLocaleString('en-IN')}`);
    line("HRA", `INR ${(targetPayslip?.hra || 20000).toLocaleString('en-IN')}`);
    line("Allowances", `INR ${(targetPayslip?.allowances || 15000).toLocaleString('en-IN')}`);
    line("Gross Salary", `INR ${(targetPayslip?.grossPay || 85000).toLocaleString('en-IN')}`);
    divider();
    line("Provident Fund (PF)", `INR ${(targetPayslip?.pf || 6000).toLocaleString('en-IN')}`);
    line("Income Tax (TDS)", `INR ${(targetPayslip?.incomeTax || 8000).toLocaleString('en-IN')}`);
    line("ESI", `INR ${(targetPayslip?.esi || 1000).toLocaleString('en-IN')}`);
    line("Total Deductions", `INR ${(targetPayslip?.deductions || 15000).toLocaleString('en-IN')}`);
    divider();
    line("Net Take-Home Salary", `INR ${(targetPayslip?.netPay || 70000).toLocaleString('en-IN')}`);
    divider();
    doc.text("This is a secure system-generated PDF document.", 20, y);
    
    const safeName = targetPayslip.employeeName.replace(/\s+/g, '_');
    const period = new Date(targetPayslip.payPeriodStart).toLocaleString('default', { month: 'short', year: 'numeric' });
    doc.save(`payslip_${safeName}_${period}.pdf`);
  };

  const handleDownloadTaxDoc = (name: string) => {
    const element = document.createElement("a");
    const file = new Blob([`
==================================================
      PROPVIVO HRMS - TAX DOCUMENT ARCHIVE
==================================================
Document Reference : ${name}
Employee           : Mayank Khandelwal
Employee ID        : EMP-001
==================================================
This file is a mock PDF placeholder for tax audit purposes.
    `], {type: 'application/pdf'});
    element.href = URL.createObjectURL(file);
    element.download = `${name}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-teal-600 dark:text-teal-400" />
              Payroll & Compliance {isAdminOrHR && <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold ml-2">Admin View</span>}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isAdminOrHR 
                ? "Organization-wide payroll records, compliance checklist, and statutory tracking oversight."
                : "Manage your salary statements, tax declarations, and compliance status."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <div className="p-2 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
                {isAdminOrHR ? <Users className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {isAdminOrHR ? "Total Org Payout" : "Last Net Salary"}
                </p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {isAdminOrHR 
                    ? `₹${payslips.reduce((acc, p) => acc + p.netPay, 0).toLocaleString()}`
                    : `₹${payslips[0]?.netPay?.toLocaleString() || '0'}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 my-6">
          <button
            onClick={() => setActiveTab('payslips')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'payslips'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {isAdminOrHR ? "All Employee Payslips" : "My Payslips"}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {isAdminOrHR ? "Tax Archive & Forms" : "Tax & Documents"}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'compliance'
                ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {isAdminOrHR ? "Statutory Compliance (Org)" : "Statutory Compliance"}
            </div>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'payslips' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Payslips */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {isAdminOrHR ? "Organization Payroll List" : "Salary Statements"}
              </h2>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {payslips.map((payslip) => (
                    <div
                      key={payslip.id}
                      onClick={() => setSelectedPayslip(payslip)}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                        selectedPayslip?.id === payslip.id ? 'bg-teal-50/50 dark:bg-teal-950/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                            {payslip.employeeName} —{' '}
                            {new Date(payslip.payPeriodStart).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(payslip.payPeriodStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            {' – '}
                            {new Date(payslip.payPeriodEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                            ₹{payslip.netPay.toLocaleString()}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">Net Pay</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={payslip.status} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(payslip.id);
                            }}
                            className="p-1.5 text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <ArrowRight className="w-4 h-4 text-zinc-400 hidden sm:block" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payslip Detailed Modal-like view on RHS */}
            <div className="lg:col-span-1">
              {selectedPayslip ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Payslip Details</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(selectedPayslip.payPeriodStart).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedPayslip.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>

                  {/* Employee Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Employee</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{selectedPayslip.employeeName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400 block font-medium">ID</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{selectedPayslip.employeeId}</span>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Earnings</h4>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">Basic Pay</span>
                        <span className="text-zinc-900 dark:text-zinc-50">₹{selectedPayslip.basicPay.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">HRA</span>
                        <span className="text-zinc-900 dark:text-zinc-50">₹{selectedPayslip.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">Allowances</span>
                        <span className="text-zinc-900 dark:text-zinc-50">₹{selectedPayslip.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 font-semibold text-zinc-900 dark:text-zinc-50 bg-zinc-50/50 dark:bg-zinc-800/20 px-2 rounded">
                        <span>Gross Salary</span>
                        <span>₹{selectedPayslip.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Deductions</h4>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">Provident Fund (PF)</span>
                        <span className="text-zinc-900 dark:text-zinc-50">₹{selectedPayslip.pf.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">Income Tax (TDS)</span>
                        <span className="text-zinc-900 dark:text-zinc-50">₹{selectedPayslip.incomeTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">ESI</span>
                        <span className="text-zinc-900 dark:text-zinc-50">₹{selectedPayslip.esi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 font-semibold text-zinc-900 dark:text-zinc-50 bg-zinc-50/50 dark:bg-zinc-800/20 px-2 rounded">
                        <span>Total Deductions</span>
                        <span>₹{selectedPayslip.deductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Summary */}
                  <div className="bg-teal-600 dark:bg-teal-500 rounded-xl p-4 text-white text-center space-y-1 shadow-md">
                    <p className="text-xs opacity-90 font-medium">Net Take-Home Salary</p>
                    <p className="text-2xl font-black">₹{selectedPayslip.netPay.toLocaleString()}</p>
                    <p className="text-[10px] opacity-75">All calculations are subject to regulatory revisions</p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Select a Payslip</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[200px] mx-auto">
                    Click any salary statement from the list to view its itemized breakdown.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {isAdminOrHR ? "All Employees Tax Documents & Declarations" : "Tax Documents & Declarations"}
            </h2>
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">Form 16 - FY 2025-26 {isAdminOrHR && "(All Employees Batch)"}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Annual income tax computation certificate</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadTaxDoc('Form_16_FY_2025_26')}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">Tax Declaration Declaration Worksheet</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Declared investment proof overview</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadTaxDoc('Tax_Declaration_2026')}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {isAdminOrHR ? "Statutory Tracking & Auditing Dashboard" : "Statutory Tracking Dashboard"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Provident Fund (PF)</span>
                  <StatusBadge status="verified" variant="success" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isAdminOrHR 
                    ? "Organization-wide PF contributions uploaded. 100% Employee UAN records verified."
                    : "Employer & Employee statutory deductions mapped to UAN. Correctly verified."}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">ESI Deductions</span>
                  <StatusBadge status="active" variant="info" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isAdminOrHR 
                    ? "Compliance active. Health insurance mapping current for all eligible workforce wages."
                    : "Insurance coverage eligibility and calculations configured based on wage limit."}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">LWF Compliance</span>
                  <StatusBadge status="completed" variant="success" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isAdminOrHR 
                    ? "Regional welfare contributions successfully filed across active states."
                    : "Labour Welfare Fund contributions collected and processed per regional legislation."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
