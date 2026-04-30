import { AppRouter } from "./routes/AppRouter";
import { BookingDataSourceProvider } from "./features/booking/context/BookingDataSourceContext";

export const App = () => (
  <BookingDataSourceProvider>
    <AppRouter />
  </BookingDataSourceProvider>
);
