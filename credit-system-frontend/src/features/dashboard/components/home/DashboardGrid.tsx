"use client";
import React, { useEffect, useMemo, useState } from "react";
import { CardsIndicatorsSection } from "./CardsIndicatorsSection";
import { CardChartBar } from "./CardChartBar";
import { RequestsByCountryCard } from "./RequestsByCountryCard";
import { DashboardSummary } from "../../types/dashboard";
import { getSummaryDashboard } from "../../api/dashboard.api";

export const DashboardGrid = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSummaryDashboard()
      .then((data) => setSummary(data))
      .catch((err) => {
        console.error(err);
        setError("Error cargando el dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  const countriesData = useMemo(() => {
    return (
      summary?.requestsByCountry.map((c) => ({
        country: c.country,
        count: c.total,
      })) || []
    );
  }, [summary]);

  const requestsChartData = useMemo(() => {
    return {
      labels:
        summary?.requestsLast7Days.map((r) =>
          new Date(r.date).toLocaleDateString("es-ES", { weekday: "short" })
        ) || [],
      datasets: [
        {
          label: "Solicitudes",
          data: summary?.requestsLast7Days.map((r) => r.count) || [],
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
      ],
    };
  }, [summary]);

  const metrics = {
    totalRequests: summary?.totalRequests || 0,
    pendingRequests: summary?.pendingRequests || 0,
    approvedRequests: summary?.approvedRequests || 0,
    totalAmount: summary?.totalAmount || 0,
  };

  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div>{error}</div>;
  if (!summary) return <div>No hay datos disponibles</div>;

  return (
    <div>
      <CardsIndicatorsSection
        totalRequests={metrics.totalRequests}
        pendingRequests={metrics.pendingRequests}
        approvedRequests={metrics.approvedRequests}
        totalAmount={metrics.totalAmount}
      />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CardChartBar
          title="Solicitudes últimos 7 días"
          data={requestsChartData}
        />
        <RequestsByCountryCard data={countriesData} />
      </section>
    </div>
  );
};
