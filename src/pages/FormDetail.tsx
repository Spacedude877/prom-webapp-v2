
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Check } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FormData, FormItemType } from "@/types/forms";

// Mock form data - this would come from an API in a real application
const mockFormData: Record<string, FormData> = {
  "form-1": {
    id: "form-1",
    title: "Guest Info",
    description: "Please provide your guest information for the event.",
    dueDate: "3/21",
    completed: true,
    questions: [
      {
        id: "q1",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "q2",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email address",
        required: true,
      },
      {
        id: "q3",
        type: "select",
        label: "Number of Guests",
        required: true,
        options: ["1", "2", "3", "4", "5+"],
      },
      {
        id: "q4",
        type: "textarea",
        label: "Special Requests",
        placeholder: "Any special requests or notes",
        required: false,
      },
    ],
  },
  "form-2": {
    id: "form-2",
    title: "Seating Request",
    description: "Please provide your seating preferences for the event.",
    dueDate: "3/23",
    completed: false,
    questions: [
      {
        id: "q1",
        type: "radio",
        label: "Seating Preference",
        required: true,
        options: ["Front", "Middle", "Back"],
      },
      {
        id: "q2",
        type: "checkbox",
        label: "Accessibility Requirements",
        required: false,
        options: ["Wheelchair Access", "Hearing Assistance", "Visual Assistance", "Other"],
      },
      {
        id: "q3",
        type: "textarea",
        label: "Additional Notes",
        placeholder: "Any additional seating requests",
        required: false,
      },
    ],
  },
  "form-3": {
    id: "form-3",
    title: "Dietary Preferences",
    description: "Please indicate any dietary restrictions or preferences.",
    dueDate: "4/02",
    completed: false,
    questions: [
      {
        id: "q1",
        type: "checkbox",
        label: "Dietary Restrictions",
        required: true,
        options: [
          "Vegetarian", 
          "Vegan", 
          "Gluten-Free", 
          "Dairy-Free", 
          "Nut Allergy", 
          "Seafood Allergy",
          "None"
        ],
      },
      {
        id: "q2",
        type: "textarea",
        label: "Additional Dietary Information",
        placeholder: "Please provide any additional details about your dietary needs",
        required: false,
      },
    ],
  },
  "form-4": {
    id: "form-4",
    title: "Travel Arrangements",
    description: "Please provide your travel details for the event.",
    dueDate: "4/10",
    completed: false,
    questions: [
      {
        id: "q1",
        type: "radio",
        label: "Travel Method",
        required: true,
        options: ["Driving", "Flying", "Train", "Other"],
      },
      {
        id: "q2",
        type: "text",
        label: "Arrival Date",
        placeholder: "MM/DD/YYYY",
        required: true,
      },
      {
        id: "q3",
        type: "text",
        label: "Departure Date",
        placeholder: "MM/DD/YYYY",
        required: true,
      },
      {
        id: "q4",
        type: "textarea",
        label: "Additional Travel Information",
        placeholder: "Flight number, arrival time, etc.",
        required: false,
      },
    ],
  },
  "form-5": {
    id: "form-5",
    title: "Budget Approval",
    description: "Please review and approve the budget for the upcoming event.",
    dueDate: "2/28",
    completed: false,
    questions: [
      {
        id: "q1",
        type: "number",
        label: "Budget Amount",
        placeholder: "Enter budget amount",
        required: true,
      },
      {
        id: "q2",
        type: "select",
        label: "Budget Category",
        required: true,
        options: ["Marketing", "Operations", "Staffing", "Venue", "Catering", "Other"],
      },
      {
        id: "q3",
        type: "radio",
        label: "Approval Status",
        required: true,
        options: ["Approved", "Rejected", "Pending"],
      },
      {
        id: "q4",
        type: "textarea",
        label: "Comments",
        placeholder: "Add any comments regarding the budget",
        required: false,
      },
    ],
  },
  "form-6": {
    id: "form-6",
    title: "Feedback Survey",
    description: "Please provide your feedback on the recent event.",
    dueDate: "3/01",
    completed: false,
    questions: [
      {
        id: "q1",
        type: "radio",
        label: "Overall Experience",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
      },
      {
        id: "q2",
        type: "checkbox",
        label: "What aspects did you enjoy?",
        required: false,
        options: ["Venue", "Food", "Speakers", "Networking", "Activities", "Other"],
      },
      {
        id: "q3",
        type: "checkbox",
        label: "What aspects could be improved?",
        required: false,
        options: ["Venue", "Food", "Speakers", "Networking", "Activities", "Other"],
      },
      {
        id: "q4",
        type: "textarea",
        label: "Additional Feedback",
        placeholder: "Please share any additional feedback or suggestions",
        required: false,
      },
    ],
  },
};

