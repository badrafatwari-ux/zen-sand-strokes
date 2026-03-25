export const ZEN_PROMPTS = [
  "Draw a spiral from the center outward",
  "Trace flowing waves across the canvas",
  "Create a circular mandala pattern",
  "Draw gentle ripples like a pond",
  "Sketch a mountain silhouette",
  "Make slow, breathing curves",
  "Draw what peace looks like to you",
  "Create a pattern of concentric circles",
  "Trace the path of falling leaves",
  "Draw a labyrinth with one continuous line",
  "Make gentle S-curves like a river",
  "Sketch a lotus flower in the sand",
  "Draw the horizon at dusk",
  "Create a web of delicate lines",
  "Trace the shape of your breath",
  "Draw a crescent moon",
  "Make a pattern of overlapping circles",
  "Sketch bamboo stalks reaching upward",
  "Draw what silence feels like",
  "Create a star map from memory",
  "Trace the Milky Way across the canvas",
  "Draw a koi fish in motion",
  "Make gentle ripples from a single point",
  "Sketch the outline of a bonsai tree",
  "Draw a torii gate silhouette",
  "Create a field of parallel waves",
  "Trace a figure-eight, then another",
  "Draw what serenity means to you",
  "Make a pattern inspired by rain",
  "Sketch a bridge over still water",
];

export function getTodayPrompt(): string {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return ZEN_PROMPTS[day % ZEN_PROMPTS.length];
}
