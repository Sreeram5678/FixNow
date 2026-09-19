import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { TopNav } from './components/navigation/TopNav';
import { OperationsView } from './components/operations/OperationsView';
import { CivicMapView } from './components/map/CivicMapView';
import { CitizenPortalView } from './components/citizen/CitizenPortalView';

const AppContent: React.FC = () => {
  const { currentView } = useCivic();

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-white text-slate-900">
      <TopNav />
      
      {currentView === 'operations' && <OperationsView />}
      {currentView === 'map' && <CivicMapView />}
      {(currentView === 'incident_detail' || currentView === 'report') && <CitizenPortalView />}
    </div>
  );
};

export function App() {
  return (
    <CivicProvider>
      <AppContent />
    </CivicProvider>
  );
}

export default App;
