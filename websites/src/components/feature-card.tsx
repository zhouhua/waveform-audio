import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GradientKey, gradientMap } from '@/lib/constants';

interface FeatureCardProps {
  icon: LucideIcon;
  color: string;
  gradientKey: GradientKey;
  title: string;
  description: string;
  code: string;
  demo: React.ReactNode;
}

export function FeatureCard({
  icon: Icon,
  color,
  gradientKey,
  title,
  description,
  code,
  demo
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl transition-all hover:shadow-lg hover:scale-[1.01]">
      <div
        className="absolute inset-0"
        style={{
          background: gradientMap[gradientKey]
        }}
      />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r shadow-sm",
            color
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 text-[15px] leading-relaxed">{description}</p>
        <div className="mb-6 overflow-hidden rounded-lg bg-[#171717] shadow-sm">
          <SyntaxHighlighter
            language="typescript"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.75rem',
              lineHeight: '1.5',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="p-4 rounded-lg bg-white shadow-sm">
          {demo}
        </div>
      </div>
    </div>
  );
} 