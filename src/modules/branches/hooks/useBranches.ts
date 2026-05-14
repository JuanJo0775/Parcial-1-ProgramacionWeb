import { useEffect } from 'react';
import { useBranchesStore } from '../store';

export const useBranches = () => {
  const { branches, isLoading, error, fetchBranches, isStale } = useBranchesStore();

  useEffect(() => {
    if (branches.length === 0 || isStale) {
      fetchBranches();
    }
  }, [branches.length, isStale, fetchBranches]);

  return { branches, isLoading, error, fetchBranches };
};