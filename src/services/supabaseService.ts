
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create a mock Supabase client if credentials are missing (for dev purposes)
// This will not throw errors but will log operations and return empty results
const createMockClient = () => {
  const mockMethods = {
    from: () => ({
      insert: () => Promise.resolve({ data: null, error: new Error('Mock Supabase client - No credentials provided') }),
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null })
        })
      })
    })
  };
  
  console.warn('Using mock Supabase client. Data operations will not work.');
  return mockMethods;
};

// Create the actual client or fallback to mock
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient<Database>(supabaseUrl, supabaseKey)
  : createMockClient() as any;

// Add a new function to submit guest information
export const submitGuestInfo = async (guestData: {
  first_name: string;
  surname: string;
  student_number?: string;
  email?: string;
  grade_level?: string;
  ticket_type?: string;
  has_guest?: boolean;
  additional_info?: Record<string, any>;
  form_id: string;
}) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot submit guest info: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true
      };
    }
    
    const { data, error } = await supabase
      .from('guest_info')
      .insert([guestData]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting guest information:', error);
    return { success: false, error };
  }
};

// Update existing submitFormData to also store guest info if applicable
export const submitFormData = async (formId: string, formData: Record<string, any>) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot submit form: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true
      };
    }
    
    // First, submit form data
    const formSubmission = await supabase
      .from('form_submissions')
      .insert([
        { 
          form_id: formId, // Fix: Changed from "form id" to "form_id" to match schema
          submission_data: formData,
          submitted_at: new Date().toISOString(),
        }
      ]);

    // Check if the form is for guest registration (e.g., form-1)
    if (formId === 'form-1') {
      const guestData = {
        first_name: formData.firstname,
        surname: formData.surname,
        student_number: formData['student-number'],
        email: formData['student-email'],
        grade_level: formData['grade-level'],
        ticket_type: formData['ticket-type'],
        has_guest: formData['paying-for-guest'] === 'Yes',
        form_id: formId
      };

      await submitGuestInfo(guestData);
    }

    if (formSubmission.error) throw formSubmission.error;
    return { success: true, data: formSubmission.data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error };
  }
};

// Add a function to retrieve guest information
export const getGuestSubmissions = async (formId: string) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot get guest submissions: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true,
        data: [] 
      };
    }
    
    const { data, error } = await supabase
      .from('guest_info')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error retrieving guest submissions:', error);
    return { success: false, error, data: [] };
  }
};

// Retrieve form submissions with better error handling
export const getFormSubmissions = async (formId: string) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot get submissions: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true,
        data: [] 
      };
    }
    
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error retrieving form submissions:', error);
    return { success: false, error, data: [] };
  }
};
