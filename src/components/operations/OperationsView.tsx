import React from 'react';
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

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Top Telemetry KPI Strip */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-900">Ward 14 Operations Center</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">15-Minute Civic Repair Network</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

          <div className="hidden sm:flex items-center gap-6 text-xs">
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Active</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{activeCount}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Pending Review</span>
              <span className="font-bold text-amber-600 font-mono text-sm">{needsReviewCount}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">15-Min SLA Compliance</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">94.2%</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Resolved</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{resolvedCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('map')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            <span>Live Civic Map</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT LIST (Triage Feed) */}
        <aside className="w-full md:w-[350px] lg:w-[380px] border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
          {/* Search and Filters */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-[17px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, road name..."
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
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Ticket Feed List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.map((ticket: CivicTicket) => {
              const isSelected = selectedTicket.id === ticket.id;
              const ticketResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 cursor-pointer transition-all ${
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

                    <span className="text-[11px] font-mono text-slate-400">
                      {ticket.slaTimeLeft || ticket.reportedTime}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 mt-1 leading-snug line-clamp-1">
                    {ticket.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {ticket.coordinates.address}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-emerald-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">group</span>
                      {ticket.confirmations} confirmations
                    </span>
                    <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {ticket.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT DETAIL WORKSPACE (No images - pure, clean, data-first) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col space-y-5">
          
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isResolved
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isResolved ? '✓ Resolved & Closed' : 'In Progress • 15-Min SLA Active'}
                  </span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-medium text-slate-500">
                    {selectedTicket.categoryName}
                  </span>
                </div>

                <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
                  {selectedTicket.title}
                </h1>

                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
                  <span>{selectedTicket.coordinates.address}</span>
                  <span className="text-slate-300">•</span>
                  <span>Reported {selectedTicket.reportedTime} via {selectedTicket.reportedVia}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('incident_detail')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
                  <span>Citizen View</span>
                </button>
              </div>
            </div>
          </div>

          {/* 15-MINUTE RAPID SLA TRACKER (Core Value Proposition) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">timer</span>
                  15-Minute Rapid Response &amp; Accountability Pipeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated dispatch, field arrival, technical repair, and sign-off within 15 minutes.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2.5 py-1 rounded-md font-bold ${
                  isResolved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-900 text-white'
                }`}>
                  {isResolved ? 'SLA Complied: 14m Total' : `Target: ${selectedTicket.slaTimeLeft}`}
                </span>
              </div>
            </div>

            {/* 4-Stage Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">1. Reported</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Citizen Geotagged</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedTicket.reportedTime}</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">2. Dispatched</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{selectedTicket.contractorTag}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedTicket.forensic.dispatchLag}</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">3. On-Site</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{selectedTicket.forensic.vehicleNumber}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Roller &amp; Crew Deployed</p>
              </div>

              <div className={`p-3 rounded-lg border ${
                isResolved 
                  ? 'border-emerald-300 bg-emerald-50/50' 
                  : 'border-amber-200 bg-amber-50/30'
              }`}>
                <div className={`flex items-center gap-2 mb-1 ${
                  isResolved ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {isResolved ? 'verified' : 'pending'}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">4. Sign-Off</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {isResolved ? 'Audited & Settled' : 'Awaiting Approval'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isResolved ? 'Escrow Released' : 'Ready for Payout'}
                </p>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS & QUALITY AUDIT (Clear structured data table) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-700 text-[18px]">fact_check</span>
              Technical Specifications &amp; Forensic Quality Audit
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Defect Area</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{selectedTicket.forensic.defectSurfaceArea}</span>
                <span className="text-[10px] text-slate-500">{selectedTicket.forensic.aiStructuralSeverity}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Structural Depth</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{selectedTicket.forensic.excavationDepth}</span>
                <span className="text-[10px] text-slate-500">{selectedTicket.forensic.pciRating}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Material Deployed</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{selectedTicket.forensic.coldMixVolume}</span>
                <span className="text-[10px] text-slate-500">{selectedTicket.forensic.materialBatch}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Quality Rating</span>
                <span className="text-sm font-bold text-emerald-700 mt-1 block">{selectedTicket.forensic.compactionRating}</span>
                <span className="text-[10px] text-slate-500">Seal: {selectedTicket.forensic.edgeSealIntegrity}</span>
              </div>
            </div>
          </div>

          {/* FIELD PARTNER & ESCROW SETTLEMENT ACTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Field Contractor Partner */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-slate-700">badge</span>
                Assigned Local Service Partner
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedTicket.forensic.assignedContractor}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedTicket.forensic.vehicleNumber}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Depot Clearance: {selectedTicket.forensic.depotStockDeduction}
                </p>
              </div>
            </div>

            {/* Smart Escrow Payout & Sign-Off */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-700">payments</span>
                    Smart Contract Escrow Payout
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {selectedTicket.forensic.contractorWallet}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {selectedTicket.forensic.escrowAmount}
                </div>
              </div>

              <div>
                {isResolved ? (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Escrow Released &amp; Settled to Contractor Wallet
                  </div>
                ) : (
                  <button
                    onClick={() => approveRepair(selectedTicket.id)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-black active:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Approve Fix &amp; Release {selectedTicket.forensic.escrowAmount} Escrow
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Civil Infrastructure Predictive Advisory */}
          <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-slate-600 text-[20px] shrink-0 mt-0.5">
              info
            </span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800">
                Municipal Civil Advisory Note
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedTicket.forensic.civilAdvisory}
              </p>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
};
