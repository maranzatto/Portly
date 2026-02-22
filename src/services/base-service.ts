import { httpClient } from './http-client';

export abstract class BaseService {
  protected http = httpClient;
  
  protected handleApiError(error: any, context: string) {
    console.error(`[${context}] Erro na API:`, error);
    
    if (error.status === 401) {
      console.warn('Não autorizado');
    }
    
    if (error.status >= 500) {
      console.warn('Erro interno do servidor');
    }
    
    throw error;
  }
}
