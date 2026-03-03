import { getCountriesRequest } from "@/features/country/api/country.api";
import { useQuery } from "@tanstack/react-query";

export const COUNTRY_REQUESTS_KEY = "country-request";
const token = localStorage.getItem("token");

export function useCountriesRequest() {
  return useQuery({
    queryKey: [COUNTRY_REQUESTS_KEY],
    queryFn: () => getCountriesRequest(),
    enabled: !!token,
  });
}
