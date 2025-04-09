
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/layout/Navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while checking auth or redirecting
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user.name) {
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      } else if (nameParts.length === 1 && nameParts[0].length > 0) {
        return nameParts[0][0].toUpperCase();
      }
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[#1A1F2C]">Your Profile</h1>
          
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 bg-[#7E69AB] text-white">
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-bold">
                  {user.name || "User"}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
                  <Separator className="my-2" />
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-[#7E69AB] mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">Full Name</p>
                        <p className="text-gray-900">{user.name || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-[#7E69AB] mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-sm text-gray-700">Email</p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">QR Code</h3>
                  <Separator className="my-2" />
                  
                  <div className="flex justify-center mt-6 bg-gray-100 p-8 rounded-md">
                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <p className="text-gray-500 text-center px-4">QR Code will be implemented later</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
