
// Add handler for the new guests table and qr code structure

import { supabase } from './baseService';
import { Guest } from '@/types/supabase';

// Submit a new guest (linked to attendee via attendee_id)
export const submitGuest = async (guestData: {
  attendee_id: string;
  first_name: string;
  surname: string;
  guest_email?: string;
  grade_level?: string;
  ticket_type?: string;
  submission_data?: Record<string, any>;
}) => {
  try {
    if (!supabase) {
      console.warn('Cannot submit guest: Supabase client not available');
      return { success: false, error: 'Supabase unavailable' };
    }

    // Generate a placeholder QR code for the guest based on their UUID after insert
    const { data, error } = await supabase
      .from('guests')
      .insert({
        ...guestData,
        qr_code: null, // Will be updated after insert if required
        scan_count: 0,
        payment_status: 'pending',
        attendance_status: 'not checked in',
        submitted_at: new Date().toISOString(),
      })
      .select(); // Get the inserted guest row

    if (error) throw error;

    const guest = data?.[0];
    if (guest) {
      // Optionally generate and save a QR code here, e.g., using guest.id
      // For now, assume the backend (trigger) or another service sets qr_code using guest.id
      return { success: true, data: guest };
    }
    return { success: false, error: "Guest insertion failed" };
  } catch (e) {
    console.error('Error submitting guest:', e);
    return { success: false, error: e };
  }
};

// Fetch guests for an attendee
export const getGuestsForAttendee = async (attendee_id: string) => {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase unavailable', data: [] };
    }
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('attendee_id', attendee_id);

    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e, data: [] };
  }
};
