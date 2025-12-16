import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Clothify - Fashion E-commerce",
  description: "Modern clothing ecommerce demo built with Next.js",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
