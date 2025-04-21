
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
  description?: string;
  dependsOn?: {
    field: string;
    value: string | string[];
  };
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
  isMultiStep?: boolean;
  steps?: {
    title: string;
    description?: string;
    questions: string[]; // IDs of questions for this step
  }[];
}

// Fix the FormValues type to properly handle form field values based on their types
export type FormValues = Record<string, any>;

export type TableConfiguration = 
  | 'Free Seating (Single)'
  | 'Free Seating (Couple)'
  | 'Half Table (5 People)'
  | 'Half Table (6 People)'
  | 'Full Table (10 People)'
  | 'Full Table (12 People)';

// Enhanced Form interface that includes basic properties but makes the FormData specific properties optional
export interface Form {
  id: string;
  name: string;
  description: string;
  questions?: FormQuestion[];
  completed?: boolean;
  dueDate?: string;
  type?: 'active' | 'upcoming' | 'overdue';
  fields?: FormQuestion[];
  isMultiStep?: boolean;
  steps?: {
    title: string;
    description?: string;
    questions: string[];
  }[];
}
