
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
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
      className="bg-white rounded-md p-4 mb-2 border border-gray-200 hover:border-gray-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-5 h-5 mr-3">
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
              {item.completed && (
                <div className="w-3 h-3 rounded-full bg-form-complete"></div>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-500">Due: {item.dueDate}</div>
          </div>
        </div>
        <div>
          {item.completed ? (
            <span className="text-form-complete font-medium text-sm">Completed</span>
          ) : item.type === "overdue" ? (
            <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-md">Overdue</span>
          ) : (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">In Progress</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormItem;
