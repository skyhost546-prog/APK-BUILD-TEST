import React, { useState } from 'react';
import { 
  Sliders, 
  Smartphone, 
  Palette, 
  ShieldCheck, 
  Settings2, 
  Code, 
  Check, 
  Wand2, 
  HelpCircle,
  Wifi,
  Camera,
  MapPin,
  Mic,
  Folder,
  Bell,
  Zap
} from 'lucide-react';
import { AppConfig, AndroidPermissions } from '../types';

interface AppConfiguratorProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onOpenIconModal: () => void;
}

export const AppConfigurator: React.FC<AppConfiguratorProps> = ({
  config,
  setConfig,
  onOpenIconModal,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'theme' | 'webview' | 'permissions' | 'advanced'>('info');

  const updateConfig = <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const togglePermission = (permKey: keyof AndroidPermissions) => {
    setConfig((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey],
      },
    }));
  };

  const COLOR_PRESETS = [
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Émeraude', hex: '#10b981' },
    { label: 'Océan', hex: '#0284c7' },
    { label: 'Violet', hex: '#8b5cf6' },
    { label: 'Ambre', hex: '#f59e0b' },
    { label: 'Rose', hex: '#f43f5e' },
    { label: 'Sombre', hex: '#0f172a' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Configuration de l'APK Android</span>
        </h3>
        <span className="text-[11px] text-slate-400">
          Changements appliqués en temps réel
        </span>
      </div>

      {/* Accordion / Tab Buttons */}
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-800 pb-3 mb-5 no-scrollbar">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
            activeTab === 'info'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>1. Général</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
            activeTab === 'theme'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>2. Apparence &amp; Icône</span>
        </button>

        <button
          onClick={() => setActiveTab('webview')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
            activeTab === 'webview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>3. WebView &amp; Écran</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
            activeTab === 'permissions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>4. Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
            activeTab === 'advanced'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>5. Code Avancé</span>
        </button>
      </div>

      {/* Tab 1: Info */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nom de l'application
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => updateConfig('appName', e.target.value)}
                placeholder="Mon Application"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                ID de Package (Android Package Name)
              </label>
              <input
                type="text"
                value={config.packageName}
                onChange={(e) => updateConfig('packageName', e.target.value)}
                placeholder="com.monentreprise.monapp"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Exemple: <code className="text-slate-300">com.monentreprise.app</code> (Format inversé unique).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nom de Version
              </label>
              <input
                type="text"
                value={config.versionName}
                onChange={(e) => updateConfig('versionName', e.target.value)}
                placeholder="1.0.0"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Code de Version
              </label>
              <input
                type="number"
                value={config.versionCode}
                onChange={(e) => updateConfig('versionCode', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Auteur / Organisation
              </label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => updateConfig('author', e.target.value)}
                placeholder="Ex: Web2APK Studio"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Theme & Icon */}
      {activeTab === 'theme' && (
        <div className="space-y-5">
          {/* Icon Customizer Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-lg"
                style={{
                  background: config.icon.useGradient && config.icon.gradientSecondary
                    ? `linear-gradient(135deg, ${config.icon.bgColor}, ${config.icon.gradientSecondary})`
                    : config.icon.bgColor,
                }}
              >
                {config.appName.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200">
                  Icône d'Application Android
                </h4>
                <p className="text-[11px] text-slate-400">
                  Forme: <span className="capitalize">{config.icon.shape}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onOpenIconModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Personnaliser l'Icône</span>
            </button>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Couleur d'Accentuation Principale
            </label>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  onClick={() => updateConfig('primaryColor', preset.hex)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                    config.primaryColor === preset.hex
                      ? 'border-white bg-slate-800 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span>{preset.label}</span>
                </button>
              ))}
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
                title="Couleur personnalisée"
              />
            </div>
          </div>

          {/* Splash Screen */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-slate-200">
                  Écran de Démarrage (Splash Screen)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Affiche votre logo au lancement de l'application
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.showSplashScreen}
                onChange={(e) => updateConfig('showSplashScreen', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
              />
            </div>

            {config.showSplashScreen && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Durée d'affichage (ms)
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="250"
                    value={config.splashDurationMs}
                    onChange={(e) => updateConfig('splashDurationMs', parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-[10px] text-indigo-400 font-mono">
                    {config.splashDurationMs} ms
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Couleur de fond Splash
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.splashBgColor}
                      onChange={(e) => updateConfig('splashBgColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {config.splashBgColor}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: WebView Settings */}
      {activeTab === 'webview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Orientation de l'écran
              </label>
              <select
                value={config.orientation}
                onChange={(e) => updateConfig('orientation', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              >
                <option value="portrait">Portrait Uniquement (Recommandé)</option>
                <option value="landscape">Paysage Uniquement (Jeux/Vidéo)</option>
                <option value="sensor">Auto-Rotation (Capteur)</option>
                <option value="unspecified">Par défaut du système</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mode d'Affichage Écran
              </label>
              <select
                value={config.displayMode}
                onChange={(e) => updateConfig('displayMode', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-100"
              >
                <option value="standard">Standard (Avec Barre d'État Android)</option>
                <option value="fullscreen">Plein Écran (Sans barre d'état)</option>
                <option value="immersive">Immersif (Jeux/Multimédia)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-200">Geste "Tirer pour Rafraîchir"</span>
                <p className="text-[10px] text-slate-400">Swipe-to-refresh natif SwipeRefreshLayout</p>
              </div>
              <input
                type="checkbox"
                checked={config.pullToRefresh}
                onChange={(e) => updateConfig('pullToRefresh', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-200">Zoom Manuel Autorisé</span>
                <p className="text-[10px] text-slate-400">Pinch-to-zoom sur la page web</p>
              </div>
              <input
                type="checkbox"
                checked={config.enableZoom}
                onChange={(e) => updateConfig('enableZoom', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              User-Agent Personnalisé (Optionnel)
            </label>
            <input
              type="text"
              value={config.customUserAgent}
              onChange={(e) => updateConfig('customUserAgent', e.target.value)}
              placeholder="Ex: Mozilla/5.0 (Linux; Android 14) Chrome/120.0 Mobile Web2APK/1.0"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-300"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Permissions */}
      {activeTab === 'permissions' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Cochez les autorisations Android nécessaires au bon fonctionnement de votre site (elles seront générées dans <code className="text-indigo-300">AndroidManifest.xml</code>) :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'internet', label: 'Accès Internet & Réseau', icon: Wifi, desc: 'Requis pour charger des URL ou API distantes', required: true },
              { key: 'camera', label: 'Appareil Photo', icon: Camera, desc: 'Requis si votre site utilise des fichiers ou scan QR' },
              { key: 'location', label: 'Géolocalisation GPS', icon: MapPin, desc: 'Requis pour les cartes et la position GPS' },
              { key: 'microphone', label: 'Microphone & Audio', icon: Mic, desc: 'Requis pour les appels vocaux ou l\'enregistrement' },
              { key: 'storage', label: 'Stockage & Fichiers', icon: Folder, desc: 'Requis pour télécharger ou envoyer des médias' },
              { key: 'notifications', label: 'Notifications Push', icon: Bell, desc: 'Requis pour envoyer des alertes' },
              { key: 'vibrate', label: 'Vibration Haptique', icon: Zap, desc: 'Requis pour navigator.vibrate()' },
            ].map((perm) => {
              const IconComp = perm.icon;
              const isChecked = config.permissions[perm.key as keyof AndroidPermissions];
              return (
                <div
                  key={perm.key}
                  onClick={() => togglePermission(perm.key as keyof AndroidPermissions)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-3 transition ${
                    isChecked
                      ? 'bg-indigo-950/40 border-indigo-600/60 text-indigo-100'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{perm.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div click
                        className="w-3.5 h-3.5 rounded text-indigo-600"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{perm.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Advanced Code */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200">Générer la Page Hors-Ligne (Offline Fallback)</span>
              <p className="text-[10px] text-slate-400">Affiche une page d'erreur esthétique si la connexion réseau est coupée</p>
            </div>
            <input
              type="checkbox"
              checked={config.enableOfflinePage}
              onChange={(e) => updateConfig('enableOfflinePage', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600"
            />
          </label>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              CSS Injecté sur Mesure dans la WebView
            </label>
            <textarea
              rows={3}
              value={config.customInjectedCss}
              onChange={(e) => updateConfig('customInjectedCss', e.target.value)}
              placeholder="body { -webkit-user-select: none; -webkit-tap-highlight-color: transparent; }"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Deep Linking (Schéma d'ouverture d'App)
            </label>
            <input
              type="text"
              value={config.deepLinkScheme}
              onChange={(e) => updateConfig('deepLinkScheme', e.target.value)}
              placeholder="ex: monapp (permet d'ouvrir l'app via monapp://)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
