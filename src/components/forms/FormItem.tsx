
import { useNavigate } from "react-router-dom";
import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormItemType } from "@/types/forms";

interface FormItemProps {
  item: FormItemType;
}

const FormItem = ({ item }: FormItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/forms/${item.id}`);
  };
  
  return (
    <div 
      className={cn(
        "form-item p-4 bg-white rounded-md cursor-pointer border",
        item.completed 
          ? "form-item-completed border-gray-200" 
          : "hover:border-gray-300 border-gray-200",
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
            item.completed ? "bg-form-complete text-white" : "border border-gray-300"
          )}>
            {item.completed && <Check className="w-3 h-3" />}
          </div>
          <span className="font-medium text-gray-900">{item.title}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{item.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default FormItem;
