import React from 'react';
import { Smartphone, Sparkles, Wand2, FileCode, HelpCircle, Download } from 'lucide-react';

interface NavbarProps {
  onOpenAiModal: () => void;
  onOpenIconModal: () => void;
  onOpenGuideModal: () => void;
  onGenerateClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiModal,
  onOpenIconModal,
  onOpenGuideModal,
  onGenerateClick,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Web2APK<span className="text-emerald-400">Studio</span>
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                v2.4 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Convertisseur Web &amp; HTML vers APK Android Valide
            </p>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenIconModal}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Studio Icône</span>
          </button>

          <button
            onClick={onOpenAiModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 rounded-lg border border-emerald-800/50 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Analyseur IA</span>
          </button>

          <button
            onClick={onOpenGuideModal}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Guide Android Studio &amp; Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onGenerateClick}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          >
            <Download className="w-4 h-4" />
            <span>Générer L'APK</span>
          </button>
        </div>

      </div>
    </header>
  );
};
