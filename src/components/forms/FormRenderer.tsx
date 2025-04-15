
import React from 'react';
import { Form } from '@/types/forms';

interface FormRendererProps {
  formId?: string;
  formConfig: Form;
}

const FormRenderer: React.FC<FormRendererProps> = ({ formId, formConfig }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-medium mb-4">{formConfig.name}</h2>
      <p className="text-gray-600 mb-6">{formConfig.description}</p>
      
      {/* Placeholder for future form fields */}
      <div className="py-4 text-center text-gray-500">
        <p>Form content will be rendered here.</p>
      </div>
    </div>
  );
};

export default FormRenderer;
