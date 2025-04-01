
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import FormItem from "./FormItem";
import { FormItemType } from "@/types/forms";

interface FormSectionProps {
  title: string;
  items: FormItemType[];
  defaultOpen?: boolean;
  accent?: string;
  icon?: React.ReactNode;
  count?: number;
}

const FormSection = ({ 
  title, 
  items, 
  defaultOpen = false,
  accent = "border-form-active",
  icon,
  count
}: FormSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const getCompletedCount = () => {
    return items.filter(item => item.completed).length;
  };
  
  const allCompleted = items.length > 0 && getCompletedCount() === items.length;

  // Set color based on section type
  let sectionColor = "#0087FF"; // Default blue for active
  if (title.toLowerCase() === "upcoming") sectionColor = "#9b87f5";
  if (title.toLowerCase() === "overdue") sectionColor = "#FF6B6B";

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden mb-2 bg-white",
      isOpen ? `border-gray-200` : "border-gray-200"
    )}>
      <div 
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer",
          isOpen ? `border-l-4` : ""
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderLeftColor: isOpen ? sectionColor : 'transparent' }}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 mr-3">
            {icon ? icon : (
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: sectionColor }}></div>
            )}
          </div>
          <span className="font-medium" style={{ color: sectionColor }}>{title}</span>
          <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {count !== undefined ? count : items.length}
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
      
      {isOpen && items.length > 0 && (
        <div className="p-2">
          <div className="space-y-1">
            {items.map((item) => (
              <FormItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {isOpen && items.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No forms available in this section.
        </div>
      )}
    </div>
  );
};

export default FormSection;
