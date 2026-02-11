import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Layout } from "@/components/Layout";
import { InsightCursor } from "@/components/InsightCursor";
import { AIChatbot } from "@/components/AIChatbot";
import { ExitIntentMessage } from "@/components/ExitIntentMessage";
import Index from "./pages/Index";
import FittsLaw from "./pages/FittsLaw";
import HicksLaw from "./pages/HicksLaw";
import MillersLaw from "./pages/MillersLaw";
import VonRestorff from "./pages/VonRestorff";
import ZeigarnikEffect from "./pages/ZeigarnikEffect";
import AestheticUsability from "./pages/AestheticUsability";
import DohertyThreshold from "./pages/DohertyThreshold";
import LawOfProximity from "./pages/LawOfProximity";
import TeslersLaw from "./pages/TeslersLaw";
import PeakEndRule from "./pages/PeakEndRule";
import DarkPatterns from "./pages/DarkPatterns";
import AccessibilityLab from "./pages/AccessibilityLab";
import TypographyLab from "./pages/TypographyLab";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <ThemeProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <InsightCursor />
        <ExitIntentMessage />
        <BrowserRouter>
          <AIChatbot />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/fitts" element={<FittsLaw />} />
              <Route path="/hicks" element={<HicksLaw />} />
              <Route path="/millers" element={<MillersLaw />} />
              <Route path="/von-restorff" element={<VonRestorff />} />
              <Route path="/zeigarnik" element={<ZeigarnikEffect />} />
              <Route path="/aesthetic-usability" element={<AestheticUsability />} />
              <Route path="/doherty" element={<DohertyThreshold />} />
              <Route path="/proximity" element={<LawOfProximity />} />
              <Route path="/teslers" element={<TeslersLaw />} />
              <Route path="/peak-end" element={<PeakEndRule />} />
              <Route path="/dark-patterns" element={<DarkPatterns />} />
              <Route path="/accessibility" element={<AccessibilityLab />} />
              <Route path="/typography" element={<TypographyLab />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  </TooltipProvider>
);

export default App;
