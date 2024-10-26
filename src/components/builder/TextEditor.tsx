import React from 'react';

interface TextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({ 
  label, 
  value, 
  onChange, 
  multiline = false 
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md min-h-[100px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      )}
    </div>
  );
};