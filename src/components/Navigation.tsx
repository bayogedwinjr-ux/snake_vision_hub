import { NavLink } from "@/components/NavLink";

const Navigation = () => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <h1 className="text-lg font-semibold text-foreground">AI Snake Identifier</h1>
          <div className="flex gap-2">
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
            <NavLink
              to="/glossary"
              className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              activeClassName="bg-accent text-foreground"
            >
              Glossary
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
