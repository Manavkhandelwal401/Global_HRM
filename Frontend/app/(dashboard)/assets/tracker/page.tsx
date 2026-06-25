'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_ASSETS, GET_ALL_ALLOCATIONS } from '@/graphql/assets';
import { CREATE_ASSET, ALLOCATE_ASSET, PROCESS_ASSET_RETURN } from '@/graphql/assets';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Laptop, 
  Smartphone, 
  Package, 
  KeyRound,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock
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
  Laptop: <Laptop className="w-5 h-5" />,
  Mobile: <Smartphone className="w-5 h-5" />,
  Accessory: <Package className="w-5 h-5" />,
  Keycard: <KeyRound className="w-5 h-5" />,
};

export default function AssetTrackerPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'all' | 'allocated' | 'available'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [newAsset, setNewAsset] = useState({
    serialNumber: '',
    name: '',
    category: 'Laptop',
  });
  const [employeeId, setEmployeeId] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState<AssetAllocation | null>(null);
  const [returnCondition, setReturnCondition] = useState('');

  const { data: assetsData, loading: assetsLoading, error: assetsError, refetch: refetchAssets } = useQuery<any, any>(
    GET_ALL_ASSETS,
    {
      variables: { category: categoryFilter || null, status: null },
    }
  );

  const { data: allocationsData, loading: allocationsLoading, error: allocationsError, refetch: refetchAllocations } = useQuery<any, any>(
    GET_ALL_ALLOCATIONS
  );

  const [createAsset, { loading: creatingAsset }] = useMutation<any, any>(CREATE_ASSET, {
    onCompleted: () => {
      refetchAssets();
      setShowCreateModal(false);
      setNewAsset({ serialNumber: '', name: '', category: 'Laptop' });
    },
  });

  const [allocateAsset, { loading: allocating }] = useMutation<any, any>(ALLOCATE_ASSET, {
    onCompleted: () => {
      refetchAssets();
      refetchAllocations();
      setShowAllocateModal(false);
      setSelectedAsset(null);
      setEmployeeId('');
    },
  });

  const [processReturn, { loading: processingReturn }] = useMutation<any, any>(PROCESS_ASSET_RETURN, {
    onCompleted: () => {
      refetchAssets();
      refetchAllocations();
      setSelectedAllocation(null);
      setReturnCondition('');
    },
  });

  const defaultAssets: Asset[] = [
    {
      id: 'asset-1',
      serialNumber: 'SN-VER-48201',
      assetName: 'MacBook Pro 16" (M3 Max)',
      category: 'Laptop',
      condition: 'New',
      status: 'Allocated'
    },
    {
      id: 'asset-2',
      serialNumber: 'SN-PHN-99827',
      assetName: 'iPhone 15 Pro (256GB)',
      category: 'Mobile',
      condition: 'Good',
      status: 'Allocated'
    },
    {
      id: 'asset-3',
      serialNumber: 'SN-KEY-11223',
      assetName: 'Office Access Card',
      category: 'Keycard',
      condition: 'New',
      status: 'Available'
    }
  ];

  const defaultAllocations: AssetAllocation[] = [
    {
      id: 'alloc-1',
      assetId: 'asset-1',
      employeeId: 'EMP-001',
      allocatedOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      returnedOn: null,
      returnReason: 'Upgrade',
      conditionOnReturn: null,
      asset: {
        id: 'asset-1',
        serialNumber: 'SN-VER-48201',
        assetName: 'MacBook Pro 16" (M3 Max)',
        category: 'Laptop',
        condition: 'New',
        status: 'Allocated'
      }
    }
  ];

  const allAssets: Asset[] = assetsData?.getAllAssets || defaultAssets;
  const allAllocations: AssetAllocation[] = allocationsData?.getAllAllocations || defaultAllocations;

  const filteredAssets = allAssets.filter((asset) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'allocated' && asset.status === 'Allocated') ||
      (activeTab === 'available' && asset.status === 'Available');
    
    const matchesSearch = 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingReturns = allAllocations.filter(
    (allocation) => allocation.returnReason && !allocation.returnedOn
  );

  const handleCreateAsset = async () => {
    if (!newAsset.serialNumber || !newAsset.name) return;

    await createAsset({
      variables: {
        serialNumber: newAsset.serialNumber,
        name: newAsset.name,
        category: newAsset.category,
      },
    });
  };

  const handleAllocateAsset = async () => {
    if (!selectedAsset || !employeeId) return;

    await allocateAsset({
      variables: {
        assetId: selectedAsset.id,
        employeeId: employeeId,
      },
    });
  };

  const handleProcessReturn = async (allocation: AssetAllocation) => {
    if (!returnCondition) return;

    await processReturn({
      variables: {
        allocationId: allocation.id,
        conditionOnReturn: returnCondition,
      },
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Asset Management Console
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage corporate asset inventory and allocations</p>
        </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Register New Asset
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
            <option value="Accessory">Accessory</option>
            <option value="Keycard">Keycard</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {(['all', 'allocated', 'available'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Assets
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {tab === 'all' && allAssets.length}
                {tab === 'allocated' && allAssets.filter((a) => a.status === 'Allocated').length}
                {tab === 'available' && allAssets.filter((a) => a.status === 'Available').length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Pending Returns Section */}
      {pendingReturns.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Pending Return Requests ({pendingReturns.length})
          </h3>
          <div className="space-y-2">
            {pendingReturns.map((allocation) => (
              <div
                key={allocation.id}
                className="bg-white rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {categoryIcons[allocation.asset.category] || <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{allocation.asset.assetName}</p>
                    <p className="text-sm text-gray-500">
                      Serial: {allocation.asset.serialNumber} • Reason: {allocation.returnReason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedAllocation?.id === allocation.id ? returnCondition : ''}
                    onChange={(e) => {
                      setSelectedAllocation(allocation);
                      setReturnCondition(e.target.value);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                  <button
                    onClick={() => handleProcessReturn(allocation)}
                    disabled={!returnCondition || selectedAllocation?.id !== allocation.id || processingReturn}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <EmptyState 
          title="No assets found"
          description="Try adjusting your filters or create a new asset"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {categoryIcons[asset.category] || <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{asset.assetName}</h3>
                    <p className="text-xs text-gray-500">{asset.serialNumber}</p>
                  </div>
                </div>
                <StatusBadge 
                  status={asset.status} 
                  variant={asset.status === 'Available' ? 'success' : asset.status === 'Allocated' ? 'info' : 'default'}
                />
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{asset.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Condition:</span>
                  <StatusBadge 
                    status={asset.condition}
                    variant={asset.condition === 'New' ? 'success' : asset.condition === 'Good' ? 'info' : 'error'}
                    size="sm"
                  />
                </div>
              </div>

              {asset.status === 'Available' && (
                <button
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowAllocateModal(true);
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Allocate Asset
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Asset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Register New Asset</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={newAsset.serialNumber}
                  onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., LT-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., MacBook Pro 16-inch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Keycard">Keycard</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewAsset({ serialNumber: '', name: '', category: 'Laptop' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAsset}
                disabled={!newAsset.serialNumber || !newAsset.name || creatingAsset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {creatingAsset ? 'Creating...' : 'Create Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Asset Modal */}
      {showAllocateModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Allocate Asset</h2>
            <p className="text-sm text-gray-600 mb-4">
              Asset: <span className="font-medium">{selectedAsset.assetName}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employee ID"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAllocateModal(false);
                  setSelectedAsset(null);
                  setEmployeeId('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocateAsset}
                disabled={!employeeId || allocating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {allocating ? 'Allocating...' : 'Allocate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

// Made with Bob
