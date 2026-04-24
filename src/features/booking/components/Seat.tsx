import { cn } from "@/lib/cn";

interface SeatProps {
  seatNumber: number;
  status: "available" | "booked" | "selected";
  onClick?: (seatNumber: number) => void;
}

export const Seat = ({ seatNumber, status, onClick }: SeatProps) => {
  const disabled = status === "booked";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick?.(seatNumber)}
      aria-label={`Seat ${seatNumber} (${status})`}
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold",
        "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        status === "available" &&
          "border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:ring-brand-500",
        status === "selected" &&
          "border-2 border-brand-600 bg-brand-600 text-white shadow-md scale-105",
        status === "booked" &&
          "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 line-through"
      )}
    >
      {seatNumber}
    </button>
  );
};
