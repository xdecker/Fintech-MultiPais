"use client";

import { useEffect } from "react";
import { socket } from "./socket";

export function useSocket() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
}
