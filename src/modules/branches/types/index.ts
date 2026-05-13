import type { Branch } from '../../../shared/types';

export interface BranchesState {
  branches: Branch[];
  nearestBranch: Branch | null;
  selectedBranch: Branch | null;
  locationDenied: boolean;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
  fetchNearestBranch: () => Promise<void>;
  selectBranch: (branch: Branch) => void;
  markAsStale: () => void;
  reset: () => void;
}

export type { Branch } from '../../../shared/types';
export type { Coords } from '../../../shared/types';