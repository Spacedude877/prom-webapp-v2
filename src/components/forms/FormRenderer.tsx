
import React, { useState } from 'react';
import { Form, FormQuestion } from '@/types/forms';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { submitFormData } from '@/services/formSubmissionService';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormRendererProps {
  formId?: string;
  formConfig: Form;
}

const FormRenderer: React.FC<FormRendererProps> = ({ formId, formConfig }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();

  const onSubmit = async (data: any) => {
    if (!formId) {
      toast({
        title: "Error",
        description: "Form ID is missing",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Add user email if authenticated
      const userEmail = isAuthenticated ? user?.email : null;
      
      const result = await submitFormData(formId, data, userEmail as string);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Form submitted successfully",
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to submit form",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: FormQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id} className="block text-sm font-medium mb-1">
              {question.label} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={question.id}
              type="text"
              placeholder={question.placeholder || ''}
              {...register(question.id, { required: question.required })}
              className={errors[question.id] ? "border-red-500" : ""}
            />
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            )}
            {errors[question.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        );
        
      case 'email':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id} className="block text-sm font-medium mb-1">
              {question.label} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={question.id}
              type="email"
              placeholder={question.placeholder || ''}
              {...register(question.id, { 
                required: question.required,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={errors[question.id] ? "border-red-500" : ""}
            />
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            )}
            {errors[question.id] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[question.id]?.message?.toString() || "This field is required"}
              </p>
            )}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id} className="block text-sm font-medium mb-1">
              {question.label} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={question.id}
              placeholder={question.placeholder || ''}
              {...register(question.id, { required: question.required })}
              className={errors[question.id] ? "border-red-500" : ""}
            />
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            )}
            {errors[question.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="mb-4 flex items-start space-x-2" key={question.id}>
            <Checkbox
              id={question.id}
              {...register(question.id)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={question.id} className="text-sm font-medium">
                {question.label} {question.required && <span className="text-red-500">*</span>}
              </Label>
              {question.description && (
                <p className="text-sm text-gray-500">{question.description}</p>
              )}
            </div>
          </div>
        );
        
      case 'select':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id} className="block text-sm font-medium mb-1">
              {question.label} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              onValueChange={(value) => setValue(question.id, value)}
              defaultValue=""
            >
              <SelectTrigger className={errors[question.id] ? "border-red-500" : ""}>
                <SelectValue placeholder={question.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            )}
            {errors[question.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        );
        
      case 'radio':
        return (
          <div className="mb-4" key={question.id}>
            <Label className="block text-sm font-medium mb-2">
              {question.label} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(question.id, value)}
              defaultValue=""
              className="flex flex-col space-y-1"
            >
              {question.options?.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {question.description && (
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            )}
            {errors[question.id] && (
              <p className="text-sm text-red-500 mt-1">This field is required</p>
            )}
          </div>
        );
        
      default:
        return (
          <div className="mb-4" key={question.id}>
            <p className="text-sm text-gray-500">Unsupported field type: {question.type}</p>
          </div>
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your form has been submitted successfully.</p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            Submit Another Response
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-amber-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m1-12a1 1 0 011 1v4a1 1 0 01-1 1H6.5a1 1 0 01-1-1v-4a1 1 0 011-1H10zm7 0a1 1 0 011 1v4a1 1 0 01-1 1h-3.5a1 1 0 01-1-1v-4a1 1 0 011-1H18z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to submit this form.</p>
          <Button
            onClick={() => window.location.href = '/login'}
            variant="default"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-medium mb-4">{formConfig.name}</h2>
      <p className="text-gray-600 mb-6">{formConfig.description}</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formConfig.questions && formConfig.questions.length > 0 ? (
          formConfig.questions.map((question) => renderQuestion(question))
        ) : (
          <div className="py-4 text-center text-gray-500">
            <p>No questions available for this form.</p>
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormRenderer;
