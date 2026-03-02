"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateCreditRequest } from "../hooks/use-credit-request";
import { useCustomDialog } from "@/providers/custom-dialog.provider";

interface Props {
  open: boolean;
  onClose: () => void;
}

type FormInputs = {
  applicantName: string;
  applicantEmail: string;
  document: string;
  amount: number;
  currency: string;
  countryId: string;
};

export const CreateCreditRequestDialog = ({ open, onClose }: Props) => {
  const createMutation = useCreateCreditRequest();
  const { showDialog } = useCustomDialog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormInputs>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormInputs) => {
    try {
      toast.loading("Creando solicitud...");

      await createMutation.mutateAsync({
        ...data,
        amount: Number(data.amount.toFixed(2)),
      });

      toast.dismiss();
      toast.success("Solicitud creada correctamente");

      reset();
      onClose();
    } catch (err: any) {
      toast.dismiss();
      showDialog("error", err.message ?? "No se pudo crear");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Crédito</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre Aplicante</Label>
            <Input
              className={clsx({ "border-red-500": errors.applicantName })}
              {...register("applicantName", { required: true })}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              className={clsx({ "border-red-500": errors.applicantEmail })}
              {...register("applicantEmail", { required: true })}
            />
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label>Documento</Label>
            <Input
              className={clsx({ "border-red-500": errors.document })}
              {...register("document", { required: true })}
            />
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label>Monto</Label>
            <Input
              type="number"
              className={clsx({ "border-red-500": errors.amount })}
              {...register("amount", { required: true, valueAsNumber: true })}
            />
          </div>

          {/* Moneda */}
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Input
              defaultValue="USD"
              {...register("currency", { required: true })}
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label>Country ID</Label>
            <Input
              className={clsx({ "border-red-500": errors.countryId })}
              {...register("countryId", { required: true })}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!isValid || createMutation.isPending}
              className="bg-blue-800"
            >
              {createMutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
