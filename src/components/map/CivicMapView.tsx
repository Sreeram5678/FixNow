import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { CivicTicket } from '../../types';

const MapRecenter: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(coords, 15, { duration: 1.0 });
  }, [coords, map]);
  return null;
};

const createLightMarker = (ticket: CivicTicket, isSelected: boolean) => {
  const isPothole = ticket.category === 'pothole';
  const isDrainage = ticket.category === 'drainage';

  const dotColor = isPothole ? '#ef4444' : isDrainage ? '#0284c7' : '#d97706';

  const html = `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="
        background: #ffffff; 
        border: 1px solid #e2e8f0; 
        border-radius: 4px; 
        padding: 2px 6px; 
        font-size: 11px; 
        font-weight: 600; 
        display: flex; 
        align-items: center; 
        gap: 4px; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        white-space: nowrap;
        transform: ${isSelected ? 'scale(1.08)' : 'scale(1)'};
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${dotColor};"></span>
        <span style="color: #0f172a;">${ticket.coordinates.landmark}</span>
        <span style="color: #64748b; font-size: 10px; font-weight: normal;">${ticket.priority.split(' ')[0]}</span>
      </div>
      <div style="
        width: 24px; 
        height: 24px; 
        background: #0f172a; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-size: 12px; 
        margin-top: 2px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
      ">
        <span class="material-symbols-outlined" style="font-size: 14px;">
          ${isPothole ? 'warning' : isDrainage ? 'water' : 'lightbulb'}
        </span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html,
    iconSize: [120, 50],
    iconAnchor: [60, 48],
  });
};

export const CivicMapView: React.FC = () => {
  const { 
    tickets, 
    selectedTicket, 
    setSelectedTicketId, 
    setCurrentView,
    upvoteTicket 
  } = useCivic();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pothole' | 'drainage' | 'streetlight'>('all');
  const [sheetVisible, setSheetVisible] = useState(true);

  const filteredTickets = tickets.filter((t: CivicTicket) => {
    if (activeFilter === 'all') return true;
    return t.category === activeFilter;
  });

  const centerCoords: [number, number] = [selectedTicket.coordinates.lat, selectedTicket.coordinates.lng];

  return (
    <div className="relative w-full h-[calc(100dvh-3.5rem)] md:h-[calc(100vh-4rem)] bg-[#F8FAFC] flex flex-col font-sans text-[13px] text-slate-900 overflow-hidden pb-14 md:pb-0">
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 inset-x-3 md:top-4 md:left-6 md:right-auto md:w-[480px] z-30 flex flex-col gap-2 pointer-events-auto">
        {/* Search input with RK badge */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 flex-1">
            <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input 
              type="text"
              placeholder="Search tickets, wards, roads..."
              className="bg-transparent border-none outline-none text-[13px] text-slate-900 w-full placeholder:text-slate-400"
            />
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
            RK
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All Issues ({tickets.length})
          </button>

          <button
            onClick={() => setActiveFilter('pothole')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
              activeFilter === 'pothole'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Potholes ({tickets.filter(t => t.category === 'pothole').length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('drainage')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
              activeFilter === 'drainage'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>Drainage ({tickets.filter((t: CivicTicket) => t.category === 'drainage').length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('streetlight')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
              activeFilter === 'streetlight'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>Streetlights ({tickets.filter((t: CivicTicket) => t.category === 'streetlight').length})</span>
          </button>
        </div>
      </div>

      {/* Map Surface (Clean CartoDB Light Tiles) */}
      <div className="w-full h-full relative z-0">
        <MapContainer
          center={centerCoords}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#f8fafc' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter coords={centerCoords} />

          {/* Heat Circle for high defect areas */}
          {filteredTickets.map((t: CivicTicket) => (
            <Circle
              key={`c-${t.id}`}
              center={[t.coordinates.lat, t.coordinates.lng]}
              radius={180}
              pathOptions={{
                color: t.category === 'pothole' ? '#ef4444' : '#0ea5e9',
                fillColor: t.category === 'pothole' ? '#ef4444' : '#0ea5e9',
                fillOpacity: 0.12,
                weight: 1,
                dashArray: '4, 4'
              }}
            />
          ))}

          {/* Interactive Markers */}
          {filteredTickets.map((ticket: CivicTicket) => {
            const isSelected = selectedTicket.id === ticket.id;
            return (
              <Marker
                key={ticket.id}
                position={[ticket.coordinates.lat, ticket.coordinates.lng]}
                icon={createLightMarker(ticket, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedTicketId(ticket.id);
                    setSheetVisible(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 font-sans">
                    <div className="font-mono text-xs font-bold text-slate-700">{ticket.ticketNumber}</div>
                    <div className="font-semibold text-xs mt-0.5">{ticket.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{ticket.coordinates.address}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Floating Incident Sheet (Stitch Screen 2) */}
      {sheetVisible && selectedTicket && (
        <div className="absolute bottom-18 md:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] z-30 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Sheet Handle */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto -mt-1 mb-1"></div>

          {/* Title Header */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-semibold text-[#0F172A] leading-tight">
                  {selectedTicket.title}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 border border-slate-200 text-slate-600 bg-slate-50 rounded-md">
                  {selectedTicket.priority.split(' ')[0]}
                </span>
              </div>
              <button 
                onClick={() => setSheetVisible(false)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-[12px] text-[#64748B] mt-1">
              {selectedTicket.coordinates.address} • Reported {selectedTicket.reportedTime}
            </p>
          </div>

          {/* Status & Verification Grid */}
          <div className="grid grid-cols-2 gap-3 text-[13px] border-y border-slate-100 py-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block">
                Dispatch Status
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-medium text-[#0F172A]">
                <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                <span>Crew Dispatched • ETA 6 mins</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block">
                Community Verification
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-medium text-[#0F172A]">
                <span className="material-symbols-outlined text-[16px] text-[#059669]">check_circle</span>
                <span>{selectedTicket.confirmations} neighbors verified</span>
              </div>
            </div>
          </div>

          {/* Assigned Crew Box */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-2">
              ASSIGNED RAPID RESPONSE UNIT
            </span>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0F172A] leading-tight">
                  {selectedTicket.forensic.assignedContractor}
                </p>
                <p className="text-[12px] text-[#64748B] mt-0.5 truncate">
                  {selectedTicket.forensic.vehicleNumber} • {selectedTicket.forensic.dispatchLag}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => upvoteTicket(selectedTicket.id)}
              className="flex-1 h-11 bg-[#059669] hover:bg-[#047857] active:bg-[#064e3b] text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span>Confirm Hazard &amp; Track Crew</span>
            </button>

            <button
              onClick={() => setCurrentView('incident_detail')}
              className="h-11 px-4 border border-slate-200 hover:bg-slate-50 text-slate-800 text-[13px] font-semibold rounded-xl transition-colors"
            >
              View Details
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
