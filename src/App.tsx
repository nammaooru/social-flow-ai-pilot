
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Content from "./pages/Content";
import Schedule from "./pages/Schedule";
import Engagement from "./pages/Engagement";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import NoCodeBuilder from "./pages/NoCodeBuilder";
import WorkflowBuilder from "./components/nocode/WorkflowBuilder";
import PostCreator from "./components/nocode/PostCreator";
import TemplateBuilder from "./components/nocode/TemplateBuilder";
import RuleEditor from "./components/nocode/RuleEditor";
import DashboardBuilder from "./components/nocode/DashboardBuilder";
import Documentation from "./components/nocode/Documentation";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard routes with layout */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/content" element={<Content />} />
              <Route path="/schedule" element={<Schedule />} /> 
              <Route path="/engagement" element={<Engagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/team" element={<Team />} />
              
              {/* No-Code Builder Routes */}
              <Route path="/nocode" element={<NoCodeBuilder />} />
              <Route path="/nocode/documentation" element={<Documentation />} />
              <Route path="/nocode/workflow" element={<WorkflowBuilder />} />
              <Route path="/nocode/post" element={<PostCreator />} />
              <Route path="/nocode/template" element={<TemplateBuilder />} />
              <Route path="/nocode/rule" element={<RuleEditor />} />
              <Route path="/nocode/dashboard" element={<DashboardBuilder />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
