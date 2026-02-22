import { Visitor, CreateVisitorRequest, UpdateVisitorRequest } from '../types';
import { visitorService } from './visitor-service';
import { ApiError } from './http-client';

class ApiService {
  async getVisitors(): Promise<Visitor[]> {
    return visitorService.getAll();
  }

  async getVisitorById(id: string): Promise<Visitor> {
    return visitorService.getById(id);
  }

  async createVisitor(visitor: CreateVisitorRequest): Promise<Visitor> {
    return visitorService.create(visitor);
  }

  async restoreVisitor(id: string): Promise<Visitor> {
    return visitorService.restore(id);
  }

  async updateVisitor(visitor: UpdateVisitorRequest): Promise<Visitor> {
    return visitorService.update(visitor);
  }

  async deleteVisitor(id: string): Promise<void> {
    return visitorService.delete(id);
  }
}

export { ApiError };
export const apiService = new ApiService();
