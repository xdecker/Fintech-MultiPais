import { useEffect } from "react";
import { subscribeToCredits } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";

export function useCreditRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    subscribeToCredits((event) => {
      if (event.name === "credit.status.changed") {
        queryClient.invalidateQueries({
          queryKey: ["credits"],
        });

        queryClient.invalidateQueries({
          queryKey: ["credit", event.payload.creditRequestId],
        });
      }
    });
  }, []);
}
