import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS_DATA } from '../data/engineeringData';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Trophy,
  ArrowLeft,
  MapPin,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const StationDoneScreen: React.FC = () => {
  const {
    selectedStationId,
    navigateTo,
    getStationReadCount,
    completedActivities,
    isStationDone,
  } = useApp();

  const station = STATIONS_DATA[selectedStationId] || STATIONS_DATA[0];
  const readCount = getStationReadCount(station.id);
  const totalCards = station.cards.length;
  const isActDone = !!completedActivities[station.id];
  const isAllComplete = isStationDone(station.id);

  const isLastStation = selectedStationId === STATIONS_DATA.length - 1;

  useEffect(() => {
    soundService.playCelebration();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: [station.themeColor.primary, '#F59E0B', '#10B981', '#6366F1'],
    });
  }, [station.id]);

  const handleNext = () => {
    soundService.playSuccess();
    if (isLastStation) {
      navigateTo('certificate');
    } else {
      navigateTo('station_intro', selectedStationId + 1);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-slate-50 text-slate-800 p-5 overflow-y-auto no-scrollbar text-center">
      {/* Top Tag */}
      <div className="pt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>إنجاز محطة هندسية</span>
        </span>
      </div>

      {/* Hero Medal & Celebration */}
      <div className="my-auto py-2">
        <div className="relative w-32 h-32 mx-auto mb-5">
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-6xl shadow-xl border-4"
            style={{
              backgroundColor: station.themeColor.light,
              borderColor: station.themeColor.primary,
            }}
          >
            {station.icon}
          </div>
          {isAllComplete && (
            <div className="absolute -bottom-1 -left-1 w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center border-3 border-white shadow-lg animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-1">
          {isAllComplete ? 'أحسنت يا مهندس المستقبل!' : 'جهد رائع ومميز!'}
        </h1>
        <p className="text-xs font-semibold text-slate-500 mb-6 max-w-xs mx-auto">
          أنهيت استكشاف محطة «{station.name}» وتعرفت على أهم أسرارها وتطبيقاتها.
        </p>

        {/* Score Summary Cards */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6 text-right">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>بطاقات المعرفة</span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {readCount} / {totalCards}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {readCount === totalCards ? 'كاملة ✓' : 'متبقي بعضها'}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>التحدي العملي</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {isActDone ? 'مكتمل ⭐⭐⭐' : 'قيد المحاولة'}
            </div>
            <div className="text-[10px] text-amber-700 font-bold mt-0.5">
              {isActDone ? '+٣ نجوم ذهبية' : 'العب التحدي'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleNext}
          className="w-full h-13 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <span>{isLastStation ? 'استلم شهادة الإنجاز الفخرية 🏅' : 'المحطة التالية'}</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>

        <button
          onClick={() => {
            soundService.playTap();
            navigateTo('map');
          }}
          className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>العودة لخريطة الرحلة</span>
        </button>
      </div>
    </div>
  );
};
