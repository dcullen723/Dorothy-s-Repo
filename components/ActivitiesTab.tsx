import React, { useState } from 'react';
import { VendorActivity, ActivityType } from '../types';

interface ActivitiesTabProps {
  activities: VendorActivity[];
  onUpdate: (activities: VendorActivity[]) => void;
}

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  Demo: 'fa-solid fa-desktop',
  Call: 'fa-solid fa-phone',
  Meeting: 'fa-solid fa-users',
  Email: 'fa-solid fa-envelope',
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  Demo: 'bg-indigo-100 text-indigo-600',
  Call: 'bg-green-100 text-green-600',
  Meeting: 'bg-blue-100 text-blue-600',
  Email: 'bg-orange-100 text-orange-600',
};

const ACTIVITY_TYPES: ActivityType[] = ['Demo', 'Call', 'Meeting', 'Email'];

const emptyActivity = (): Omit<VendorActivity, 'id'> => ({
  type: 'Demo',
  date: new Date().toISOString().split('T')[0],
  summary: '',
  attendees: [],
  notes: '',
});

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ activities, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyActivity());
  const [attendeeInput, setAttendeeInput] = useState('');

  const sorted = [...activities].sort((a, b) => b.date.localeCompare(a.date));

  const openAdd = () => {
    setForm(emptyActivity());
    setAttendeeInput('');
    setShowForm(true);
  };

  const addAttendee = () => {
    const val = attendeeInput.trim();
    if (val && !form.attendees.includes(val)) {
      setForm(f => ({ ...f, attendees: [...f.attendees, val] }));
    }
    setAttendeeInput('');
  };

  const removeAttendee = (name: string) => {
    setForm(f => ({ ...f, attendees: f.attendees.filter(a => a !== name) }));
  };

  const handleSave = () => {
    if (!form.summary.trim()) return;
    onUpdate([...activities, { id: crypto.randomUUID(), ...form }]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(activities.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{activities.length} activit{activities.length !== 1 ? 'ies' : 'y'}</p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <i className="fa-solid fa-plus text-xs" />
          Log Activity
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">Log Activity</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as ActivityType }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Summary *</label>
              <input
                type="text"
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder="Brief description of the activity..."
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Attendees</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.attendees.map(a => (
                  <span key={a} className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">
                    {a}
                    <button onClick={() => removeAttendee(a)} className="hover:text-red-500">
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={attendeeInput}
                onChange={e => setAttendeeInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addAttendee(); } }}
                onBlur={addAttendee}
                placeholder="Name (role) — press Enter to add"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Key takeaways, action items, follow-ups..."
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5">Cancel</button>
            <button
              onClick={handleSave}
              disabled={!form.summary.trim()}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {sorted.length === 0 && !showForm && (
        <div className="text-center py-8 text-slate-400">
          <i className="fa-solid fa-calendar-days text-2xl mb-2 block" />
          <p className="text-sm">No activities logged yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(activity => (
          <div key={activity.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${ACTIVITY_COLORS[activity.type]}`}>
              <i className={`${ACTIVITY_ICONS[activity.type]} text-xs`} />
            </div>
            <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">{activity.type}</span>
                  <span className="text-xs text-slate-400">{formatDate(activity.date)}</span>
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="text-slate-300 hover:text-red-400 p-0.5 transition-colors"
                >
                  <i className="fa-solid fa-trash text-xs" />
                </button>
              </div>
              <p className="text-sm text-slate-800">{activity.summary}</p>
              {activity.attendees.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activity.attendees.map((a, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                </div>
              )}
              {activity.notes && (
                <p className="text-xs text-slate-400 mt-2 italic border-t border-slate-50 pt-2">{activity.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesTab;
