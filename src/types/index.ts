export interface Visitor {
  id: string;
  fullName: string;
  document: string;
  phone: string;
  email: string;
  isDeleted?: boolean;
}

export interface CreateVisitorRequest {
  fullName: string;
  document: string;
  phone: string;
  email: string;
}

export interface UpdateVisitorRequest extends CreateVisitorRequest {
  id: string;
}
