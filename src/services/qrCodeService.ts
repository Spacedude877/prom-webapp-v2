
import { supabase } from './baseService';
import { QrCodeVerification } from '@/types/supabase';

// Verify a QR code
export const verifyQrCode = async (code: string): Promise<{ 
  success: boolean, 
  data: QrCodeVerification | null, 
  error?: any 
}> => {
  try {
    if (!supabase) {
      console.warn('Cannot verify QR code: Supabase client not available');
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

// Get the QR code for a form submission
export const getQrCodeForSubmission = async (formId: string, submissionId: string): Promise<{ success: boolean, qrCode?: string, error?: any }> => {
  try {
    if (!supabase) {
      console.warn('Cannot get QR code: Supabase client not available');
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
