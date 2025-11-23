import { useDirection } from "./hooks/useDirection";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import UserOverview from "./components/UserBoard/UserOverview";
import UserSettings from "./components/UserBoard/UserSettings";
import UserTickets from "./components/UserBoard/UserTickets";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import CreateEvent from "./components/UserBoard/CreateEvent";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import PublicRoute from "@/components/guards/PublicRoute";
import Events from "./pages/Events";
import Services from "./pages/Services";
import EventDetails from "./pages/EventDetails";
import HostOverview from "./components/HostBoard/HostOverview";
import HostEvents from "./components/HostBoard/EventsTable";
import HostSettings from "./components/HostBoard/HostSettings";
import ServiceDetails from "./pages/ServiceDetails";
import AddService from "./pages/AddService";
import UserServices from "./pages/UserServices";
import PlanoraAi from "./pages/PlanoraAi";
import ChatWidget from "./components/ChatWidget";
import MessagesPage from "./pages/MessagesPage";
import EventAttendeeDetails from "./components/HostBoard/EventAttendeeDetails";
import NotFoundPage from "./components/NotFoundPage";
import { useEffect } from "react";
import { startAuthListener } from "./store/authListener";
import { store } from "./store/store";

function App() {
    useDirection();

    useEffect(() => {
        const stop = startAuthListener(store);
        return () => stop && stop();
    }, []);

    return (
        <main>
            <BrowserRouter>
                <Toaster richColors position='bottom-right' />
                <ChatWidget />

                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route
                            path='/events/:eventId'
                            element={<EventDetails />}
                        />
                        <Route path='/events' element={<Events />} />
                        <Route path='/services' element={<Services />} />
                        <Route
                            path='/services/:serviceId'
                            element={<ServiceDetails />}
                        />
                        <Route path='/planora-ai' element={<PlanoraAi />} />
                    </Route>
                    <Route
                        element={
                            <PublicRoute>
                                <AuthLayout />
                            </PublicRoute>
                        }
                    >
                        <Route path='/signin' element={<Signin />} />
                        <Route path='/register' element={<Register />} />
                    </Route>

                    <Route
                        path='/user'
                        element={
                            <ProtectedRoute>
                                <SidebarLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            index
                            element={<Navigate to='overview' replace />}
                        />
                        <Route path='overview' element={<UserOverview />} />
                        <Route path='settings' element={<UserSettings />} />
                        <Route path='tickets' element={<UserTickets />} />
                        <Route path='messages' element={<MessagesPage />} />
                        <Route path='services' element={<UserServices />} />
                        <Route path='create-service' element={<AddService />} />
                    </Route>

                    <Route
                        path='/host'
                        element={
                            <ProtectedRoute>
                                <SidebarLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            index
                            element={<Navigate to='overview' replace />}
                        />
                        <Route path='overview' element={<HostOverview />} />
                        <Route
                            path='attendees'
                            element={<EventAttendeeDetails />}
                        />
                        <Route path='settings' element={<HostSettings />} />
                        <Route path='events' element={<HostEvents />} />
                        <Route path='messages' element={<MessagesPage />} />
                        <Route path='create-event' element={<CreateEvent />} />
                    </Route>
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
