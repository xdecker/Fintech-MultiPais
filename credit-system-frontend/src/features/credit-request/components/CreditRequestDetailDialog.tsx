"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  CreditRequestDetail,
  CreditRequestStatus,
} from "../types/credit-request";

import clsx from "clsx";
import { useCreditRequestDetail } from "../hooks/use-credit-request";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  creditId: string;
}

export const CreditRequestDetailDialog = ({
  open,
  onOpenChange,
  creditId,
}: Props) => {
  const { data: credit, isLoading } = useCreditRequestDetail(creditId);

  if (!credit) return null;

  const statusColor = (status: CreditRequestStatus) =>
    clsx("font-semibold border", {
      "bg-orange-100 text-orange-700": status === CreditRequestStatus.PENDING,
      "bg-blue-100 text-blue-700": status === CreditRequestStatus.UNDER_REVIEW,
      "bg-green-100 text-green-700": status === CreditRequestStatus.APPROVED,
      "bg-red-100 text-red-700": status === CreditRequestStatus.REJECTED,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ modal profesional */}
      <DialogContent
        className="
                fixed
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2

                w-[55vw]
                sm:max-w-none
                max-w-[1400px]   /* ← clave */
                h-[92vh]

                p-0
                overflow-hidden
                flex
                flex-col
                rounded-xl
            "
      >
        {/* ================= HEADER ================= */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/40 shrink-0">
          <DialogTitle className="flex items-center justify-between py-3">
            <span className="text-lg font-bold">Solicitud de Crédito</span>

            <Badge
              className={statusColor(credit._status as CreditRequestStatus)}
            >
              {credit._status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* ================= BODY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 p-6 flex-1 overflow-hidden">
          {/* ========= LEFT COLUMN ========= */}
          <div className="space-y-5 overflow-y-auto pr-2 min-w-0">
            <Section title="Información del solicitante">
              <DetailRow label="Nombre" value={credit._applicantName} />
              <DetailRow label="Email" value={credit._applicantEmail} />
              <DetailRow label="Documento" value={credit._document} />
            </Section>

            <Section title="Información financiera">
              <DetailRow label="Monto" value={`$ ${credit._amount}`} />
              <DetailRow label="Moneda" value={credit._currency} />
              <DetailRow label="País" value={credit.country?.countryName} />
            </Section>

            <Section title="Identificación">
              <DetailRow label="ID Solicitud" value={credit._id} mono />
            </Section>

            {credit._evaluation && (
              <Section title="Evaluación de Riesgo">
                <DetailRow label="Score" value={credit._evaluation.score} />
                <DetailRow
                  label="Nivel Riesgo"
                  value={credit._evaluation.riskLevel}
                />
                <DetailRow
                  label="Decisión"
                  value={credit._evaluation.decision}
                />
              </Section>
            )}
          </div>

          {/* ========= RIGHT COLUMN (TIMELINE) ========= */}
          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-4 shrink-0">
              Historial de estados
            </h3>

            <ScrollArea className="flex-1 pr-4 min-h-0">
              <div className="relative border-l pl-6 space-y-6">
                {credit._history?.map((h, index) => (
                  <div key={index} className="relative">
                    {/* timeline dot */}
                    <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-background" />

                    <div className="rounded-xl border p-4 shadow-sm bg-background">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="secondary">{h.newStatus}</Badge>

                        <span className="text-xs text-muted-foreground">
                          {new Date(h.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Cambiado por{" "}
                        <span className="font-medium text-foreground">
                          {h.changedBy}
                        </span>
                      </p>

                      {h.previousStatus && (
                        <p className="text-xs mt-1 text-muted-foreground">
                          {h.previousStatus} → {h.newStatus}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ================= UI HELPERS ================= */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
      {title}
    </h3>

    <div className="rounded-xl border p-4 space-y-2 bg-background shadow-sm">
      {children}
    </div>
  </div>
);

const DetailRow = ({
  label,
  value,
  mono,
}: {
  label: string;
  value?: any;
  mono?: boolean;
}) => (
  <>
    <div className="flex justify-between gap-6 text-sm items-start">
      <span className="text-muted-foreground shrink-0">{label}</span>

      <span
        title={value}
        className={clsx("font-medium text-right break-words", {
          "font-mono text-xs": mono,
        })}
      >
        {value ?? "-"}
      </span>
    </div>
    <Separator />
  </>
);
