import CustomerSidebar from "@/components/layout/CustomerSidebar";
import Topbar from "@/components/layout/Topbar";

export default function CustomerLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <CustomerSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
