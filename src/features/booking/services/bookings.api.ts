import { api } from "@/lib/api-client";
import type { Booking, BookingInput, BookingUpdate } from "../types";

interface TicketRow {
  id: number;
  seat_number: number;
  status: "OPEN" | "CLOSED";
  passenger_first_name: string | null;
  passenger_last_name: string | null;
  passenger_email: string | null;
  passenger_phone: string | null;
  booked_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ListResponse {
  count: number;
  tickets: TicketRow[];
}

const toBooking = (t: TicketRow): Booking => ({
  seat_number: t.seat_number,
  first_name: t.passenger_first_name ?? "",
  last_name: t.passenger_last_name ?? "",
  email: t.passenger_email ?? "",
  phone: t.passenger_phone,
  booked_at: t.booked_at ?? t.updated_at,
});

export const bookingsApi = {
  listClosed: async (signal?: AbortSignal): Promise<Booking[]> => {
    const data = await api.get<ListResponse>("/booking/closed", signal);
    return data.tickets.map(toBooking);
  },

  book: async (
    seatNumber: number,
    input: BookingInput,
    signal?: AbortSignal
  ): Promise<Booking> => {
    const ticket = await api.post<TicketRow>(
      `/booking/${seatNumber}/book`,
      { passenger: input },
      signal
    );
    return toBooking(ticket);
  },

  updatePassenger: async (
    seatNumber: number,
    update: BookingUpdate,
    signal?: AbortSignal
  ): Promise<Booking> => {
    const ticket = await api.patch<TicketRow>(
      `/booking/${seatNumber}/passenger`,
      { passenger: update },
      signal
    );
    return toBooking(ticket);
  },

  cancel: async (
    seatNumber: number,
    signal?: AbortSignal
  ): Promise<Booking> => {
    const ticket = await api.post<TicketRow>(
      `/booking/${seatNumber}/cancel`,
      undefined,
      signal
    );
    return toBooking(ticket);
  },

  resetAll: async (signal?: AbortSignal): Promise<{ reset_count: number }> => {
    return api.post<{ reset_count: number }>(
      "/booking/admin/reset",
      undefined,
      signal
    );
  },
};
