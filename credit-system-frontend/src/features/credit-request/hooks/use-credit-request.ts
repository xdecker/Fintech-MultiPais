"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCreditRequest,
  deleteCreditRequest,
  getCreditRequest,
  getCreditRequests,
  updateStatusRequest,
} from "../api/credit-request.api";
import { CreditRequestDetail } from "../types/credit-request";

export const CREDIT_REQUESTS_KEY = "credit-request";
export const CREDIT_REQUEST_DETAIL_KEY = "credit-request-detail";

export function useCreateCreditRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCreditRequest,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [CREDIT_REQUESTS_KEY],
      });
    },
  });
}

export function useCreditRequests(page: number, limit: number) {
  return useQuery({
    queryKey: [CREDIT_REQUESTS_KEY, page, limit],
    queryFn: () => getCreditRequests(page, limit),
  });
}

export function useCreditRequestDetail(id?: string) {
  return useQuery<CreditRequestDetail>({
    queryKey: [CREDIT_REQUEST_DETAIL_KEY, id],
    queryFn: () => getCreditRequest(id!),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 min
  });
}

export function useDeleteCreditRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCreditRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [CREDIT_REQUESTS_KEY],
      });
    },
  });
}

export function useUpdateCreditStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateStatusRequest(id, status as any),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CREDIT_REQUESTS_KEY],
      });
    },
  });
}
