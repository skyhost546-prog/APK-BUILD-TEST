import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileCheck, 
  FolderArchive, 
  Github, 
  Globe, 
  QrCode, 
  Check, 
  Sparkles, 
  Loader2,
  Smartphone
} from 'lucide-react';
import { AppConfig, SourceMode } from '../types';
import { buildAndroidStudioZip, buildDirectApkPackage } from '../utils/apkGenerator';

interface BuildExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  sourceMode: SourceMode;
  webUrl: string;
  htmlContent: string;
}

export const BuildExportModal: React.FC<BuildExportModalProps> = ({
  isOpen,
  onClose,
  config,
  sourceMode,
  webUrl,
  htmlContent,
}) => {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadApk = async () => {
    setDownloadingType('apk');
    try {
      const blob = await buildDirectApkPackage(config, sourceMode, webUrl, htmlContent);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.appName.replace(/\s+/g, '_')}-v${config.versionName}.apk`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la génération de l'APK:", error);
      alert("Erreur lors de la génération de l'APK.");
    } finally {
      setDownloadingType(null);
    }
  };

  const handleDownloadZip = async () => {
    setDownloadingType('zip');
    try {
      const blob = await buildAndroidStudioZip(config, sourceMode, webUrl, htmlContent);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AndroidStudio-Project-${config.appName.replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur génération projet ZIP:", error);
      alert("Erreur lors de la génération du projet Android Studio.");
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Exportation &amp; Téléchargement APK
              </h3>
              <p className="text-xs text-slate-400">
                Application: <span className="text-emerald-400 font-semibold">{config.appName}</span> ({config.packageName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Card 1: Direct APK */}
          <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500 transition group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Recommandé
                </span>
                <FileCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition">
                Fichier APK Android Prêt (.apk)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Package Android signé valide prêt pour installation directe sur votre smartphone ou tablette Android.
              </p>
            </div>

            <button
              onClick={handleDownloadApk}
              disabled={downloadingType === 'apk'}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {downloadingType === 'apk' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compilation de l'APK...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger Fichier APK (.apk)</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: Android Studio Zip */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-500/50 transition group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Source Kotlin
                </span>
                <FolderArchive className="w-5 h-5 text-indigo-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition">
                Projet Android Studio (.ZIP)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Code source complet Kotlin + Gradle. Ouvrez directement dans Android Studio pour compiler ou publier sur Google Play Store.
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={downloadingType === 'zip'}
              className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {downloadingType === 'zip' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Création du ZIP...</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-4 h-4 text-indigo-400" />
                  <span>Projet Android Studio (.ZIP)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* GitHub Actions info banner */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs text-slate-300">
          <Github className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">Intégration GitHub Actions Incluses</p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Le projet ZIP comprend le fichier <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">.github/workflows/android.yml</code> pour générer automatiquement vos APKs sur chaque push GitHub !
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
