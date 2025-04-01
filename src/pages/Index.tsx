
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to FormFlow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            An elegant, intuitive form management system designed with simplicity in mind.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/forms")}
              className="bg-form-active hover:bg-blue-700 text-white"
            >
              View Forms
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
          
          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureItems.map((item, index) => (
              <div 
                key={index} 
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-left"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const featureItems = [
  {
    title: "Organized Forms",
    description: "Keep track of all your forms in one place with intuitive categorization by status.",
  },
  {
    title: "Visual Progress",
    description: "Clear visual indicators show which forms are complete, upcoming, or overdue.",
  },
  {
    title: "Responsive Design",
    description: "Access your forms from any device with our mobile-friendly interface.",
  },
];

export default Index;
