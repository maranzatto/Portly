import { Visitor, CreateVisitorRequest, UpdateVisitorRequest } from '../types';

const API_BASE_URL = 'https://localhost:5001/api/v1/admin';

interface ApiError {
  error: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = (errorData as ApiError)?.error || errorMessage;
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (response.status === 204) {
        return {} as T;
      }
      
      if (!isJson || response.headers.get('Content-Length') === '0') {
        return {} as T;
      }

      try {
        return await response.json();
      } catch (parseError) {
        console.warn('JSON parse failed for successful response:', parseError);
        throw new Error('Formato de resposta inválido do servidor');
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getVisitors(): Promise<Visitor[]> {
    return this.request<Visitor[]>('/visitor');
  }

  async getVisitorById(id: string): Promise<Visitor> {
    return this.request<Visitor>(`/visitor/${id}`);
  }

  async createVisitor(visitor: CreateVisitorRequest): Promise<Visitor> {
    return this.request<Visitor>('/visitor', {
      method: 'POST',
      body: JSON.stringify(visitor),
    });
  }

  async restoreVisitor(id: string): Promise<Visitor> {
    return this.request<Visitor>(`/visitor/${id}/restore`, {
      method: 'POST',
    });
  }

  async updateVisitor(visitor: UpdateVisitorRequest): Promise<Visitor> {
    return this.request<Visitor>(`/visitor/${visitor.id}`, {
      method: 'PUT',
      body: JSON.stringify(visitor),
    });
  }

  async deleteVisitor(id: string): Promise<void> {
    await this.request<void>(`/visitor/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
