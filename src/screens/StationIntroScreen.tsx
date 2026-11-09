import React from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS_DATA } from '../data/engineeringData';
import { soundService } from '../services/soundService';
import {
  ChevronRight,
  BookOpen,
  Gamepad2,
  Trophy,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const StationIntroScreen: React.FC = () => {
  const {
    selectedStationId,
    navigateTo,
    getStationReadCount,
    isStationDone,
  } = useApp();

  const station = STATIONS_DATA[selectedStationId] || STATIONS_DATA[0];
  const readCount = getStationReadCount(station.id);
  const totalCards = station.cards.length;
  const isDone = isStationDone(station.id);

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-slate-50 text-slate-800 p-4 overflow-y-auto no-scrollbar">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <button
          onClick={() => {
            soundService.playTap();
            navigateTo('map');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-transform"
        >
          <ChevronRight className="w-4 h-4" />
          <span>الخريطة الرئيسية</span>
        </button>

        <span className="text-xs font-bold text-slate-400">
          المحطة {station.id + 1} من {STATIONS_DATA.length}
        </span>
      </div>

      {/* Hero Visual Area */}
      <div className="my-auto py-2 text-center">
        {/* Animated Badge with Halo */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          {/* Subtle spinning halo rings */}
          <div
            className="absolute inset-0 rounded-full opacity-30 animate-spin-slow border-4 border-dashed"
            style={{ borderColor: station.themeColor.primary }}
          />
          <div
            className="absolute inset-2 rounded-full opacity-20 blur-sm"
            style={{ backgroundColor: station.themeColor.primary }}
          />

          {/* Main Medal Center */}
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 transition-transform hover:scale-105"
            style={{
              backgroundColor: station.themeColor.light,
              borderColor: station.themeColor.primary,
              boxShadow: `0 12px 24px -8px ${station.themeColor.primary}40`,
            }}
          >
            {station.icon}
          </div>

          {isDone && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white shadow">
              مكتملة ✓
            </div>
          )}
        </div>

        {/* Tag Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-xs"
          style={{
            backgroundColor: station.themeColor.light,
            color: station.themeColor.dark,
            borderColor: station.themeColor.border,
          }}
        >
          <Sparkles className="w-3 h-3" />
          <span>{station.tag}</span>
        </div>

        {/* Station Title */}
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          {station.name}
        </h1>

        {/* Station Learning Objective */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs max-w-sm mx-auto mb-5 text-right">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-black" style={{ color: station.themeColor.primary }}>
            <span>🎯</span>
            <span>الهدف التعليمي للمحطة:</span>
          </div>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            {station.goal}
          </p>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto text-right text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-0.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>بطاقات الاستكشاف</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {readCount} من {totalCards} تم قراءتها
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-0.5">
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              <span>تحدي تفاعلي</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {station.activity.type === 'ordering' ? 'ترتيب خطوات' : 'سحب وتصنيف'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            soundService.playSuccess();
            navigateTo('station_cards', station.id);
          }}
          className="w-full h-13 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: station.themeColor.primary,
            boxShadow: `0 8px 20px -4px ${station.themeColor.primary}60`,
          }}
        >
          <span>ابدأ استكشاف البطاقات</span>
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </button>

        {readCount > 0 && (
          <button
            onClick={() => {
              soundService.playTap();
              navigateTo('station_activity', station.id);
            }}
            className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>الانتقال مباشرة إلى التحدي الهادف</span>
          </button>
        )}
      </div>
    </div>
  );
};
