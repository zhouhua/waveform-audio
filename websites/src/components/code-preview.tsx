import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

interface CodePreviewProps {
  code: string;
  preview: React.ReactNode;
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  toast.success('代码已复制到剪贴板');
}

export function CodePreview({
  code,
  preview,
}: CodePreviewProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div>
      <div className="p-4 bg-card/50 rounded-lg shadow-lg relative z-10">
        {preview}
      </div>
      <div className="relative min-h-10 shadow-md mx-6 rounded-b-lg bg-black/50">
        <div className="flex h-10 items-center justify-end gap-2 pr-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="h-8"
          >
            {showCode ? '隐藏代码' : '查看代码'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code)}
            className="h-8"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        {showCode && (
          <SyntaxHighlighter
            language="tsx"
            style={vscDarkPlus}
            customStyle={{
              borderBottomLeftRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
              margin: 0,
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
