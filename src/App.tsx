import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HomeRouter from "./pages/HomeRouter";
import Providers from "./pages/Providers";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderSignup from "./pages/ProviderSignup";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderProfileSetup from "./pages/ProviderProfileSetup";
import ProviderMyProfile from "./pages/ProviderMyProfile";
import ClientDashboard from "./pages/ClientDashboard";
import ClientAuth from "./pages/ClientAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRouter />} />
          <Route path="/landing" element={<Index />} />
          <Route path="/prestataires" element={<Providers />} />
          <Route path="/prestataire/:id" element={<ProviderProfile />} />
          <Route path="/recherche" element={<Providers />} />
          <Route path="/inscription-prestataire" element={<ProviderSignup />} />
          <Route path="/espace-client" element={<ClientDashboard />} />
          <Route path="/espace-prestataire" element={<ProviderDashboard />} />
          <Route path="/espace-prestataire/profil" element={<ProviderProfileSetup />} />
          <Route path="/espace-prestataire/mon-profil" element={<ProviderMyProfile />} />
          <Route path="/inscription-client" element={<ClientAuth />} />
          <Route path="/connexion-client" element={<ClientAuth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
