import React, { useState } from 'react';
import { Globe, Code2, Sparkles, Upload, Check, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { SourceMode, AppConfig } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';

interface SourceInputProps {
  sourceMode: SourceMode;
  setSourceMode: (mode: SourceMode) => void;
  webUrl: string;
  setWebUrl: (url: string) => void;
  htmlContent: string;
  setHtmlContent: (html: string) => void;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onLoadPreset: (presetId: string) => void;
}

export const SourceInput: React.FC<SourceInputProps> = ({
  sourceMode,
  setSourceMode,
  webUrl,
  setWebUrl,
  htmlContent,
  setHtmlContent,
  appConfig,
  setAppConfig,
  onLoadPreset,
}) => {
  const [urlStatus, setUrlStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const validateUrl = (inputUrl: string) => {
    try {
      let formatted = inputUrl.trim();
      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        formatted = 'https://' + formatted;
      }
      new URL(formatted);
      setWebUrl(formatted);
      setUrlStatus('valid');
    } catch {
      setUrlStatus('invalid');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setHtmlContent(text);
          setSourceMode('html');
        }
      };
      reader.readAsText(file);
    } else {
      alert("Veuillez sélectionner un fichier HTML (.html) valide.");
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-800 pb-4 mb-5">
        <div className="grid grid-cols-3 gap-2 w-full p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          <button
            onClick={() => setSourceMode('url')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg font-medium text-xs transition ${
              sourceMode === 'url'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Site Web (URL)</span>
            <span className="sm:hidden">URL</span>
          </button>

          <button
            onClick={() => setSourceMode('html')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg font-medium text-xs transition ${
              sourceMode === 'html'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Code HTML / JS</span>
            <span className="sm:hidden">HTML</span>
          </button>

          <button
            onClick={() => setSourceMode('preset')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg font-medium text-xs transition ${
              sourceMode === 'preset'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">Modèles Démo</span>
            <span className="sm:hidden">Démo</span>
          </button>
        </div>
      </div>

      {/* URL Mode */}
      {sourceMode === 'url' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Adresse URL du Site Web à convertir en APK
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={webUrl}
                onChange={(e) => {
                  setWebUrl(e.target.value);
                  setUrlStatus('idle');
                }}
                onBlur={(e) => validateUrl(e.target.value)}
                placeholder="https://mon-site-web.com"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-24"
              />
              <button
                type="button"
                onClick={() => validateUrl(webUrl)}
                className="absolute right-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
              >
                Tester
              </button>
            </div>
            {urlStatus === 'invalid' && (
              <p className="text-xs text-rose-400 flex items-center mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Veuillez entrer une adresse URL valide (ex: https://exemple.com)
              </p>
            )}
            {urlStatus === 'valid' && (
              <p className="text-xs text-emerald-400 flex items-center mt-1.5">
                <Check className="w-3.5 h-3.5 mr-1" />
                URL valide et prête à être intégrée dans le WebView Android.
              </p>
            )}
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
            <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-300">Mode WebView Distant Active</p>
              <p className="mt-0.5">
                L'application chargera en direct l'URL indiquée au démarrage. Toutes les mises à jour sur votre serveur web seront instantanément reflétées dans l'APK Android !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HTML Code Mode */}
      {sourceMode === 'html' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Source HTML5 / CSS3 / JavaScript
            </label>
            <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Importer un fichier .html</span>
              <input type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="relative">
            <textarea
              rows={10}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="<!DOCTYPE html><html><head><title>Mon App</title></head><body><h1>Bonjour Android!</h1></body></html>"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
            />
            <div className="absolute top-3 right-3 text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-400 font-mono">
              {htmlContent.length} caractères
            </div>
          </div>

          <p className="text-xs text-slate-400">
            💡 Ce code HTML sera directement embarqué dans le sous-dossier <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">assets/www/index.html</code> de votre APK Android pour fonctionner à 100% hors-ligne.
          </p>
        </div>
      )}

      {/* Preset Mode */}
      {sourceMode === 'preset' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Sélectionnez un modèle d'application pré-construit pour tester la conversion vers APK Android en 1 clic :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_TEMPLATES.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onLoadPreset(preset.id)}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl cursor-pointer transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {preset.category}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-indigo-300 transition">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <button className="mt-3 text-xs font-semibold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-1 transition">
                  <span>Charger ce Modèle</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
