export interface FormSubmission {
  id: string;
  form_id: string; // Keep as form_id for internal use
  submission_data: Record<string, any>;
  submitted_at: string;
  // Additional fields from the Supabase schema
  first_name?: string;
  surname?: string;
  student_number?: string;
  email?: string;
  grade_level?: string;
  ticket_type?: string;
  has_guest?: boolean;
  additional_info?: Record<string, any>;
  user_email?: string; // Add user_email field
  qr_code?: string; // Add QR code field
  scan_count?: number; // Add scan count field
  payment_status?: string; // Add payment status field
  attendance_status?: string; // Add attendance status field
}

export interface QrCodeVerification {
  id: string;
  first_name: string;
  surname: string;
  student_number: string;
  grade_level: string;
  scan_count: number;
  submission_data: Record<string, any>;
  payment_status: string;
  attendance_status: string;
  is_valid: boolean;
  message: string;
}

// TicketForm type (main attendee)
export interface TicketForm {
  id: string;
  first_name: string;
  surname: string;
  student_email: string;
  grade_level?: string;
  ticket_type?: string;
  submitted_at: string;
  submission_data?: Record<string, any>;
  qr_code?: string;
  scan_count?: number;
  payment_status?: string;
  attendance_status?: string;
  user_email?: string;
  has_guest?: boolean;
}

// Guest type
export interface Guest {
  id: string;
  attendee_id: string; // links to TicketForm.id
  first_name: string;
  surname: string;
  guest_email?: string;
  grade_level?: string;
  ticket_type?: string;
  qr_code?: string;
  scan_count?: number;
  payment_status?: string;
  attendance_status?: string;
  submission_data?: Record<string, any>;
  submitted_at: string;
}

// SeatingRequest type
export interface SeatingRequest {
  id: string;
  attendee_id: string;
  request_type: string;
  request_details?: Record<string, any>;
  submitted_at: string;
}
