import React from 'react';
import {
  Pencil, Circle, Waves, Eraser,
  Minus, AlignCenter, LayoutGrid,
  Volume2, VolumeX, Wind, Music2,
  Save, Image, Infinity, Leaf,
  Sun, RefreshCw,
} from 'lucide-react';
import type { DrawMode, BrushSize } from '@/lib/sandRenderer';
import type { SoundType } from '@/hooks/useZenSound';

interface FloatingToolbarProps {
  visible: boolean;
  mode: DrawMode;
  brushSize: BrushSize;
  permanentMode: boolean;
  activeSound: SoundType;
  breathingActive: boolean;
  onModeChange: (m: DrawMode) => void;
  onBrushChange: (b: BrushSize) => void;
  onPermanentToggle: () => void;
  onSoundToggle: (s: SoundType) => void;
  onBreathingToggle: () => void;
  onSave: () => void;
  onGallery: () => void;
  onClear: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  visible,
  mode, brushSize, permanentMode,
  activeSound, breathingActive,
  onModeChange, onBrushChange,
  onPermanentToggle, onSoundToggle,
  onBreathingToggle, onSave, onGallery, onClear,
}) => {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${visible ? 'toolbar-visible' : 'toolbar-hidden'}`}>
      <div className="glass-toolbar rounded-full px-4 py-2.5 flex items-center gap-1.5 flex-wrap justify-center max-w-[92vw]">

        {/* Separator helper */}
        <span className="w-px h-7 bg-border/50 mx-0.5 shrink-0" />

        {/* Draw modes */}
        <ToolBtn
          title="Free Draw"
          active={mode === 'free'}
          onClick={() => onModeChange('free')}
        ><Pencil size={18} /></ToolBtn>

        <ToolBtn
          title="Mandala"
          active={mode === 'mandala'}
          onClick={() => onModeChange('mandala')}
        ><Circle size={18} /></ToolBtn>

        <ToolBtn
          title="Wave"
          active={mode === 'wave'}
          onClick={() => onModeChange('wave')}
        ><Waves size={18} /></ToolBtn>

        <ToolBtn
          title="Erase"
          active={mode === 'erase'}
          onClick={() => onModeChange('erase')}
        ><Eraser size={18} /></ToolBtn>

        <span className="w-px h-7 bg-border/50 mx-0.5 shrink-0" />

        {/* Brush sizes */}
        <ToolBtn
          title="Small brush"
          active={brushSize === 'small'}
          onClick={() => onBrushChange('small')}
        ><Minus size={13} /></ToolBtn>

        <ToolBtn
          title="Medium brush"
          active={brushSize === 'medium'}
          onClick={() => onBrushChange('medium')}
        ><AlignCenter size={16} /></ToolBtn>

        <ToolBtn
          title="Large brush"
          active={brushSize === 'large'}
          onClick={() => onBrushChange('large')}
        ><LayoutGrid size={18} /></ToolBtn>

        <span className="w-px h-7 bg-border/50 mx-0.5 shrink-0" />

        {/* Permanent mode */}
        <ToolBtn
          title={permanentMode ? 'Fading off' : 'Fading on'}
          active={permanentMode}
          onClick={onPermanentToggle}
        ><Infinity size={17} /></ToolBtn>

        {/* Breathing guide */}
        <ToolBtn
          title="Breathing guide"
          active={breathingActive}
          onClick={onBreathingToggle}
        ><Leaf size={17} /></ToolBtn>

        <span className="w-px h-7 bg-border/50 mx-0.5 shrink-0" />

        {/* Sound */}
        <ToolBtn
          title="Ocean waves"
          active={activeSound === 'ocean'}
          onClick={() => onSoundToggle('ocean')}
        ><Volume2 size={17} /></ToolBtn>

        <ToolBtn
          title="Wind"
          active={activeSound === 'wind'}
          onClick={() => onSoundToggle('wind')}
        ><Wind size={17} /></ToolBtn>

        <ToolBtn
          title="Chimes"
          active={activeSound === 'chimes'}
          onClick={() => onSoundToggle('chimes')}
        ><Music2 size={17} /></ToolBtn>

        <span className="w-px h-7 bg-border/50 mx-0.5 shrink-0" />

        {/* Actions */}
        <ToolBtn title="Save snapshot" onClick={onSave}>
          <Save size={17} />
        </ToolBtn>

        <ToolBtn title="Gallery" onClick={onGallery}>
          <Image size={17} />
        </ToolBtn>

        <ToolBtn title="Clear canvas" onClick={onClear}>
          <RefreshCw size={16} />
        </ToolBtn>
      </div>
    </div>
  );
};

interface ToolBtnProps {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolBtn: React.FC<ToolBtnProps> = ({ title, active, onClick, children }) => (
  <button
    title={title}
    aria-label={title}
    onClick={onClick}
    className={`zen-button ${active ? 'active' : ''}`}
    style={{ width: 40, height: 40 }}
  >
    {children}
  </button>
);

export default FloatingToolbar;
