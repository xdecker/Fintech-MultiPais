"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCreditRequest,
  deleteCreditRequest,
  getCreditRequests,
} from "../api/credit-request.api";

export const CREDIT_REQUESTS_KEY = "credit-request";

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
