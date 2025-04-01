import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/layout/Navigation";
import { ChevronLeft } from "lucide-react";
import { FormData, FormQuestion } from "@/types/forms";

const formTemplates: Record<string, FormData> = {
  "form-1": {
    id: "form-1",
    name: "Student Formal Registration",
    description: "Registration form for student formal event",
    type: "active",
    completed: true,
    dueDate: "2023-06-15",
    questions: [
      { id: "firstname", type: "text", label: "First Name", required: true, value: "Jane" },
      { id: "surname", type: "text", label: "Surname", required: true, value: "Doe" },
      { id: "student-number", type: "text", label: "Student Number", required: true, value: "S12345" },
      { id: "student-email", type: "email", label: "Student Email Address", required: true, value: "jane.doe@student.edu" },
      { 
        id: "grade-level", 
        type: "select", 
        label: "Grade Level", 
        required: true, 
        options: ["Junior Grade 11", "Senior Grade 12"],
        value: "Senior Grade 12"
      },
      { 
        id: "ticket-type", 
        type: "select", 
        label: "Ticket Type", 
        required: true, 
        options: ["Senior Early Bird HK$690", "Regular Early Bird HK$690", "Regular Ticket HK$750"],
        value: "Senior Early Bird HK$690"
      },
      { 
        id: "paying-for-guest", 
        type: "radio", 
        label: "Are you paying for a guest?", 
        options: ["Yes", "No"], 
        required: true,
        value: "No"
      },
    ],
  },
  "form-2": {
    id: "form-2",
    name: "Table Booking Form",
    description: "Book a table for the event",
    type: "active",
    completed: false,
    dueDate: "2023-06-20",
    questions: [
      { 
        id: "party-size", 
        type: "select", 
        label: "Party Size", 
        options: ["2", "5", "10"], 
        required: true 
      },
      { 
        id: "party-members", 
        type: "textarea", 
        label: "Names of the members in your party", 
        required: true,
        placeholder: "Please list the full names of all members in your party"
      },
      { id: "accessibility", type: "checkbox", label: "Accessibility Requirements", required: false, checkboxLabel: "I require accessibility accommodations" },
      { id: "additional-notes", type: "textarea", label: "Additional Notes", required: false },
    ],
  },
  "form-3": {
    id: "form-3",
    name: "Feedback Form",
    description: "Share your feedback about the event",
    type: "upcoming",
    completed: false,
    dueDate: "2023-07-10",
    questions: [
      { id: "rating", type: "radio", label: "Overall Experience", options: ["Excellent", "Good", "Average", "Poor"], required: true },
      { id: "feedback", type: "textarea", label: "Your Feedback", required: true },
      { id: "contact-permission", type: "checkbox", label: "May we contact you about your feedback?", required: false },
    ],
  },
  "form-4": {
    id: "form-4",
    name: "Travel Arrangements",
    description: "Arrange your travel for the event",
    type: "upcoming",
    completed: false,
    dueDate: "2023-07-20",
    questions: [
      { id: "travel-method", type: "radio", label: "Travel Method", options: ["Driving", "Flying", "Train", "Other"], required: true },
      { id: "arrival-date", type: "text", label: "Arrival Date", placeholder: "MM/DD/YYYY", required: true },
      { id: "departure-date", type: "text", label: "Departure Date", placeholder: "MM/DD/YYYY", required: true },
      { id: "travel-info", type: "textarea", label: "Additional Travel Information", placeholder: "Flight number, arrival time, etc.", required: false },
    ],
  },
  "form-5": {
    id: "form-5",
    name: "Budget Approval",
    description: "Request budget approval for the event",
    type: "overdue",
    completed: false,
    dueDate: "2023-05-20",
    questions: [
      { id: "budget-amount", type: "number", label: "Budget Amount", placeholder: "Enter budget amount", required: true },
      { 
        id: "budget-category", 
        type: "select", 
        label: "Budget Category", 
        required: true, 
        options: ["Marketing", "Operations", "Staffing", "Venue", "Catering", "Other"] 
      },
      { 
        id: "approval-status", 
        type: "radio", 
        label: "Approval Status", 
        required: true, 
        options: ["Approved", "Rejected", "Pending"] 
      },
      { id: "comments", type: "textarea", label: "Comments", placeholder: "Add any comments regarding the budget", required: false },
    ],
  },
  "form-6": {
    id: "form-6",
    name: "Feedback Survey",
    description: "Post-event feedback survey",
    type: "overdue",
    completed: false,
    dueDate: "2023-05-30",
    questions: [
      { 
        id: "overall-experience", 
        type: "radio", 
        label: "Overall Experience", 
        required: true, 
        options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] 
      },
      { 
        id: "enjoyed-aspects", 
        type: "checkbox", 
        label: "What aspects did you enjoy?", 
        required: false, 
        options: ["Venue", "Food", "Speakers", "Networking", "Activities", "Other"] 
      },
      { 
        id: "improvement-aspects", 
        type: "checkbox", 
        label: "What aspects could be improved?", 
        required: false, 
        options: ["Venue", "Food", "Speakers", "Networking", "Activities", "Other"] 
      },
      { id: "additional-feedback", type: "textarea", label: "Additional Feedback", placeholder: "Please share any additional feedback or suggestions", required: false },
    ],
  },
};

