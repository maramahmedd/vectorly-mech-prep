import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
          <span className="text-xl font-bold text-foreground">Vectorly</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/practice"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/practice") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Practice
          </Link>
          <Link
            to="/profile"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/profile") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Profile
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="hero" size="sm" className="shadow-strong">
            Start Free Trial
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;