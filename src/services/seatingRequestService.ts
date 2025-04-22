
import { supabase } from './baseService';
import { SeatingRequest } from '@/types/supabase';

// Submit seating request for an attendee
export const submitSeatingRequest = async (request: {
  attendee_id: string;
  request_type: string;
  request_details?: Record<string, any>;
}) => {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase unavailable' };
    }
    
    // Check if we're using the mock client
    const isMockClient = typeof supabase.from('seating_requests').insert({}).select !== 'function';
    
    if (isMockClient) {
      console.log('Using mock client for seating request submission');
      return { 
        success: true, 
        data: {
          ...request,
          id: 'mock-id',
          submitted_at: new Date().toISOString()
        },
        mock: true 
      };
    }
    
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
    console.error('Error submitting seating request:', e);
    return { success: false, error: e };
  }
};

// Fetch all seating requests for an attendee
export const getSeatingRequestsForAttendee = async (attendee_id: string) => {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase unavailable', data: [] };
    }
    
    const { data, error } = await supabase
      .from('seating_requests')
      .select('*')
      .eq('attendee_id', attendee_id);

    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    console.error('Error retrieving seating requests:', e);
    return { success: false, error: e, data: [] };
  }
};

// Get all seating requests for a specific form/event
export const getSeatingRequestsByType = async (request_type: string) => {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase unavailable', data: [] };
    }
    
    const { data, error } = await supabase
      .from('seating_requests')
      .select('*')
      .eq('request_type', request_type)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    console.error('Error retrieving seating requests by type:', e);
    return { success: false, error: e, data: [] };
  }
};
