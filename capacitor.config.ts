import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.influrunner.app',
  appName: 'InfluRunner',
  webDir: 'dist',
  android: {
    allowMixedContent: true, // allow HTTP mixed content during dev if needed
  },
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6B1A',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
