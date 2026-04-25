import { Armchair } from "lucide-react";
import { Seat } from "./Seat";
import { SEATS_PER_ROW, TOTAL_SEATS } from "../constants";

interface SeatLayoutProps {
  bookedSeats: Set<number>;
  selectedSeat: number | null;
  onSelectSeat: (seat: number) => void;
}

export const SeatLayout = ({
  bookedSeats,
  selectedSeat,
  onSelectSeat,
}: SeatLayoutProps) => {
  const rows = Math.ceil(TOTAL_SEATS / SEATS_PER_ROW);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-full items-start gap-3">
          <div className="flex h-[138px] min-w-16 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Driver
          </div>

          {Array.from({ length: rows }, (_, rowIndex) => {
            const start = rowIndex * SEATS_PER_ROW + 1;
            const seats = Array.from(
              { length: SEATS_PER_ROW },
              (_, i) => start + i
            ).filter((n) => n <= TOTAL_SEATS);

            return (
              <div
                key={rowIndex}
                className="grid grid-rows-[1fr_1fr_auto_1fr_1fr] items-center gap-2"
              >
                {seats.slice(0, 2).map((seat) => (
                  <Seat
                    key={seat}
                    seatNumber={seat}
                    status={
                      bookedSeats.has(seat)
                        ? "booked"
                        : selectedSeat === seat
                        ? "selected"
                        : "available"
                    }
                    onClick={onSelectSeat}
                  />
                ))}
                <div className="h-4" aria-hidden />
                {seats.slice(2, 4).map((seat) => (
                  <Seat
                    key={seat}
                    seatNumber={seat}
                    status={
                      bookedSeats.has(seat)
                        ? "booked"
                        : selectedSeat === seat
                        ? "selected"
                        : "available"
                    }
                    onClick={onSelectSeat}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Scroll horizontally on smaller screens.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
        <LegendItem color="bg-brand-50 border-brand-200" label="Available" />
        <LegendItem color="bg-brand-600" label="Selected" />
        <LegendItem color="bg-slate-100 border-slate-200" label="Booked" />
      </div>
    </div>
  );
};
const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5">
    <span className={`h-4 w-4 rounded border ${color}`} />
    <span>{label}</span>
    <Armchair className="hidden" />
  </span>
);
