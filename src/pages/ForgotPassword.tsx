
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Since we don't have actual email functionality,
      // just show a success message
      setSubmitted(true);
      toast.success("Check your email for a reset link");
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
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={16} />
          Return to Login
        </Button>
      </div>
      
      {/* Forgot password card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1A1F2C]">HKIS</h1>
            <p className="text-gray-500 mt-2">Reset your password</p>
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Enter the email associated with your account and we'll send you a link to reset your password.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#7E69AB] hover:bg-[#6a5994]"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <p className="text-gray-700">
                A password reset link has been sent to <span className="font-semibold">{email}</span>. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
              
              <Button 
                onClick={() => navigate("/login")} 
                className="bg-[#7E69AB] hover:bg-[#6a5994]"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
