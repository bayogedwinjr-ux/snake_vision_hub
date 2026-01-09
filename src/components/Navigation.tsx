import { Link } from 'react-router-dom';
import { NavLink } from "@/components/NavLink";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Shield } from 'lucide-react';

const Navigation = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            Snake Vision Hub
          </Link>
          <div className="flex items-center gap-2">
            <NavLink
              to="/glossary"
              className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              activeClassName="bg-accent text-foreground"
            >
              Glossary
            </NavLink>
            <NavLink
              to="/identify"
              className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              activeClassName="bg-accent text-foreground"
            >
              Identify
            </NavLink>
            <NavLink
              to="/encode"
              className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              activeClassName="bg-accent text-foreground"
            >
              Encode
            </NavLink>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
              <Button asChild variant="ghost" size="sm" className="ml-2">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
