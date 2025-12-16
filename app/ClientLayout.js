"use client";

import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { StoreProvider, useStore } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";

function Toast() {
  const { toastMessage } = useStore();
  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          className="toast success"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
=======

function Toast() {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;
  return (
    <div className="toast">
      {toastMessage}
    </div>
>>>>>>> 3c8d2e00d65f001eb55f8c8ddef0ab3d537da2b8
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