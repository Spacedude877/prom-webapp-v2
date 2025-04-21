
// Adjusted types: guests removed/replaced with guest_info on attendee

export interface FormSubmission {
  id: string;
  form_id: string;
  submission_data: Record<string, any>;
  submitted_at: string;
  first_name?: string;
  surname?: string;
  student_number?: string;
  email?: string;
  grade_level?: string;
  ticket_type?: string;
  has_guest?: boolean;
  additional_info?: Record<string, any>;
  user_email?: string;
  qr_code?: string;
  scan_count?: number;
  payment_status?: string;
  attendance_status?: string;
  guest_info?: {
    first_name: string;
    surname: string;
    email?: string;
    grade_level?: string;
    ticket_type?: string;
    qr_code?: string;
    scan_count?: number;
    payment_status?: string;
    attendance_status?: string;
    [key: string]: any;
  };
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

// Main attendee type (embedded guest)
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
  guest_info?: {
    first_name: string;
    surname: string;
    email?: string;
    grade_level?: string;
    ticket_type?: string;
    qr_code?: string;
    scan_count?: number;
    payment_status?: string;
    attendance_status?: string;
    [key: string]: any;
  };
}

// Removed Guest interface as we are now embedding guest_info

export interface SeatingRequest {
  id: string;
  attendee_id: string;
  request_type: string;
  request_details?: Record<string, any>;
  submitted_at: string;
}

