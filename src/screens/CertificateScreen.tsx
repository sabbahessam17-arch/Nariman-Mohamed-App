import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';
import {
  ChevronRight,
  Printer,
  Sparkles,
  Share2,
  Code2,
} from 'lucide-react';

export const CertificateScreen: React.FC = () => {
  const { user, totalStars, maxStars, navigateTo, setFlutterInspectorOpen } = useApp();
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    soundService.playCelebration();
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.4 },
      colors: ['#F59E0B', '#2563EB', '#10B981', '#EC4899'],
    });
  }, []);

  const handlePrint = () => {
    soundService.playTap();
    window.print();
  };

  const handleShare = async () => {
    soundService.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'شهادة مهندس المستقبل',
          text: `أنا المهندس ${user.name} حصلت على شهادة مهندس المستقبل وجمعت ${totalStars} نجمة!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      alert(`🎉 البطل ${user.name} حصل على ${totalStars} نجمة في مهندس المستقبل!`);
    }
  };

  const todayArabic = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-slate-50 text-slate-800 p-4 overflow-y-auto no-scrollbar">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => {
            soundService.playTap();
            navigateTo('map');
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-transform"
        >
          <ChevronRight className="w-4 h-4" />
          <span>خريطة المحطات</span>
        </button>

        <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>شهادة التخرّج</span>
        </span>
      </div>

      {/* Main Printable Certificate Area */}
      <div className="my-auto py-2">
        <div
          ref={certRef}
          className="bg-white rounded-3xl p-5 border-4 border-amber-400 shadow-xl shadow-amber-500/15 relative text-center overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(219, 234, 254, 0.4), rgba(255, 255, 255, 0.9) 70%)',
          }}
        >
          {/* Inner Decorative Border */}
          <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 relative">
            {/* Corner Decorative Ornaments */}
            <span className="absolute top-1 right-2 text-xs text-amber-500">✦</span>
            <span className="absolute top-1 left-2 text-xs text-amber-500">✦</span>
            <span className="absolute bottom-1 right-2 text-xs text-amber-500">✦</span>
            <span className="absolute bottom-1 left-2 text-xs text-amber-500">✦</span>

            {/* Gear Emblem */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md mb-2">
              ⚙️
            </div>

            <h1 className="text-xl font-black text-blue-900 tracking-tight mb-1">
              شهادة مهندس المستقبل
            </h1>

            <p className="text-[11px] font-bold text-slate-400 mb-2">
              FUTURE ENGINEER OFFICIAL CERTIFICATE OF EXCELLENCE
            </p>

            <p className="text-xs font-bold text-slate-500 mb-1">
              تُمنح هذه الشهادة الفخرية بكل تقدير إلى:
            </p>

            {/* Candidate Name & Avatar */}
            <div className="my-2.5 py-1.5 px-3 bg-amber-50/80 rounded-2xl border border-amber-200 inline-block max-w-full">
              <span className="text-2xl mr-1">{user.avatar}</span>
              <span className="text-xl font-black text-amber-900 tracking-wide">
                {user.name || 'مهندس المستقبل'}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-700 leading-relaxed max-w-xs mx-auto mb-3">
              لإتمامه رحلة «مهندس المستقبل» التفاعلية بنجاح، وإتقان أساسيات التفكير
              التصميمي والهندسي، وجمعه{' '}
              <span className="font-mono font-black text-amber-600">
                {totalStars} / {maxStars}
              </span>{' '}
              نجمة تميّز! ⭐
            </p>

            {/* Footer with Seal and Date */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-right mt-2 px-1">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold">تاريخ الاعتماد:</span>
                <span className="text-[11px] font-bold text-slate-700 font-mono">
                  {todayArabic}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-amber-950 flex items-center justify-center text-xl shadow-md border-2 border-white">
                  🏅
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-amber-800">الختم الهندسي</span>
                  <span className="text-[9px] text-slate-400 font-bold">معتمد تفاعلياً</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 h-12 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>مشاركة الإنجاز</span>
          </button>
        </div>

        {/* View Flutter Source Code Button */}
        <button
          onClick={() => {
            soundService.playTap();
            setFlutterInspectorOpen(true);
          }}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>استكشاف الكود البرمجي الكامل لتطبيق فلاتر (Flutter Code)</span>
        </button>
      </div>
    </div>
  );
};
