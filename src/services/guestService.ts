
import { supabase } from './baseService';

// Submit guest information
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
    if (!supabase) {
      console.warn('Cannot submit guest info: Supabase client not available');
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

// Retrieve guest submissions
export const getGuestSubmissions = async (formId: string, userEmail?: string) => {
  try {
    if (!supabase) {
      console.warn('Cannot get guest submissions: Supabase client not available');
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
