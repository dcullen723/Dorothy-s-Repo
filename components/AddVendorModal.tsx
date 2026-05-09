import React, { useState, useEffect, useCallback } from 'react';
import { Vendor, VendorCategory, ALL_CATEGORIES } from '../types';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Vendor) => void;
  existingVendor?: Vendor | null;
}

interface FormState {
  name: string;
  website: string;
  description: string;
  categories: VendorCategory[];
  dataSourceInput: string;
  dataSources: string[];
  integrationInput: string;
  integrations: string[];
}

const emptyForm = (): FormState => ({
  name: '',
  website: '',
  description: '',
  categories: [],
  dataSourceInput: '',
  dataSources: [],
  integrationInput: '',
  integrations: [],
});

const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose, onSave, existingVendor }) => {
  const [form, setForm] = useState<FormState>(emptyForm());

  useEffect(() => {
    if (existingVendor) {
      setForm({
        name: existingVendor.name,
        website: existingVendor.website,
        description: existingVendor.description,
        categories: existingVendor.categories,
        dataSourceInput: '',
        dataSources: existingVendor.dataSources,
        integrationInput: '',
        integrations: existingVendor.integrations,
      });
    } else {
      setForm(emptyForm());
    }
  }, [existingVendor, isOpen]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleEscape]);

  const toggleCategory = (cat: VendorCategory) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const addTag = (field: 'dataSources' | 'integrations', inputField: 'dataSourceInput' | 'integrationInput') => {
    const val = form[inputField].trim();
    if (val && !form[field].includes(val)) {
      setForm(f => ({ ...f, [field]: [...f[field], val], [inputField]: '' }));
    } else {
      setForm(f => ({ ...f, [inputField]: '' }));
    }
  };

  const removeTag = (field: 'dataSources' | 'integrations', tag: string) => {
    setForm(f => ({ ...f, [field]: f[field].filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'dataSources' | 'integrations',
    inputField: 'dataSourceInput' | 'integrationInput'
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(field, inputField);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const now = new Date().toISOString();
    const vendor: Vendor = existingVendor
      ? {
          ...existingVendor,
          name: form.name.trim(),
          website: form.website.trim(),
          description: form.description.trim(),
          categories: form.categories,
          dataSources: form.dataSources,
          integrations: form.integrations,
          updatedAt: now,
        }
      : {
          id: crypto.randomUUID(),
          name: form.name.trim(),
          website: form.website.trim(),
          description: form.description.trim(),
          categories: form.categories,
          dataSources: form.dataSources,
          integrations: form.integrations,
          contacts: [],
          activities: [],
          intelligence: {
            latestRelease: '',
            aiModels: [],
            recentFeatures: [],
            lastFetched: null,
            sources: [],
          },
          createdAt: now,
          updatedAt: now,
        };
    onSave(vendor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {existingVendor ? 'Edit Vendor' : 'Add Vendor'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-5 flex-1">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Harvey AI"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              placeholder="https://example.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of what this vendor does..."
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data Sources</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.dataSources.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {tag}
                  <button onClick={() => removeTag('dataSources', tag)} className="hover:text-blue-600">
                    <i className="fa-solid fa-xmark text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={form.dataSourceInput}
              onChange={e => setForm(f => ({ ...f, dataSourceInput: e.target.value }))}
              onKeyDown={e => handleTagKeyDown(e, 'dataSources', 'dataSourceInput')}
              onBlur={() => addTag('dataSources', 'dataSourceInput')}
              placeholder="Type and press Enter to add..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Integrations */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Integrations</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.integrations.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  {tag}
                  <button onClick={() => removeTag('integrations', tag)} className="hover:text-purple-600">
                    <i className="fa-solid fa-xmark text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={form.integrationInput}
              onChange={e => setForm(f => ({ ...f, integrationInput: e.target.value }))}
              onKeyDown={e => handleTagKeyDown(e, 'integrations', 'integrationInput')}
              onBlur={() => addTag('integrations', 'integrationInput')}
              placeholder="Type and press Enter to add..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {existingVendor ? 'Save Changes' : 'Add Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVendorModal;
