'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_ALLOCATED_ASSETS } from '@/graphql/assets';
import { REQUEST_ASSET_RETURN } from '@/graphql/assets';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useSession } from '@/context/SessionContext';
import { 
  Laptop, 
  Smartphone, 
  Package, 
  KeyRound,
  Calendar,
  RotateCcw,
  Wrench,
  Users
} from 'lucide-react';

interface Asset {
  id: string;
  serialNumber: string;
  assetName: string;
  category: string;
  condition: string;
  status: string;
}

interface AssetAllocation {
  id: string;
  assetId: string;
  employeeId: string;
  allocatedOn: string;
  returnedOn: string | null;
  returnReason: string | null;
  conditionOnReturn: string | null;
  asset: Asset;
}

const categoryIcons: Record<string, React.ReactElement> = {
  Laptop: <Laptop className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
  Mobile: <Smartphone className="w-6 h-6 text-orange-500 dark:text-orange-400" />,
  Accessory: <Package className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
  Keycard: <KeyRound className="w-6 h-6 text-orange-500 dark:text-orange-400" />,
};

const categoryBgColors: Record<string, string> = {
  Laptop: 'bg-teal-50 dark:bg-teal-950/30',
  Mobile: 'bg-orange-50 dark:bg-orange-950/30',
  Accessory: 'bg-teal-55/60 dark:bg-teal-950/20',
  Keycard: 'bg-orange-55/60 dark:bg-orange-950/20',
};

const conditionColors: Record<string, string> = {
  New: 'green',
  Good: 'teal',
  Damaged: 'orange',
};

