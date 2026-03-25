import React, {
  useRef, useEffect, useCallback, forwardRef, useImperativeHandle
} from 'react';
import {
  drawSandBackground,
  drawSandStroke,
  applyFadeLayer,
  animateSandReset,
  BRUSH_SIZES,
  type DrawMode,
  type BrushSize,
} from '@/lib/sandRenderer';

export interface SandCanvasHandle {
  getDataUrl: () => string;
  clearCanvas: () => void;
  triggerReset: () => void;
}

interface SandCanvasProps {
  mode: DrawMode;
  brushSize: BrushSize;
  permanentMode: boolean;
  onInteract: () => void;
  onFirstDraw?: () => void;
  isResetting: boolean;
  onResetDone: () => void;
}

const SandCanvas = forwardRef<SandCanvasHandle, SandCanvasProps>(
  ({ mode, brushSize, permanentMode, onInteract, onFirstDraw, isResetting, onResetDone }, ref) => {
    const canvasRef   = useRef<HTMLCanvasElement>(null);
    const rafRef      = useRef<number>(0);
    const drawingRef  = useRef(false);
    const lastPosRef  = useRef({ x: 0, y: 0 });
    const waveOffRef  = useRef(0);
    const didFirstDraw= useRef(false);
    const resetProgRef= useRef(0);
    const fadeAccRef  = useRef(0);
    const touchMapRef = useRef<Map<number, { x: number; y: number }>>(new Map());

    // ── expose methods ──────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      getDataUrl: () => canvasRef.current?.toDataURL('image/jpeg', 0.85) ?? '',
      clearCanvas: () => {
        const ctx = getCtx();
        if (ctx) drawSandBackground(ctx);
      },
      triggerReset: () => { resetProgRef.current = 0; },
    }));

    const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

    // ── init & resize ───────────────────────────────────────────────
    const init = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      drawSandBackground(ctx);
    }, []);

    useEffect(() => {
      init();
      const ro = new ResizeObserver(init);
      if (canvasRef.current) ro.observe(canvasRef.current);
      return () => ro.disconnect();
    }, [init]);

    // ── animation loop ──────────────────────────────────────────────
    useEffect(() => {
      let lastTime = 0;
      const loop = (time: number) => {
        const dt = time - lastTime;
        lastTime = time;
        waveOffRef.current += 0.015;
        const ctx = getCtx();

        if (isResetting && ctx) {
          resetProgRef.current = Math.min(1, resetProgRef.current + dt / 4000);
          const done = animateSandReset(ctx, resetProgRef.current);
          if (done) onResetDone();
        } else if (!permanentMode && ctx) {
          fadeAccRef.current += dt;
          if (fadeAccRef.current > 120) {
            applyFadeLayer(ctx, 0.004);
            fadeAccRef.current = 0;
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }, [isResetting, permanentMode, onResetDone]);

    // ── coordinate helpers ──────────────────────────────────────────
    const getCanvasPos = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const doStroke = (x: number, y: number) => {
      const ctx = getCtx();
      if (!ctx) return;
      const canvas = canvasRef.current!;
      const w = canvas.width  / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      drawSandStroke(
        ctx,
        lastPosRef.current.x, lastPosRef.current.y,
        x, y,
        BRUSH_SIZES[brushSize],
        mode,
        waveOffRef.current,
        w, h
      );
      lastPosRef.current = { x, y };
      onInteract();
      if (!didFirstDraw.current) {
        didFirstDraw.current = true;
        onFirstDraw?.();
      }
    };

    // ── mouse events ────────────────────────────────────────────────
    const onMouseDown = (e: React.MouseEvent) => {
      const pos = getCanvasPos(e.clientX, e.clientY);
      drawingRef.current = true;
      lastPosRef.current = pos;
      onInteract();
    };
    const onMouseMove = (e: React.MouseEvent) => {
      if (!drawingRef.current) return;
      const pos = getCanvasPos(e.clientX, e.clientY);
      doStroke(pos.x, pos.y);
    };
    const onMouseUp = () => { drawingRef.current = false; };

    // ── touch events ────────────────────────────────────────────────
    const onTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach(t => {
        const pos = getCanvasPos(t.clientX, t.clientY);
        touchMapRef.current.set(t.identifier, pos);
      });
      onInteract();
    };
    const onTouchMove = (e: React.TouchEvent) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach(t => {
        const prev = touchMapRef.current.get(t.identifier);
        const pos  = getCanvasPos(t.clientX, t.clientY);
        if (prev) {
          lastPosRef.current = prev;
          doStroke(pos.x, pos.y);
        }
        touchMapRef.current.set(t.identifier, pos);
      });
    };
    const onTouchEnd = (e: React.TouchEvent) => {
      Array.from(e.changedTouches).forEach(t => touchMapRef.current.delete(t.identifier));
    };

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        style={{ touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    );
  }
);

SandCanvas.displayName = 'SandCanvas';
export default SandCanvas;
