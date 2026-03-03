"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ResizeObserver from "rc-resize-observer";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo, useRef } from "react";
import { EmptyDataMessage } from "@/components/shared";
import { ClipboardPlus } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  data: any;
  title: string;
  classNameTitle?: string;
  icon?: React.ReactNode;
}

export const CardChartBar = ({
  data,
  title,
  icon,
  classNameTitle = "",
}: Props) => {
  const chartRef = useRef<any>(null);
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  const isAllZero = useMemo(() => {
    if (!data?.datasets?.length) return true;
    const values = data.datasets[0].data || [];
    return values.every((v: number) => v === 0);
  }, [data]);

  return (
    <ResizeObserver
      onResize={() => {
        console.log("resizeee");
        // 🔁 Forzar recalculo del tamaño cuando el card cambia
        if (chartRef.current) {
          chartRef.current.resize();
        }
      }}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center text-blue-800 font-bold">
            {icon}
            <CardTitle className={`${classNameTitle} lg:text-xl`}>
              &nbsp;{title}
            </CardTitle>
          </div>
          <Separator />
        </CardHeader>
        {isAllZero ? (
          <div className="p-2">
            <EmptyDataMessage
              description={"No se tienen solicitudes registradas"}
              classNameDescription={"text-slate-700"}
              icon={<ClipboardPlus className="w-18 h-18 text-slate-400" />}
            />
          </div>
        ) : (
          <CardContent>
            <Bar ref={chartRef} data={data} options={chartOptions} />
          </CardContent>
        )}
      </Card>
    </ResizeObserver>
  );
};
