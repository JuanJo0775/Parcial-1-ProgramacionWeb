import { create } from 'zustand';
import { getBranches, getNearestBranch } from '../services/branches.service';
import { requestGeolocation } from '../utils/geolocation.util';
import type { BranchesState } from '../types';
export type { BranchesState };

let abortController: AbortController | null = null;

export const useBranchesStore = create<BranchesState>((set) => ({
  branches: [],
  nearestBranch: null,
  selectedBranch: null,
  locationDenied: false,
  isLoading: false,
  isStale: false,
  error: null,

  fetchBranches: async () => {
    abortController?.abort();
    abortController = new AbortController();
    set({ isLoading: true, error: null });

    const response = await getBranches();
    if (response.success) {
      set({ branches: response.data, isLoading: false, isStale: false });
    } else {
      set({ error: response.error.message, isLoading: false });
    }
  },

  fetchNearestBranch: async () => {
    set({ isLoading: true, error: null, locationDenied: false });

    const geoResult = await requestGeolocation();

    if (!geoResult.granted) {
      set({ locationDenied: true, isLoading: false });
      return;
    }

    const { coords } = geoResult;
    const response = await getNearestBranch(coords);
    if (response.success) {
      set({ nearestBranch: response.data, selectedBranch: response.data, isLoading: false });
    } else {
      set({ error: response.error.message, isLoading: false });
    }
  },

  selectBranch: (branch) => set({ selectedBranch: branch }),

  markAsStale: () => set({ branches: [], isStale: true }),

  reset: () => {
    abortController?.abort();
    set({
      branches: [],
      nearestBranch: null,
      selectedBranch: null,
      locationDenied: false,
      isLoading: false,
      isStale: false,
      error: null,
    });
  },
}));