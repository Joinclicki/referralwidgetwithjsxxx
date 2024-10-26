(function() {
  // Create React and ReactDOM script tags
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load required stylesheets
  const loadStylesheet = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  // Main widget initialization
  window.ReferralWidget = {
    init: async function(containerId, config) {
      try {
        // Load dependencies
        await Promise.all([
          loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
          loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
          loadScript('https://unpkg.com/canvas-confetti@1.9.2'),
          loadScript('https://unpkg.com/lucide-react@0.344.0')
        ]);

        // Load styles
        loadStylesheet('https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css');

        // Initialize the widget
        const container = document.getElementById(containerId);
        if (!container) {
          console.error(`Container with id "${containerId}" not found`);
          return;
        }

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'referral-widget-container';
        container.appendChild(widgetContainer);

        // Widget Component
        const Widget = () => {
          const [isOpen, setIsOpen] = React.useState(false);
          const [loading, setLoading] = React.useState(false);
          const [formData, setFormData] = React.useState({});

          const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            try {
              if (config.webhook) {
                await fetch(config.webhook, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
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

          const getIconForField = (type) => {
            const icons = {
              email: Lucide.Mail,
              tel: Lucide.Phone,
              text: Lucide.User
            };
            const Icon = icons[type] || Lucide.User;
            return React.createElement(Icon, { className: 'h-5 w-5 text-gray-400' });
          };

          return React.createElement(
            'div',
            { className: 'relative h-full' },
            [
              // Floating Button
              React.createElement(
                'button',
                {
                  onClick: () => setIsOpen(true),
                  style: { 
                    backgroundColor: config.colors.primary,
                    color: config.colors.text
                  },
                  className: 'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-6 py-3 shadow-lg transition-transform hover:scale-105'
                },
                [
                  React.createElement(Lucide.Gift, { className: 'h-5 w-5' }),
                  React.createElement('span', { className: 'font-medium' }, config.content.buttonText)
                ]
              ),

              // Slide-in Panel
              isOpen && React.createElement(
                'div',
                {
                  className: 'fixed inset-y-0 right-0 z-50 w-full max-w-md transform shadow-xl transition-transform duration-300 ease-in-out translate-x-0'
                },
                React.createElement(
                  'div',
                  {
                    style: { backgroundColor: config.colors.background },
                    className: 'h-full'
                  },
                  [
                    // Header
                    React.createElement(
                      'div',
                      {
                        style: { 
                          backgroundColor: config.colors.primary,
                          color: config.colors.text
                        },
                        className: 'px-6 py-4 flex justify-between items-center'
                      },
                      [
                        React.createElement('h2', { className: 'text-xl font-semibold' }, config.content.title),
                        React.createElement(
                          'button',
                          {
                            onClick: () => setIsOpen(false),
                            className: 'p-2 rounded-full hover:bg-black/10'
                          },
                          React.createElement(Lucide.X, { 
                            className: 'h-5 w-5',
                            style: { color: config.colors.text }
                          })
                        )
                      ]
                    ),

                    // Content
                    React.createElement(
                      'div',
                      { className: 'p-6 overflow-y-auto' },
                      [
                        React.createElement('p', { className: 'text-gray-600 mb-8' }, config.content.description),
                        React.createElement(
                          'form',
                          { 
                            onSubmit: handleSubmit,
                            className: 'space-y-6'
                          },
                          [
                            ...config.fields.map(field => 
                              React.createElement(
                                'div',
                                { key: field.id },
                                [
                                  React.createElement(
                                    'label',
                                    { className: 'block text-sm font-medium text-gray-700 mb-1' },
                                    field.label
                                  ),
                                  React.createElement(
                                    'div',
                                    { className: 'relative' },
                                    [
                                      React.createElement(
                                        'div',
                                        { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                                        getIconForField(field.type)
                                      ),
                                      React.createElement(
                                        'input',
                                        {
                                          type: field.type,
                                          name: field.id,
                                          required: field.required,
                                          placeholder: field.placeholder,
                                          value: formData[field.id] || '',
                                          onChange: (e) => setFormData(prev => ({
                                            ...prev,
                                            [field.id]: e.target.value
                                          })),
                                          className: 'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                                        }
                                      )
                                    ]
                                  )
                                ]
                              )
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'submit',
                                disabled: loading,
                                style: { 
                                  backgroundColor: config.colors.primary,
                                  color: config.colors.text
                                },
                                className: `w-full py-3 px-4 rounded-md font-medium transition-colors ${
                                  loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
                                }`
                              },
                              loading ? 'Submitting...' : 'Send Referral'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                )
              ),

              // Backdrop
              isOpen && React.createElement(
                'div',
                {
                  className: 'fixed inset-0 bg-black/50 z-40',
                  onClick: () => setIsOpen(false)
                }
              )
            ]
          );
        };

        // Render the widget
        const root = ReactDOM.createRoot(widgetContainer);
        root.render(React.createElement(Widget));
      } catch (error) {
        console.error('Failed to initialize ReferralWidget:', error);
      }
    }
  };
})();