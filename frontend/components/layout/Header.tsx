"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "🏠 Home", href: "/" },
  { name: "🤖 AI Tools", href: "/ai-tools" },
  { name: "📚 Lessons", href: "/lessons" },
  { name: "📝 Blog", href: "/blog" },
  { name: "📊 Dashboard", href: "/dashboard" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md shadow-cute">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover-lift">
          <span className="text-2xl">✨</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SkillSpark
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-primary font-bold"
                    : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-cute bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-sm hover-lift transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
