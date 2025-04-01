
import { FormData, FormValues } from "@/types/forms";

const formTemplates: Record<string, FormData> = {
  "form-1": {
    id: "form-1",
    name: "Student Formal Registration",
    description: "Registration form for student formal event",
    type: "active",
    completed: true,
    dueDate: "2023-06-15",
    questions: [
      { id: "firstname", type: "text", label: "First Name", required: true, value: "Jane" },
      { id: "surname", type: "text", label: "Surname", required: true, value: "Doe" },
      { id: "student-number", type: "text", label: "Student Number", required: true, value: "S12345" },
      { id: "student-email", type: "email", label: "Student Email Address", required: true, value: "jane.doe@student.edu" },
      { 
        id: "grade-level", 
        type: "select", 
        label: "Grade Level", 
        required: true, 
        options: ["Junior Grade 11", "Senior Grade 12"],
        value: "Senior Grade 12"
      },
      { 
        id: "ticket-type", 
        type: "select", 
        label: "Ticket Type", 
        required: true, 
        options: ["Senior Early Bird HK$690", "Regular Early Bird HK$690", "Regular Ticket HK$750"],
        value: "Senior Early Bird HK$690"
      },
      { 
        id: "paying-for-guest", 
        type: "radio", 
        label: "Are you paying for a guest?", 
        options: ["Yes", "No"], 
        required: true,
        value: "No"
      },
    ],
  },
  "form-2": {
    id: "form-2",
    name: "Table Booking Form",
    description: "Book a table for the event",
    type: "active",
    completed: false,
    dueDate: "2023-06-20",
    questions: [
      { 
        id: "party-size", 
        type: "select", 
        label: "Party Size", 
        options: ["2", "5", "10"], 
        required: true 
      },
      { 
        id: "party-members", 
        type: "textarea", 
        label: "Names of the members in your party", 
        required: true,
        placeholder: "Please list the full names of all members in your party"
      },
      { id: "accessibility", type: "checkbox", label: "Accessibility Requirements", required: false, checkboxLabel: "I require accessibility accommodations" },
      { id: "additional-notes", type: "textarea", label: "Additional Notes", required: false },
    ],
  },
  "form-3": {
    id: "form-3",
    name: "Feedback Form",
    description: "Share your feedback about the event",
    type: "upcoming",
    completed: false,
    dueDate: "2023-07-10",
    questions: [
      { id: "rating", type: "radio", label: "Overall Experience", options: ["Excellent", "Good", "Average", "Poor"], required: true },
      { id: "feedback", type: "textarea", label: "Your Feedback", required: true },
      { id: "contact-permission", type: "checkbox", label: "May we contact you about your feedback?", required: false },
    ],
  },
  "form-4": {
    id: "form-4",
    name: "Travel Arrangements",
    description: "Arrange your travel for the event",
    type: "upcoming",
    completed: false,
    dueDate: "2023-07-20",
    questions: [
      { id: "travel-method", type: "radio", label: "Travel Method", options: ["Driving", "Flying", "Train", "Other"], required: true },
      { id: "arrival-date", type: "text", label: "Arrival Date", placeholder: "MM/DD/YYYY", required: true },
      { id: "departure-date", type: "text", label: "Departure Date", placeholder: "MM/DD/YYYY", required: true },
      { id: "travel-info", type: "textarea", label: "Additional Travel Information", placeholder: "Flight number, arrival time, etc.", required: false },
    ],
  },
  "form-5": {
    id: "form-5",
    name: "Budget Approval",
    description: "Request budget approval for the event",
    type: "overdue",
    completed: false,
    dueDate: "2023-05-20",
    questions: [
      { id: "budget-amount", type: "number", label: "Budget Amount", placeholder: "Enter budget amount", required: true },
      { 
        id: "budget-category", 
        type: "select", 
        label: "Budget Category", 
        required: true, 
        options: ["Marketing", "Operations", "Staffing", "Venue", "Catering", "Other"] 
      },
      { 
        id: "approval-status", 
        type: "radio", 
        label: "Approval Status", 
        required: true, 
        options: ["Approved", "Rejected", "Pending"] 
      },
      { id: "comments", type: "textarea", label: "Comments", placeholder: "Add any comments regarding the budget", required: false },
    ],
  },
  "form-6": {
    id: "form-6",
    name: "Feedback Survey",
    description: "Post-event feedback survey",
    type: "overdue",
    completed: false,
    dueDate: "2023-05-30",
    questions: [
      { 
        id: "overall-experience", 
        type: "radio", 
        label: "Overall Experience", 
        required: true, 
        options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] 
      },
      { 
        id: "enjoyed-aspects", 
        type: "checkbox", 
        label: "What aspects did you enjoy?", 
        required: false, 
        options: ["Venue", "Food", "Speakers", "Networking", "Activities", "Other"] 
      },
      { 
        id: "improvement-aspects", 
        type: "checkbox", 
        label: "What aspects could be improved?", 
        required: false, 
        options: ["Venue", "Food", "Speakers", "Networking", "Activities", "Other"] 
      },
      { id: "additional-feedback", type: "textarea", label: "Additional Feedback", placeholder: "Please share any additional feedback or suggestions", required: false },
    ],
  },
};

export const getFormById = (formId: string): FormData | undefined => {
  return formTemplates[formId as keyof typeof formTemplates];
};

export const updateFormCompletion = (formId: string, completed: boolean): void => {
  if (formTemplates[formId as keyof typeof formTemplates]) {
    formTemplates[formId as keyof typeof formTemplates] = {
      ...formTemplates[formId as keyof typeof formTemplates],
      completed,
    };
  }
};

export const getInitialFormValues = (form: FormData): FormValues => {
  const initialValues: FormValues = {};
  form.questions.forEach((field) => {
    if (field.value) {
      initialValues[field.id] = field.value;
    }
  });
  return initialValues;
};
