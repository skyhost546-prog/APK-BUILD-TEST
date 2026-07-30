import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Wifi, 
  WifiOff, 
  Play, 
  Maximize2, 
  RefreshCw, 
  Smartphone, 
  Sparkles,
  ChevronLeft,
  Circle,
  Square
} from 'lucide-react';
import { AppConfig, SourceMode } from '../types';

interface DeviceSimulatorProps {
  config: AppConfig;
  sourceMode: SourceMode;
  webUrl: string;
  htmlContent: string;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  config,
  sourceMode,
  webUrl,
  htmlContent,
}) => {
  const [isLandscape, setIsLandscape] = useState(config.orientation === 'landscape');
  const [isOffline, setIsOffline] = useState(false);
  const [showingSplash, setShowingSplash] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  // Sync orientation prop
  useEffect(() => {
    setIsLandscape(config.orientation === 'landscape');
  }, [config.orientation]);

  // Update status bar clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerSplashScreen = () => {
    setShowingSplash(true);
    setTimeout(() => {
      setShowingSplash(false);
    }, config.splashDurationMs || 2000);
  };

  // Determine iframe source URL
  const getIframeSrc = () => {
    if (isOffline && config.enableOfflinePage) {
      return undefined; // Handled by offline fallback rendering
    }

    if (sourceMode === 'url' && webUrl) {
      let formatted = webUrl.trim();
      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        formatted = 'https://' + formatted;
      }
      return `/api/proxy?url=${encodeURIComponent(formatted)}`;
    }
    return undefined;
  };

  const iframeSrc = getIframeSrc();

  return (
    <div className="flex flex-col items-center">
      {/* Simulator Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 mb-4 flex items-center space-x-2 shadow-lg text-xs">
        <button
          onClick={() => setIsLandscape(!isLandscape)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          title="Basculez entre Mode Portrait et Paysage"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">{isLandscape ? 'Paysage' : 'Portrait'}</span>
        </button>

        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
            isOffline
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Simuler une coupure réseau"
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5 text-rose-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isOffline ? 'Hors Ligne' : 'En Ligne'}</span>
        </button>

        <button
          onClick={triggerSplashScreen}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          title="Tester le Splash Screen"
        >
          <Play className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Splash</span>
        </button>

        <button
          onClick={() => setIframeKey((prev) => prev + 1)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          title="Rafraîchir la vue"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Android Device Mockup Container */}
      <div
        className={`relative transition-all duration-300 ease-out bg-slate-950 border-[10px] border-slate-800 rounded-[48px] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col ${
          isLandscape
            ? 'w-[620px] h-[340px] max-w-full'
            : 'w-[320px] sm:w-[350px] h-[640px]'
        }`}
      >
        {/* Android Top Notch Camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          </div>
        </div>

        {/* Android Status Bar */}
        {config.displayMode !== 'fullscreen' && (
          <div
            className="w-full h-8 px-6 pt-1 text-[11px] font-semibold text-white flex justify-between items-center z-30 shrink-0"
            style={{ backgroundColor: config.primaryColor || '#000000' }}
          >
            <span>{currentTime || '12:00'}</span>
            <div className="flex items-center space-x-2 text-[10px]">
              {isOffline ? <WifiOff className="w-3 h-3 text-rose-300" /> : <Wifi className="w-3 h-3" />}
              <span>85%</span>
            </div>
          </div>
        )}

        {/* Device Main Screen Content */}
        <div className="relative flex-1 bg-slate-900 overflow-hidden w-full h-full">
          {/* Splash Screen Layer */}
          {showingSplash && (
            <div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-300"
              style={{ backgroundColor: config.splashBgColor || '#1e1b4b' }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl mb-4 animate-bounce"
                style={{ backgroundColor: config.primaryColor || '#6366f1' }}
              >
                {config.appName.charAt(0).toUpperCase() || 'A'}
              </div>
              <h2 className="text-xl font-bold tracking-wide">{config.appName}</h2>
              <div className="mt-6 w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Offline Mode Screen Simulation */}
          {isOffline ? (
            <div className="w-full h-full bg-slate-950 p-6 flex flex-col items-center justify-center text-center text-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-2xl mb-3 border border-rose-500/20">
                📡
              </div>
              <h3 className="font-bold text-base mb-1">Pas de Connexion Internet</h3>
              <p className="text-xs text-slate-400 max-w-[220px] mb-4">
                Vous êtes hors-ligne. Mode fallback offline.html de {config.appName} actif.
              </p>
              <button
                onClick={() => setIsOffline(false)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md"
              >
                Se Reconnecter
              </button>
            </div>
          ) : sourceMode === 'url' ? (
            <iframe
              key={iframeKey}
              src={iframeSrc}
              title="Android WebView Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <iframe
              key={iframeKey}
              srcDoc={htmlContent}
              title="Android WebView HTML Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>

        {/* Android Bottom Navigation Bar */}
        <div className="w-full h-9 bg-black flex items-center justify-around px-12 z-30 shrink-0 border-t border-slate-900">
          <button className="text-slate-500 hover:text-white p-1">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="text-slate-500 hover:text-white p-1">
            <Circle className="w-3.5 h-3.5" />
          </button>
          <button className="text-slate-500 hover:text-white p-1">
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
