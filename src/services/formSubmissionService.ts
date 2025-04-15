import { supabase } from './baseService';
import { FormSubmission } from '@/types/supabase';
import { Form } from '@/types/forms';

// Submit form data for a specific form
export const submitFormData = async (formId: string, formData: Record<string, any>, userEmail?: string) => {
  try {
    if (!supabase) {
      console.warn('Cannot submit form: Supabase client not available');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true
      };
    }
    
    // Submit form data with correct field name
    const formSubmission = await supabase
      .from('form_submissions')
      .insert({
        "form id": formId, // Use "form id" for Supabase
        submission_data: formData,
        submitted_at: new Date().toISOString(),
        first_name: formData.firstname || '',
        surname: formData.surname || '',
        student_number: formData['student-number'],
        email: formData['student-email'],
        grade_level: formData['grade-level'],
        ticket_type: formData['ticket-type'],
        has_guest: formData['paying-for-guest'] === 'Yes',
        user_email: userEmail || null // Include user_email if available
      });

    if (formSubmission.error) throw formSubmission.error;
    return { success: true, data: formSubmission.data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error };
  }
};

// Retrieve form submissions for a specific form
export const getFormSubmissions = async (formId: string, userEmail?: string) => {
  try {
    if (!supabase) {
      console.warn('Cannot get submissions: Supabase client not available');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true,
        data: [] 
      };
    }
    
    let query = supabase
      .from('form_submissions')
      .select('*')
      .eq('form id', formId); // Use "form id" for Supabase
    
    // Filter by user email if provided
    if (userEmail) {
      query = query.eq('user_email', userEmail);
    }
    
    const { data, error } = await query.order('submitted_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error retrieving form submissions:', error);
    return { success: false, error, data: [] };
  }
};

// Check if a user has submitted a specific form
export const hasUserSubmittedForm = async (formId: string, userEmail: string) => {
  try {
    if (!userEmail || !formId) {
      return { success: false, data: false };
    }
    
    if (!supabase) {
      console.warn('Cannot check user submission: Supabase client not available');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true,
        data: false 
      };
    }
    
    const { data, error } = await supabase
      .from('form_submissions')
      .select('id')
      .eq('form id', formId)
      .eq('user_email', userEmail)
      .limit(1);

    if (error) throw error;
    return { success: true, data: data && data.length > 0 };
  } catch (error) {
    console.error('Error checking user form submission:', error);
    return { success: false, error, data: false };
  }
};

export const getFormById = async (formId: string): Promise<Form | null> => {
  try {
    // This is a mock implementation. Replace with actual Supabase query
    const mockForm: Form = {
      id: formId,
      name: `Form ${formId}`,
      description: `Description for form ${formId}`
    };
    return mockForm;
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
};
