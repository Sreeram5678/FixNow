import React from 'react';
import { useCivic } from '../../context/CivicContext';

export const TopNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    searchQuery, 
    setSearchQuery, 
    resetData 
  } = useCivic();

  return (
    <header className="h-16 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8 select-none">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setCurrentView('operations')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-bold text-xs rounded-lg tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
            FN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-tight text-slate-900 leading-none">
                FIXNOW
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Bengaluru Central
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
              The 15-Minute Civic Repair Network
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Pill Navigation */}
      <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
        <button
          onClick={() => setCurrentView('operations')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'operations'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Command Center</span>
        </button>

        <button
          onClick={() => setCurrentView('map')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'map'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">map</span>
          <span>Civic Map</span>
        </button>

        <button
          onClick={() => setCurrentView('incident_detail')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'incident_detail' || currentView === 'report'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">smartphone</span>
          <span>Citizen App</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[16px] text-slate-400 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="w-44 h-8 pl-8 pr-3 text-xs bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-slate-300 rounded-lg outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetData}
          title="Reset to Initial Demo State"
          className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">restart_alt</span>
          <span className="hidden lg:inline">Reset</span>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
            NO
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Nodal Officer</p>
            <p className="text-[10px] text-slate-500 leading-none">Ward 14</p>
          </div>
        </div>
      </div>
    </header>
  );
};
