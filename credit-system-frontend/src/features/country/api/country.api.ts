import { apiClient } from "@/lib/api";
import { Country } from "../interfaces/country";

// GET list
export function getCountriesRequest() {
  return apiClient<Country[]>("/country", "GET");
}
