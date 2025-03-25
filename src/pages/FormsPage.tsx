
import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import FormSection from "@/components/forms/FormSection";
import { FormItemType } from "@/types/forms";

// Mock data for demonstration
const mockForms: FormItemType[] = [
  {
    id: "form-1",
    title: "Guest Info",
    dueDate: "3/21",
    completed: true,
    type: "active",
  },
  {
    id: "form-2",
    title: "Seating Request",
    dueDate: "3/23",
    completed: false,
    type: "active",
  },
  {
    id: "form-3",
    title: "Dietary Preferences",
    dueDate: "4/02",
    completed: false,
    type: "upcoming",
  },
  {
    id: "form-4",
    title: "Travel Arrangements",
    dueDate: "4/10",
    completed: false,
    type: "upcoming",
  },
  {
    id: "form-5",
    title: "Budget Approval",
    dueDate: "2/28",
    completed: false,
    type: "overdue",
  },
  {
    id: "form-6",
    title: "Feedback Survey",
    dueDate: "3/01",
    completed: false,
    type: "overdue",
  },
];

const FormsPage = () => {
  const [activeForms, setActiveForms] = useState<FormItemType[]>([]);
  const [upcomingForms, setUpcomingForms] = useState<FormItemType[]>([]);
  const [overdueForms, setOverdueForms] = useState<FormItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setActiveForms(mockForms.filter(form => form.type === "active"));
      setUpcomingForms(mockForms.filter(form => form.type === "upcoming"));
      setOverdueForms(mockForms.filter(form => form.type === "overdue"));
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forms</h1>
            <p className="text-gray-600">
              Manage and complete your forms in one place
            </p>
          </header>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg h-16 bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <FormSection 
                title="Active" 
                items={activeForms} 
                defaultOpen={true}
                accent="border-form-active"
              />
              
              <FormSection 
                title="Upcoming" 
                items={upcomingForms}
                accent="border-form-upcoming"
              />
              
              <FormSection 
                title="Overdue" 
                items={overdueForms} 
                accent="border-form-overdue"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
