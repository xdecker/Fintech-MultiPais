import { DollarSign, Clock, CheckCircle, FileText } from "lucide-react";
import { CardIndicator } from "@/components/shared";

interface Props {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalAmount: number;
}

export const CardsIndicatorsSection = ({
  totalRequests = 0,
  pendingRequests = 0,
  approvedRequests = 0,
  totalAmount = 0,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-4 w-full">
        {/* TOTAL SOLICITUDES */}
        <CardIndicator
          description="Solicitudes"
          classCard="bg-white  shadow-2xl"
          value={totalRequests}
          icon={<FileText className="h-full w-full text-blue-900" />}
        />

        {/* PENDIENTES */}
        <CardIndicator
          description="Pendientes"
          classCard="bg-white  shadow-2xl"
          value={pendingRequests}
          icon={<Clock className="h-full w-full text-orange-700" />}
        />

        {/* APROBADAS */}
        <CardIndicator
          description="Aprobadas"
          classCard="bg-white  shadow-2xl"
          value={approvedRequests}
          icon={<CheckCircle className="h-full w-full text-green-800" />}
        />

        {/* MONTO TOTAL */}
        <CardIndicator
          description="Monto Solicitado"
          classCard="bg-white  shadow-2xl"
          value={`$ ${totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-full w-full color-indicator4" />}
        />
      </div>
    </div>
  );
};
