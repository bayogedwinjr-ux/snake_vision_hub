import { Link } from 'react-router-dom';
import { NavLink } from "@/components/NavLink";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import snaidLogo from '@/assets/snaid-logo.png';

const Navigation = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={snaidLogo} 
              alt="SNAID Logo" 
              className="h-10 w-auto transition-transform group-hover:scale-105" 
            />
            <span className="text-xl font-bold text-primary hidden sm:block">
              SNAID
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/glossary"
              className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="bg-primary/10 text-primary"
            >
              Glossary
            </NavLink>
            <NavLink
              to="/identify"
              className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="bg-primary/10 text-primary"
            >
              Identify
            </NavLink>
            <NavLink
              to="/encode"
              className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="bg-primary/10 text-primary"
            >
              Encode
            </NavLink>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden lg:inline text-foreground">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/snakes" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" />
                          Manage Snakes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="ml-4">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/glossary"
                className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                activeClassName="bg-primary/10 text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Glossary
              </NavLink>
              <NavLink
                to="/identify"
                className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                activeClassName="bg-primary/10 text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Identify
              </NavLink>
              <NavLink
                to="/encode"
                className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                activeClassName="bg-primary/10 text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Encode
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground border-t border-border mt-2 pt-4">
                    Signed in as {user?.email}
                  </div>
                  {isAdmin && (
                    <NavLink
                      to="/admin/snakes"
                      className="px-4 py-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                      activeClassName="bg-primary/10 text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 inline mr-2" />
                      Manage Snakes
                    </NavLink>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="px-4 py-3 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 text-left"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground text-center mt-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
