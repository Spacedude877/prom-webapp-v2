import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { FormSubmission, QrCodeVerification } from '@/types/supabase';

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
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: [], error: null })
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
  form_id: string; // Keep as form_id for our internal use
  user_email?: string; // Add user_email field
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
    
    // Transform form_id to "form id" for Supabase
    const supabaseData = {
      ...guestData,
      "form id": guestData.form_id,
      user_email: guestData.user_email
    };
    
    // Remove the form_id property
    delete (supabaseData as any).form_id;
    
    const { data, error } = await supabase
      .from('guest_info')
      .insert([supabaseData]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting guest information:', error);
    return { success: false, error };
  }
};

// Update existing submitFormData to use correct field names and include user_email
export const submitFormData = async (formId: string, formData: Record<string, any>, userEmail?: string) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot submit form: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        mock: true
      };
    }
    
    // First, submit form data with correct field name
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

// Add a function to retrieve guest information
export const getGuestSubmissions = async (formId: string, userEmail?: string) => {
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
    
    let query = supabase
      .from('guest_info')
      .select('*')
      .eq('form id', formId); // Use "form id" for Supabase
    
    // Filter by user email if provided
    if (userEmail) {
      query = query.eq('user_email', userEmail);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error retrieving guest submissions:', error);
    return { success: false, error, data: [] };
  }
};

// Retrieve form submissions with better error handling
export const getFormSubmissions = async (formId: string, userEmail?: string) => {
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

// Add a new function to check if a user has submitted a specific form
export const hasUserSubmittedForm = async (formId: string, userEmail: string) => {
  try {
    if (!userEmail || !formId) {
      return { success: false, data: false };
    }
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot check user submission: Supabase credentials missing');
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

// Add a new function to verify a QR code
export const verifyQrCode = async (code: string): Promise<{ 
  success: boolean, 
  data: QrCodeVerification | null, 
  error?: any 
}> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot verify QR code: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing. Please check environment variables.',
        data: null 
      };
    }
    
    // Call the function that verifies the QR code and handles check-in
    const { data, error } = await supabase
      .rpc('verify_ticket', { code });
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { 
        success: false, 
        error: 'QR code not found', 
        data: null 
      };
    }
    
    // Pass through the verification result
    return { 
      success: true, 
      data: data[0] 
    };
  } catch (error) {
    console.error('Error verifying QR code:', error);
    return { success: false, error, data: null };
  }
};

// Add a function to get the QR code for a form submission
export const getQrCodeForSubmission = async (formId: string, submissionId: string): Promise<{ success: boolean, qrCode?: string, error?: any }> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Cannot get QR code: Supabase credentials missing');
      return { 
        success: false, 
        error: 'Supabase configuration missing.'
      };
    }
    
    const { data, error } = await supabase
      .from('form_submissions')
      .select('qr_code')
      .eq('id', submissionId)
      .eq('form id', formId)
      .single();
      
    if (error) throw error;
    
    return { 
      success: true, 
      qrCode: data?.qr_code 
    };
  } catch (error) {
    console.error('Error getting QR code:', error);
    return { success: false, error };
  }
};
