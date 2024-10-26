import React, { useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface EmbedCodeProps {
  config: any;
}

export const EmbedCode: React.FC<EmbedCodeProps> = ({ config }) => {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const configString = JSON.stringify(config, null, 2);
  
  const scriptCode = `
<!-- Referral Widget -->
<div id="referral-widget"></div>
<script src="${window.location.origin}/referral-widget.js"></script>
<script>
  ReferralWidget.init('referral-widget', ${configString});
</script>`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Embed Code</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      
      <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
        <code>{scriptCode}</code>
      </pre>
      
      <p className="text-sm text-gray-500">
        Add this code to your website where you want the referral widget to appear.
      </p>
    </div>
  );
};