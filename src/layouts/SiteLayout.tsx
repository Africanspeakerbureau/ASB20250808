import { Outlet } from "react-router-dom";
import Header from "@/components/Header"; // or Navbar
import Footer from "@/components/Footer";

export default function SiteLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer /> {/* <- ONE shared footer */}
    </div>
  );
}

