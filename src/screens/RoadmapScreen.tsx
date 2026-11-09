import React from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS_DATA } from '../data/engineeringData';
import { soundService } from '../services/soundService';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronLeft,
  Award,
  Sparkles,
  RotateCcw,
  Code2,
} from 'lucide-react';

export const RoadmapScreen: React.FC = () => {
  const {
    user,
    totalStars,
    maxStars,
    isMuted,
    toggleSound,
    navigateTo,
    isStationDone,
    getStationReadCount,
    setFlutterInspectorOpen,
    resetProgress,
  } = useApp();

  const totalProgressPercent = Math.round((totalStars / maxStars) * 100);

  // Find the first unfinished station
  const firstUnfinishedId = STATIONS_DATA.findIndex((s) => !isStationDone(s.id));
  const currentTargetId = firstUnfinishedId !== -1 ? firstUnfinishedId : 0;

  return (
    <div className="relative min-h-full flex flex-col bg-slate-50 text-slate-800">
      {/* Flutter-style AppBar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm">
            ⚙️
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-none">مهندس المستقبل</h1>
            <span className="text-[11px] font-semibold text-slate-400">خريطة المحطات</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Star Counter Pill */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-amber-900 font-black text-xs shadow-xs">
            <span className="text-sm">⭐</span>
            <span className="font-mono">{totalStars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
            aria-label="تبديل الصوت"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Code Inspector Trigger */}
          <button
            onClick={() => {
              soundService.playTap();
              setFlutterInspectorOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 active:scale-95 transition-transform"
            title="عرض كود فلاتر"
            aria-label="كود فلاتر"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar pb-24">
        {/* User Status Card */}
        <div className="relative overflow-hidden bg-gradient-to-l from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-4 text-white shadow-md shadow-blue-600/20">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-blue-200">مرحباً بك يا</span>
                <span className="text-xs font-bold text-amber-300">مبتكر الغد</span>
              </div>
              <h2 className="text-lg font-black truncate">{user.name || 'مهندس صغير'}</h2>
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-100 mt-1">
                <span>إجمالي الإنجاز</span>
                <span className="font-mono text-amber-300">{totalProgressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-black/20 h-2.5 rounded-full mt-3 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, totalProgressPercent))}%` }}
            />
          </div>
        </div>

        {/* Stations Path Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <h3 className="text-sm font-black text-slate-700 flex items-center gap-1.5">
            <span>🗺️</span>
            <span>خط السير الهندسي (٥ محطات)</span>
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {STATIONS_DATA.filter((s) => isStationDone(s.id)).length} من ٥ مكتملة
          </span>
        </div>

        {/* Vertical Stations Timeline */}
        <div className="space-y-3 relative before:absolute before:right-6 before:top-6 before:bottom-6 before:w-1 before:bg-slate-200 before:rounded-full before:z-0">
          {STATIONS_DATA.map((station, idx) => {
            const isDone = isStationDone(station.id);
            const isCurrent = currentTargetId === station.id && !isDone;
            const readCount = getStationReadCount(station.id);
            const totalCards = station.cards.length;
            const stationProgress = Math.round((readCount / totalCards) * 100);

            return (
              <div
                key={station.id}
                onClick={() => {
                  soundService.playTap();
                  navigateTo('station_intro', station.id);
                }}
                className={`relative z-10 bg-white rounded-2xl p-3.5 border-2 transition-all cursor-pointer active:scale-[0.98] ${
                  isDone
                    ? 'border-emerald-300 shadow-sm shadow-emerald-500/10'
                    : isCurrent
                    ? 'border-blue-500 shadow-md shadow-blue-500/15 ring-4 ring-blue-50'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Station Icon with Ripple */}
                  <div className="relative shrink-0">
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl border shadow-inner transition-transform"
                      style={{
                        backgroundColor: station.themeColor.light,
                        borderColor: station.themeColor.border,
                      }}
                    >
                      {station.icon}
                    </div>
                    {isDone && (
                      <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Station Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[11px] font-bold text-slate-400">
                        المحطة {idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>ابدأ هنا</span>
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          مكتملة ✓
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-slate-900 truncate">
                      {station.name}
                    </h4>

                    <p className="text-xs font-semibold text-slate-500 truncate mb-2">
                      {station.tag}
                    </p>

                    {/* Mini Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${isDone ? 100 : stationProgress}%`,
                            backgroundColor: isDone ? '#10B981' : station.themeColor.primary,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {readCount}/{totalCards} بطاقات
                      </span>
                    </div>
                  </div>

                  {/* Chevron Navigation */}
                  <div className="text-slate-300 shrink-0">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Honor Certificate CTA */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundService.playStar();
              navigateTo('certificate');
            }}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-between shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
                🏅
              </div>
              <div className="text-right">
                <div className="font-black text-sm">شهادة مهندس المستقبل</div>
                <div className="text-[11px] text-amber-100 font-semibold">
                  اضغط هنا لعرض وطباعة شهادتك الفخرية
                </div>
              </div>
            </div>
            <Award className="w-5 h-5 text-amber-200" />
          </button>
        </div>

        {/* Reset Progress (Quiet button) */}
        <div className="pt-4 text-center">
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين التقدم والبدء من جديد؟')) {
                resetProgress();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors py-1 px-3 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة تعيين نقاط الرحلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
