import type { ApiResponse } from '../../core/api/types/api-response.types';
import type { Branch, Coords } from '../../shared/types';
import { branchesData } from '../data/branches.data';
import { delay } from '../utils/delay.util';
import { mockSuccess, mockError, shouldSimulateError } from '../utils/mock-response.util';
import { haversineDistance } from '../utils/haversine.util';

export const getBranchesHandler = async (): Promise<ApiResponse<Branch[]>> => {
  await delay();
  if (shouldSimulateError()) {
    console.error('500 Internal Server Error – getBranches');
    return mockError(500, 'INTERNAL_SERVER_ERROR', 'Error inesperado del servidor. Intenta de nuevo.');
  }
  return mockSuccess(branchesData, 200);
};

export const getNearestBranchHandler = async (coords: Coords): Promise<ApiResponse<Branch>> => {
  await delay();
  if (shouldSimulateError()) {
    console.error('500 Internal Server Error – getNearestBranch');
    return mockError(500, 'INTERNAL_SERVER_ERROR', 'Error inesperado del servidor. Intenta de nuevo.');
  }
  if (branchesData.length === 0) {
    return mockError(404, 'NOT_FOUND', 'No hay sucursales disponibles.');
  }
  if (coords.lat < -90 || coords.lat > 90 || coords.lng < -180 || coords.lng > 180) {
    return mockError(400, 'BAD_REQUEST', 'Coordenadas fuera de rango válido.');
  }

  let nearest = branchesData[0]!;
  for (const branch of branchesData) {
    const distToNearest = haversineDistance(coords, { lat: nearest.lat, lng: nearest.lng });
    const distToBranch = haversineDistance(coords, { lat: branch.lat, lng: branch.lng });
    if (distToBranch < distToNearest) {
      nearest = branch;
    }
  }

  return mockSuccess(nearest, 200);
};