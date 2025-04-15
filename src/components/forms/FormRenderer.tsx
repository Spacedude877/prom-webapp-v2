
import React from 'react';
import { FormData } from '@/types/forms';

interface FormRendererProps {
  formId?: string;
  formConfig: FormData;
}

const FormRenderer: React.FC<FormRendererProps> = ({ formId, formConfig }) => {
  return (
    <div>
      {/* Placeholder for form rendering logic */}
      <p>Form: {formConfig.name}</p>
    </div>
  );
};

export default FormRenderer;
