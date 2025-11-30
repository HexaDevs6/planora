// src/redux/tickets/ticketsAPI.js
import { supabase } from "@/lib/supabaseClient";

// Fetch client tickets
export const getClientTickets = async (clientId) => {
    const { data, error } = await supabase
        .from("tickets")
        .select("*, events(*)")
        .eq("client_id", clientId);

    if (error) throw error;
    return data;
};

// Fetch host tickets for a specific event
export const getEventTickets = async (eventId) => {
    const { data, error } = await supabase
        .from("tickets")
        .select("*, users(full_name, email)")
        .eq("event_id", eventId);

    if (error) throw error;
    return data;
};

// Create ticket
export const createTicketAPI = async ({
    eventId,
    clientId,
    price,
    seat,
    payStatus,
}) => {
    const qrCode = `${eventId}-${clientId}-${Date.now()}-${crypto.randomUUID()}`;

    const { data, error } = await supabase
        .from("tickets")
        .insert({
            event_id: eventId,
            client_id: clientId,
            qr_code: qrCode,
            price: price ?? 0,
            seat_number: seat ?? null,
            payment_status: payStatus || "paid",
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Update status (check-in)
export const updateTicketStatusAPI = async ({ id, status }) => {
    const { data, error } = await supabase
        .from("tickets")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};
