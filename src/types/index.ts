export type CivicCategory = 
  | 'pothole' 
  | 'streetlight' 
  | 'drainage' 
  | 'water_pipe' 
  | 'manhole' 
  | 'footpath' 
  | 'garbage';

export type IssuePriority = 'High Priority' | 'Urgent' | 'Moderate' | 'Low';
export type IssueStatus = 'needs_review' | 'in_transit' | 'resolved';

export interface GeoCoordinates {
  lat: number;
  lng: number;
  latStr: string;
  lngStr: string;
  address: string;
  landmark: string;
  ward: string;
}

export interface ForensicDetails {
  defectSurfaceArea: string;
  aiStructuralSeverity: string;
  excavationDepth: string;
  pciRating: string;
  edgeSealIntegrity: string;
  assignedContractor: string;
  coldMixVolume: string;
  compactionRating: string;
  vehicleNumber: string;
  dispatchLag: string;
  materialBatch: string;
  depotStockDeduction: string;
  escrowAmount: string;
  contractorWallet: string;
  civilAdvisory: string;
}

export interface CivicTicket {
  id: string;
  ticketNumber: string;
  title: string;
  categoryName: string;
  category: CivicCategory;
  priority: IssuePriority;
  status: IssueStatus;
  reportedTime: string;
  reportedVia: string;
  slaTimeLeft?: string;
  confirmations: number;
  contractorTag: string;
  coordinates: GeoCoordinates;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  forensic: ForensicDetails;
  isApproved?: boolean;
}
