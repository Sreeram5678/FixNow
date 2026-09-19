import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import type { CivicCategory } from '../../types';

export const CitizenPortalView: React.FC = () => {
  const { 
    selectedTicket, 
    setCurrentView,
    upvoteTicket,
    addReportedTicket 
  } = useCivic();

  const [isVerified, setIsVerified] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  // New report form state
  const [reportTitle, setReportTitle] = useState('Broken Streetlight Pole & Dark Road');
  const [reportAddress, setReportAddress] = useState('80ft Road, Koramangala 4th Block');
  const [reportCategory, setReportCategory] = useState<CivicCategory>('streetlight');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleVerification = () => {
    if (!isVerified) {
      setIsVerified(true);
      upvoteTicket(selectedTicket.id);
      showToast("Confirmation added! You'll receive live SMS updates.");
    } else {
      setIsVerified(false);
      showToast('Confirmation updated.');
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `t-${Date.now()}`;
    const newTicketNum = `#FIX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addReportedTicket({
      id: newId,
      ticketNumber: newTicketNum,
      title: reportTitle,
      categoryName: reportCategory === 'pothole' ? 'Pavement & Road Failure' : 'Civic Facility Defect',
      category: reportCategory,
      priority: 'High Priority',
      status: 'needs_review',
      slaTimeLeft: '14:45 left',
      reportedTime: 'Just now',
      reportedVia: 'Citizen Quick Report',
      confirmations: 1,
      contractorTag: 'Dispatching Unit',
      coordinates: {
        lat: 12.9348,
        lng: 77.6250,
        latStr: '12.9348° N',
        lngStr: '77.6250° E',
        address: reportAddress,
        landmark: 'Reported Location',
        ward: 'Ward 14',
      },
      beforePhotoUrl: '',
      afterPhotoUrl: '',
      forensic: {
        defectSurfaceArea: '1 Defect Point',
        aiStructuralSeverity: 'Tier 1 Priority Alert',
        excavationDepth: 'Field Inspection Required',
        pciRating: 'Pending Initial Triage',
        edgeSealIntegrity: 'Pending',
        assignedContractor: 'BBMP Rapid Response Unit #14',
        coldMixVolume: 'Standard Repair Kit',
        compactionRating: 'Target: 120 PSI',
        vehicleNumber: 'Truck KA-01-EA-4912',
        dispatchLag: 'Lag: 1m',
        materialBatch: 'Batch #2026-Q1',
        depotStockDeduction: 'Standard allocation',
        escrowAmount: '₹3,500.00',
        contractorWallet: '#W14-BBMP-881',
        civilAdvisory: 'Automatic 15-minute dispatch triggered. Nearest crew notified.',
      },
      isApproved: false,
    });

    setIsReporting(false);
    showToast('Report submitted! Local repair crew dispatched within 15 minutes.');
  };

  const isResolved = selectedTicket.status === 'resolved';

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 flex flex-col items-center min-h-[calc(100vh-4rem)] font-sans text-slate-900">
      
      {/* Centered Single Card Container (Simple, basic, featherlight) */}
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <header className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              FixNow Citizen App
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs font-bold text-slate-900">
              {selectedTicket.ticketNumber}
            </span>
          </div>

          <button
            onClick={() => setIsReporting(!isReporting)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>{isReporting ? 'Close Form' : 'Report Defect'}</span>
          </button>
        </header>

        {/* Quick Report Form Modal / Drawer (No photos needed, just simple fields) */}
        {isReporting && (
          <form onSubmit={handleCreateReport} className="p-5 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">add_alert</span>
                Report Broken Public Facility (15-Min Response)
              </h3>
              <button 
                type="button" 
                onClick={() => setIsReporting(false)} 
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Issue Type
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as CivicCategory)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                >
                  <option value="pothole">Pothole / Broken Road</option>
                  <option value="streetlight">Streetlight Not Working</option>
                  <option value="drainage">Blocked Drain / Overflow</option>
                  <option value="manhole">Damaged Manhole Cover</option>
                  <option value="water_pipe">Leaking Public Water Pipe</option>
                  <option value="footpath">Broken Footpath / Paver</option>
                  <option value="garbage">Garbage Accumulation</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Location / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={reportAddress}
                  onChange={(e) => setReportAddress(e.target.value)}
                  placeholder="e.g. 80ft Rd, Opp. Sony Signal"
                  className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Brief Problem Description
              </label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Dangerous crater damaging two-wheelers"
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Submit 15-Minute Rapid Fix Alert</span>
            </button>
          </form>
        )}

        {/* Core Incident Card */}
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isResolved 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {isResolved ? '✓ Fixed & Resolved' : 'Crew Active'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedTicket.categoryName}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mt-1.5">
                {selectedTicket.title}
              </h2>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
                  <span>{selectedTicket.coordinates.address}</span>
                </p>
                <button
                  onClick={() => setCurrentView('map')}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  View on Map
                </button>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                Target SLA
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">
                {isResolved ? 'Resolved in 14m' : selectedTicket.slaTimeLeft}
              </span>
            </div>
          </div>

          {/* 15-Minute Progress Stepper */}
          <div className="pt-2">
            <div className="relative flex items-center justify-between text-center">
              <div className="absolute top-3 left-4 right-4 h-[2px] bg-slate-200 z-0"></div>
              <div 
                className="absolute top-3 left-4 h-[2px] bg-slate-900 z-0 transition-all duration-500"
                style={{ width: isResolved ? '94%' : '66%' }}
              ></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-1">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px]">
                  ✓
                </div>
                <span className="text-[10px] font-semibold text-slate-900">Reported</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-1">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px]">
                  ✓
                </div>
                <span className="text-[10px] font-semibold text-slate-900">Assigned</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-1">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[12px]">
                  ✓
                </div>
                <span className="text-[10px] font-semibold text-slate-900">En Route</span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${
                  isResolved 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {isResolved ? '✓' : '4'}
                </div>
                <span className={`text-[10px] font-semibold ${isResolved ? 'text-emerald-700' : 'text-slate-400'}`}>
                  Fixed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Answers (Whom to contact, Has anyone reported, When will it be fixed) */}
        <div className="p-5 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Answer 1: Has anyone reported it? */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Has anyone reported it?
              </span>
              <p className="font-semibold text-slate-900 mt-1">
                Reported {selectedTicket.reportedTime}
              </p>
              <p className="text-slate-500 mt-0.5">
                {selectedTicket.confirmations} local neighbors confirmed
              </p>
            </div>

            <button
              onClick={handleToggleVerification}
              className={`w-full py-1.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isVerified ? 'check' : 'thumb_up'}
              </span>
              <span>{isVerified ? 'You Confirmed (+1)' : "I'm also affected (+1)"}</span>
            </button>
          </div>

          {/* Answer 2: Whom should I contact & When fixed? */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Who is fixing it?
              </span>
              <p className="font-semibold text-slate-900 mt-1">
                {selectedTicket.forensic.assignedContractor.split('(')[0]}
              </p>
              <p className="text-slate-500 font-mono mt-0.5">
                Vehicle: {selectedTicket.forensic.vehicleNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Calling crew dispatcher...')}
                className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg font-medium text-xs flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span>Call Crew</span>
              </button>
              <button
                onClick={() => showToast('Chat channel opened with contractor unit.')}
                className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg font-medium text-xs flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                <span>Message</span>
              </button>
            </div>
          </div>

        </div>

        {/* Live Event Timeline */}
        <div className="p-5 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Public Live Updates &amp; Notes
          </span>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[17px] text-emerald-600 mt-0.5">
                verified
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Rapid Response Unit Assigned</span>
                  <span className="text-[10px] font-mono text-slate-400">11m ago</span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  BBMP Rapid Unit #14 dispatched with quick-repair materials.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[17px] text-slate-400 mt-0.5">
                notifications
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Incident Logged</span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedTicket.reportedTime}</span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  Reported at {selectedTicket.coordinates.address}. 15-minute SLA timer started.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-lg animate-in fade-in duration-200">
          {toastMsg}
        </div>
      )}

    </div>
  );
};
