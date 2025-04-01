
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  title: string;
  status: string;
  statusColor: string;
  onGoBack: () => void;
}

const FormHeader = ({ title, status, statusColor, onGoBack }: FormHeaderProps) => {
  return (
    <div className="flex items-center mb-6 animate-fade-in">
      <Button 
        onClick={onGoBack} 
        variant="ghost" 
        className="mr-4 -ml-2"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center mt-1">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColor)}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
