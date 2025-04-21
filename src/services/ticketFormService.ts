
import { supabase } from './baseService';
import { TicketForm } from '@/types/supabase';

// Submit main ticket form
export const submitTicketForm = async (form: {
  first_name: string;
  surname: string;
  student_email: string;
  grade_level?: string;
  ticket_type?: string;
  user_email?: string;
  submission_data?: Record<string, any>;
  has_guest?: boolean;
}) => {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase unavailable' };
    }
    const { data, error } = await supabase
      .from('ticket_form')
      .insert({
        ...form,
        payment_status: 'pending',
        attendance_status: 'not checked in',
        scan_count: 0,
        submitted_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Fetch ticket form by user email
export const getTicketFormByUserEmail = async (user_email: string) => {
  try {
    const { data, error } = await supabase
      .from('ticket_form')
      .select('*')
      .eq('user_email', user_email)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e, data: null };
  }
};
