"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, InfoIcon, XCircle, Loader2 } from "lucide-react";

type DialogType = "success" | "info" | "error" | "loading" | null;

interface DialogState {
  open: boolean;
  type: DialogType;
  message: string;
}

interface CustomDialogContextProps {
  showDialog: (type: DialogType, message: string) => void;
  closeDialog: () => void;
}

const CustomDialogContext = createContext<CustomDialogContextProps | undefined>(
  undefined
);

export function CustomDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: null,
    message: "",
  });

  const showDialog = (type: DialogType, message: string) =>
    setDialog({ open: true, type, message });

  const closeDialog = () => setDialog({ open: false, type: null, message: "" });

  // ---------- UI ----------
  const renderContent = () => {
    switch (dialog.type) {
      case "success":
        return (
          <DialogContent className="text-center space-y-4">
            <DialogTitle className="sr-only">Success</DialogTitle>
            <DialogDescription className="sr-only">
              {dialog.message}
            </DialogDescription>

            <CheckCircle className="mx-auto w-16 h-16 text-green-500" />

            <p className="text-lg font-semibold">{dialog.message}</p>

            <Button onClick={closeDialog}>Cerrar</Button>
          </DialogContent>
        );

      case "info":
        return (
          <DialogContent className="text-center space-y-4">
            <DialogTitle className="sr-only">Info</DialogTitle>

            <InfoIcon className="mx-auto w-16 h-16 text-blue-500" />

            <p className="text-lg font-semibold">{dialog.message}</p>

            <Button onClick={closeDialog}>Cerrar</Button>
          </DialogContent>
        );

      case "error":
        return (
          <DialogContent className="text-center space-y-4">
            <DialogTitle className="sr-only">Error</DialogTitle>

            <XCircle className="mx-auto w-16 h-16 text-red-500" />

            <p className="text-lg font-semibold">{dialog.message}</p>

            <Button variant="destructive" onClick={closeDialog}>
              Cerrar
            </Button>
          </DialogContent>
        );

      case "loading":
        return (
          <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <Loader2 className="w-14 h-14 animate-spin text-white mb-4" />

            <p className="text-white text-lg font-semibold">
              {dialog.message || "Procesando..."}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CustomDialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}

      <Dialog open={dialog.open} onOpenChange={closeDialog}>
        {renderContent()}
      </Dialog>
    </CustomDialogContext.Provider>
  );
}

export function useCustomDialog() {
  const context = useContext(CustomDialogContext);

  if (!context) {
    throw new Error("useCustomDialog must be used within CustomDialogProvider");
  }

  return context;
}
