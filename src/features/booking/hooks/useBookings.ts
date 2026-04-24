import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
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
  const [state, setState] = useState<UseBookingsState>({
    bookings: [],
    loading: true,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refetch();
    return () => abortRef.current?.abort();
  }, [refetch]);

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
      const booking = await bookingsApi.book(seatNumber, input);
      setState((prev) => ({ ...prev, bookings: [...prev.bookings, booking] }));
      return booking;
    },
    []
  );

  const updateBooking = useCallback(
    async (seatNumber: number, update: BookingUpdate): Promise<void> => {
      const updated = await bookingsApi.updatePassenger(seatNumber, update);
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.seat_number === seatNumber ? updated : b
        ),
      }));
    },
    []
  );

  const deleteBooking = useCallback(
    async (seatNumber: number): Promise<void> => {
      await bookingsApi.cancel(seatNumber);
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((b) => b.seat_number !== seatNumber),
      }));
    },
    []
  );

  const resetAll = useCallback(async (): Promise<void> => {
    await bookingsApi.resetAll();
    setState((prev) => ({ ...prev, bookings: [] }));
  }, []);

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
