
import { createClient } from '@supabase/supabase-js';

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
  ? createClient(supabaseUrl, supabaseKey)
  : createMockClient() as any;

// Form submissions service with better error handling
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
    
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([
        { 
          form_id: formId,
          submission_data: formData,
          submitted_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error };
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
