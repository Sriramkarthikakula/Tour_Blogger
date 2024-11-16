// utils/supabase/fetchCountries.ts
import { supabase } from "./client";

export async function fetchCountries() {
  const { data, error } = await supabase
    .from("countries")
    .select("country_code, country_name")
    .order("country_name", { ascending: true });

  if (error) {
    console.error("Error fetching countries:", error);
    return [];
  }

  return data;
}
