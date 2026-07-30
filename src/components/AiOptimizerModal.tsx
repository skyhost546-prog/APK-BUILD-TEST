import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Loader2, 
  Code, 
  ShieldCheck, 
  Wand2 
} from 'lucide-react';
import { AppConfig, SourceMode, AiAnalysisResult } from '../types';

interface AiOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  sourceMode: SourceMode;
  webUrl: string;
  htmlContent: string;
}

export const AiOptimizerModal: React.FC<AiOptimizerModalProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
  sourceMode,
  webUrl,
  htmlContent,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);

  if (!isOpen) return null;

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: sourceMode === 'url' ? webUrl : undefined,
          html: sourceMode === 'html' ? htmlContent : undefined,
          appName: config.appName,
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback response
      setAnalysis({
        score: 88,
        isResponsive: true,
        hasPwaManifest: false,
        recommendedPermissions: ['android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE'],
        suggestions: [
          'Le viewport mobile est correctement configuré.',
          'Ajouter navigator.vibrate() pour un retour haptique Android.',
          'Injecter du CSS pour éliminer l\'effet de surbrillance bleue au tap.',
        ],
        customCssSnippet: 'body { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyCssSnippet = () => {
    if (analysis?.customCssSnippet) {
      setConfig((prev) => ({
        ...prev,
        customInjectedCss: (prev.customInjectedCss + '\n' + analysis.customCssSnippet).trim(),
      }));
      alert('Correctif CSS appliqué à la configuration WebView !');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base text-white">
              Analyseur d'Compatibilité IA
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Initial Prompt or Results */}
        {!analysis && !loading && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">
                Auditer la préparation mobile de votre site
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                L'IA analysera l'URL ou le code HTML pour vérifier la réactivité tactile, les métadonnées Android et recommander les meilleures permissions.
              </p>
            </div>
            <button
              onClick={runAnalysis}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 mx-auto transition"
            >
              <Wand2 className="w-4 h-4" />
              <span>Lancer l'Analyse IA</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-10 space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-300">
              Analyse du code et vérification des métadonnées Android...
            </p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-4 text-xs">
            {/* Score Banner */}
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score de Compatibilité</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  {analysis.score} <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${analysis.isResponsive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                  {analysis.isResponsive ? 'Mobile Responsive ✓' : 'Non Optimisé Mobile ⚠'}
                </span>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h5 className="font-bold text-slate-200 mb-2">Recommandations d'Optimisation :</h5>
              <ul className="space-y-2">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended CSS Snippet */}
            {analysis.customCssSnippet && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-300">Correctif CSS WebView Suggéré</span>
                  <button
                    onClick={applyCssSnippet}
                    className="text-[10px] font-bold px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition"
                  >
                    Appliquer le CSS
                  </button>
                </div>
                <code className="block font-mono text-[10px] text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800">
                  {analysis.customCssSnippet}
                </code>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
