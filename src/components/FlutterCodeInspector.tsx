import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterCodeSnippets';
import { soundService } from '../services/soundService';
import {
  X,
  Copy,
  Check,
  FileCode,
  Terminal,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

interface FlutterCodeInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeInspector: React.FC<FlutterCodeInspectorProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile: FlutterFile = FLUTTER_PROJECT_FILES[activeFileIndex] || FLUTTER_PROJECT_FILES[0];

  const handleCopy = () => {
    soundService.playTap();
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    soundService.playSuccess();
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-md">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white">
                  كود تطبيق فلاتر (Flutter Architecture & Source Code)
                </h2>
                <span className="text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                  Flutter 3.x + Material 3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                من إعداد كبير مهندسي فلاتر (Senior Flutter Developer)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800 bg-slate-950/30 overflow-x-auto no-scrollbar">
          {FLUTTER_PROJECT_FILES.map((file, idx) => {
            const isActive = idx === activeFileIndex;
            return (
              <button
                key={file.path}
                onClick={() => {
                  soundService.playTap();
                  setActiveFileIndex(idx);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* File Description & Controls Strip */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <span className="font-mono text-cyan-400">{currentFile.path}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">{currentFile.description}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              title="تنزيل الملف"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed text-left dir-ltr selection:bg-blue-600 selection:text-white">
          <pre className="m-0 font-mono">
            <code>{currentFile.content}</code>
          </pre>
        </div>

        {/* Quick Flutter Setup Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              لتشغيل المشروع محلياً:{' '}
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">
                flutter create future_engineer && flutter pub get && flutter run
              </code>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>يدعم Android و iOS والويب بالكامل مع RTL عربي</span>
          </div>
        </div>
      </div>
    </div>
  );
};
