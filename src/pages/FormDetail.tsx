
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@/components/ui/Container'; // Fixed capitalization
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import FormRenderer from '@/components/forms/FormRenderer';
import FormSubmissions from '@/components/forms/FormSubmissions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getFormById } from '@/services/formSubmissionService';
import { Form } from '@/types/forms';

const FormDetail = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadForm = async () => {
      try {
        if (!formId) {
          setError('Form ID is missing');
          setIsLoading(false);
          return;
        }

        const formData = await getFormById(formId);
        if (!formData) {
          setError('Form not found');
        } else {
          setForm(formData);
        }
      } catch (err) {
        console.error('Failed to load form:', err);
        setError('Failed to load form. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the form. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();
  }, [formId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <Container className="flex-1 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <Container className="flex-1 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-6">{error || 'Form not found'}</p>
            <a href="/forms" className="text-blue-600 hover:text-blue-800 underline">
              Return to forms list
            </a>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <Container className="flex-1 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">{form.name}</h1>
        <p className="text-gray-600 text-center mb-8">{form.description}</p>

        <div className="max-w-3xl mx-auto">
          <FormRenderer formId={formId} formConfig={form as any} />
          
          {isAuthenticated && formId && (
            <FormSubmissions formId={formId} />
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default FormDetail;
