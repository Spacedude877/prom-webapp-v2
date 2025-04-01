
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormQuestion } from "@/types/forms";
import { UseFormReturn } from "react-hook-form";

// Helper function to determine input type
const getInputType = (questionType: FormQuestion['type']): React.HTMLInputTypeAttribute | undefined => {
  if (questionType === "text" || questionType === "email" || 
      questionType === "tel" || questionType === "number") {
    return questionType;
  }
  return undefined;
};

interface FormFieldRendererProps {
  question: FormQuestion;
  form: UseFormReturn<any>;
  isCompleted: boolean;
}

const FormFieldRenderer = ({ question, form, isCompleted }: FormFieldRendererProps) => {
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
          
          {(question.type === "text" || question.type === "email" || 
           question.type === "tel" || question.type === "number") ? (
            <FormControl>
              <Input
                type={getInputType(question.type)}
                placeholder={question.placeholder || `Enter ${question.label.toLowerCase()}`}
                disabled={isCompleted}
                {...field}
                value={field.value as string || ''}
              />
            </FormControl>
          ) : question.type === "textarea" ? (
            <FormControl>
              <Textarea
                placeholder={question.placeholder || `Enter ${question.label.toLowerCase()}`}
                className="min-h-[120px]"
                disabled={isCompleted}
                {...field}
                value={field.value as string || ''}
              />
            </FormControl>
          ) : question.type === "checkbox" && !question.options ? (
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  disabled={isCompleted}
                />
              </FormControl>
              <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {question.checkboxLabel || question.label}
              </div>
            </div>
          ) : question.type === "checkbox" && question.options ? (
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={Array.isArray(field.value) ? field.value.includes(option) : false}
                      onCheckedChange={(checked) => {
                        const currentValues = Array.isArray(field.value) ? field.value : [];
                        if (checked) {
                          field.onChange([...currentValues, option]);
                        } else {
                          field.onChange(currentValues.filter(val => val !== option));
                        }
                      }}
                      disabled={isCompleted}
                    />
                  </FormControl>
                  <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {option}
                  </div>
                </div>
              ))}
            </div>
          ) : question.type === "radio" ? (
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value as string}
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
                value={field.value as string}
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
  );
};

export default FormFieldRenderer;
