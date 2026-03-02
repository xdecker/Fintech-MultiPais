import { getCountriesRequest } from "@/features/country/api/country.api";
import { useQuery } from "@tanstack/react-query";

export const COUNTRY_REQUESTS_KEY = "country-request";

export function useCountriesRequest() {
  return useQuery({
    queryKey: [COUNTRY_REQUESTS_KEY],
    queryFn: () => getCountriesRequest(),
  });
}
