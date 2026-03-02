"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreditStatus } from "../types/credit-request";
import { useUpdateCreditStatus } from "../hooks/use-credit-request";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditId: string;
  currentStatus: string;
};

const STATUSES: CreditStatus[] = [
  "CREATED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

export function UpdateCreditStatusDialog({
  open,
  onOpenChange,
  creditId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState<CreditStatus>(
    currentStatus as CreditStatus
  );

  const { mutate, isPending } = useUpdateCreditStatus();

  const handleSubmit = () => {
    mutate(
      { id: creditId, status },
      {
        onSuccess: () => {
          toast.success("Estado actualizado");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar Estado de Solicitud de Crédito</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {STATUSES.map((s) => (
            <Button
              key={s}
              variant={status === s ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setStatus(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
