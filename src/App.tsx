// src/App.tsx (Updated with Practice Interface route)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext"; // Now uses Supabase
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import PracticeInterface from "./pages/PracticeInterface";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SupabaseTestPage from "./pages/SupabaseTest";
import Upgrade from "./pages/Upgrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/interface" element={<PracticeInterface />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test" element={<SupabaseTestPage />} />
            <Route path="/test" element={<Upgrade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;