function FormDetail() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formId && formTemplates[formId as keyof typeof formTemplates]) {
        const template = formTemplates[formId as keyof typeof formTemplates] as FormData;
        setFormData(template);
        setIsCompleted(template.completed || false);
        
        const initialValues: Record<string, any> = {};
        template.questions.forEach((field) => {
          if (field.value) {
            initialValues[field.id] = field.value;
          }
        });
        form.reset(initialValues);
      } else {
        navigate("/forms");
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [formId, navigate, form]);

  const onSubmit = (values: Record<string, any>) => {
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Form submitted successfully!");
      setIsCompleted(true);
      setIsSubmitting(false);

      if (formData) {
        const updatedTemplates = { ...formTemplates };
        if (formId) {
          updatedTemplates[formId as keyof typeof formTemplates] = {
            ...formData,
            completed: true,
          };
        }
      }
    }, 1500);
  };

  const handleEdit = () => {
    setIsCompleted(false);
  };

  const handleGoBack = () => {
    navigate("/forms");
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

  if (!formData) {
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

  const formStatus = isCompleted ? "Completed" : formData.type === "active" ? "Active" : formData.type === "upcoming" ? "Upcoming" : "Overdue";
  const statusColor = isCompleted
    ? "bg-green-100 text-green-800"
    : formData.type === "active"
    ? "bg-blue-100 text-blue-800"
    : formData.type === "upcoming"
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";

  const getInputType = (questionType: FormQuestion['type']) => {
    if (questionType === "text" || questionType === "email" || 
        questionType === "tel" || questionType === "number") {
      return questionType;
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6 animate-fade-in">
            <Button 
              onClick={handleGoBack} 
              variant="ghost" 
              className="mr-4 -ml-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
              <div className="flex items-center mt-1">
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColor)}>
                  {formStatus}
                </span>
              </div>
            </div>
          </div>
          
          <Card className="mb-8 animate-fade-in shadow-sm">
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {formData.questions.map((question) => (
                    <FormField
                      key={question.id}
                      control={form.control}
                      name={question.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {question.label}
                            {question.required && <span className="ml-1 text-red-500">*</span>}
                          </FormLabel>
                          
                          {(question.type === "text" || question.type === "email" || 
                           question.type === "tel" || question.type === "number") ? (
                            <FormControl>
                              <Input
                                type={getInputType(question.type)}
                                placeholder={question.placeholder || `Enter ${question.label.toLowerCase()}`}
                                disabled={isCompleted}
                                {...field}
                              />
                            </FormControl>
                          ) : question.type === "textarea" ? (
                            <FormControl>
                              <Textarea
                                placeholder={question.placeholder || `Enter ${question.label.toLowerCase()}`}
                                className="min-h-[120px]"
                                disabled={isCompleted}
                                {...field}
                              />
                            </FormControl>
                          ) : question.type === "checkbox" && !question.options ? (
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isCompleted}
                                />
                              </FormControl>
                              <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {question.checkboxLabel || question.label}
                              </div>
                            </div>
                          ) : question.type === "radio" ? (
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isCompleted}
                                className="space-y-2"
                              >
                                {question.options?.map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                                    <label htmlFor={`${question.id}-${option}`} className="text-sm">
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          ) : question.type === "select" ? (
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isCompleted}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${question.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {question.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          ) : null}
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="mt-8 flex justify-end">
                    {isCompleted ? (
                      <Button type="button" onClick={handleEdit}>
                        Edit Response
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || formData.type === "upcoming" || formData.type === "overdue"}
                        className="flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Form"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FormDetail;
