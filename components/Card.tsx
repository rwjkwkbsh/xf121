
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 py-3 border-b border-slate-700/50 bg-slate-900/30 flex items-center gap-3">
        {icon && <span className="text-blue-400">{icon}</span>}
        <h3 className="font-bold text-slate-100 text-sm tracking-wider uppercase">{title}</h3>
      </div>
      <div className="p-5 text-slate-300 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
};
