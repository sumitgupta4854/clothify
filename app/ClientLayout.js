"use client";

import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { StoreProvider, useStore } from "@/lib/store";

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
    <StoreProvider>
      <Topbar />
      {children}
      <Footer />
      <Toast />
    </StoreProvider>
  );
}