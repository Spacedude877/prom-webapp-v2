
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
  value?: string | boolean;
  checkboxLabel?: string;
}

export interface FormData {
  id: string;
  name: string;
  title?: string;
  description: string;
  questions: FormQuestion[];
  completed: boolean;
  dueDate: string;
  type: 'active' | 'upcoming' | 'overdue';
  fields?: FormQuestion[];
}

// Fix the FormValues type to properly handle form field values based on their types
export type FormValues = Record<string, any>;
