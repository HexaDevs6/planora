import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Scanner } from "@yudiel/react-qr-scanner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";

const HostScanner = ({ eventId }) => {
  const [ticket, setTicket] = useState(null);
  const [open, setOpen] = useState(false);

  const handleScan = async (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    try {
      const qrValue = data[0]?.rawValue;

      const { data: ticketData, error } = await supabase
        .from("tickets")
        .select("*, users(full_name, email)")
        .eq("qr_code", qrValue)
        .single();
console.log(ticketData, error);
      if (error || !ticketData) {
        toast.error("Invalid ticket!");
        return;
      }

      if (ticketData.event_id !== eventId) {
        toast.error("This ticket does NOT belong to this event!");
        return;
      }

      if (ticketData.status === "used") {
        toast.warning("This ticket was already used!");
      }

      setTicket(ticketData);
      toast.success("Valid ticket!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .update({ status: "used" })
      .eq("id", ticket.id)
      .select()
      .single();

    if (error) {
      toast.error("Update failed");
      return;
    }

    toast.success("Ticket marked as USED!");
    setTicket(data);
  };

  return (
    <div className="max-w-md  p-4">
      <Button  onClick={() => setOpen(true)}>
        <Camera /> Scan Ticket
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Ticket</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center py-4">
            {/* QR Scanner */}
            {!ticket && (
              <Scanner
                onScan={handleScan}
                onError={(err) => console.error(err)}
                className="rounded-xl overflow-hidden w-full"
              />
            )}

            {/* نتيجة التذكرة */}
         {ticket && (
  <div className="w-full mt-4 p-5 rounded-xl border bg-white shadow-sm space-y-4">

    {/* Status Badge */}
    <div className="flex items-center gap-2">
      <span 
        className={`px-3 py-1 text-sm rounded-full 
        ${ticket.status === "used" 
          ? "bg-red-100 text-red-600" 
          : "bg-green-100 text-green-600"}`}
      >
        {ticket.status === "used" ? "Already Used" : "Valid Ticket"}
      </span>
    </div>

    {/* Ticket Info */}
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="font-medium text-gray-500">Ticket ID:</span>
        <span className="font-semibold text-gray-900">{ticket.id}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium text-gray-500">Name:</span>
        <span className="font-semibold text-gray-900">{ticket.users?.full_name}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium text-gray-500">Email:</span>
        <span className="font-semibold text-gray-900">{ticket.users?.email}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium text-gray-500">Status:</span>
        <span 
          className={`font-semibold 
          ${ticket.status === "used" ? "text-red-600" : "text-green-600"}`}
        >
          {ticket.status}
        </span>
      </div>
    </div>

    {/* Buttons */}
    <div className="space-y-3 pt-2">
      <Button
        className="w-full"
        disabled={ticket.status === "used"}
        onClick={handleUpdateStatus}
      >
        Mark as Used
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setTicket(null)}
      >
        Scan Another Ticket
      </Button>
    </div>
  </div>
)}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostScanner;
