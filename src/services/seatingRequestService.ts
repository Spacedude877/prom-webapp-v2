
import { supabase } from './baseService';
import { SeatingRequest } from '@/types/supabase';

// Submit seating request for an attendee
export const submitSeatingRequest = async (request: {
  attendee_id: string;
  request_type: string;
  request_details?: Record<string, any>;
}) => {
  try {
    const { data, error } = await supabase
      .from('seating_requests')
      .insert({
        ...request,
        submitted_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (e) {
    return { success: false, error: e };
  }
};

// Fetch all seating requests for an attendee
export const getSeatingRequestsForAttendee = async (attendee_id: string) => {
  try {
    const { data, error } = await supabase
      .from('seating_requests')
      .select('*')
      .eq('attendee_id', attendee_id);

    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e, data: [] };
  }
};
