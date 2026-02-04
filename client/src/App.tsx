import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/Dashboard";
import Alerts from "@/pages/Alerts";
import Projects from "@/pages/Projects";
import Experience from "@/pages/Experience";
import Certifications from "@/pages/Certifications";
import Labs from "@/pages/Labs";
import Achievements from "@/pages/Achievements";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/projects" component={Projects} />
      <Route path="/experience" component={Experience} />
      <Route path="/certifications" component={Certifications} />
      <Route path="/labs" component={Labs} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/contact" component={Contact} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
