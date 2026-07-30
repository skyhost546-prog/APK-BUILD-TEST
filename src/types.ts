export type SourceMode = 'url' | 'html' | 'preset';

export type AppOrientation = 'portrait' | 'landscape' | 'unspecified' | 'sensor';
export type DisplayMode = 'fullscreen' | 'immersive' | 'standard' | 'header';

export interface AndroidPermissions {
  internet: boolean;
  camera: boolean;
  location: boolean;
  microphone: boolean;
  storage: boolean;
  notifications: boolean;
  vibrate: boolean;
}

export interface AppIconConfig {
  type: 'custom' | 'generated';
  customUrl?: string;
  iconName: string; // Lucide icon name
  bgColor: string;
  gradientSecondary?: string;
  useGradient: boolean;
  shape: 'circle' | 'squircle' | 'rounded-square';
  badgeText?: string;
}

export interface AppConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  description: string;
  author: string;
  
  // Visuals
  icon: AppIconConfig;
  primaryColor: string;
  splashBgColor: string;
  splashDurationMs: number;
  showSplashScreen: boolean;
  
  // Screen & WebView
  orientation: AppOrientation;
  displayMode: DisplayMode;
  pullToRefresh: boolean;
  enableZoom: boolean;
  customUserAgent: string;
  javaScriptEnabled: boolean;
  domStorageEnabled: boolean;
  clearCacheOnExit: boolean;
  
  // Permissions
  permissions: AndroidPermissions;
  
  // Advanced Features
  enableOfflinePage: boolean;
  customOfflineHtml: string;
  customInjectedCss: string;
  customInjectedJs: string;
  deepLinkScheme: string;
  openExternalLinksInBrowser: boolean;
}

export interface PresetTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  url?: string;
  html?: string;
  config: Partial<AppConfig>;
}

export interface AiAnalysisResult {
  score: number;
  isResponsive: boolean;
  hasPwaManifest: boolean;
  recommendedPermissions: string[];
  suggestions: string[];
  customCssSnippet: string;
}
