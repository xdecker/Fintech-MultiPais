import { CustomDataTable, PrincipalHeader } from "@/components/shared";
import { CreditRequestList } from "@/features/credit-request/components";

export default function CreditRequestPage() {
  return (
    <div>
      <PrincipalHeader
        title="Solicitudes de Crédito"
        subTitle="Hecha un vistazo a las solicitudes de crédito recibidas"
      />
      <div>
        <CreditRequestList />
      </div>
    </div>
  );
}
