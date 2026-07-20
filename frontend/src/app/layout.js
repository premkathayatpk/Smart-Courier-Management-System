import ReduxProvider from "@/redux/provider";
import "./globals.css";

export const metadata = {
  title: "Smart Courier MS",
  description: "Courier Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