// Mock forms list
const mockForms: FormItemType[] = [
  {
    id: "form-1",
    title: "Guest Info",
    dueDate: "3/21",
    completed: true,
    type: "active",
  },
  {
    id: "form-2",
    title: "Seating Request",
    dueDate: "3/23",
    completed: false,
    type: "active",
  },
  {
    id: "form-3",
    title: "Dietary Preferences",
    dueDate: "4/02",
    completed: false,
    type: "upcoming",
  },
  {
    id: "form-4",
    title: "Travel Arrangements",
    dueDate: "4/10",
    completed: false,
    type: "upcoming",
  },
  {
    id: "form-5",
    title: "Budget Approval",
    dueDate: "2/28",
    completed: false,
    type: "overdue",
  },
  {
    id: "form-6",
    title: "Feedback Survey",
    dueDate: "3/01",
    completed: false,
    type: "overdue",
  },
];

const FormDetail = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      if (formId && mockFormData[formId]) {
        setForm(mockFormData[formId]);
        setIsComplete(mockFormData[formId].completed);
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [formId]);

  const handleInputChange = (questionId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      
      // Update the mock data (in a real app, this would be an API call)
      if (formId) {
        mockFormData[formId].completed = true;
        
        // Find the form in the list and update it
        const formIndex = mockForms.findIndex(f => f.id === formId);
        if (formIndex !== -1) {
          mockForms[formIndex].completed = true;
        }
      }
      
      toast({
        title: "Form submitted successfully",
        description: "Your form has been submitted and marked as complete.",
        variant: "default",
      });
    }, 1000);
  };

  const handleGoBack = () => {
    navigate("/forms");
  };

  // Render form question based on its type
  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div className="space-y-2" key={question.id}>
            <Label htmlFor={question.id} className="font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={question.id}
              type={question.type}
              placeholder={question.placeholder || ""}
              value={formValues[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              disabled={isComplete}
              required={question.required}
              className="w-full"
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2" key={question.id}>
            <Label htmlFor={question.id} className="font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={question.id}
              placeholder={question.placeholder || ""}
              value={formValues[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              disabled={isComplete}
              required={question.required}
              className="resize-none min-h-[100px]"
            />
          </div>
        );
      case "select":
        return (
          <div className="space-y-2" key={question.id}>
            <Label htmlFor={question.id} className="font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              disabled={isComplete}
              onValueChange={(value) => handleInputChange(question.id, value)}
              defaultValue={formValues[question.id] || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-3" key={question.id}>
            <div className="font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={
                    formValues[question.id]?.includes(option) || false
                  }
                  onCheckedChange={(checked) => {
                    const currentValues = formValues[question.id] || [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((val: string) => val !== option);
                    handleInputChange(question.id, newValues);
                  }}
                  disabled={isComplete}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-3" key={question.id}>
            <div className="font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <RadioGroup
              value={formValues[question.id] || ""}
              onValueChange={(value) => handleInputChange(question.id, value)}
              disabled={isComplete}
            >
              {question.options?.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-96 bg-gray-200 rounded animate-pulse mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Form not found</h1>
            <Button onClick={handleGoBack} variant="outline" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Forms
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6 animate-fade-in">
            <Button 
              onClick={handleGoBack} 
              variant="ghost" 
              className="mr-4 -ml-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 mr-4">Due: {form.dueDate}</span>
                {isComplete ? (
                  <span className="inline-flex items-center text-sm font-medium text-green-600">
                    <Check className="mr-1 h-4 w-4" />
                    Completed
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Incomplete</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
            <p className="text-gray-700">{form.description}</p>
          </div>
          
          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.questions.map((question) => (
                <div key={question.id} className="pb-4 border-b border-gray-100 last:border-0">
                  {renderQuestion(question)}
                </div>
              ))}
              
              {!isComplete && (
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Submit Form
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDetail;
