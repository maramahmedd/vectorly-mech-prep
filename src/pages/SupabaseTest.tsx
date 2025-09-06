// src/pages/SupabaseTest.tsx
import React from 'react';
import Navbar from "@/components/ui/navbar";
import SupabaseTest from '@/components/SupabaseTest';

const SupabaseTestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />
      <div className="container mx-auto py-8">
        <SupabaseTest />
      </div>
    </div>
  );
};

export default SupabaseTestPage;

// Add this route to your App.tsx:
/*
// src/App.tsx - Add this import
import SupabaseTestPage from "./pages/SupabaseTest";

// Add this route to your Routes:
<Route path="/test" element={<SupabaseTestPage />} />
*/