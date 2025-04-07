
export interface FormSubmission {
  id: string;
  "form id": string; // Changed from form_id to match Supabase schema
  submission_data: Record<string, any>;
  submitted_at: string;
  created_at?: string; // Made optional since it might not always be present
  // Additional fields from the Supabase schema
  first_name?: string;
  surname?: string;
  student_number?: string;
  email?: string;
  grade_level?: string;
  ticket_type?: string;
  has_guest?: boolean;
  additional_info?: Record<string, any>;
}
