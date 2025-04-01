
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
  name: string; // Making this required
  description: string;
  questions: FormQuestion[];
  completed: boolean;
  dueDate: string;
  type: 'active' | 'upcoming' | 'overdue'; // Making this required
}
