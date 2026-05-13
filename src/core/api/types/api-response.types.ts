export type ApiResponse<T> =
  | { success: true; status: number; data: T }
  | { success: false; status: number; error: { code: string; message: string } };