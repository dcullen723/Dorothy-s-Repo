import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import VendorCard from './components/VendorCard';
import VendorDetail from './components/VendorDetail';
import AddVendorModal from './components/AddVendorModal';
import EmptyState from './components/EmptyState';
import { Vendor, AppFilters, VendorCategory, ALL_CATEGORIES } from './types';
import { fetchVendorIntelligence } from './services/geminiService';
import { SEED_VENDORS } from './utils/seedData';

const STORAGE_KEY = 'legalai_vendors';

const App: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [filters, setFilters] = useState<AppFilters>({ searchQuery: '', selectedCategory: 'All' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [refreshingVendorId, setRefreshingVendorId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Load from localStorage on mount; seed if empty
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVendors(JSON.parse(stored));
      } catch {
        setVendors(SEED_VENDORS);
      }
    } else {
      setVendors(SEED_VENDORS);
    }
  }, []);

  // Persist whenever vendors change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  }, [vendors]);

  // Derived
  const selectedVendor = vendors.find(v => v.id === selectedVendorId) ?? null;

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesCategory =
      filters.selectedCategory === 'All' || v.categories.includes(filters.selectedCategory as VendorCategory);
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleSaveVendor = useCallback((vendor: Vendor) => {
    setVendors(prev => {
      const exists = prev.some(v => v.id === vendor.id);
      return exists ? prev.map(v => v.id === vendor.id ? vendor : v) : [...prev, vendor];
    });
    setSelectedVendorId(vendor.id);
    if (window.innerWidth < 1024) setMobileView('detail');
  }, []);

  const handleDeleteVendor = useCallback((id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    setSelectedVendorId(null);
    if (window.innerWidth < 1024) setMobileView('list');
  }, []);

  const handleRefreshIntelligence = useCallback(async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    setRefreshingVendorId(vendorId);
    const { intelligence, sources } = await fetchVendorIntelligence(vendor.name, vendor.website);
    const now = new Date().toISOString();
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, intelligence: { ...v.intelligence, ...intelligence, lastFetched: now, sources }, updatedAt: now }
        : v
    ));
    setRefreshingVendorId(null);
  }, [vendors]);

  const openAddModal = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleSelectVendor = (id: string) => {
    setSelectedVendorId(id);
    if (window.innerWidth < 1024) setMobileView('detail');
  };

  const handleModalSave = async (vendor: Vendor) => {
    handleSaveVendor(vendor);
    // Auto-fetch intelligence for newly created vendors that have a name
    if (!editingVendor && vendor.name) {
      setTimeout(() => handleRefreshIntelligence(vendor.id), 300);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={q => setFilters(f => ({ ...f, searchQuery: q }))}
        onAddVendor={openAddModal}
        vendorCount={vendors.length}
      />

      {/* Category Filter Bar */}
      <div className="bg-white border-b border-slate-100 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {(['All', ...ALL_CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilters(f => ({ ...f, selectedCategory: cat as AppFilters['selectedCategory'] }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filters.selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel — Vendor List */}
        <div className={`w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden ${
          mobileView === 'detail' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="px-4 py-3 border-b border-slate-50 flex-shrink-0">
            <p className="text-xs text-slate-400 font-medium">
              {filteredVendors.length} of {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {vendors.length === 0 ? (
              <EmptyState
                icon="fa-solid fa-building"
                title="No vendors yet"
                message="Add your first legal AI vendor to start tracking."
                actionLabel="Add Vendor"
                onAction={openAddModal}
              />
            ) : filteredVendors.length === 0 ? (
              <EmptyState
                icon="fa-solid fa-magnifying-glass"
                title="No results"
                message="No vendors match your current search or filter."
              />
            ) : (
              filteredVendors.map(vendor => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  isSelected={vendor.id === selectedVendorId}
                  onSelect={handleSelectVendor}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel — Vendor Detail */}
        <div className={`flex-1 overflow-hidden flex flex-col ${
          mobileView === 'list' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Mobile back button */}
          <div className="lg:hidden flex-shrink-0 px-4 pt-3">
            <button
              onClick={() => setMobileView('list')}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 font-medium"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
              All Vendors
            </button>
          </div>

          {selectedVendor ? (
            <div className="flex-1 overflow-y-auto">
              <VendorDetail
                vendor={selectedVendor}
                onUpdate={handleSaveVendor}
                onDelete={handleDeleteVendor}
                isRefreshing={refreshingVendorId === selectedVendor.id}
                onRefreshIntelligence={handleRefreshIntelligence}
                onEdit={openEditModal}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon="fa-solid fa-arrow-left"
                title="Select a vendor"
                message="Choose a vendor from the list to view and manage its profile."
              />
            </div>
          )}
        </div>
      </div>

      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        existingVendor={editingVendor}
      />
    </div>
  );
};

export default App;
