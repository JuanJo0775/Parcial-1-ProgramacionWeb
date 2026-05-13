import type { ApiResponse } from '../../../core/api/types/api-response.types';
import type { Branch } from '../types';
import type { Coords } from '../../../shared/types';
import { api } from '../../../core/api';

export const getBranches = (): Promise<ApiResponse<Branch[]>> =>
  api.getBranches();

export const getNearestBranch = (coords: Coords): Promise<ApiResponse<Branch>> =>
  api.getNearestBranch(coords);