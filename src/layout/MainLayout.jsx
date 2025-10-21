import Navbar from "@/components/NavBar";
import { Outlet } from "react-router-dom";
import FooterSection from "@/components/FooterSection";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
