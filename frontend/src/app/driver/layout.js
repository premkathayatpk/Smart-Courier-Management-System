import DriverSidebar from "@/components/layout/DriverSidebar";
import Topbar from "@/components/layout/Topbar";

export default function DriverLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DriverSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
