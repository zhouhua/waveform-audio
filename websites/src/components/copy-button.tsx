import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CopyButtonProps {
  copiedLabel?: string;
  label: string;
  text: string;
}

async function writeClipboardText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function CopyButton({
  copiedLabel = 'Copied',
  label,
  text,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await writeClipboardText(text);
      setCopied(true);
      toast.success(`${label} ${copiedLabel.toLowerCase()}`);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    }
    catch {
      toast.error(`Unable to copy ${label.toLowerCase()}`);
    }
  };

  return (
    <Button
      aria-label={label}
      onClick={handleCopy}
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 text-xs text-stone-700 hover:bg-white hover:text-stone-950"
      type="button"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
