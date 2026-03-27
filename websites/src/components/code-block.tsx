import { type ComponentProps } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <Highlight
      theme={themes.vsDark}
      code={code}
      language={language as ComponentProps<typeof Highlight>['language']}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="overflow-hidden border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-stone-400">
            <span>{language}</span>
            <span>Waveform Audio</span>
          </div>
          <pre
            className={`${className} overflow-x-auto px-5 py-4 text-[13px] leading-6`}
            style={{
              ...style,
              background: 'transparent',
              borderRadius: 0,
              margin: 0,
              minWidth: '100%',
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="min-w-max">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
}
