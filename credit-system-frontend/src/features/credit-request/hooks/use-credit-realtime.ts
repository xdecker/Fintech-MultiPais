"use client";

import { useEffect } from "react";
import { socket } from "@/lib/websocket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { CREDIT_REQUESTS_KEY } from "./use-credit-request";

export function useCreditRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    socket.on("credit.updated", () => {
      queryClient.invalidateQueries({
        queryKey: [CREDIT_REQUESTS_KEY],
      });
    });

    return () => {
      socket.off("credit.updated");
    };
  }, [queryClient]);
}
