import React, { useState } from 'react';
import { Gift, X, User, Phone, Mail, Building2 } from 'lucide-react';
import * as confetti from 'canvas-confetti';
import { clsx } from 'clsx';

interface ReferralWidgetProps {
  theme?: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  content?: {
    buttonText: string;
    title: string;
    description: string;
    videoUrl: string;
  };
  fields?: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    placeholder: string;
  }>;
  onSubmit?: (data: any) => Promise<void>;
}

const defaultContent = {
  buttonText: 'Refer & Earn',
  title: 'Refer & Earn Rewards',
  description: 'Get $25 for each successful business referral. Plus, receive a $25 welcome bonus for your first referral!',
  videoUrl: ''
};

const defaultTheme = {
  primary: '#4F46E5',
  secondary: '#4338CA',
  text: '#FFFFFF',
  background: '#FFFFFF'
};

const YouTubeEmbed: React.FC<{ url: string }> = ({ url }) => {
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
    return match?.[1] || '';
  };

  const videoId = getVideoId(url);
  if (!videoId) return null;

  return (
    <div className="relative w-full pt-[56.25%] mb-6">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export const ReferralWidget: React.FC<ReferralWidgetProps> = ({ 
  theme = defaultTheme,
  content = defaultContent,
  fields = [],
  onSubmit
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setFormData({});
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getIconForField = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5 text-gray-400" />;
      case 'tel': return <Phone className="h-5 w-5 text-gray-400" />;
      case 'text':
      default: return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="relative h-full">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: theme.primary, color: theme.text }}
        className={clsx(
          'absolute bottom-6 left-6 z-10 flex items-center gap-2 rounded-full px-6 py-3',
          'shadow-lg transition-transform hover:scale-105'
        )}
      >
        <Gift className="h-5 w-5" />
        <span className="font-medium">{content.buttonText}</span>
      </button>

      {/* Slide-in Panel */}
      <div
        className={clsx(
          'absolute inset-y-0 right-0 z-20 w-full max-w-md transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div style={{ backgroundColor: theme.background }} className="h-full shadow-xl">
          {/* Header */}
          <div 
            style={{ backgroundColor: theme.primary, color: theme.text }}
            className="px-6 py-4 flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold">{content.title}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-black/10"
            >
              <X className="h-5 w-5" style={{ color: theme.text }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 64px)' }}>
            {content.videoUrl && <YouTubeEmbed url={content.videoUrl} />}
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Earn rewards!</h3>
              <p className="text-gray-600">{content.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {getIconForField(field.type)}
                    </div>
                    <input
                      type={field.type}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={handleChange}
                      required={field.required}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={field.placeholder}
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: theme.primary, color: theme.text }}
                className={clsx(
                  'w-full py-3 px-4 rounded-md font-medium transition-colors',
                  loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
                )}
              >
                {loading ? 'Submitting...' : 'Send Referral'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};