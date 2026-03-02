import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface CardIndicatorProps {
  description: string;
  value: string | number;
  icon: React.ReactNode;
  rate?: string;
  typeRate?: "up" | "down";
  classCard?: string;
}

export const CardIndicator = ({
  description,
  value,
  icon,
  classCard = "bg-indicator1",
}: CardIndicatorProps) => {
  return (
    <Card
      className={`@container/card ${classCard} rounded-2xl shadow-sm p-4 border-gray-300`}
    >
      <div className="flex items-center gap-4">
        {/* Izquierda 70% fijo */}
        <div className="flex-1 min-w-0">
          <CardDescription className="text-md whitespace-nowrap text-slate-950">
            {description}
          </CardDescription>

          <CardTitle className="text-3xl mt-1 font-semibold tabular-nums whitespace-nowrap">
            {value.toString()}
          </CardTitle>
        </div>

        {/* Derecha 30% */}
        <div className="shrink-0 flex items-center justify-center h-15 w-15">
          {icon}
        </div>
      </div>
    </Card>
  );
};
