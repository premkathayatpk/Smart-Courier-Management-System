import ReduxProvider from "@/redux/provider";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthLoader from "@/components/auth/AuthLoader";

export const metadata = {
  title: "Smart Courier MS",
  description: "Courier Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthLoader>
            <Toaster position="top-right" />
            {children}
          </AuthLoader>
        </ReduxProvider>{" "}
      </body>
    </html>
  );
}
