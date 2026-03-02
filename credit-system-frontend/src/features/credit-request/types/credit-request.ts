export interface FormCreditRequest {
  amount: number;
  currency: string;
  applicantName: string;
  applicantEmail: string;
  document: string;
  countryId: string;
}

export interface CreditRequest {
  _id: string;
  _amount: number;
  _currency: string;
  _applicantName: string;
  _applicantEmail: string;
  _document: string;
  _countryId: string;
  _createdById: string;
  country: {
    countryName: string;
    countryCode: string;
  };
  _status: string;
}

export enum CreditRequestStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type CreditStatus =
  | "CREATED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface PaginatedCreditRequests {
  data: CreditRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
