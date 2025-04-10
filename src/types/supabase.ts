
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
}
