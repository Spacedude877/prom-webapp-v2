
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Navigation from "@/components/layout/Navigation";
import { FormValues } from "@/types/forms";
import FormHeader from "@/components/forms/FormHeader";
import FormContent from "@/components/forms/FormContent";
import FormSkeleton from "@/components/forms/FormSkeleton";
import FormNotFound from "@/components/forms/FormNotFound";
import { getFormById, updateFormCompletion } from "@/services/formService";

function FormDetail() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formId) {
        const template = getFormById(formId);
        if (template) {
          setFormData(template);
          setIsCompleted(template.completed || false);
        }
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [formId]);

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Form submitted successfully!");
      setIsCompleted(true);
      setIsSubmitting(false);

      if (formData && formId) {
        updateFormCompletion(formId, true);
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
    return <FormSkeleton />;
  }

  if (!formData) {
    return <FormNotFound onGoBack={handleGoBack} />;
  }

  const formStatus = isCompleted ? "Completed" : formData.type === "active" ? "Active" : formData.type === "upcoming" ? "Upcoming" : "Overdue";
  const statusColor = isCompleted
    ? "bg-green-100 text-green-800"
    : formData.type === "active"
    ? "bg-blue-100 text-blue-800"
    : formData.type === "upcoming"
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <FormHeader 
            title={formData.name}
            status={formStatus}
            statusColor={statusColor}
            onGoBack={handleGoBack}
          />
          
          <FormContent 
            formData={formData}
            isCompleted={isCompleted}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default FormDetail;
