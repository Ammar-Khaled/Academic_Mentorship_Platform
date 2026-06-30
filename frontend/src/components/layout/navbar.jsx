import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "mentor") return "/mentor";
    return "/student";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl !flex-row items-center justify-between px-4 overflow-hidden">
        <div className="flex !flex-row items-center gap-4 shrink-0">
          <Link to="/" className="flex !flex-row items-center gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-primary whitespace-nowrap">Mentorship Hub</span>
          </Link>

          {isAuthenticated && (
            <Link to={getDashboardLink()} className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:block">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex !flex-row items-center gap-2 sm:gap-4">
          {/* Utilities Group: Language & Theme */}
          <div className="flex !flex-row items-center gap-1 border-e pe-2 sm:pe-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Auth Group */}
          <div className="flex !flex-row items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
