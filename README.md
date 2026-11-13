# Sand Zen

Build a mobile-first web app called “Sand Drawing Zen”, a calming, stress-relieving drawing experience where users create beautiful patterns in virtual sand using touch or mouse input. The app should emphasize relaxation, simplicity, and a Zen aesthetic. It must be fully offline-first using localStorage, and structured so it can later be wrapped with Capacitor for Android deployment.

The core experience should allow users to draw freely on a sand canvas that reacts naturally to movement. The sand should feel organic, with soft trails, fading edges, and subtle particle-like behavior. Drawing should leave smooth grooves like real sand being traced with a finger or stick.

Design the interface to be minimal, immersive, and distraction-free. Use soft, warm tones (beige, sand, light brown) with gentle gradients. Include ambient animations like slow drifting light or subtle grain movement. No clutter, no ads, no paywalls.

Core Features:

1. Interactive Sand Canvas

 Fullscreen responsive canvas

 Touch and mouse support

 Smooth line interpolation for natural strokes

 Adjustable brush size (small, medium, large)

 Optional multi-touch drawing

2. Sand Physics Simulation (Lightweight)

 Trails fade gradually over time

 Option to toggle “permanent mode” (no fading)

 Slight grain displacement effect for realism

3. Zen Modes

Free Draw Mode – no rules, just draw

Mandala Mode – mirrored drawing symmetry (radial)

Wave Mode – lines gently ripple like water in sand

Erase Mode – simulate smoothing sand back to clean

4. Relaxation Enhancements

 Ambient background sounds:

 Ocean waves

 Wind breeze

 Soft chimes

 Toggle sound on/off

 Optional vibration feedback (for mobile)

5. Auto Calm System

 After inactivity, sand slowly resets itself

 Gentle animation smoothing previous drawings away

 Encourages mindful interaction

6. Save & Gallery (LocalStorage)

 Save current drawing as snapshot (canvas to image)

 Simple gallery view (grid layout)

 Ability to delete saved drawings

 No cloud, fully offline

7. Daily Zen Prompt

 Optional daily suggestion like:

 “Draw a spiral”

 “Create flowing waves”

 “Make a calming pattern”

 Stored locally, rotates daily

8. UI / UX

 Floating minimal toolbar (semi-transparent)

 Icons only, no heavy text

 Hide UI automatically after a few seconds of inactivity

 Tap to bring controls back

9. Performance

 Optimized canvas rendering

 Lightweight animation loop

 Works smoothly on low-end mobile devices

Technical Requirements:

 Use HTML5 Canvas for rendering

 Store data in localStorage

 No backend required

 Structure code modularly for future Capacitor integration

 Ensure offline functionality (PWA-ready structure preferred)

Visual Style:

 Zen, calming, meditative

 Inspired by Japanese sand gardens

 Soft shadows, subtle motion, no harsh contrasts

 Smooth transitions and animations

Extra Touch:

Add a subtle “breathing guide” mode where the sand gently pulses to guide inhale/exhale timing, helping users relax while drawing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zen-sand-strokes.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/30fcf1f2-ea2d-4bc7-af42-0a5b40315bec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
