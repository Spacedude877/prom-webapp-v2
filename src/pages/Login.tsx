
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb]">
      {/* Return button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Return
        </Button>
      </div>
      
      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1A1F2C]">HKIS</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <Link to="/signup" className="text-[#7E69AB] hover:underline">
                Sign up?
              </Link>
              <Link to="/forgot-password" className="text-[#7E69AB] hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#7E69AB] hover:bg-[#6a5994]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <div className="text-center">
              <Button 
                type="button" 
                variant="outline"
                className="w-full border-[#7E69AB] text-[#7E69AB] hover:bg-[#7E69AB] hover:text-white"
                disabled={isLoading}
              >
                Login via email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
