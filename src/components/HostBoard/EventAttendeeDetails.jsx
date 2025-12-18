import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Loader2,
  Users,
  Check,
  X,
  Circle,
  CalendarCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import HostScanner from "./HostScanner";
import { Input } from "@/components/ui/input";
import { useDirection } from "@/hooks/useDirection";

const EventAttendeeDetails = () => {
  const { lang } = useDirection();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceMs = 400;
  const debounceRef = useRef(null);

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const eventId = searchParams.get("id");
  const eventTitle = searchParams.get("title");
  const eventDate = searchParams.get("date");
  const eventLocation = searchParams.get("location");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
        setDebouncedSearch(searchInput.trim());
    }, debounceMs);

    return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    };
}, [searchInput]);

  const flushSearchNow = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDebouncedSearch(searchInput.trim());
};

  async function loadAttendees(eventId, debouncedSearch) {
    const { data, error } = await supabase.rpc("get_event_attendees", {
      p_event_id: eventId,
    });

    if (error) {
      console.error("Failed to load attendees:", error);
      return [];
    }

    if (debouncedSearch) {
      const filteredData = data.filter((attendee) => {
        return attendee.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) || attendee.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      });
      return filteredData;
    }

    return data || [];
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await loadAttendees(eventId, debouncedSearch);
      setAttendees(result);
      setLoading(false);
    }

    fetchData();
  }, [eventId, debouncedSearch]);

  function formatCairoDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString + "Z").toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <Users className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {lang === "ar" ? "لا يوجد حجوزات بعد" : "No reservations yet"}
      </h3>
    </div>
  );

  return (
    <div className="space-y-5 container">
      {/* Header */}
      <div className="flex gap-4 flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {eventTitle}{" "}
            {lang === "ar" ? " تفاصيل الحضور" : " Attendees Details"}
          </h1>
          <p className="text-muted-foreground">
            {eventDate.split("T")[0]} | {eventLocation}
          </p>
        </div>

        <HostScanner eventId={eventId} />
      </div>


          <div className="flex justify-between items-center">
              <lable >{lang === "ar" ? "جميع الحجوزات" : "All Attendees"}</lable>
              <Input 
                  className='w-1/2 !bg-input'
                  type="search" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter") flushSearchNow();
                  }}
                  placeholder={lang === "ar" ? "ابحث باسم الحجز أو البريد الإلكتروني..." : "Search by reservation name or email..."}
                  aria-label={lang === "ar" ? "بحث" : "Search"}
              />
        </div>

      {/* Table */}
      {attendees.length === 0 && !loading ? (
        <Card>
          <CardContent>
            <EmptyState />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-background border rounded-xl overflow-hidden">
          <CardContent className={"p-0"}>
            {loading ? (
              <div className="flex-center py-16 px-4 min-h-[300px]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr className="border-b border-border">
                      <th className="text-start py-3 px-4 font-semibold text-sm">
                        {lang === "ar" ? "الاسم" : "Name"}
                      </th>
                      <th className="text-start py-3 px-4 font-semibold text-sm">
                        {lang === "ar" ? "البريد الألكتروني" : "Email"}
                      </th>
                      <th className="text-start py-3 px-4 font-semibold text-sm">
                        {lang === "ar" ? "تاريخ الحجز" : "Res. Date"}
                      </th>
                      <th className="text-start py-3 px-4 font-semibold text-sm">
                        {lang === "ar" ? "تاريخ الاستخدام" : "Used Date"}
                      </th>
                      <th className="text-start py-3 px-4 font-semibold text-sm">
                        {lang === "ar" ? "السعر" : "Ticket Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee) => (
                      <tr
                        key={attendee.ticket_id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{attendee.full_name}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm">{attendee.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm text-nowrap">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatCairoDate(attendee.purchased_at)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-amber-600 text-sm text-nowrap">
                            {!attendee.used_at ? (
                              "Not checked in yet"
                            ) : (
                              <div className="flex items-center gap-1 text-emerald-600">
                                <CalendarCheck className="h-3 w-3" />
                                {formatCairoDate(attendee.used_at)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-sm">
                            {attendee.status === "valid" && (
                              <span className="text-amber-600 flex items-center gap-1">
                                <Circle className="h-4 w-4" />
                                {lang === "ar" ? "صالح" : "Valid"}
                              </span>
                            )}

                            {attendee.status === "used" && (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                {lang === "ar" ? "مستخدم" : "Used"}
                              </span>
                            )}

                            {attendee.status === "cancelled" && (
                              <span className="text-red-600 flex items-center gap-1">
                                <X className="h-4 w-4" />
                                {lang === "ar" ? "ملغية" : "Cancelled"}
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventAttendeeDetails;
