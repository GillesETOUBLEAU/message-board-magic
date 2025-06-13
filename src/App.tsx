
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./contexts/EventContext";
import Index from "./pages/Index";
import EventDashboard from "./pages/EventDashboard";
import EventAdmin from "./pages/EventAdmin";
import EventProjection from "./pages/EventProjection";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Projection from "./pages/Projection";
import NotFound from "./pages/NotFound";
import EventSelector from "./components/EventSelector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EventProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<EventSelector />} />
            <Route path="/event/:eventSlug/dashboard" element={<EventDashboard />} />
            <Route path="/event/:eventSlug/admin" element={<EventAdmin />} />
            <Route path="/event/:eventSlug/projection" element={<EventProjection />} />
            {/* Legacy routes for backward compatibility */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/projection" element={<Projection />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </EventProvider>
  </QueryClientProvider>
);

export default App;
