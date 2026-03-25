import React, { useRef, useState, useCallback, useEffect } from 'react';
import SandCanvas, { type SandCanvasHandle } from '@/components/SandCanvas';
import FloatingToolbar from '@/components/FloatingToolbar';
import Gallery from '@/components/Gallery';
import ZenPrompt from '@/components/ZenPrompt';
import BreathingGuide from '@/components/BreathingGuide';
import AmbientLight from '@/components/AmbientLight';
import { useGallery } from '@/hooks/useGallery';
import { useZenSound } from '@/hooks/useZenSound';
import type { DrawMode, BrushSize } from '@/lib/sandRenderer';
import type { SoundType } from '@/hooks/useZenSound';

const INACTIVITY_HIDE_MS  = 3500;  // hide toolbar
const INACTIVITY_RESET_MS = 45000; // auto-calm reset

const Index: React.FC = () => {
  const canvasRef  = useRef<SandCanvasHandle>(null);

  // Drawing state
  const [mode,          setMode]         = useState<DrawMode>('free');
  const [brushSize,     setBrushSize]    = useState<BrushSize>('medium');
  const [permanentMode, setPermanentMode]= useState(false);

  // UI state
  const [toolbarVisible,  setToolbarVisible]  = useState(true);
  const [showGallery,     setShowGallery]     = useState(false);
  const [showPrompt,      setShowPrompt]      = useState(true);
  const [breathingActive, setBreathingActive] = useState(false);
  const [ambientActive,   setAmbientActive]   = useState(true);
  const [isResetting,     setIsResetting]     = useState(false);
  const [saveToast,       setSaveToast]       = useState('');
  const [hasDrawn,        setHasDrawn]        = useState(false);

  // Timers
  const hideTimerRef  = useRef<ReturnType<typeof setTimeout>>();
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const firstDrawRef  = useRef(false);

  // Sub-systems
  const { items: galleryItems, save: saveToGallery, remove: deleteFromGallery } = useGallery();
  const { activeSound, toggle: toggleSound } = useZenSound();

  // ── Toolbar auto-hide ─────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setToolbarVisible(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setToolbarVisible(false), INACTIVITY_HIDE_MS);
  }, []);

  // ── Auto-calm reset timer ─────────────────────────────────────────
  const resetCalmTimer = useCallback(() => {
    clearTimeout(resetTimerRef.current);
    if (!firstDrawRef.current) return;
    resetTimerRef.current = setTimeout(() => {
      setIsResetting(true);
    }, INACTIVITY_RESET_MS);
  }, []);

  const onInteract = useCallback(() => {
    resetHideTimer();
    resetCalmTimer();
    if (isResetting) setIsResetting(false);
  }, [resetHideTimer, resetCalmTimer, isResetting]);

  const onFirstDraw = useCallback(() => {
    firstDrawRef.current = true;
    setHasDrawn(true);
    resetCalmTimer();
  }, [resetCalmTimer]);

  const onResetDone = useCallback(() => {
    setIsResetting(false);
    firstDrawRef.current = false;
    setHasDrawn(false);
  }, []);

  // Start toolbar hide on mount
  useEffect(() => {
    resetHideTimer();
    return () => { clearTimeout(hideTimerRef.current); clearTimeout(resetTimerRef.current); };
  }, [resetHideTimer]);

  // Show toolbar on any tap/click on canvas area
  const handleScreenTap = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  // ── Save snapshot ─────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    const url = canvasRef.current?.getDataUrl();
    if (!url) return;
    const id = saveToGallery(url, mode);
    void id;
    setSaveToast('Saved ✓');
    setTimeout(() => setSaveToast(''), 2000);
    // optional vibration
    if ('vibrate' in navigator) navigator.vibrate(40);
  }, [saveToGallery, mode]);

  // ── Clear canvas ──────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    canvasRef.current?.clearCanvas();
    firstDrawRef.current = false;
    setHasDrawn(false);
    setIsResetting(false);
    clearTimeout(resetTimerRef.current);
  }, []);

  const handleSoundToggle = (s: SoundType) => {
    resetHideTimer();
    toggleSound(s);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: 'var(--gradient-sand)' }}
      onPointerMove={handleScreenTap}
      onPointerDown={handleScreenTap}
    >
      {/* Ambient drifting light orbs */}
      <AmbientLight active={ambientActive} />

      {/* Sand grain overlay */}
      <div className="absolute inset-0 pointer-events-none sand-texture opacity-60" aria-hidden />

      {/* Main canvas */}
      <SandCanvas
        ref={canvasRef}
        mode={mode}
        brushSize={brushSize}
        permanentMode={permanentMode}
        onInteract={onInteract}
        onFirstDraw={onFirstDraw}
        isResetting={isResetting}
        onResetDone={onResetDone}
      />

      {/* Breathing guide overlay */}
      <BreathingGuide active={breathingActive} />

      {/* Daily zen prompt */}
      <ZenPrompt visible={showPrompt} onDismiss={() => setShowPrompt(false)} />

      {/* Floating toolbar */}
      <FloatingToolbar
        visible={toolbarVisible}
        mode={mode}
        brushSize={brushSize}
        permanentMode={permanentMode}
        activeSound={activeSound}
        breathingActive={breathingActive}
        onModeChange={setMode}
        onBrushChange={setBrushSize}
        onPermanentToggle={() => setPermanentMode(p => !p)}
        onSoundToggle={handleSoundToggle}
        onBreathingToggle={() => setBreathingActive(b => !b)}
        onSave={handleSave}
        onGallery={() => { setShowGallery(true); resetHideTimer(); }}
        onClear={handleClear}
      />

      {/* App title — fades on first draw */}
      {!hasDrawn && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
          style={{ opacity: 0.28 }}
        >
          <h1
            className="font-display text-4xl sm:text-5xl tracking-widest"
            style={{ color: 'hsl(var(--sand-groove))', letterSpacing: '0.22em' }}
          >
            Sand Drawing
          </h1>
          <p
            className="font-zen text-sm mt-1 tracking-[0.3em]"
            style={{ color: 'hsl(var(--sand-deep))' }}
          >
            Zen
          </p>
        </div>
      )}

      {/* Auto-calm indicator */}
      {isResetting && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-fade-up">
          <div className="glass-toolbar rounded-full px-4 py-1.5">
            <p className="font-zen text-xs tracking-widest" style={{ color: 'hsl(var(--muted-foreground))' }}>
              returning to stillness…
            </p>
          </div>
        </div>
      )}

      {/* Save toast */}
      {saveToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-fade-up">
          <div className="glass-toolbar rounded-full px-5 py-2">
            <p className="font-zen text-sm tracking-wide" style={{ color: 'hsl(var(--sand-groove))' }}>
              {saveToast}
            </p>
          </div>
        </div>
      )}

      {/* Gallery overlay */}
      {showGallery && (
        <Gallery
          items={galleryItems}
          onClose={() => setShowGallery(false)}
          onDelete={deleteFromGallery}
        />
      )}
    </div>
  );
};

export default Index;
