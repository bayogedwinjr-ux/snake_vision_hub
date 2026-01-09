import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Identify from "@/pages/Identify";
import Encode from "@/pages/Encode";
import Glossary from "@/pages/Glossary";
import SnakeDetail from "@/pages/SnakeDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/identify" replace />} />
            <Route path="/identify" element={<Identify />} />
            <Route path="/encode" element={<Encode />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/glossary/:id" element={<SnakeDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
