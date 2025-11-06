import React from "react";
import { setLoading, setServices } from "./servicesSlice";
import { supabase } from "@/lib/supabaseClient";

export const fetchServices = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;

    dispatch(setServices(data || []));
    return { success: true, services: data || [] };
  } catch (error) {
    console.error("Fetch events error:", error.message);
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};
