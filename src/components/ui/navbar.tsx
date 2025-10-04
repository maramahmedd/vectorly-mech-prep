import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UserMenu } from "@/components/auth/UserMenu";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
          <span className="text-xl font-bold text-foreground">Vectorly</span>
        </Link>

        {/* Desktop Navigation */}
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
          {user && (
            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <UserMenu />
          ) : (
            <>
              <AuthDialog defaultMode="login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </AuthDialog>
              <AuthDialog defaultMode="signup">
                <Button variant="hero" size="sm" className="shadow-strong">
                  Start Free Trial
                </Button>
              </AuthDialog>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-2">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <UserMenu />
          ) : null}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  to="/practice"
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary py-2",
                    isActive("/practice") ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Practice
                </Link>
                {user && (
                  <Link
                    to="/dashboard"
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary py-2",
                      isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {!user && (
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <AuthDialog defaultMode="login">
                      <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Button>
                    </AuthDialog>
                    <AuthDialog defaultMode="signup">
                      <Button variant="hero" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        Start Free Trial
                      </Button>
                    </AuthDialog>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;