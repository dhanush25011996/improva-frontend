import { useState, type FormEvent } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { BookingInput } from "../types";

interface ReservationFormProps {
  selectedSeat: number | null;
  onSubmit: (input: BookingInput) => Promise<void>;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
}

const validate = (values: BookingInput): FormErrors => {
  const errors: FormErrors = {};
  if (!values.first_name.trim()) errors.first_name = "First name is required";
  if (!values.last_name.trim()) errors.last_name = "Last name is required";
  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email";
  }
  return errors;
};

export const ReservationForm = ({
  selectedSeat,
  onSubmit,
}: ReservationFormProps) => {
  const [values, setValues] = useState<BookingInput>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successSeat, setSuccessSeat] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange =
    (field: keyof BookingInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedSeat == null) return;

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
      setSuccessSeat(selectedSeat);
      setValues({ first_name: "", last_name: "", email: "" });
      window.setTimeout(() => setSuccessSeat(null), 2500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const noSeat = selectedSeat == null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Passenger details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {!noSeat
            ? `You're booking seat #${selectedSeat}.`
            : "Select an available seat to continue."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="first_name"
          label="First name"
          placeholder="Jane"
          value={values.first_name}
          onChange={handleChange("first_name")}
          error={errors.first_name}
          disabled={noSeat}
          autoComplete="given-name"
        />
        <Input
          name="last_name"
          label="Last name"
          placeholder="Doe"
          value={values.last_name}
          onChange={handleChange("last_name")}
          error={errors.last_name}
          disabled={noSeat}
          autoComplete="family-name"
        />
      </div>

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="jane@example.com"
        value={values.email}
        onChange={handleChange("email")}
        error={errors.email}
        disabled={noSeat}
        autoComplete="email"
      />

      <Button type="submit" size="lg" disabled={noSeat || submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Booking...
          </>
        ) : (
          <>Reserve seat{selectedSeat ? ` #${selectedSeat}` : ""}</>
        )}
      </Button>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {successSeat != null && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          <Check className="h-4 w-4" />
          Seat #{successSeat} reserved successfully.
        </div>
      )}
    </form>
  );
};
