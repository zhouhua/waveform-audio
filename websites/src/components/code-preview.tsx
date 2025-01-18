import type { TFunction } from 'i18next';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

interface CodePreviewProps {
  code: string;
  preview: React.ReactNode;
  showCode?: boolean;
}

async function copyToClipboard(text: string, t: TFunction) {
  await navigator.clipboard.writeText(text);
  toast.success(t('toast.copySuccess'));
}

export function CodePreview({
  code,
  preview,
  showCode = false,
}: CodePreviewProps) {
  const [showCodeState, setShowCodeState] = useState(false);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    setTimeout(() => {
      setShowCodeState(showCode);
    }, 20);
  }, [showCode]);

  return (
    <div className="not-prose">
      <div className="p-4 bg-card/50 rounded-lg shadow-lg relative z-10">
        {preview}
      </div>
      <div className="relative min-h-10 shadow-md mx-6 rounded-b-lg bg-black/50">
        <div className="flex h-10 items-center justify-end gap-2 pr-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCodeState(!showCodeState)}
            className="h-8"
          >
            {showCodeState ? '隐藏代码' : '查看代码'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code, t)}
            className="h-8"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <AnimatePresence>
          {showCodeState && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: showCodeState ? 'auto' : 0, opacity: showCodeState ? 1 : 0 }}
              exit={{ height: showCodeState ? 0 : 'auto', opacity: showCodeState ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
