import { useEffect } from 'react';
import { useBranchesStore } from '../store';

export const useNearestBranch = () => {
  const { nearestBranch, locationDenied, isLoading, error, fetchNearestBranch, fetchBranches } = useBranchesStore();

  useEffect(() => {
    fetchNearestBranch();
    fetchBranches();
  }, []);

  return { nearestBranch, locationDenied, isLoading, error, fetchNearestBranch, fetchBranches };
};