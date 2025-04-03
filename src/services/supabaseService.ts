
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Form submissions service
export const submitFormData = async (formId: string, formData: Record<string, any>) => {
  try {
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

// Retrieve form submissions
export const getFormSubmissions = async (formId: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error retrieving form submissions:', error);
    return { success: false, error };
  }
};
