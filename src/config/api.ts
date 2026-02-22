export const API_CONFIG = {
  BASE_URL: 'https://localhost:5001/api/v1/admin',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  VISITORS: {
    BASE: '/visitor',
    BY_ID: (id: string) => `/visitor/${id}`,
    RESTORE: (id: string) => `/visitor/${id}/restore`,
  },
} as const;
