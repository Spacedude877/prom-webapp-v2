
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll behavior for glass effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById("main-nav");
      if (nav) {
        if (window.scrollY > 10) {
          nav.classList.add("glass-nav", "shadow-sm");
        } else {
          nav.classList.remove("glass-nav", "shadow-sm");
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tickets", path: "/tickets" },
    { name: "Gallery", path: "/gallery" },
    { name: "Forms", path: "/forms" },
  ];

  return (
    <nav 
      id="main-nav"
      className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-semibold text-[#1A1F2C] tracking-tight mr-8"
            >
              HKIS Prom
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#7E69AB]",
                    location.pathname === item.path
                      ? "text-[#7E69AB]"
                      : "text-gray-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Login Link */}
          <div className="hidden md:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#7E69AB] transition-colors"
            >
              Login
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#1A1F2C]" />
              ) : (
                <Menu className="h-6 w-6 text-[#1A1F2C]" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="flex flex-col space-y-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors px-3 py-2 rounded-md",
                    location.pathname === item.path
                      ? "bg-gray-50 text-[#7E69AB]"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
