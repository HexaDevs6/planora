// src/redux/tickets/clientTicketsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getClientTickets, createTicketAPI } from "./ticketsAPI";

// 1) Fetch tickets
export const fetchClientTickets = createAsyncThunk(
    "clientTickets/fetchClientTickets",
    async (clientId) => {
        return await getClientTickets(clientId);
    }
);

// 2) Create ticket
export const createTicket = createAsyncThunk(
    "clientTickets/createTicket",
    async ({ eventId, clientId, price, seat, payStatus }) => {
        return await createTicketAPI({
            eventId,
            clientId,
            price,
            seat,
            payStatus,
        });
    }
);

const clientTicketsSlice = createSlice({
    name: "clientTickets",
    initialState: {
        tickets: [],
        loading: false,
        error: null,
    },

    reducers: {
        clearClientTickets: (state) => {
            state.tickets = [];
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchClientTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClientTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchClientTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create
            .addCase(createTicket.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets.push(action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearClientTickets } = clientTicketsSlice.actions;
export default clientTicketsSlice.reducer;
