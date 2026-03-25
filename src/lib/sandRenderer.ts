export type DrawMode = 'free' | 'mandala' | 'wave' | 'erase';
export type BrushSize = 'small' | 'medium' | 'large';

export const BRUSH_SIZES: Record<BrushSize, number> = {
  small: 6,
  medium: 14,
  large: 28,
};

// Sand color palette (matching CSS vars)
export const SAND_COLORS = {
  base:   'hsl(35, 38%, 82%)',
  groove: 'hsl(25, 42%, 32%)',
  deep:   'hsl(28, 38%, 42%)',
  shadow: 'hsl(22, 36%, 22%)',
  light:  'hsl(38, 40%, 90%)',
};

export interface SandState {
  lastX: number;
  lastY: number;
  isDrawing: boolean;
  waveOffset: number;
}

/** Draw a single sand groove stroke from (x1,y1) to (x2,y2) */
export function drawSandStroke(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  radius: number,
  mode: DrawMode,
  waveOffset: number,
  canvasW: number,
  canvasH: number
) {
  if (mode === 'erase') {
    eraseStroke(ctx, x1, y1, x2, y2, radius);
    return;
  }

  const points = interpolatePoints(x1, y1, x2, y2, 3);
  points.forEach(([px, py]) => {
    let fx = px, fy = py;
    if (mode === 'wave') {
      fx = px + Math.sin((py / canvasH) * Math.PI * 4 + waveOffset) * 8;
      fy = py + Math.cos((px / canvasW) * Math.PI * 4 + waveOffset) * 5;
    }
    drawGroove(ctx, fx, fy, radius);
    if (mode === 'mandala') {
      drawMandalaSymmetry(ctx, fx, fy, radius, canvasW, canvasH);
    }
  });
}

function drawGroove(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Outer soft shadow
  const shadowGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
  shadowGrad.addColorStop(0,   'hsla(25, 42%, 30%, 0.12)');
  shadowGrad.addColorStop(0.5, 'hsla(25, 38%, 28%, 0.06)');
  shadowGrad.addColorStop(1,   'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Main groove (dark center)
  const grooveGrad = ctx.createRadialGradient(x - r * 0.15, y - r * 0.15, 0, x, y, r);
  grooveGrad.addColorStop(0,   'hsla(23, 44%, 26%, 0.82)');
  grooveGrad.addColorStop(0.4, 'hsla(26, 40%, 32%, 0.68)');
  grooveGrad.addColorStop(0.8, 'hsla(30, 36%, 40%, 0.35)');
  grooveGrad.addColorStop(1,   'transparent');
  ctx.fillStyle = grooveGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Highlight edge (displacement light)
  const hlGrad = ctx.createRadialGradient(
    x - r * 0.3, y - r * 0.3, 0,
    x, y, r * 1.1
  );
  hlGrad.addColorStop(0,    'hsla(42, 55%, 88%, 0.4)');
  hlGrad.addColorStop(0.45, 'hsla(40, 48%, 82%, 0.15)');
  hlGrad.addColorStop(1,    'transparent');
  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.1, 0, Math.PI * 2);
  ctx.fill();
}

function drawMandalaSymmetry(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  r: number,
  w: number, h: number,
  symmetry = 8
) {
  const cx = w / 2, cy = h / 2;
  const dx = x - cx, dy = y - cy;
  const angle = Math.atan2(dy, dx);
  const dist  = Math.sqrt(dx * dx + dy * dy);

  for (let i = 1; i < symmetry; i++) {
    const a = angle + (Math.PI * 2 / symmetry) * i;
    const nx = cx + Math.cos(a) * dist;
    const ny = cy + Math.sin(a) * dist;
    drawGroove(ctx, nx, ny, r);
    // Mirror
    const ma = -angle + (Math.PI * 2 / symmetry) * i;
    const mx = cx + Math.cos(ma) * dist;
    const my = cy + Math.sin(ma) * dist;
    drawGroove(ctx, mx, my, r);
  }
}

function eraseStroke(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  r: number
) {
  const points = interpolatePoints(x1, y1, x2, y2, 3);
  points.forEach(([px, py]) => {
    const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.5);
    grad.addColorStop(0,   'hsla(35, 38%, 82%, 1)');
    grad.addColorStop(0.5, 'hsla(36, 36%, 84%, 0.8)');
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function interpolatePoints(
  x1: number, y1: number,
  x2: number, y2: number,
  step: number
): [number, number][] {
  const pts: [number, number][] = [];
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.floor(dist / step));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([x1 + dx * t, y1 + dy * t]);
  }
  return pts;
}

/** Apply fade layer to gradually erase drawings */
export function applyFadeLayer(ctx: CanvasRenderingContext2D, alpha: number) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = `hsla(35, 38%, 82%, ${alpha})`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/** Draw the base sand texture background */
export function drawSandBackground(ctx: CanvasRenderingContext2D) {
  const w = ctx.canvas.width, h = ctx.canvas.height;

  // Base gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0,   'hsl(40, 42%, 90%)');
  grad.addColorStop(0.4, 'hsl(36, 38%, 84%)');
  grad.addColorStop(1,   'hsl(32, 34%, 78%)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle grain texture
  drawGrainTexture(ctx, w, h);
}

function drawGrainTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[i]     = Math.max(0, Math.min(255, data[i]     + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.8));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.6));
  }
  ctx.putImageData(imageData, 0, 0);
}

/** Animate sand resetting — returns true when done */
export function animateSandReset(
  ctx: CanvasRenderingContext2D,
  progress: number // 0–1
): boolean {
  const alpha = 0.03 + progress * 0.04;
  applyFadeLayer(ctx, alpha);
  return progress >= 1;
}
