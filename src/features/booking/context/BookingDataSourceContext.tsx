import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  BOOKING_DATA_SOURCE_KEY,
  IS_BACKEND_INTEGRATED,
} from "../constants";

export type BookingDataSource = "backend" | "local";

interface BookingDataSourceContextValue {
  dataSource: BookingDataSource;
  isBackendMode: boolean;
  setDataSource: (next: BookingDataSource) => void;
  toggleDataSource: () => void;
}

const defaultDataSource: BookingDataSource = IS_BACKEND_INTEGRATED
  ? "backend"
  : "local";

const BookingDataSourceContext = createContext<
  BookingDataSourceContextValue | undefined
>(undefined);

export const BookingDataSourceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [dataSource, setDataSource] = useLocalStorage<BookingDataSource>(
    BOOKING_DATA_SOURCE_KEY,
    defaultDataSource
  );

  const value = useMemo<BookingDataSourceContextValue>(() => {
    const isBackendMode = dataSource === "backend";
    return {
      dataSource,
      isBackendMode,
      setDataSource,
      toggleDataSource: () =>
        setDataSource((prev) => (prev === "backend" ? "local" : "backend")),
    };
  }, [dataSource, setDataSource]);

  return (
    <BookingDataSourceContext.Provider value={value}>
      {children}
    </BookingDataSourceContext.Provider>
  );
};

export const useBookingDataSource = () => {
  const ctx = useContext(BookingDataSourceContext);
  if (!ctx) {
    throw new Error(
      "useBookingDataSource must be used within BookingDataSourceProvider"
    );
  }
  return ctx;
};
