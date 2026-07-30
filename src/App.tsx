import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SourceInput } from './components/SourceInput';
import { AppConfigurator } from './components/AppConfigurator';
import { DeviceSimulator } from './components/DeviceSimulator';
import { CodeInspector } from './components/CodeInspector';
import { BuildExportModal } from './components/BuildExportModal';
import { IconGeneratorModal } from './components/IconGeneratorModal';
import { AiOptimizerModal } from './components/AiOptimizerModal';
import { GuideModal } from './components/GuideModal';
import { AppConfig, SourceMode } from './types';
import { PRESET_TEMPLATES } from './data/presets';
import { Download, Sparkles, Smartphone, CheckCircle, Zap } from 'lucide-react';

export default function App() {
  const [sourceMode, setSourceMode] = useState<SourceMode>('url');
  const [webUrl, setWebUrl] = useState<string>('https://example.com');
  const [htmlContent, setHtmlContent] = useState<string>(PRESET_TEMPLATES[0].html || '');

  const [appConfig, setAppConfig] = useState<AppConfig>({
    appName: 'Mon Application Web',
    packageName: 'com.monentreprise.monapp',
    versionName: '1.0.0',
    versionCode: 1,
    description: 'Application Android WebView créée avec Web2APK Studio.',
    author: 'Web2APK Creator',
    
    icon: {
      type: 'generated',
      iconName: 'Smartphone',
      bgColor: '#6366f1',
      useGradient: true,
      gradientSecondary: '#8b5cf6',
      shape: 'squircle',
    },
    primaryColor: '#6366f1',
    splashBgColor: '#0f172a',
    splashDurationMs: 2000,
    showSplashScreen: true,

    orientation: 'portrait',
    displayMode: 'standard',
    pullToRefresh: true,
    enableZoom: false,
    customUserAgent: '',
    javaScriptEnabled: true,
    domStorageEnabled: true,
    clearCacheOnExit: false,

    permissions: {
      internet: true,
      camera: false,
      location: false,
      microphone: false,
      storage: true,
      notifications: true,
      vibrate: true,
    },

    enableOfflinePage: true,
    customOfflineHtml: '',
    customInjectedCss: '/* Inserer du CSS WebView ici */',
    customInjectedJs: '',
    deepLinkScheme: '',
    openExternalLinksInBrowser: false,
  });

  // Modal States
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;

    if (preset.html) {
      setHtmlContent(preset.html);
      setSourceMode('html');
    } else if (preset.url) {
      setWebUrl(preset.url);
      setSourceMode('url');
    }

    setAppConfig((prev) => ({
      ...prev,
      appName: preset.config.appName || prev.appName,
      packageName: preset.config.packageName || prev.packageName,
      primaryColor: preset.config.primaryColor || prev.primaryColor,
      orientation: preset.config.orientation || prev.orientation,
      displayMode: preset.config.displayMode || prev.displayMode,
      permissions: {
        ...prev.permissions,
        ...preset.config.permissions,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Navbar
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenIconModal={() => setIsIconModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onGenerateClick={() => setIsBuildModalOpen(true)}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Générateur d'APK Android Valides &amp; Projets Kotlin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Transformez tout Site Web ou Code HTML en <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Application APK Android</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Créez votre APK d'application Android en quelques clics. Téléchargez le package <code className="text-emerald-400 font-mono">.apk</code> valide prêt à être installé ou le projet Kotlin Android Studio complet avec workflows GitHub Actions CI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsBuildModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 active:scale-95 transition"
            >
              <Download className="w-4 h-4" />
              <span>Générer Mon APK Maintenant</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input, Configurator & Inspector */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Source Selector */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">1</span>
                <h2 className="font-bold text-sm text-slate-200">Choisir la Source Web</h2>
              </div>
              <SourceInput
                sourceMode={sourceMode}
                setSourceMode={setSourceMode}
                webUrl={webUrl}
                setWebUrl={setWebUrl}
                htmlContent={htmlContent}
                setHtmlContent={setHtmlContent}
                appConfig={appConfig}
                setAppConfig={setAppConfig}
                onLoadPreset={handleLoadPreset}
              />
            </div>

            {/* Step 2: Android App Settings */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">2</span>
                <h2 className="font-bold text-sm text-slate-200">Personnaliser les Paramètres Android</h2>
              </div>
              <AppConfigurator
                config={appConfig}
                setConfig={setAppConfig}
                onOpenIconModal={() => setIsIconModalOpen(true)}
              />
            </div>

            {/* Step 3: Generated Code Inspector */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">3</span>
                <h2 className="font-bold text-sm text-slate-200">Code Source Android Généré</h2>
              </div>
              <CodeInspector
                config={appConfig}
                sourceMode={sourceMode}
                webUrl={webUrl}
              />
            </div>

          </div>

          {/* Right Column (Sticky): Simulator Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-xs text-slate-200">
                    Simulateur Android Interactif
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                  Aperçu En Direct
                </span>
              </div>

              {/* Simulator Component */}
              <DeviceSimulator
                config={appConfig}
                sourceMode={sourceMode}
                webUrl={webUrl}
                htmlContent={htmlContent}
              />

              <button
                onClick={() => setIsBuildModalOpen(true)}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger l'APK ({appConfig.appName})</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Web2APK Studio — Convertisseur Web &amp; HTML vers APK Android.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsGuideModalOpen(true)} className="hover:text-slate-300">Guide Android</button>
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-slate-300">Auditeur IA</button>
            <button onClick={() => setIsIconModalOpen(true)} className="hover:text-slate-300">Studio Icône</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BuildExportModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        config={appConfig}
        sourceMode={sourceMode}
        webUrl={webUrl}
        htmlContent={htmlContent}
      />

      <IconGeneratorModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        config={appConfig}
        setConfig={setAppConfig}
      />

      <AiOptimizerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        config={appConfig}
        setConfig={setAppConfig}
        sourceMode={sourceMode}
        webUrl={webUrl}
        htmlContent={htmlContent}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
