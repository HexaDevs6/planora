// src/redux/tickets/hostEventTicketsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEventTickets, updateTicketStatusAPI } from "./ticketsAPI";

// 1) Fetch event tickets
export const fetchEventTickets = createAsyncThunk(
  "hostEventTickets/fetchEventTickets",
  async (eventId) => {
    return await getEventTickets(eventId);
  }
);

// 2) Update ticket status
export const updateTicketStatus = createAsyncThunk(
  "hostEventTickets/updateTicketStatus",
  async ({ id, status }) => {
    return await updateTicketStatusAPI({ id, status });
  }
);

const hostEventTicketsSlice = createSlice({
  name: "hostEventTickets",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearHostTickets: (state) => {
      state.tickets = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch event tickets
      .addCase(fetchEventTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchEventTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update ticket status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const idx = state.tickets.findIndex(
          (t) => t.id === action.payload.id
        );
        if (idx !== -1) state.tickets[idx] = action.payload;
      });
  },
});

export const { clearHostTickets } = hostEventTicketsSlice.actions;
export default hostEventTicketsSlice.reducer;
