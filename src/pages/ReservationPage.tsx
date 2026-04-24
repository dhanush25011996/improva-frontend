import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { ReservationForm } from "@/features/booking/components/ReservationForm";
import { SeatLayout } from "@/features/booking/components/SeatLayout";
import { useBookings } from "@/features/booking/hooks/useBookings";
import { TOTAL_SEATS } from "@/features/booking/constants";
import type { BookingInput } from "@/features/booking/types";

export const ReservationPage = () => {
  const { bookedSeats, loading, error, createBooking, refetch } = useBookings();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const availableCount = TOTAL_SEATS - bookedSeats.size;

  const handleSubmit = async (input: BookingInput) => {
    if (selectedSeat == null) return;
    await createBooking(selectedSeat, input);
    setSelectedSeat(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Reserve your seat
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tap an available seat, fill in passenger details and confirm.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Available
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {availableCount}
            <span className="text-sm font-normal text-slate-500">
              {" "}
              / {TOTAL_SEATS}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading seats...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Couldn't load bookings</p>
            <p className="mt-0.5 text-red-600/90">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-2 text-xs font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
          <SeatLayout
            bookedSeats={bookedSeats}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
          />
          <ReservationForm
            selectedSeat={selectedSeat}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};
