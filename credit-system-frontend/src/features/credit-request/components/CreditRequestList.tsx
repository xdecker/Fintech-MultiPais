"use client";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import {
  CreditRequest,
  CreditRequestDetail,
  CreditRequestStatus,
} from "../types/credit-request";
import { Button } from "@/components/ui/button";
import { CircleEllipsis, Eye, Plus, Trash2, UserRound } from "lucide-react";
import { ConfirmDialog, CustomDataTable } from "@/components/shared";
import { toast } from "sonner";
import { useCustomDialog } from "@/providers/custom-dialog.provider";
import {
  useCreditRequests,
  useDeleteCreditRequest,
} from "../hooks/use-credit-request";
import clsx from "clsx";
import { UpdateCreditStatusDialog } from "./UpdateCreditsStatusDialog";
import { CreateCreditRequestDialog } from "./CreateCreditRequestDialog";
import { CreditRequestDetailDialog } from "./CreditRequestDetailDialog";
import { useAuth } from "@/providers/auth.provider";
import { useCountriesRequest } from "../hooks/use-country-request";

export const CreditRequestList = () => {
  const columns: ColumnDef<CreditRequest>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => {
        const { _id } = row.original;
        return _id;
      },
    },
    {
      accessorKey: "_document",
      header: "Documento Aplicante",
    },

    {
      accessorKey: "_applicantName",
      header: "Nombre Aplicante",
    },

    {
      accessorKey: "_applicantEmail",
      header: "Email Aplicante",
    },

    {
      accessorKey: "country",
      header: "País",
      cell: ({ row }) => {
        const { country } = row.original;
        return country.countryName;
      },
    },

    {
      accessorKey: "_currency",
      header: "Moneda",
    },

    {
      accessorKey: "_amount",
      header: "Monto",
    },

    {
      accessorKey: "_status",
      header: "Estatus",
      cell: ({ row }) => {
        const { _status } = row.original;
        return (
          <p
            className={clsx("font-bold", {
              "text-green-800": _status == CreditRequestStatus.APPROVED,
              "text-red-800": _status == CreditRequestStatus.REJECTED,
              "text-orange-600": _status == CreditRequestStatus.PENDING,
              "text-blue-900": _status == CreditRequestStatus.UNDER_REVIEW,
            })}
          >
            {" "}
            {_status}
          </p>
        );
      },
    },

    {
      id: "actions",
      header: "Acciones",

      cell: ({ row }) => {
        const credit = row.original;

        return (
          <div className="flex gap-2 justify-center">
            {/* 👁 DETALLE */}
            {canViewDetail && (
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => {
                  setCreditSelected(credit);
                  setOpenDetailModal(true);
                }}
              >
                <Eye className="w-5 h-5 text-slate-700" />
              </Button>
            )}

            {/* ✏️ UPDATE STATUS */}
            {canUpdateStatus && (
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => {
                  setCreditSelected(credit);
                  setOpenUpdateStatusModal(true);
                }}
              >
                <CircleEllipsis className="w-5 h-5 text-blue-800" />
              </Button>
            )}

            {/* 🗑 DELETE */}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => {
                  setCreditSelected(credit);
                  setOpenConfirm(true);
                }}
              >
                <Trash2 className="w-5 h-5 text-red-800" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const { user } = useAuth();
  const canViewDetail = !user
    ? false
    : ["USER", "REVIEWER", "ADMIN"].includes(user.role);
  const canUpdateStatus = !user
    ? false
    : ["REVIEWER", "ADMIN"].includes(user.role);
  const canDelete = !user ? false : user!.role === "ADMIN";
  const [page, setPage] = useState(1);
  const limit = 10;
  const deleteMutation = useDeleteCreditRequest();
  const { data, isLoading, isError } = useCreditRequests(page, limit);
  const { data: countries } = useCountriesRequest();
  console.log("paises: ", countries);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
  const [creditSelected, setCreditSelected] = useState<CreditRequest | null>(
    null
  );

  const { showDialog } = useCustomDialog();

  const handleDelete = async () => {
    try {
      const id = creditSelected?._id;

      if (!id) return;

      toast.loading("Cargando...");

      await deleteMutation.mutateAsync(id);

      toast.dismiss();
      toast.success("Solicitud eliminada correctamente");
    } catch (err: any) {
      toast.dismiss();
      showDialog("error", err.message ?? "No se pudo eliminar");
    }
  };

  return (
    <>
      <div className="flex mb-2 mx-2 px-2 w-full justify-end">
        <Button
          onClick={() => setOpenCreateModal(true)}
          className="cursor-pointer bg-blue-800 font-bold"
        >
          <Plus strokeWidth={4} /> Nueva Solicitud Crédito
        </Button>
      </div>

      <CustomDataTable
        placeholderFilter="Buscar en solicitudes..."
        enableFilter
        enableExport={false}
        tableBordered
        sortable
        columns={columns}
        pageSize={data?.meta.limit}
        data={data?.data ?? []}
        onPageChange={(p) => setPage(p + 1)}
        pageCount={data?.meta.totalPages ?? 1}
        pageIndex={page - 1}
      />

      {creditSelected && (
        <>
          <ConfirmDialog
            open={openConfirm}
            onClose={() => {
              setOpenConfirm(false);
            }}
            onConfirm={() => handleDelete()}
            title={"Eliminar Solicitud"}
            description={`¿Seguro que deseas eliminar la solicitud de credito de  ${creditSelected?._applicantName} | ${creditSelected?.country.countryCode}`}
            icon={<UserRound className="text-slate-500 w-10 h-10" />}
          />

          <UpdateCreditStatusDialog
            open={openUpdateStatusModal}
            onOpenChange={setOpenUpdateStatusModal}
            creditId={creditSelected._id}
            currentStatus={creditSelected._status}
          />

          <CreditRequestDetailDialog
            open={openDetailModal}
            onOpenChange={setOpenDetailModal}
            creditId={creditSelected._id}
          />
        </>
      )}

      <CreateCreditRequestDialog
        open={openCreateModal}
        countries={countries ?? []}
        onClose={() => setOpenCreateModal(false)}
      />
    </>
  );
};
