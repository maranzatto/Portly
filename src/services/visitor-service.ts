import { httpClient } from './http-client';
import { API_ENDPOINTS } from '../config/api';
import { Visitor, CreateVisitorRequest, UpdateVisitorRequest } from '../types';

export class VisitorService {
  async getAll(): Promise<Visitor[]> {
    return httpClient.get<Visitor[]>(API_ENDPOINTS.VISITORS.BASE);
  }

  async getById(id: string): Promise<Visitor> {
    return httpClient.get<Visitor>(API_ENDPOINTS.VISITORS.BY_ID(id));
  }

  async create(visitor: CreateVisitorRequest): Promise<Visitor> {
    return httpClient.post<Visitor>(API_ENDPOINTS.VISITORS.BASE, visitor);
  }

  async update(visitor: UpdateVisitorRequest): Promise<Visitor> {
    return httpClient.put<Visitor>(API_ENDPOINTS.VISITORS.BY_ID(visitor.id), visitor);
  }

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(API_ENDPOINTS.VISITORS.BY_ID(id));
  }

  async restore(id: string): Promise<Visitor> {
    return httpClient.post<Visitor>(API_ENDPOINTS.VISITORS.RESTORE(id));
  }
}

export const visitorService = new VisitorService();
