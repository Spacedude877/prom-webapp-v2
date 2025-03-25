
import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import FormItem from "./FormItem";
import { FormItemType } from "@/types/forms";

interface FormSectionProps {
  title: string;
  items: FormItemType[];
  defaultOpen?: boolean;
  accent?: string;
}

const FormSection = ({ 
  title, 
  items, 
  defaultOpen = false,
  accent = "border-form-active"
}: FormSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const getCompletedCount = () => {
    return items.filter(item => item.completed).length;
  };
  
  const allCompleted = items.length > 0 && getCompletedCount() === items.length;

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden mb-6 shadow-sm", 
      allCompleted ? "border-form-complete" : "border-gray-200"
    )}>
      <div 
        className={cn(
          "px-6 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50",
          isOpen ? `border-l-4 ${accent}` : ""
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {allCompleted && (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              <Check className="mr-1 h-3 w-3" />
              Complete
            </span>
          )}
          <span className="text-sm text-gray-500">
            ({getCompletedCount()}/{items.length})
          </span>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="bg-gray-50 p-4 animate-slide-in">
          <div className="space-y-3">
            {items.map((item) => (
              <FormItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSection;
