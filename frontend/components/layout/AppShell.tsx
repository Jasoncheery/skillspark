"use client";

import { usePathname } from "next/navigation";
import { 
  Star, Heart, Lightbulb, Rocket, GraduationCap, Brain, 
  Pencil, Music, Globe, Palette
} from "lucide-react";
import { FloatingIcon } from "@/components/ui/FloatingIcon";
import { MiniOwl } from "@/components/ui/OwlAvatar";
import Header from "./Header";
import Footer from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  
  // Determine if we should show full decorations or reduced density
  // Home page and marketing pages get full treatment
  const isHomePage = pathname === "/";
  const isMarketingPage = pathname === "/" || pathname === "/ai-tools" || pathname === "/lessons" || pathname === "/blog";
  
  // Reduce decoration density on inner pages (detail pages, dashboard, auth)
  const showFullDecorations = isMarketingPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Floating decorative icons - full set for marketing pages, reduced for others */}
      {showFullDecorations ? (
        <>
          <FloatingIcon icon={Star} className="text-accent top-32 left-[10%]" delay={0} />
          <FloatingIcon icon={Heart} className="text-primary top-48 right-[15%]" delay={0.5} />
          <FloatingIcon icon={Lightbulb} className="text-accent top-64 left-[5%]" delay={1} />
          <FloatingIcon icon={Rocket} className="text-primary bottom-48 right-[8%]" delay={1.5} />
          <FloatingIcon icon={GraduationCap} className="text-primary bottom-32 left-[12%]" delay={2} />
          <FloatingIcon icon={Brain} className="text-accent top-40 right-[5%]" delay={2.5} />
          <FloatingIcon icon={Pencil} className="text-primary bottom-64 right-[20%]" delay={3} />
          <FloatingIcon icon={Music} className="text-accent top-56 left-[20%]" delay={3.5} />
          <FloatingIcon icon={Globe} className="text-primary bottom-40 left-[25%]" delay={4} />
          <FloatingIcon icon={Palette} className="text-accent top-72 right-[25%]" delay={4.5} />
          
          {/* Mini owls decoration */}
          <MiniOwl className="absolute top-36 right-[10%] opacity-40" />
          <MiniOwl className="absolute bottom-52 left-[8%] opacity-40" />
          <MiniOwl className="absolute top-60 left-[15%] opacity-30" />
        </>
      ) : (
        <>
          {/* Reduced decorations for inner pages */}
          <FloatingIcon icon={Star} className="text-accent top-32 left-[8%]" delay={0} />
          <FloatingIcon icon={Lightbulb} className="text-primary top-56 right-[10%]" delay={1} />
          <FloatingIcon icon={Brain} className="text-accent bottom-40 right-[12%]" delay={2} />
          <FloatingIcon icon={Pencil} className="text-primary bottom-56 left-[15%]" delay={3} />
          
          {/* Single mini owl for subtle branding */}
          <MiniOwl className="absolute top-40 right-[8%] opacity-30" />
        </>
      )}

      {/* Header */}
      <Header />

      {/* Main content area */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
