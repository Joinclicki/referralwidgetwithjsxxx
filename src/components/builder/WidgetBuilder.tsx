import React, { useState } from 'react';
import { ReferralWidget } from '../ReferralWidget';
import { ColorPicker } from './ColorPicker';
import { TextEditor } from './TextEditor';
import { FormFieldEditor } from './FormFieldEditor';
import { EmbedCode } from './EmbedCode';

interface WidgetConfig {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  content: {
    buttonText: string;
    title: string;
    description: string;
    videoUrl: string;
  };
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    placeholder: string;
  }>;
  webhook: string;
}

const defaultConfig: WidgetConfig = {
  colors: {
    primary: '#4F46E5',
    secondary: '#4338CA',
    text: '#FFFFFF',
    background: '#FFFFFF'
  },
  content: {
    buttonText: 'Refer & Earn',
    title: 'Refer & Earn Rewards',
    description: 'Get $25 for each successful business referral. Plus, receive a $25 welcome bonus for your first referral!',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  fields: [
    {
      id: '1',
      label: 'What is your name?',
      type: 'text',
      required: true,
      placeholder: 'Enter what is your name?'
    },
    {
      id: '2',
      label: 'What is your email?',
      type: 'email',
      required: true,
      placeholder: 'Enter what is your email?'
    },
    {
      id: '3',
      label: 'What is your phone?',
      type: 'tel',
      required: true,
      placeholder: 'Enter what is your phone?'
    },
    {
      id: '4',
      label: 'Who do you want to refer?',
      type: 'text',
      required: true,
      placeholder: 'Enter who do you want to refer?'
    },
    {
      id: '5',
      label: 'What is their best phone number?',
      type: 'tel',
      required: true,
      placeholder: 'Enter what is their best phone number?'
    }
  ],
  webhook: ''
};

export const WidgetBuilder: React.FC = () => {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'fields' | 'settings'>('design');

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (data: any) => {
    if (!config.webhook) return;
    
    try {
      const response = await fetch(config.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Submission failed');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const getTheme = () => ({
    primary: config.colors.primary,
    secondary: config.colors.secondary,
    text: config.colors.text,
    background: config.colors.background
  });

  const tabs = [
    { id: 'design', label: 'Design' },
    { id: 'content', label: 'Content' },
    { id: 'fields', label: 'Fields' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Builder Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Widget Builder</h2>
            
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'design' && (
                <div className="space-y-4">
                  <ColorPicker
                    label="Primary Color"
                    value={config.colors.primary}
                    onChange={value => updateConfig({ colors: { ...config.colors, primary: value } })}
                  />
                  <ColorPicker
                    label="Secondary Color"
                    value={config.colors.secondary}
                    onChange={value => updateConfig({ colors: { ...config.colors, secondary: value } })}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={config.colors.text}
                    onChange={value => updateConfig({ colors: { ...config.colors, text: value } })}
                  />
                  <ColorPicker
                    label="Background Color"
                    value={config.colors.background}
                    onChange={value => updateConfig({ colors: { ...config.colors, background: value } })}
                  />
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-4">
                  <TextEditor
                    label="Button Text"
                    value={config.content.buttonText}
                    onChange={value => updateConfig({ content: { ...config.content, buttonText: value } })}
                  />
                  <TextEditor
                    label="Title"
                    value={config.content.title}
                    onChange={value => updateConfig({ content: { ...config.content, title: value } })}
                  />
                  <TextEditor
                    label="Description"
                    value={config.content.description}
                    onChange={value => updateConfig({ content: { ...config.content, description: value } })}
                    multiline
                  />
                  <TextEditor
                    label="YouTube Video URL"
                    value={config.content.videoUrl}
                    onChange={value => updateConfig({ content: { ...config.content, videoUrl: value } })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}

              {activeTab === 'fields' && (
                <FormFieldEditor
                  fields={config.fields}
                  onUpdate={fields => updateConfig({ fields })}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <TextEditor
                    label="Webhook URL"
                    value={config.webhook}
                    onChange={value => updateConfig({ webhook: value })}
                  />
                  <div className="pt-6 border-t">
                    <EmbedCode config={config} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Live Preview</h2>
            <div className="relative h-[600px] border rounded-lg overflow-hidden bg-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-lg font-medium">Preview Website Content</p>
                  <p className="text-sm">The referral widget will appear here</p>
                </div>
              </div>
              <ReferralWidget
                theme={getTheme()}
                content={config.content}
                fields={config.fields}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};