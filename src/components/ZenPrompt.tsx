import React from 'react';
import { getTodayPrompt } from '@/lib/zenPrompts';
import { Lightbulb, X } from 'lucide-react';

interface ZenPromptProps {
  visible: boolean;
  onDismiss: () => void;
}

const ZenPrompt: React.FC<ZenPromptProps> = ({ visible, onDismiss }) => {
  const prompt = getTodayPrompt();

  if (!visible) return null;

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 animate-float-prompt"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div className="glass-toolbar rounded-2xl px-4 py-3 flex items-center gap-3 shadow-float">
        <Lightbulb size={16} className="text-amber-accent shrink-0" style={{ color: 'hsl(var(--amber-accent))' }} />
        <p className="text-sm font-zen text-foreground/75 italic" style={{ maxWidth: 260 }}>
          {prompt}
        </p>
        <button
          onClick={onDismiss}
          className="ml-1 opacity-50 hover:opacity-100 transition-opacity shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default ZenPrompt;
