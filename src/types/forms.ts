
export interface FormItemType {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: 'active' | 'upcoming' | 'overdue';
}

export interface FormQuestion {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  value?: string;
  checkboxLabel?: string;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
  completed: boolean;
  dueDate: string;
  name?: string;
  type?: 'active' | 'upcoming' | 'overdue';
  fields?: FormQuestion[];
}
