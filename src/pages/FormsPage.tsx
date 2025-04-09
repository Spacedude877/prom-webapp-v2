
import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import FormSection from "@/components/forms/FormSection";
import { FormItemType } from "@/types/forms";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Base mock data for demonstration
const baseForms: FormItemType[] = [
  {
    id: "form-1",
    title: "Guest Info",
    dueDate: "3/21",
    completed: false,
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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch user's form submissions and update form statuses
    const fetchUserForms = async () => {
      setIsLoading(true);
      
      try {
        // Create a copy of the base forms to modify based on user data
        const formsWithUserData = [...baseForms];
        
        if (isAuthenticated && user?.email) {
          // Fetch the user's form submissions from Supabase
          const { data, error } = await supabase
            .from('form_submissions')
            .select('form id')
            .eq('user_email', user.email);
            
          if (error) {
            console.error("Error fetching user's form submissions:", error);
            toast.error("Error fetching your form submissions");
          } else if (data && data.length > 0) {
            // Create a set of form IDs that the user has completed
            const completedFormIds = new Set(data.map(submission => submission['form id']));
            
            // Update the completed status of forms based on user submissions
            formsWithUserData.forEach(form => {
              if (completedFormIds.has(form.id)) {
                form.completed = true;
              }
            });
            
            console.log("User has completed these forms:", completedFormIds);
          }
        }
        
        // Filter forms by type
        setActiveForms(formsWithUserData.filter(form => form.type === "active"));
        setUpcomingForms(formsWithUserData.filter(form => form.type === "upcoming"));
        setOverdueForms(formsWithUserData.filter(form => form.type === "overdue"));
      } catch (err) {
        console.error("Exception in fetchUserForms:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to simulate API fetch
    const timer = setTimeout(() => {
      fetchUserForms();
    }, 600);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

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
            {isAuthenticated && user && (
              <p className="text-sm text-green-600 mt-2">
                Logged in as {user.email}. Your form progress is being saved.
              </p>
            )}
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
