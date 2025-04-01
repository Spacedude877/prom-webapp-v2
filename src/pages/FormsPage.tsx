
import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import FormSection from "@/components/forms/FormSection";
import { FormItemType } from "@/types/forms";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

// Mock data for demonstration
const mockForms: FormItemType[] = [
  {
    id: "form-1",
    title: "Guest Information",
    dueDate: "Mar 21, 2023",
    completed: true,
    type: "active",
  },
  {
    id: "form-2",
    title: "Seating Request",
    dueDate: "Mar 29, 2023",
    completed: false,
    type: "active",
  },
  {
    id: "form-3",
    title: "Event Registration",
    dueDate: "Apr 05, 2023",
    completed: false,
    type: "active",
  },
  {
    id: "form-4",
    title: "Dietary Preferences",
    dueDate: "Apr 02, 2023",
    completed: false,
    type: "upcoming",
  },
  {
    id: "form-5",
    title: "Travel Arrangements",
    dueDate: "Apr 10, 2023",
    completed: false,
    type: "upcoming",
  },
  {
    id: "form-6",
    title: "Budget Approval",
    dueDate: "Feb 28, 2023",
    completed: false,
    type: "overdue",
  },
];

const FormsPage = () => {
  const [activeForms, setActiveForms] = useState<FormItemType[]>([]);
  const [upcomingForms, setUpcomingForms] = useState<FormItemType[]>([]);
  const [overdueForms, setOverdueForms] = useState<FormItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    active: true,
    upcoming: false,
    overdue: false
  });

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

  const toggleSection = (section: 'active' | 'upcoming' | 'overdue') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Component for section headers with toggle functionality
  const SectionHeader = ({ 
    title, 
    count, 
    isOpen, 
    toggleOpen, 
    icon, 
    color 
  }: { 
    title: string; 
    count: number; 
    isOpen: boolean; 
    toggleOpen: () => void; 
    icon: React.ReactNode; 
    color: string;
  }) => (
    <div 
      className={`flex items-center justify-between p-4 rounded-md cursor-pointer ${isOpen ? 'mb-2' : 'mb-1'}`}
      onClick={toggleOpen}
      style={{ borderLeft: isOpen ? `4px solid ${color}` : 'none' }}
    >
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3`} style={{ color }}>
          {icon}
        </div>
        <span className="font-medium" style={{ color }}>{title}</span>
        <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header with icon */}
          <header className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-formflow-blue" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forms</h1>
            <p className="text-gray-600">
              Manage and complete your form submissions. Track active, upcoming, and overdue forms.
            </p>
          </header>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg h-16 bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Active Forms Section */}
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                <SectionHeader 
                  title="Active" 
                  count={activeForms.length} 
                  isOpen={openSections.active} 
                  toggleOpen={() => toggleSection('active')} 
                  icon={<div className="w-4 h-4 rounded-full bg-form-active" />}
                  color="#0087FF"
                />
                
                {openSections.active && (
                  <div className="p-2">
                    {activeForms.map(form => (
                      <div 
                        key={form.id} 
                        className="bg-white rounded-md p-4 mb-2 border border-gray-200 hover:border-gray-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-5 h-5 mr-3">
                              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                {form.completed && (
                                  <div className="w-3 h-3 rounded-full bg-form-complete"></div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{form.title}</div>
                              <div className="text-sm text-gray-500">Due: {form.dueDate}</div>
                            </div>
                          </div>
                          <div>
                            {form.completed ? (
                              <span className="text-form-complete font-medium text-sm">Completed</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">In Progress</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Forms Section */}
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                <SectionHeader 
                  title="Upcoming" 
                  count={upcomingForms.length} 
                  isOpen={openSections.upcoming} 
                  toggleOpen={() => toggleSection('upcoming')} 
                  icon={<div className="w-4 h-4 rounded-full bg-form-upcoming" />}
                  color="#9b87f5"
                />
                
                {openSections.upcoming && (
                  <div className="p-2">
                    {upcomingForms.map(form => (
                      <div 
                        key={form.id} 
                        className="bg-white rounded-md p-4 mb-2 border border-gray-200 hover:border-gray-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-5 h-5 mr-3">
                              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                {form.completed && (
                                  <div className="w-3 h-3 rounded-full bg-form-complete"></div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{form.title}</div>
                              <div className="text-sm text-gray-500">Due: {form.dueDate}</div>
                            </div>
                          </div>
                          <div>
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">In Progress</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Overdue Forms Section */}
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                <SectionHeader 
                  title="Overdue" 
                  count={overdueForms.length} 
                  isOpen={openSections.overdue} 
                  toggleOpen={() => toggleSection('overdue')} 
                  icon={<div className="w-4 h-4 rounded-full bg-form-overdue" />}
                  color="#FF6B6B"
                />
                
                {openSections.overdue && (
                  <div className="p-2">
                    {overdueForms.map(form => (
                      <div 
                        key={form.id} 
                        className="bg-white rounded-md p-4 mb-2 border border-gray-200 hover:border-gray-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-5 h-5 mr-3">
                              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                {form.completed && (
                                  <div className="w-3 h-3 rounded-full bg-form-complete"></div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{form.title}</div>
                              <div className="text-sm text-gray-500">Due: {form.dueDate}</div>
                            </div>
                          </div>
                          <div>
                            <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-md">Overdue</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
