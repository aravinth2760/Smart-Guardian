import ReduxProvider from "@/redux/provider";
import AppLayout from "@/components/AppLayout";

export default function RootLayout() {
  return (
    <ReduxProvider>
      <AppLayout />
    </ReduxProvider>
  );
}
