
export interface FormItemType {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: 'active' | 'upcoming' | 'overdue';
}

export interface FormQuestion {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'tel';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  value?: string | string[]; // Modified to handle both single values and arrays for checkboxes
  checkboxLabel?: string;
}

export interface FormData {
  id: string;
  name: string;
  title?: string; // Title is optional
  description: string;
  questions: FormQuestion[];
  completed: boolean;
  dueDate: string;
  type: 'active' | 'upcoming' | 'overdue';
}

// Add FormValues interface for form handling
export interface FormValues {
  [key: string]: string | string[] | boolean;
}
