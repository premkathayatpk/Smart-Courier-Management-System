import "./globals.css";
// import StoreProvider from "@/redux/provider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Smart Courier Management System",
  description: "Courier Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