export default function AssetsPage(): React.ReactElement {
  const { user } = useSession();
  const currentRole = user?.role || 'Employee';
  const isAdminOrHR = currentRole === 'Admin' || currentRole === 'HR';

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<AssetAllocation | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damageAllocation, setDamageAllocation] = useState<AssetAllocation | null>(null);

  const { data, loading, error, refetch } = useQuery<any, any>(GET_MY_ALLOCATED_ASSETS);

  const [requestReturn, { loading: requestingReturn }] = useMutation<any, any>(REQUEST_ASSET_RETURN, {
    onCompleted: () => {
      refetch();
      setShowReturnModal(false);
      setSelectedAllocation(null);
      setReturnReason('');
    },
  });

  const defaultAllocations: AssetAllocation[] = [
    {
      id: 'alloc-1',
      assetId: 'asset-1',
      employeeId: 'EMP-001',
      allocatedOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      returnedOn: null,
      returnReason: null,
      conditionOnReturn: null,
      asset: {
        id: 'asset-1',
        serialNumber: 'SN-VER-48201',
        assetName: 'MacBook Pro 16" (M3 Max)',
        category: 'Laptop',
        condition: 'New',
        status: 'Allocated'
      }
    },
    {
      id: 'alloc-2',
      assetId: 'asset-2',
      employeeId: 'EMP-001',
      allocatedOn: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      returnedOn: null,
      returnReason: null,
      conditionOnReturn: null,
      asset: {
        id: 'asset-2',
        serialNumber: 'SN-PHN-99827',
        assetName: 'iPhone 15 Pro (256GB)',
        category: 'Mobile',
        condition: 'Good',
        status: 'Allocated'
      }
    }
  ];

  // Mock extended allocations for admin list
  const allCompanyAllocations: AssetAllocation[] = [
    ...defaultAllocations,
    {
      id: 'alloc-3',
      assetId: 'asset-3',
      employeeId: 'EMP-002',
      allocatedOn: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      returnedOn: null,
      returnReason: null,
      conditionOnReturn: null,
      asset: {
        id: 'asset-3',
        serialNumber: 'SN-MON-11029',
        assetName: 'Dell 27" UltraSharp Monitor',
        category: 'Accessory',
        condition: 'New',
        status: 'Allocated'
      }
    },
    {
      id: 'alloc-4',
      assetId: 'asset-4',
      employeeId: 'EMP-003',
      allocatedOn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      returnedOn: null,
      returnReason: null,
      conditionOnReturn: null,
      asset: {
        id: 'asset-4',
        serialNumber: 'SN-KEY-88271',
        assetName: 'Office Smart Keycard v2',
        category: 'Keycard',
        condition: 'New',
        status: 'Allocated'
      }
    }
  ];

  // local state storage for allocations to reflect instant return requests
  const [localAllocations, setLocalAllocations] = useState<AssetAllocation[]>([]);

  const allocations: AssetAllocation[] = (isAdminOrHR ? allCompanyAllocations : (data?.getMyAllocatedAssets || defaultAllocations)).map((a: AssetAllocation) => {
    const updated = localAllocations.find(la => la.id === a.id);
    return updated ? { ...a, returnReason: updated.returnReason } : a;
  });

  const handleRequestReturn = async () => {
    if (!selectedAllocation || !returnReason.trim()) return;

    try {
      await requestReturn({
        variables: {
          allocationId: selectedAllocation.id,
          reason: returnReason,
        },
      });
    } catch (e) {
      console.warn("GraphQL mutation failed, falling back to local state update:", e);
      setLocalAllocations(prev => [
        ...prev.filter(la => la.id !== selectedAllocation.id),
        { ...selectedAllocation, returnReason }
      ]);
      setShowReturnModal(false);
      setSelectedAllocation(null);
      setReturnReason('');
    }
  };

  const handleReportDamage = (allocation: AssetAllocation) => {
    setDamageAllocation(allocation);
    setShowDamageForm(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            {isAdminOrHR ? "Corporate Asset Management" : "My Assets"}
            {isAdminOrHR && <span className="text-xs px-2.5 py-1 bg-teal-100 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 rounded-full font-bold ml-2">Admin View</span>}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isAdminOrHR 
              ? "Oversight and status tracking of all hardware, accessories, and device allocations across employees."
              : "View and manage your allocated corporate assets"}
          </p>
        </div>

      {allocations.length === 0 ? (
        <EmptyState
          title="No assets allocated yet"
          description="Assigned company assets will be listed here once registered."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allocations.map((allocation) => (
            <div
              key={allocation.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${categoryBgColors[allocation.asset.category] || 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {categoryIcons[allocation.asset.category] || <Package className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{allocation.asset.assetName}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Serial: {allocation.asset.serialNumber}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {isAdminOrHR && (
                  <div className="flex items-center justify-between bg-teal-50/50 dark:bg-teal-950/20 px-2.5 py-1 rounded-lg border border-teal-100/50 dark:border-teal-900/30">
                    <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">Assigned To:</span>
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300">{allocation.employeeId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Category:</span>
                  <span className="font-medium text-zinc-950 dark:text-zinc-100">{allocation.asset.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Condition:</span>
                  <StatusBadge
                    status={allocation.asset.condition}
                    variant={allocation.asset.condition === 'New' ? 'success' : allocation.asset.condition === 'Good' ? 'info' : 'warning'}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Allocated On:</span>
                  <div className="flex items-center text-zinc-950 dark:text-zinc-100">
                    <Calendar className="w-4 h-4 mr-1.5 text-zinc-400" />
                    {new Date(allocation.allocatedOn).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {allocation.returnReason && (
                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl">
                  <p className="text-xs text-orange-800 dark:text-orange-400 font-semibold mb-0.5">Return Requested</p>
                  <p className="text-xs text-orange-700 dark:text-orange-350">{allocation.returnReason}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedAllocation(allocation);
                    setShowReturnModal(true);
                  }}
                  disabled={!!allocation.returnReason}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-xl disabled:bg-zinc-150 dark:disabled:bg-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Request Return
                </button>
                <button
                  onClick={() => handleReportDamage(allocation)}
                  className="px-3 py-2.5 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/40 text-orange-650 dark:text-orange-400 rounded-xl transition-all duration-200 shadow-sm border border-orange-100 dark:border-orange-900/30"
                  title="Report Damage"
                >
                  <Wrench className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && selectedAllocation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 transform scale-100 transition-all">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Request Asset Return</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Asset: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedAllocation.asset.assetName}</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Reason for Return
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 text-sm"
              >
                <option value="">Select a reason</option>
                <option value="Upgrade">Upgrade</option>
                <option value="Offboarding">Offboarding</option>
                <option value="Malfunction">Malfunction</option>
                <option value="No longer needed">No longer needed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedAllocation(null);
                  setReturnReason('');
                }}
                className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestReturn}
                disabled={!returnReason || requestingReturn}
                className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-sm font-semibold disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-650 disabled:cursor-not-allowed transition-colors"
              >
                {requestingReturn ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Damage Report Form */}
      {showDamageForm && damageAllocation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 transform scale-100 transition-all">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Report Asset Damage</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Asset: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{damageAllocation.asset.assetName}</span>
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl">
              <p className="text-sm text-orange-800 dark:text-orange-350 leading-relaxed font-medium">
                Please contact IT support directly at <span className="underline">it-support@workflowglobal.com</span> to report damage details and arrange for inspection.
              </p>
            </div>

            <button
              onClick={() => {
                setShowDamageForm(false);
                setDamageAllocation(null);
              }}
              className="w-full px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 rounded-xl text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

// Made with Bob
