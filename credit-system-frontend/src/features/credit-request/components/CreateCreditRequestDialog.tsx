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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useCreateCreditRequest } from "../hooks/use-credit-request";
import { useCustomDialog } from "@/providers/custom-dialog.provider";
import { useEffect } from "react";
import { Country } from "@/features/country/interfaces/country";

interface Props {
  open: boolean;
  onClose: () => void;
  countries: Country[];
}

type FormInputs = {
  applicantName: string;
  applicantEmail: string;
  document: string;
  amount: number;
  currency: string;
  countryId: string;
};

export const CreateCreditRequestDialog = ({
  open,
  onClose,
  countries,
}: Props) => {
  const createMutation = useCreateCreditRequest();
  const { showDialog } = useCustomDialog();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormInputs>({
    mode: "onChange",
  });

  const selectedCountryId = watch("countryId");

  useEffect(() => {
    if (selectedCountryId) {
      console.log("en useEffect");
      const selected = countries.find((c) => c._id === selectedCountryId);
      setValue("currency", selected?._currency || "USD");
    }
  }, [selectedCountryId, countries, setValue]);

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

          {/* Country */}
          <div className="space-y-2">
            <Label>País</Label>
            <Controller
              name="countryId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger 
                    className={clsx("border p-2 rounded w-full", {
                      "border-red-500": errors.countryId,
                    })}
                  >
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c._name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Moneda */}
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Input value={watch("currency") || "USD"} disabled />
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
