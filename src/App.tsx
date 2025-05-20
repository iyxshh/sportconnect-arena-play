
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Onboarding from "./pages/onboarding/Onboarding";
import Dashboard from "./pages/app/Dashboard";
import Challenges from "./pages/app/Challenges";
import Leaderboard from "./pages/app/Leaderboard";
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/app/onboarding" element={<Onboarding />} />
      
      {/* App Routes - Will require auth in a real implementation */}
      <Route path="/app/dashboard" element={
        <>
          <Navbar />
          <Dashboard />
        </>
      } />
      <Route path="/app/challenges" element={
        <>
          <Navbar />
          <Challenges />
        </>
      } />
      <Route path="/app/leaderboard" element={
        <>
          <Navbar />
          <Leaderboard />
        </>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
