import React, { useState } from 'react';
import { FileCode2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { AppConfig, SourceMode } from '../types';
import { 
  generateAndroidManifest, 
  generateMainActivityKotlin, 
  generateBuildGradleApp, 
  generateGitHubWorkflow 
} from '../utils/apkGenerator';

interface CodeInspectorProps {
  config: AppConfig;
  sourceMode: SourceMode;
  webUrl: string;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  config,
  sourceMode,
  webUrl,
}) => {
  const [activeFile, setActiveFile] = useState<'manifest' | 'kotlin' | 'gradle' | 'github'>('manifest');
  const [copied, setCopied] = useState(false);

  const getCodeContent = () => {
    switch (activeFile) {
      case 'manifest':
        return generateAndroidManifest(config);
      case 'kotlin':
        return generateMainActivityKotlin(config, sourceMode === 'url' ? webUrl : undefined);
      case 'gradle':
        return generateBuildGradleApp(config);
      case 'github':
        return generateGitHubWorkflow(config);
      default:
        return '';
    }
  };

  const codeText = getCodeContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-100">
            Inspecteur de Code Android Généré
          </h3>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copié !' : 'Copier le Code'}</span>
        </button>
      </div>

      {/* File Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-3 no-scrollbar text-xs">
        <button
          onClick={() => setActiveFile('manifest')}
          className={`px-3 py-1.5 rounded-lg font-mono font-medium shrink-0 transition ${
            activeFile === 'manifest'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          AndroidManifest.xml
        </button>

        <button
          onClick={() => setActiveFile('kotlin')}
          className={`px-3 py-1.5 rounded-lg font-mono font-medium shrink-0 transition ${
            activeFile === 'kotlin'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          MainActivity.kt
        </button>

        <button
          onClick={() => setActiveFile('gradle')}
          className={`px-3 py-1.5 rounded-lg font-mono font-medium shrink-0 transition ${
            activeFile === 'gradle'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          build.gradle.kts
        </button>

        <button
          onClick={() => setActiveFile('github')}
          className={`px-3 py-1.5 rounded-lg font-mono font-medium shrink-0 transition ${
            activeFile === 'github'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          android.yml (GitHub CI)
        </button>
      </div>

      {/* Code Editor Preview Box */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <pre className="p-4 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-[350px] scrollbar-thin scrollbar-thumb-slate-800">
          <code>{codeText}</code>
        </pre>
      </div>
    </div>
  );
};
