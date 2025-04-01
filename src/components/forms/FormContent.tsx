
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData, FormValues } from "@/types/forms";
import FormFieldRenderer from "./FormFieldRenderer";

interface FormContentProps {
  formData: FormData;
  isCompleted: boolean;
  isSubmitting: boolean;
  onSubmit: (values: FormValues) => void;
  onEdit: () => void;
}

const FormContent = ({ 
  formData, 
  isCompleted, 
  isSubmitting, 
  onSubmit, 
  onEdit 
}: FormContentProps) => {
  const form = useForm<FormValues>({
    defaultValues: {},
  });

  // Set form values when formData changes
  React.useEffect(() => {
    const initialValues: FormValues = {};
    formData.questions.forEach((field) => {
      if (field.value) {
        initialValues[field.id] = field.value;
      }
    });
    form.reset(initialValues);
  }, [formData, form]);

  return (
    <Card className="mb-8 animate-fade-in shadow-sm">
      <CardHeader>
        <CardTitle>Form Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formData.questions.map((question) => (
              <FormFieldRenderer
                key={question.id}
                question={question}
                form={form}
                isCompleted={isCompleted}
              />
            ))}

            <div className="mt-8 flex justify-end">
              {isCompleted ? (
                <Button type="button" onClick={onEdit}>
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
  );
};

export default FormContent;
