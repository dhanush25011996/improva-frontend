export interface Booking {
  seat_number: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  booked_at: string;
}

export interface BookingInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
}

export interface BookingUpdate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
}
