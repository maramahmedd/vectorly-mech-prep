// src/App.tsx (Fixed routing)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/interface" element={<PracticeInterface />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/test" element={<SupabaseTestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;