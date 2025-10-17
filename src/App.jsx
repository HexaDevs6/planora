import { useDirection } from "./hooks/useDirection";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import UserMessages from "./components/UserBoard/UserMessages";
import UserOverview from "./components/UserBoard/UserOverview";
import UserSettings from "./components/UserBoard/UserSettings";
import UserTickets from "./components/UserBoard/UserTickets";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";

function App() {
  useDirection();
  // useTranslation hook provides access to the translation function 't'
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<Signin />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<UserOverview />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="tickets" element={<UserTickets />} />
            <Route path="messages" element={<UserMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
