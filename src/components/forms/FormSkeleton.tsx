
import React from "react";
import Navigation from "@/components/layout/Navigation";

const FormSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="h-96 bg-gray-200 rounded animate-pulse mt-8"></div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
