import { Link } from "react-router-dom";
import { Button } from "@/components/Button";

export const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
    <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
      404
    </p>
    <h1 className="mt-2 text-3xl font-semibold text-slate-900">
      Page not found
    </h1>
    <p className="mt-2 text-sm text-slate-500">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/reservation" className="mt-6">
      <Button>Go to reservations</Button>
    </Link>
  </div>
);
