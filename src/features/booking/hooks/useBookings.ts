import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  BOOKINGS_STORAGE_KEY,
} from "../constants";
import { useBookingDataSource } from "../context/BookingDataSourceContext";
import { bookingsApi } from "../services/bookings.api";
import type { Booking, BookingInput, BookingUpdate } from "../types";

interface UseBookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const toErrorMessage = (err: unknown): string => {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

export const useBookings = () => {
  const { isBackendMode } = useBookingDataSource();
  const [localBookings, setLocalBookings] = useLocalStorage<Booking[]>(
    BOOKINGS_STORAGE_KEY,
    []
  );
  const [state, setState] = useState<UseBookingsState>({
    bookings: [],
    loading: isBackendMode,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    if (!isBackendMode) {
      setState({ bookings: localBookings, loading: false, error: null });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const bookings = await bookingsApi.listClosed(controller.signal);
      setState({ bookings, loading: false, error: null });
    } catch (err) {
      if (controller.signal.aborted) return;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: toErrorMessage(err),
      }));
    }
  }, [isBackendMode, localBookings]);

  useEffect(() => {
    refetch();
    return () => {
      if (isBackendMode) {
        abortRef.current?.abort();
      }
    };
  }, [isBackendMode, refetch]);

  const bookedSeats = useMemo(
    () => new Set(state.bookings.map((b) => b.seat_number)),
    [state.bookings]
  );

  const isSeatBooked = useCallback(
    (seatNumber: number) => bookedSeats.has(seatNumber),
    [bookedSeats]
  );

  const getBookingBySeat = useCallback(
    (seatNumber: number) =>
      state.bookings.find((b) => b.seat_number === seatNumber) ?? null,
    [state.bookings]
  );

  const createBooking = useCallback(
    async (seatNumber: number, input: BookingInput): Promise<Booking> => {
      if (!isBackendMode) {
        const booking: Booking = {
          seat_number: seatNumber,
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          phone: input.phone ?? null,
          booked_at: new Date().toISOString(),
        };
        setLocalBookings((prev) => [...prev, booking]);
        return booking;
      }

      const booking = await bookingsApi.book(seatNumber, input);
      setState((prev) => ({ ...prev, bookings: [...prev.bookings, booking] }));
      return booking;
    },
    [isBackendMode, setLocalBookings]
  );

  const updateBooking = useCallback(
    async (seatNumber: number, update: BookingUpdate): Promise<void> => {
      if (!isBackendMode) {
        setLocalBookings((prev) =>
          prev.map((b) =>
            b.seat_number === seatNumber
              ? {
                  ...b,
                  first_name: update.first_name,
                  last_name: update.last_name,
                  email: update.email,
                  phone: update.phone ?? null,
                }
              : b
          )
        );
        return;
      }

      const updated = await bookingsApi.updatePassenger(seatNumber, update);
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.seat_number === seatNumber ? updated : b
        ),
      }));
    },
    [isBackendMode, setLocalBookings]
  );

  const deleteBooking = useCallback(
    async (seatNumber: number): Promise<void> => {
      if (!isBackendMode) {
        setLocalBookings((prev) =>
          prev.filter((b) => b.seat_number !== seatNumber)
        );
        return;
      }

      await bookingsApi.cancel(seatNumber);
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((b) => b.seat_number !== seatNumber),
      }));
    },
    [isBackendMode, setLocalBookings]
  );

  const resetAll = useCallback(async (): Promise<void> => {
    if (!isBackendMode) {
      setLocalBookings([]);
      return;
    }

    await bookingsApi.resetAll();
    setState((prev) => ({ ...prev, bookings: [] }));
  }, [isBackendMode, setLocalBookings]);

  return {
    bookings: state.bookings,
    loading: state.loading,
    error: state.error,
    bookedSeats,
    isSeatBooked,
    getBookingBySeat,
    refetch,
    createBooking,
    updateBooking,
    deleteBooking,
    resetAll,
  };
};
