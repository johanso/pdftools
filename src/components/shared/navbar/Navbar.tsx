// src/components/shared/navbar/Navbar.tsx
import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet"; 
import { Logo } from "./logo";

const Navbar = () => {
  return (
    <nav className="relative mt-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-2 md:mx-auto rounded-full z-[1]">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:inline-flex rounded-full"
          >
            Sign In
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>  
  );
};

export default Navbar;
