import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const MainLayout = () => (
  <div className="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-slate-200 bg-white py-4">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-400 sm:px-6">
        Improva - 40 seats, 1 bus, infinite journeys.
      </div>
    </footer>
  </div>
);
