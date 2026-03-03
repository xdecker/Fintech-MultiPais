"use client";

import { useEffect } from "react";
import { socket } from "@/lib/websocket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { CREDIT_REQUESTS_KEY } from "./use-credit-request";

export function useCreditRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("ws connected");
    }

    const handler = () => {
      queryClient.invalidateQueries({
        queryKey: [CREDIT_REQUESTS_KEY],
      });
    };

    socket.on("credit.updated", handler);

    return () => {
      socket.off("credit.updated", handler);
    };
  }, [queryClient]);
}
