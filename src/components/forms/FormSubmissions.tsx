
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormSubmission } from '@/types/supabase';
import { getFormSubmissions } from '@/services/supabaseService';

interface FormSubmissionsProps {
  formId: string;
}

const FormSubmissions = ({ formId }: FormSubmissionsProps) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const loadSubmissions = async () => {
      setIsLoading(true);
      
      try {
        console.log(`Fetching form submissions for form ID: ${formId}`);
        
        const { data, error, success } = await getFormSubmissions(formId);
        
        if (error) {
          console.error("Error fetching submissions:", error);
          setError(`Failed to load submissions: ${error.message || 'Unknown error'}`);
          setIsDemoMode(false);
          setSubmissions([]);
        } else {
          console.log(`Retrieved ${data?.length || 0} submissions`, data);
          setSubmissions(data as FormSubmission[] || []);
          setError(null);
          setIsDemoMode(!success);
        }
      } catch (err: any) {
        console.error("Exception in loadSubmissions:", err);
        setError('Failed to load submissions due to an unexpected error');
        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, [formId]);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDemoMode) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-800" />
            <AlertTitle className="text-amber-800">Demo Mode</AlertTitle>
            <AlertDescription className="text-amber-700">
              Supabase connection is not configured. Please set up the Supabase environment variables to view and store form submissions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No submissions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Submissions ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Submitted: {new Date(submission.submitted_at).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(submission.submission_data).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium">{key}:</span>
                    <span className="text-sm col-span-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSubmissions;
