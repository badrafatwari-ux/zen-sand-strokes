import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.30fcf1f2ea2d4bc7af420a5b40315bec',
  appName: 'Sand Drawing Zen',
  webDir: 'dist',
  server: {
    url: 'https://30fcf1f2-ea2d-4bc7-af42-0a5b40315bec.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    backgroundColor: '#d4c5a9',
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#d4c5a9',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
