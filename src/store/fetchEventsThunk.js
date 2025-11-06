import { supabase } from "@/lib/supabaseClient";
import { setEvents, setLoading } from "./eventsSlice";

export const fetchEvents = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;

    dispatch(setEvents(data || []));
    return { success: true, events: data || [] };
  } catch (error) {
    console.error("Fetch events error:", error.message);
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};
