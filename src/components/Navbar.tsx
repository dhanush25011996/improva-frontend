import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bus, ChevronDown, LayoutDashboard, Ticket } from "lucide-react";
import { cn } from "@/lib/cn";
import { useBookingDataSource } from "@/features/booking/context/BookingDataSourceContext";

interface NavOption {
  label: string;
  path: string;
  icon: typeof Ticket;
}

const navOptions: NavOption[] = [
  { label: "Reservation", path: "/reservation", icon: Ticket },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

export const Navbar = () => {
  const { isBackendMode, toggleDataSource } = useBookingDataSource();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const active =
    navOptions.find((o) => location.pathname.startsWith(o.path)) ??
    navOptions[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-900 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <Bus className="h-5 w-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">Improva</span>
            <span className="text-[11px] text-slate-500">Bus Ticketing</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleDataSource}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm transition-colors",
              isBackendMode
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
            title="Toggle booking data source"
          >
            Mode: {isBackendMode ? "Backend" : "Local"}
          </button>

          <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <active.icon className="h-4 w-4 text-brand-600" />
            <span>{active.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>

            {open && (
              <ul
                role="listbox"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              >
                {navOptions.map((option) => {
                  const isActive = option.path === active.path;
                  const Icon = option.icon;
                  return (
                    <li key={option.path}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelect(option.path)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? "text-brand-600" : "text-slate-400"
                          )}
                        />
                        <span className="flex-1 font-medium">
                          {option.label}
                        </span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-brand-500" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
