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
  FormStep,
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
import { ChevronLeft, Table2 } from "lucide-react";
import { FormData, FormValues, TableConfiguration } from "@/types/forms";
import { submitFormData } from "@/services/supabaseService";
import FormSubmissions from "@/components/forms/FormSubmissions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const formTemplates: Record<string, FormData> = {
  "form-1": {
    id: "form-1",
    name: "Student Formal Registration",
    description: "Registration form for student formal event",
    type: "active",
    completed: true,
    dueDate: "2023-06-15",
    questions: [
      { id: "firstname", type: "text", label: "First Name", required: true },
      { id: "surname", type: "text", label: "Surname", required: true },
      { id: "student-number", type: "text", label: "Student Number", required: true },
      { id: "student-email", type: "email", label: "Student Email Address", required: true },
      { 
        id: "grade-level", 
        type: "select", 
        label: "Grade Level", 
        required: true, 
        options: ["Junior Grade 11", "Senior Grade 12"]
      },
      { 
        id: "ticket-type", 
        type: "select", 
        label: "Ticket Type", 
        required: true, 
        options: ["Senior Early Bird HK$690", "Regular Early Bird HK$690", "Regular Ticket HK$750"]
      },
      { 
        id: "paying-for-guest", 
        type: "radio", 
        label: "Are you paying for a guest?", 
        options: ["Yes", "No"], 
        required: true
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
    isMultiStep: true,
    questions: [
      { 
        id: "table-configuration", 
        type: "radio", 
        label: "Which table seating option are you booking", 
        options: [
          "Free Seating (Single)",
          "Free Seating (Couple)",
          "Half Table (5 People)",
          "Half Table (6 People)",
          "Full Table (10 People)",
          "Full Table (12 People)"
        ], 
        required: true 
      },
      { 
        id: "guest-1-name", 
        type: "text", 
        label: "Guest 1 - Please add your guest's full name (as known at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Free Seating (Single)", "Free Seating (Couple)", "Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      {
        id: "guest-1-grade-level",
        type: "select",
        label: "Guest 1 - Grade Level",
        required: true,
        options: ["Junior Grade 11", "Senior Grade 12"],
        dependsOn: { field: "table-configuration", value: ["Free Seating (Single)", "Free Seating (Couple)", "Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-1-school-email", 
        type: "email", 
        label: "Guest 1 - School Email Address", 
        required: true,
        placeholder: "guest@email.com",
        dependsOn: { field: "table-configuration", value: ["Free Seating (Single)", "Free Seating (Couple)", "Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-2-name", 
        type: "text", 
        label: "Guest 2 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Free Seating (Couple)", "Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-2-student-number", 
        type: "text", 
        label: "Guest 2 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Free Seating (Couple)", "Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-3-name", 
        type: "text", 
        label: "Guest 3 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-3-student-number", 
        type: "text", 
        label: "Guest 3 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-4-name", 
        type: "text", 
        label: "Guest 4 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-4-student-number", 
        type: "text", 
        label: "Guest 4 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-5-name", 
        type: "text", 
        label: "Guest 5 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-5-student-number", 
        type: "text", 
        label: "Guest 5 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      
      { 
        id: "guest-6-name", 
        type: "text", 
        label: "Guest 6 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-6-student-number", 
        type: "text", 
        label: "Guest 6 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
      
      { 
        id: "guest-7-name", 
        type: "text", 
        label: "Guest 7 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-7-student-number", 
        type: "text", 
        label: "Guest 7 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-8-name", 
        type: "text", 
        label: "Guest 8 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-8-student-number", 
        type: "text", 
        label: "Guest 8 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-9-name", 
        type: "text", 
        label: "Guest 9 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-9-student-number", 
        type: "text", 
        label: "Guest 9 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-10-name", 
        type: "text", 
        label: "Guest 10 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      { 
        id: "guest-10-student-number", 
        type: "text", 
        label: "Guest 10 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (10 People)", "Full Table (12 People)"] }
      },
      
      { 
        id: "guest-11-name", 
        type: "text", 
        label: "Guest 11 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (12 People)"] }
      },
      { 
        id: "guest-11-student-number", 
        type: "text", 
        label: "Guest 11 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (12 People)"] }
      },
      { 
        id: "guest-12-name", 
        type: "text", 
        label: "Guest 12 - Please add your guest's full name (as they are known by at school)", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (12 People)"] }
      },
      { 
        id: "guest-12-student-number", 
        type: "text", 
        label: "Guest 12 - Student Number", 
        required: true,
        dependsOn: { field: "table-configuration", value: ["Full Table (12 People)"] }
      },
      
      { 
        id: "additional-notes", 
        type: "textarea", 
        label: "Additional Notes or Requests", 
        required: false,
        dependsOn: { field: "table-configuration", value: ["Free Seating (Single)", "Free Seating (Couple)", "Half Table (5 People)", "Half Table (6 People)", "Full Table (10 People)", "Full Table (12 People)"] }
      },
    ],
    steps: [
      {
        title: "Table Configuration",
        description: "Select your table seating option",
        questions: ["table-configuration"]
      },
      {
        title: "Guest Information",
        description: "Provide details for all guests",
        questions: [
          "guest-1-name",
          "guest-1-grade-level",
          "guest-1-school-email",
          "guest-2-name", "guest-2-student-number",
          "guest-3-name", "guest-3-student-number",
          "guest-4-name", "guest-4-student-number",
          "guest-5-name", "guest-5-student-number",
          "guest-6-name", "guest-6-student-number",
          "guest-7-name", "guest-7-student-number",
          "guest-8-name", "guest-8-student-number",
          "guest-9-name", "guest-9-student-number",
          "guest-10-name", "guest-10-student-number",
          "guest-11-name", "guest-11-student-number",
          "guest-12-name", "guest-12-student-number",
          "additional-notes"
        ]
      }
    ]
  },
  "form-3": {
    id: "form-3",
    name: "Dietary Preferences Form",
    description: "Share your dietary needs for the event",
    type: "upcoming",
    completed: false,
    dueDate: "2023-07-01",
    questions: [
      {
        id: "dietary-restrictions",
        type: "textarea",
        label: "Please specify any dietary restrictions or allergies",
        required: true,
      },
      {
        id: "vegetarian-vegan",
        type: "radio",
        label: "Do you require a vegetarian or vegan meal?",
        options: ["Vegetarian", "Vegan", "No preference"],
        required: true,
      },
      {
        id: "additional-notes",
        type: "textarea",
        label: "Additional Notes",
        required: false,
      },
    ],
  },
  "form-4": {
    id: "form-4",
    name: "Travel Arrangements Form",
    description: "Let us know your travel plans for the event",
    type: "upcoming",
    completed: false,
    dueDate: "2023-07-05",
    questions: [
      {
        id: "arrival-date",
        type: "text",
        label: "Arrival Date",
        required: true,
      },
      {
        id: "departure-date",
        type: "text",
        label: "Departure Date",
        required: true,
      },
      {
        id: "transportation-needs",
        type: "textarea",
        label: "Any specific transportation needs?",
        required: false,
      },
    ],
  },
  "form-5": {
    id: "form-5",
    name: "Budget Approval Form",
    description: "Request budget approval for your project",
    type: "overdue",
    completed: false,
    dueDate: "2023-05-20",
    questions: [
      {
        id: "project-name",
        type: "text",
        label: "Project Name",
        required: true,
      },
      {
        id: "budget-amount",
        type: "number",
        label: "Budget Amount (HKD)",
        required: true,
      },
      {
        id: "justification",
        type: "textarea",
        label: "Justification for Budget Request",
        required: true,
      },
    ],
  },
  "form-6": {
    id: "form-6",
    name: "Feedback Survey Form",
    description: "Share your feedback about the event",
    type: "overdue",
    completed: false,
    dueDate: "2023-05-25",
    questions: [
      {
        id: "overall-satisfaction",
        type: "select",
        label: "Overall Satisfaction",
        options: ["Excellent", "Good", "Neutral", "Poor"],
        required: true,
      },
      {
        id: "recommend-event",
        type: "radio",
        label: "Would you recommend this event to others?",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "comments-suggestions",
        type: "textarea",
        label: "Any comments or suggestions?",
        required: false,
      },
    ],
  },
};

function FormDetail() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user, isAuthenticated } = useAuth();

  const form = useForm<FormValues>({
    defaultValues: {},
  });

  const watchTableConfiguration = form.watch("table-configuration") as TableConfiguration | undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formId && formId in formTemplates) {
        const template = formTemplates[formId];
        setFormData(template);
        
        if (isAuthenticated && user) {
          checkUserFormSubmission(formId, user.email);
        } else {
          setIsCompleted(template.completed || false);
        }
        
        const initialValues: Record<string, any> = {};
        form.reset(initialValues);
      } else {
        navigate("/forms");
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [formId, navigate, form, isAuthenticated, user]);

  const checkUserFormSubmission = async (formId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form id', formId)
        .eq('user_email', userEmail)
        .order('submitted_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error checking user form submission:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setIsCompleted(true);
        
        if (data[0].submission_data) {
          const formValues = data[0].submission_data as FormValues;
          form.reset(formValues);
        }
        
        console.log("Found user submission:", data[0]);
      } else {
        setIsCompleted(formData?.completed || false);
      }
    } catch (err) {
      console.error("Exception in checkUserFormSubmission:", err);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (formData?.isMultiStep && currentStep < (formData.steps?.length || 1) - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      if (formId) {
        console.log("Submitting form data to Supabase:", values);
        
        const { error } = await supabase
          .from('form_submissions')
          .insert({
            "form id": formId,
            submission_data: values,
            submitted_at: new Date().toISOString(),
            first_name: values.firstname || values["guest-1-name"] || '',
            surname: values.surname || '',
            student_number: values['student-number'] || values["guest-1-student-number"] || '',
            email: values['student-email'] || '',
            grade_level: values['grade-level'] || '',
            ticket_type: values['ticket-type'] || '',
            has_guest: values['paying-for-guest'] === 'Yes',
            user_email: user?.email || null
          });

        if (error) {
          console.error("Supabase submission error:", error);
          toast.error(`Error submitting form: ${error.message}`);
          setSubmissionStatus('error');
          setSupabaseError(error.message);
        } else {
          console.log("Form submission successful");
          toast.success("Form submitted successfully!");
          setIsCompleted(true);
          setIsEditing(false);
          setSubmissionStatus('success');
          
          if (formData) {
            const updatedTemplates = { ...formTemplates };
            if (formId in updatedTemplates) {
              updatedTemplates[formId] = {
                ...formData,
                completed: true,
              };
            }
          }
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while submitting the form");
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsCompleted(false);
    setSubmissionStatus('idle');
    setCurrentStep(0);
  };

  const handleGoBack = () => {
    navigate("/forms");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCompleted(true);
    setSubmissionStatus('success');
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

  const formStatus = isCompleted && !isEditing 
    ? "Completed" 
    : formData.type === "active" 
    ? "Active" 
    : formData.type === "upcoming" 
    ? "Upcoming" 
    : "Overdue";
    
  const statusColor = isCompleted && !isEditing
    ? "bg-green-100 text-green-800"
    : formData.type === "active"
    ? "bg-blue-100 text-blue-800"
    : formData.type === "upcoming"
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";

  const getFilteredQuestionsForStep = (stepIndex: number) => {
    if (!formData.steps || !formData.steps[stepIndex]) return [];
    
    return formData.questions.filter(q => {
      if (formData.steps && formData.steps[stepIndex].questions.includes(q.id)) {
        if (q.dependsOn) {
          const dependencyValue = form.watch(q.dependsOn.field);
          if (Array.isArray(q.dependsOn.value)) {
            return q.dependsOn.value.includes(dependencyValue);
          }
          return dependencyValue === q.dependsOn.value;
        }
        return true;
      }
      return false;
    });
  };

  const currentStepQuestions = formData.isMultiStep && formData.steps 
    ? getFilteredQuestionsForStep(currentStep) 
    : formData.questions;

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
              <h1 className="text-2xl font-bold text-gray-900">{formData?.name}</h1>
              <div className="flex items-center mt-1">
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColor)}>
                  {formStatus}
                </span>
                {isEditing && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Editing
                  </span>
                )}
                {submissionStatus === 'success' && !isEditing && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {supabaseError ? "Demo Mode" : "Saved to Database"}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {supabaseError && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800">Configuration Note</h3>
              <p className="text-sm text-amber-700">{supabaseError}</p>
              <p className="text-sm text-amber-700 mt-2">
                To enable database functionality, please set the Supabase environment variables:
                <code className="block mt-1 p-2 bg-amber-100 rounded">
                  VITE_SUPABASE_URL<br />
                  VITE_SUPABASE_ANON_KEY
                </code>
              </p>
            </div>
          )}

          {formData.isMultiStep && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex space-x-2">
                {formData.steps?.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center",
                      index !== 0 && "ml-2"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        currentStep >= index
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                    {index < (formData.steps?.length || 0) - 1 && (
                      <div
                        className={cn(
                          "h-1 w-12",
                          currentStep > index
                            ? "bg-primary"
                            : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium">
                Step {currentStep + 1} of {formData.steps?.length}
              </div>
            </div>
          )}
          
          <Card className="mb-8 animate-fade-in shadow-sm">
            <CardHeader>
              <CardTitle>
                {formData.isMultiStep && formData.steps 
                  ? formData.steps[currentStep].title 
                  : "Form Details"}
              </CardTitle>
              {formData.isMultiStep && formData.steps && formData.steps[currentStep].description && (
                <p className="text-sm text-muted-foreground">
                  {formData.steps[currentStep].description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {currentStepQuestions.map((question) => {
                    if (
                      currentStep === 1 && 
                      question.dependsOn?.field === "table-configuration" && 
                      question.dependsOn.value &&
                      watchTableConfiguration &&
                      (Array.isArray(question.dependsOn.value) 
                        ? !question.dependsOn.value.includes(watchTableConfiguration)
                        : question.dependsOn.value !== watchTableConfiguration)
                    ) {
                      return null;
                    }
                    
                    return (
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
                            
                            {question.type === "text" || question.type === "email" || question.type === "number" || question.type === "tel" ? (
                              <FormControl>
                                <Input
                                  type={question.type}
                                  placeholder={question.placeholder || `Enter ${question.label.toLowerCase()}`}
                                  disabled={isCompleted && !isEditing}
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                            ) : question.type === "textarea" ? (
                              <FormControl>
                                <Textarea
                                  placeholder={question.placeholder || `Enter ${question.label.toLowerCase()}`}
                                  className="min-h-[120px]"
                                  disabled={isCompleted && !isEditing}
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                            ) : question.type === "checkbox" && !question.options ? (
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={Boolean(field.value)}
                                    onCheckedChange={field.onChange}
                                    disabled={isCompleted && !isEditing}
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
                                  value={field.value || ''}
                                  disabled={isCompleted && !isEditing}
                                  className="space-y-2"
                                >
                                  {question.options?.map((option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                                      <label 
                                        htmlFor={`${question.id}-${option}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
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
                                  disabled={isCompleted && !isEditing}
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
                            
                            {question.description && (
                              <FormDescription>
                                {question.description}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                  
                  <div className="flex justify-between mt-8">
                    {formData.isMultiStep && currentStep > 0 ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePreviousStep}
                        disabled={isSubmitting || (isCompleted && !isEditing)}
                      >
                        Previous
                      </Button>
                    ) : isEditing ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    {isCompleted && !isEditing ? (
                      <Button onClick={handleEdit}>
                        Edit Response
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting 
                          ? "Submitting..." 
                          : formData.isMultiStep && currentStep < (formData.steps?.length || 1) - 1
                          ? "Next"
                          : "Submit"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {formId && isAuthenticated && user && (
            <FormSubmissions formId={formId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default FormDetail;
