// src/store/eventsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";

// ✅ Fetch all events from Supabase
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Fetch events error:", err.message);
      return rejectWithValue(err.message);
    }
  }
);
