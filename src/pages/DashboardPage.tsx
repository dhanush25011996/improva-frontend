import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2, Ticket, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { EditPassengerModal } from "@/features/booking/components/EditPassengerModal";
import { PassengerTable } from "@/features/booking/components/PassengerTable";
import { useBookings } from "@/features/booking/hooks/useBookings";
import { TOTAL_SEATS } from "@/features/booking/constants";
import type { Booking, BookingUpdate } from "@/features/booking/types";

export const DashboardPage = () => {
  const { bookings, loading, error, updateBooking, deleteBooking, refetch } =
    useBookings();
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deletingSeat, setDeletingSeat] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...bookings].sort((a, b) => a.seat_number - b.seat_number),
    [bookings]
  );

  const handleDelete = async (booking: Booking) => {
    const confirmed = window.confirm(
      `Delete reservation for seat #${booking.seat_number} (${booking.first_name} ${booking.last_name})?`
    );
    if (!confirmed) return;

    setDeletingSeat(booking.seat_number);
    setActionError(null);
    try {
      await deleteBooking(booking.seat_number);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingSeat(null);
    }
  };

  const handleSave = async (seatNumber: number, update: BookingUpdate) => {
    await updateBooking(seatNumber, update);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Passenger dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, edit or cancel reservations.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            label="Passengers"
            value={bookings.length}
          />
          <StatCard
            icon={<Ticket className="h-4 w-4" />}
            label="Seats left"
            value={TOTAL_SEATS - bookings.length}
          />
        </div>
      </div>

      {actionError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-sm text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading passengers...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Couldn't load passengers</p>
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
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No reservations yet"
          description="Bookings you make will show up here."
          action={
            <Link to="/reservation">
              <Button>Book a seat</Button>
            </Link>
          }
        />
      ) : (
        <PassengerTable
          bookings={sorted}
          deletingSeat={deletingSeat}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}

      <EditPassengerModal
        open={editing != null}
        booking={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
      {icon}
    </span>
    <div className="leading-tight">
      <div className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);
