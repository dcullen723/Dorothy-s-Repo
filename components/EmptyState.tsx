import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <i className={`${icon} text-2xl text-slate-400`} />
    </div>
    <h3 className="text-slate-700 font-semibold text-lg mb-1">{title}</h3>
    <p className="text-slate-500 text-sm max-w-xs">{message}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
