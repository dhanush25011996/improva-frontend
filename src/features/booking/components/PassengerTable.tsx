import { Loader2, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date";
import type { Booking } from "../types";

interface PassengerTableProps {
  bookings: Booking[];
  deletingSeat?: number | null;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export const PassengerTable = ({
  bookings,
  deletingSeat,
  onEdit,
  onDelete,
}: PassengerTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Seat</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Booked on</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((b) => {
            const isDeleting = deletingSeat === b.seat_number;
            return (
              <tr key={b.seat_number} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <span className="inline-flex h-8 w-10 items-center justify-center rounded-md bg-brand-50 text-xs font-semibold text-brand-700">
                    #{b.seat_number}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {b.first_name} {b.last_name}
                </td>
                <td className="px-4 py-3 text-slate-600">{b.email}</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(b.booked_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(b)}
                      disabled={isDeleting}
                      aria-label={`Edit booking for seat ${b.seat_number}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(b)}
                      disabled={isDeleting}
                      aria-label={`Delete booking for seat ${b.seat_number}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
