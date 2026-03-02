"use client";

import { CustomDataTable } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";

interface CountryItem {
  country: string;
  count: number;
}

interface Props {
  data: CountryItem[];
}

export const RequestsByCountryCard = ({ data }: Props) => {
  const columns: ColumnDef<CountryItem>[] = [
    {
      accessorKey: "country",
      header: "País",
    },
    {
      accessorKey: "count",
      header: "Solicitudes",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes por país</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <CustomDataTable
          columns={columns}
          showPagination={false}
          enableFilter={false}
          enableExport={false}
          data={data}
          emptyMessage="No cuentas con solicitudes "
        />
      </CardContent>
    </Card>
  );
};
