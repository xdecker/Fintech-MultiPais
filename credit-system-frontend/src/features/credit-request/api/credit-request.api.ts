import { apiClient } from "@/lib/api";
import {
  FormCreditRequest,
  CreditRequest,
  PaginatedCreditRequests,
  CreditRequestStatus,
} from "../types/credit-request";

// GET list
export function getCreditRequests(page = 1, limit = 10) {
  return apiClient<PaginatedCreditRequests>("/credit-request", "GET", {
    params: { page, limit },
  });
}

// GET detail
export function getCreditRequest(id: string) {
  return apiClient<CreditRequest>(`/credit-request/${id}`, "GET");
}

// CREATE
export function createCreditRequest(data: FormCreditRequest) {
  return apiClient<CreditRequest>("/credit-request", "POST", { data });
}

// DELETE
export function deleteCreditRequest(id: string) {
  return apiClient<string | null>(`/credit-request/${id}`, "DELETE");
}

export function updateStatusRequest(id: string, status: CreditRequestStatus) {
  return apiClient<CreditRequest>(`/credit-request/status/${id}`, "PATCH", {
    data: { status },
  });
}
