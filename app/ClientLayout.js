"use client";

import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { StoreProvider, useStore } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";

function Toast() {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;
  return (
    <div className="toast">
      {toastMessage}
    </div>
  );
}

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <StoreProvider>
        <Topbar />
        {children}
        <Footer />
        <Toast />
      </StoreProvider>
    </ThemeProvider>
  );
}