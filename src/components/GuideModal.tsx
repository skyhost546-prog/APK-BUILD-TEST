import React from 'react';
import { X, Smartphone, BookOpen, Check, Github, ExternalLink, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">
              Guide d'Installation &amp; Compilation Android
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-slate-300">
          
          {/* Section 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sm text-emerald-400 mb-2 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4" />
              <span>1. Installer le Fichier .APK directement sur Smartphone</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Téléchargez le fichier <code className="text-emerald-300">.apk</code> généré sur votre appareil Android.</li>
              <li>Ouvrez le fichier dans votre gestionnaire de fichiers.</li>
              <li>Si Android affiche "Installation d'applications inconnues bloquée", autorisez votre navigateur ou gestionnaire de fichiers dans les paramètres.</li>
              <li>Cliquez sur <strong>Installer</strong> puis sur <strong>Ouvrir</strong> !</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sm text-indigo-400 mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4" />
              <span>2. Ouvrir et compiler dans Android Studio</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Extrayez l'archive <code className="text-indigo-300">AndroidStudio-Project.zip</code> dans un dossier.</li>
              <li>Lancez <strong>Android Studio</strong> et sélectionnez <strong>Open Existing Project</strong>.</li>
              <li>Laissez Gradle synchroniser les dépendances Kotlin automatiquement.</li>
              <li>Connectez votre smartphone en USB (Débogage USB actif) ou lancez un émulateur.</li>
              <li>Cliquez sur le bouton vert <strong>Run (Shift+F10)</strong> pour lancer l'application !</li>
            </ol>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sm text-amber-400 mb-2 flex items-center space-x-1.5">
              <Github className="w-4 h-4" />
              <span>3. Compilation Cloud Automatique avec GitHub Actions</span>
            </h4>
            <p className="text-slate-400 mb-2">
              Chaque projet ZIP contient le fichier <code className="text-amber-300">.github/workflows/android.yml</code>. Créez un dépôt GitHub avec ce code et GitHub compilera vos APKs gratuitement à chaque commit !
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
