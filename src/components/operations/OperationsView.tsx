import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import type { CivicTicket } from '../../types';

export const OperationsView: React.FC = () => {
  const { 
    tickets, 
    selectedTicket, 
    setSelectedTicketId, 
    filterStatus, 
    setFilterStatus, 
    searchQuery,
    setSearchQuery,
    approveRepair,
    setCurrentView
  } = useCivic();

  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');

  const filteredTickets = tickets.filter((ticket: CivicTicket) => {
    if (filterStatus === 'needs_review' && ticket.status !== 'needs_review') return false;
    if (filterStatus === 'in_transit' && ticket.status !== 'in_transit') return false;
    if (filterStatus === 'resolved' && ticket.status !== 'resolved') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ticket.ticketNumber.toLowerCase().includes(q) ||
             ticket.title.toLowerCase().includes(q) ||
             ticket.coordinates.address.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = tickets.filter((t: CivicTicket) => t.status !== 'resolved').length;
  const needsReviewCount = tickets.filter((t: CivicTicket) => t.status === 'needs_review').length;
  const resolvedCount = tickets.filter((t: CivicTicket) => t.status === 'resolved').length;

  const isResolved = selectedTicket.status === 'resolved';

  const handleSelectTicketOnMobile = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setMobileTab('detail');
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] bg-slate-50 font-sans text-slate-900 pb-16 md:pb-0 overflow-x-hidden">
      
      {/* Top Telemetry KPI Strip */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 select-none shrink-0">
        <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-900">Ward 14 Hub</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium hidden xs:inline">15-Min Network</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400 font-sans text-[10px] sm:text-[11px] uppercase">Active</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{activeCount}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400 font-sans text-[10px] sm:text-[11px] uppercase">Review</span>
              <span className="font-bold text-amber-600 text-xs sm:text-sm">{needsReviewCount}</span>
            </div>
            <div className="flex items-baseline gap-1 hidden sm:flex">
              <span className="text-slate-400 font-sans text-[10px] sm:text-[11px] uppercase">15m SLA</span>
              <span className="font-bold text-emerald-600 text-xs sm:text-sm">94.2%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400 font-sans text-[10px] sm:text-[11px] uppercase">Done</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{resolvedCount}</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setCurrentView('map')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            <span>Live Civic Map</span>
          </button>
        </div>
      </div>

      {/* Mobile Feed / Detail Switcher (Visible only on mobile) */}
      <div className="flex md:hidden bg-white border-b border-slate-200 px-3 py-2 gap-2">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
            mobileTab === 'list'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          Incident Feed ({filteredTickets.length})
        </button>
        <button
          onClick={() => setMobileTab('detail')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
            mobileTab === 'detail'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          Details: {selectedTicket.ticketNumber}
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT LIST (Triage Feed) - On mobile, toggle visibility based on mobileTab */}
        <aside className={`w-full md:w-[340px] lg:w-[380px] border-r border-slate-200 bg-white flex-col h-full shrink-0 ${
          mobileTab === 'list' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Search and Filters */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 space-y-2.5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-[17px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, road..."
                className="w-full h-8 pl-9 pr-3 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 py-1 rounded-md transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                onClick={() => setFilterStatus('needs_review')}
                className={`flex-1 py-1 rounded-md transition-all ${
                  filterStatus === 'needs_review'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Review ({needsReviewCount})
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`flex-1 py-1 rounded-md transition-all ${
                  filterStatus === 'resolved'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Done ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Ticket Feed List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pb-16 md:pb-0">
            {filteredTickets.map((ticket: CivicTicket) => {
              const isSelected = selectedTicket.id === ticket.id;
              const ticketResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  onClick={() => handleSelectTicketOnMobile(ticket.id)}
                  className={`p-3.5 sm:p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-50 border-l-4 border-slate-900'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        ticketResolved 
                          ? 'bg-emerald-500' 
                          : ticket.priority === 'High Priority' || ticket.priority === 'Urgent'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}></span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {ticket.ticketNumber}
                      </span>
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                      {ticket.slaTimeLeft || ticket.reportedTime}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 mt-1 leading-snug line-clamp-1">
                    {ticket.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {ticket.coordinates.address}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-emerald-700 flex items-center gap-1 text-[10px] sm:text-[11px]">
                      <span className="material-symbols-outlined text-[13px]">group</span>
                      {ticket.confirmations} confirmed
                    </span>
                    <span className="text-slate-400 font-mono text-[9px] sm:text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {ticket.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT DETAIL WORKSPACE - On mobile, toggle visibility based on mobileTab */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex-col space-y-4 sm:space-y-5 pb-24 md:pb-8 ${
          mobileTab === 'detail' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Mobile Back Button */}
          <div className="flex md:hidden items-center justify-between">
            <button
              onClick={() => setMobileTab('list')}
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-lg bg-white border border-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Incident Feed</span>
            </button>
            <span className="text-xs font-mono font-bold text-slate-500">
              {selectedTicket.ticketNumber}
            </span>
          </div>

          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isResolved
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isResolved ? '✓ Resolved' : '15-Min SLA Active'}
                  </span>
                  <span className="text-xs text-slate-300 hidden sm:inline">•</span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                    {selectedTicket.categoryName}
                  </span>
                </div>

                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight mt-1.5">
                  {selectedTicket.title}
                </h1>

                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  <span>{selectedTicket.coordinates.address}</span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-slate-400 text-[10px] sm:text-xs block sm:inline">
                    {selectedTicket.reportedTime} via {selectedTicket.reportedVia}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('incident_detail')}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
                  <span className="hidden xs:inline">Citizen View</span>
                </button>
              </div>
            </div>
          </div>

          {/* 15-MINUTE RAPID SLA TRACKER */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">timer</span>
                  15-Minute SLA Pipeline
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                  Automated dispatch, on-site arrival, and sign-off within 15 minutes.
                </p>
              </div>

              <span className={`px-2 py-0.5 sm:py-1 rounded font-mono text-[11px] sm:text-xs font-bold shrink-0 ${
                isResolved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-900 text-white'
              }`}>
                {isResolved ? '14m Total' : selectedTicket.slaTimeLeft}
              </span>
            </div>

            {/* 4-Stage Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1">
              <div className="p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span className="text-[10px] font-bold uppercase">1. Reported</span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">Citizen Alert</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedTicket.reportedTime}</p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span className="text-[10px] font-bold uppercase">2. Dispatched</span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">{selectedTicket.contractorTag}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedTicket.forensic.dispatchLag}</p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span className="text-[10px] font-bold uppercase">3. On-Site</span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">{selectedTicket.forensic.vehicleNumber}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Crew Deployed</p>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-lg border ${
                isResolved 
                  ? 'border-emerald-300 bg-emerald-50/50' 
                  : 'border-amber-200 bg-amber-50/30'
              }`}>
                <div className={`flex items-center gap-1.5 mb-0.5 ${
                  isResolved ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  <span className="material-symbols-outlined text-[15px]">
                    {isResolved ? 'verified' : 'pending'}
                  </span>
                  <span className="text-[10px] font-bold uppercase">4. Sign-Off</span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">
                  {isResolved ? 'Audited' : 'Awaiting'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isResolved ? 'Escrow Released' : 'Ready'}
                </p>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS & AUDIT */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-700 text-[18px]">fact_check</span>
              Technical Specifications &amp; Quality Audit
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs">
              <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Defect Area</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{selectedTicket.forensic.defectSurfaceArea}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 truncate block">{selectedTicket.forensic.aiStructuralSeverity}</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Depth</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{selectedTicket.forensic.excavationDepth}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 truncate block">{selectedTicket.forensic.pciRating}</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Material</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">{selectedTicket.forensic.coldMixVolume}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 truncate block">{selectedTicket.forensic.materialBatch}</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Quality</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 block">{selectedTicket.forensic.compactionRating}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 truncate block">Seal: {selectedTicket.forensic.edgeSealIntegrity}</span>
              </div>
            </div>
          </div>

          {/* FIELD PARTNER & ESCROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-slate-700">badge</span>
                Assigned Local Service Partner
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedTicket.forensic.assignedContractor}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5">
                  {selectedTicket.forensic.vehicleNumber}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Stock: {selectedTicket.forensic.depotStockDeduction}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-slate-700">payments</span>
                    Escrow Payout
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500">
                    {selectedTicket.forensic.contractorWallet}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-0.5">
                  {selectedTicket.forensic.escrowAmount}
                </div>
              </div>

              <div>
                {isResolved ? (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Escrow Released to Contractor
                  </div>
                ) : (
                  <button
                    onClick={() => approveRepair(selectedTicket.id)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-black active:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Approve Fix &amp; Release {selectedTicket.forensic.escrowAmount}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Advisory */}
          <div className="bg-slate-100 rounded-xl border border-slate-200 p-3.5 sm:p-4 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-slate-600 text-[18px] shrink-0 mt-0.5">
              info
            </span>
            <div className="space-y-0.5">
              <h4 className="text-[11px] sm:text-xs font-bold text-slate-800">
                Civil Infrastructure Advisory Note
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                {selectedTicket.forensic.civilAdvisory}
              </p>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
};
