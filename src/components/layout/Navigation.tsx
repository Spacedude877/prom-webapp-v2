
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tickets", path: "/tickets" },
    { name: "Gallery", path: "/gallery" },
    { name: "Forms", path: "/forms" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-formflow-blue tracking-tight mr-8"
            >
              FormFlow
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-formflow-blue flex items-center",
                    location.pathname === item.path
                      ? "text-formflow-blue"
                      : "text-gray-600"
                  )}
                >
                  {item.name === "Home" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                  
                  {item.name === "Tickets" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      <path d="M13 5v2" />
                      <path d="M13 17v2" />
                      <path d="M13 11v2" />
                    </svg>
                  )}
                  
                  {item.name === "Gallery" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 3h.01" />
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="m9 3 .01.01M3 3l.01.01M3 9l.01.01M3 15l.01.01M3 21l.01.01M9 21l.01.01M15 21l.01.01M21 21l.01.01M21 15l.01.01M21 9l.01.01M21 3l.01.01M15 3l.01.01" />
                    </svg>
                  )}
                  
                  {item.name === "Forms" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  )}
                  
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Login Button */}
          <div className="hidden md:flex">
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-formflow-blue hover:bg-blue-600"
            >
              <Link
                to="/login"
                className="flex items-center"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-formflow-blue"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
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
                    "text-sm font-medium transition-colors px-3 py-2 rounded-md flex items-center",
                    location.pathname === item.path
                      ? "bg-blue-50 text-formflow-blue"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                asChild
                variant="default"
                size="sm"
                className="bg-formflow-blue hover:bg-blue-600 w-full"
              >
                <Link
                  to="/login"
                  className="flex items-center justify-center"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
