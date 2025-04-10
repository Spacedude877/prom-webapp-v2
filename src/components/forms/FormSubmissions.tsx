import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormSubmission } from '@/types/supabase';
import { getFormSubmissions } from '@/services/supabaseService';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FormSubmissionsProps {
  formId: string;
}

const FormSubmissions = ({ formId }: FormSubmissionsProps) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [filterByUser, setFilterByUser] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadSubmissions = async () => {
      setIsLoading(true);
      
      try {
        console.log(`Fetching form submissions for form ID: ${formId}`);
        
        let query = supabase
          .from('form_submissions')
          .select('*')
          .eq('form id', formId);
          
        // If filter by user is enabled and user is authenticated, filter by user email
        if (filterByUser && isAuthenticated && user?.email) {
          query = query.eq('user_email', user.email);
        }
        
        // Order by submitted_at, most recent first
        query = query.order('submitted_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching submissions:", error);
          setError(`Failed to load submissions: ${error.message || 'Unknown error'}`);
          setIsDemoMode(false);
          setSubmissions([]);
        } else {
          console.log(`Retrieved ${data?.length || 0} submissions`, data);
          
          // Transform the data to match our FormSubmission interface
          const transformedData = data?.map(item => ({
            id: item.id,
            form_id: item["form id"], // Transform from "form id" to form_id
            submission_data: item.submission_data || {},
            submitted_at: item.submitted_at,
            first_name: item.first_name,
            surname: item.surname,
            student_number: item.student_number,
            email: item.email,
            grade_level: item.grade_level,
            ticket_type: item.ticket_type,
            has_guest: item.has_guest,
            additional_info: item.additional_info,
            user_email: item.user_email
          })) as FormSubmission[];
          
          setSubmissions(transformedData || []);
          setError(null);
          setIsDemoMode(false);
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
  }, [formId, filterByUser, isAuthenticated, user]);

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

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Submissions ({submissions.length})</CardTitle>
        {isAuthenticated && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-user" 
              checked={filterByUser}
              onCheckedChange={(checked) => setFilterByUser(checked as boolean)}
            />
            <label 
              htmlFor="filter-user" 
              className="text-sm font-medium cursor-pointer flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Show only my submissions
            </label>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-gray-500">
            {filterByUser 
              ? "You haven't submitted any forms yet." 
              : "No submissions yet."}
          </p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Submitted: {new Date(submission.submitted_at).toLocaleString()}
                  </span>
                  {submission.user_email && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      by: {submission.user_email}
                    </span>
                  )}
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
        )}
      </CardContent>
    </Card>
  );
};

export default FormSubmissions;
