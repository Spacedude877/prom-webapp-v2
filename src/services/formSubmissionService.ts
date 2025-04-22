
import { supabase } from './baseService';
import { FormSubmission } from '@/types/supabase';
import { submitTicketForm } from './ticketFormService';
import { submitSeatingRequest } from './seatingRequestService';

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
    
    // Determine which table to submit to based on the form ID
    if (formId === "form-2") {
      // For the table booking form, submit to seating_requests
      const seatingRequest = await submitSeatingRequest({
        attendee_id: userEmail || 'anonymous',
        request_type: formData['table-configuration'] || 'unknown',
        request_details: formData
      });
        
      return seatingRequest;
      
    } else {
      // For other forms, submit to ticket_form
      const ticketSubmission = await submitTicketForm({
        first_name: formData.firstname || '',
        surname: formData.surname || '',
        student_email: formData['student-email'] || '',
        grade_level: formData['grade-level'] || '',
        ticket_type: formData['ticket-type'] || '',
        user_email: userEmail || null,
        submission_data: formData,
        has_guest: formData['paying-for-guest'] === 'Yes',
        form_id: formId // Store which form was used
      });

      return ticketSubmission;
    }
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
    
    // For table booking form, query seating_requests
    if (formId === "form-2") {
      let query = supabase
        .from('seating_requests')
        .select('*')
        .eq('request_type', formId);  // Filter by form ID stored in request_type
      
      // Filter by user email if provided (using attendee_id for now)
      if (userEmail) {
        query = query.eq('attendee_id', userEmail);
      }
      
      const { data, error } = await query.order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
      
    } else {
      // For other forms, query ticket_form
      let query = supabase
        .from('ticket_form')
        .select('*')
        .eq('form_id', formId);  // Using form_id field
      
      // Filter by user email if provided
      if (userEmail) {
        query = query.eq('user_email', userEmail);
      }
      
      const { data, error } = await query.order('submitted_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    }
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
    
    // For table booking form, check seating_requests
    if (formId === "form-2") {
      const { data, error } = await supabase
        .from('seating_requests')
        .select('id')
        .eq('request_type', formId)  // Using formId as request_type
        .eq('attendee_id', userEmail)  // Using email as attendee_id
        .limit(1);
        
      if (error) throw error;
      return { success: true, data: data && data.length > 0 };
      
    } else {
      // For other forms, check ticket_form
      const { data, error } = await supabase
        .from('ticket_form')
        .select('id')
        .eq('form_id', formId)
        .eq('user_email', userEmail)
        .limit(1);

      if (error) throw error;
      return { success: true, data: data && data.length > 0 };
    }
  } catch (error) {
    console.error('Error checking user form submission:', error);
    return { success: false, error, data: false };
  }
};
