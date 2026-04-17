import React, { useState } from 'react';
import { VendorContact } from '../types';

interface ContactsTabProps {
  contacts: VendorContact[];
  onUpdate: (contacts: VendorContact[]) => void;
}

const emptyContact = (): Omit<VendorContact, 'id'> => ({
  name: '', title: '', email: '', phone: '', linkedIn: '', notes: '',
});

const ContactsTab: React.FC<ContactsTabProps> = ({ contacts, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyContact());

  const openAdd = () => {
    setForm(emptyContact());
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (contact: VendorContact) => {
    setForm({ name: contact.name, title: contact.title, email: contact.email, phone: contact.phone, linkedIn: contact.linkedIn, notes: contact.notes });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      onUpdate(contacts.map(c => c.id === editingId ? { ...c, ...form } : c));
    } else {
      onUpdate([...contacts, { id: crypto.randomUUID(), ...form }]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(contacts.filter(c => c.id !== id));
  };

  const f = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <i className="fa-solid fa-plus text-xs" />
          Add Contact
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">{editingId ? 'Edit Contact' : 'New Contact'}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={f('name')} placeholder="Full name"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Title</label>
              <input type="text" value={form.title} onChange={f('title')} placeholder="Job title"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Email</label>
              <input type="email" value={form.email} onChange={f('email')} placeholder="email@company.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+1 555-000-0000"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">LinkedIn URL</label>
              <input type="url" value={form.linkedIn} onChange={f('linkedIn')} placeholder="https://linkedin.com/in/..."
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Notes</label>
              <textarea value={form.notes} onChange={f('notes')} placeholder="Any notes about this contact..." rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim()}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Contact list */}
      {contacts.length === 0 && !showForm && (
        <div className="text-center py-8 text-slate-400">
          <i className="fa-solid fa-address-book text-2xl mb-2 block" />
          <p className="text-sm">No contacts added yet.</p>
        </div>
      )}

      <div className="space-y-2">
        {contacts.map(contact => (
          <div key={contact.id} className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-indigo-700">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{contact.name}</p>
              {contact.title && <p className="text-xs text-slate-500 truncate">{contact.title}</p>}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                    <i className="fa-solid fa-envelope" /> {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                    <i className="fa-solid fa-phone" /> {contact.phone}
                  </a>
                )}
                {contact.linkedIn && (
                  <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <i className="fa-brands fa-linkedin" /> LinkedIn
                  </a>
                )}
              </div>
              {contact.notes && <p className="text-xs text-slate-400 mt-1.5 italic">{contact.notes}</p>}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => openEdit(contact)} className="text-slate-300 hover:text-slate-500 p-1 transition-colors">
                <i className="fa-solid fa-pen text-xs" />
              </button>
              <button onClick={() => handleDelete(contact.id)} className="text-slate-300 hover:text-red-400 p-1 transition-colors">
                <i className="fa-solid fa-trash text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsTab;
