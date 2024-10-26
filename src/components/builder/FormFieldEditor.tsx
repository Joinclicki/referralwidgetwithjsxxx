import React from 'react';
import { Trash2 } from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
}

interface FormFieldEditorProps {
  fields: FormField[];
  onUpdate: (fields: FormField[]) => void;
}

export const FormFieldEditor: React.FC<FormFieldEditorProps> = ({ fields, onUpdate }) => {
  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      required: true,
      placeholder: 'Enter value'
    };
    onUpdate([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    onUpdate(newFields);
  };

  const removeField = (index: number) => {
    onUpdate(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Form Fields</h3>
        <button
          onClick={addField}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Field
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Field Label"
                />
                
                <div className="flex gap-4">
                  <select
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value })}
                    className="px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="number">Number</option>
                  </select>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
                      className="rounded"
                    />
                    Required
                  </label>
                </div>

                <input
                  type="text"
                  value={field.placeholder}
                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Placeholder text"
                />
              </div>
              
              <button
                onClick={() => removeField(index)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};