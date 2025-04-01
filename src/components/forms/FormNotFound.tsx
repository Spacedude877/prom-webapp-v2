
import React from "react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface FormNotFoundProps {
  onGoBack: () => void;
}

const FormNotFound = ({ onGoBack }: FormNotFoundProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form not found</h1>
          <Button onClick={onGoBack} variant="outline" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormNotFound;
