"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  icon,
  confirmText = "Sí",
  cancelText = "No",
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-sm">
        <DialogHeader className="flex flex-col items-center gap-2 text-center pb-4">
          {icon && <div className="mb-2">{icon}</div>}

          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>

          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose} className="min-w-25">
            {cancelText}
          </Button>

          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="min-w-25"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
