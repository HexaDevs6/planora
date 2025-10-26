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
import CreateEvent from "./components/UserBoard/CreateEvent";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import PublicRoute from "@/components/guards/PublicRoute";
import Events from "./pages/Events";
import Services from "./pages/Services";
import EventDetails from "./pages/EventDetails";
import HostLayout from "./layout/HostLayout";
import HostOverview from "./components/HostBoard/HostOverview";
import HostEvents from "./components/HostBoard/EventsTable";
import HostMessages from "./components/HostBoard/HostMessages";
import HostSettings from "./components/HostBoard/HostSettings";

function App() {
    useDirection();
    // useTranslation hook provides access to the translation function 't'
    return (
        <main>
            <BrowserRouter>
                <Toaster richColors position='top-right' />

                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path="/events/:eventId" element={<EventDetails />} />
                        <Route path="/events" element={<Events/>}/>
                        <Route path="/services" element={<Services/>}/>
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
                                <UserLayout />
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
                        <Route path='messages' element={<UserMessages />} />
                        <Route path='create-event' element={<CreateEvent />} />
                    </Route>

                    <Route
                        path='/host'
                        element={
                            <ProtectedRoute>
                                <HostLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            index
                            element={<Navigate to='overview' replace />}
                        />
                        <Route path='overview' element={<HostOverview />} />
                        <Route path='settings' element={<HostSettings />} />
                        <Route path='events' element={<HostEvents />} />
                        <Route path='messages' element={<HostMessages />} />
                        <Route path='create-event' element={<CreateEvent />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
