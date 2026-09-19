import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CivicTicket } from '../types';
import { INITIAL_TICKETS } from '../data/ticketsData';
import confetti from 'canvas-confetti';

interface CivicContextType {
  tickets: CivicTicket[];
  selectedTicket: CivicTicket;
  setSelectedTicketId: (id: string) => void;
  currentView: 'operations' | 'map' | 'incident_detail' | 'report';
  setCurrentView: (view: 'operations' | 'map' | 'incident_detail' | 'report') => void;
  filterStatus: 'all' | 'needs_review' | 'in_transit' | 'resolved';
  setFilterStatus: (filter: 'all' | 'needs_review' | 'in_transit' | 'resolved') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  approveRepair: (ticketId: string) => void;
  upvoteTicket: (ticketId: string) => void;
  addReportedTicket: (ticket: CivicTicket) => void;
  resetData: () => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<CivicTicket[]>(() => {
    const saved = localStorage.getItem('fixnow_civic_tickets_v4');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_TICKETS[0].id);
  const [currentView, setCurrentView] = useState<'operations' | 'map' | 'incident_detail' | 'report'>('operations');
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs_review' | 'in_transit' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('fixnow_civic_tickets_v4', JSON.stringify(tickets));
  }, [tickets]);

  const selectedTicket = tickets.find((t: CivicTicket) => t.id === selectedTicketId) || tickets[0];

  const approveRepair = (ticketId: string) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#047857', '#10b981', '#a7f3d0']
    });

    setTickets((prev: CivicTicket[]) =>
      prev.map((t: CivicTicket) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              isApproved: true,
              contractorTag: 'Approved & Settled',
              forensic: {
                ...t.forensic,
                escrowAmount: '₹0.00 (Settled)',
              }
            }
          : t
      )
    );
  };

  const upvoteTicket = (ticketId: string) => {
    setTickets((prev: CivicTicket[]) =>
      prev.map((t: CivicTicket) =>
        t.id === ticketId ? { ...t, confirmations: t.confirmations + 1 } : t
      )
    );
  };

  const addReportedTicket = (newTicket: CivicTicket) => {
    setTickets((prev: CivicTicket[]) => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    setCurrentView('incident_detail');
  };

  const resetData = () => {
    localStorage.removeItem('fixnow_civic_tickets_v2');
    setTickets(INITIAL_TICKETS);
    setSelectedTicketId(INITIAL_TICKETS[0].id);
  };

  return (
    <CivicContext.Provider
      value={{
        tickets,
        selectedTicket,
        setSelectedTicketId,
        currentView,
        setCurrentView,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        approveRepair,
        upvoteTicket,
        addReportedTicket,
        resetData
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within CivicProvider');
  }
  return context;
};
