import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import type { Booking, BookingUpdate } from "../types";

interface EditPassengerModalProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSave: (seatNumber: number, update: BookingUpdate) => Promise<void>;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
}

const validate = (values: BookingUpdate): FormErrors => {
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

export const EditPassengerModal = ({
  booking,
  open,
  onClose,
  onSave,
}: EditPassengerModalProps) => {
  const [values, setValues] = useState<BookingUpdate>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setValues({
        first_name: booking.first_name,
        last_name: booking.last_name,
        email: booking.email,
      });
      setErrors({});
      setApiError(null);
    }
  }, [booking]);

  const handleSave = async () => {
    if (!booking) return;
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setApiError(null);
    setSaving(true);
    try {
      await onSave(booking.seat_number, values);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof BookingUpdate) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit passenger"
      description={
        booking ? `Seat #${booking.seat_number} - details can be updated.` : ""
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="first_name"
            label="First name"
            value={values.first_name}
            onChange={handleChange("first_name")}
            error={errors.first_name}
          />
          <Input
            name="last_name"
            label="Last name"
            value={values.last_name}
            onChange={handleChange("last_name")}
            error={errors.last_name}
          />
        </div>
        <Input
          name="email"
          type="email"
          label="Email"
          value={values.email}
          onChange={handleChange("email")}
          error={errors.email}
        />
        <Input
          label="Seat number"
          value={booking?.seat_number ?? ""}
          disabled
          hint="Seat number cannot be edited. Delete and rebook to change seats."
        />

        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
