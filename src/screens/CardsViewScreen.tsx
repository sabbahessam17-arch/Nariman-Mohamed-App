import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS_DATA } from '../data/engineeringData';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle2,
  Gamepad2,
  Lightbulb,
} from 'lucide-react';

export const CardsViewScreen: React.FC = () => {
  const {
    selectedStationId,
    readCards,
    toggleCardRead,
    navigateTo,
    getStationReadCount,
  } = useApp();

  const station = STATIONS_DATA[selectedStationId] || STATIONS_DATA[0];
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const card = station.cards[activeCardIndex] || station.cards[0];
  const isCardRead = !!readCards[`${station.id}-${activeCardIndex}`];
  const totalCards = station.cards.length;
  const readCount = getStationReadCount(station.id);
  const allCardsRead = readCount === totalCards;

  const handleLearnToggle = (e: React.MouseEvent) => {
    const isNowRead = toggleCardRead(station.id, activeCardIndex);
    if (isNowRead) {
      // Confetti burst from button position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x, y },
        colors: [station.themeColor.primary, '#F59E0B', '#10B981', '#6366F1'],
      });
    }
  };

  const handleNextCard = () => {
    soundService.playTap();
    if (activeCardIndex < totalCards - 1) {
      setActiveCardIndex((prev) => prev + 1);
    } else {
      setActiveCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    soundService.playTap();
    if (activeCardIndex > 0) {
      setActiveCardIndex((prev) => prev - 1);
    } else {
      setActiveCardIndex(totalCards - 1);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-slate-50 text-slate-800 p-4 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => {
              soundService.playTap();
              navigateTo('station_intro', station.id);
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-transform"
          >
            <ChevronRight className="w-4 h-4" />
            <span>المحطة</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span
              className="px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: station.themeColor.light,
                color: station.themeColor.dark,
              }}
            >
              {station.name}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-500 font-mono">
            {activeCardIndex + 1} / {totalCards}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1 mb-4">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${((activeCardIndex + 1) / totalCards) * 100}%`,
              backgroundColor: station.themeColor.primary,
            }}
          />
        </div>
      </div>

      {/* Main FlashCard (Material 3 Card) */}
      <div className="my-auto py-2">
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-lg shadow-slate-200/50 relative overflow-hidden transition-all duration-300">
          {/* Top Card Badge / Status */}
          <div className="flex items-center justify-between mb-4">
            <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 font-mono">
              {activeCardIndex + 1}
            </span>

            {isCardRead ? (
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم إتقانها</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>+1 نجمة</span>
              </span>
            )}
          </div>

          {/* Card Emoji */}
          <div className="text-center my-3">
            <div
              className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-6xl shadow-md border-2 mb-3"
              style={{
                backgroundColor: station.themeColor.light,
                borderColor: station.themeColor.border,
              }}
            >
              {card.emoji}
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {card.title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm font-semibold text-slate-700 text-center leading-relaxed mb-4">
            {card.description}
          </p>

          {/* Practical Tip */}
          {card.practicalTip && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 text-right">
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-800 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>معلومة هندسية للمستقبل:</span>
              </div>
              <p className="text-xs font-medium text-slate-600 leading-normal">
                {card.practicalTip}
              </p>
            </div>
          )}

          {/* Action Button: ⭐ تعلّمت! */}
          <div className="mt-5">
            <button
              onClick={handleLearnToggle}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] cursor-pointer shadow-md ${
                isCardRead
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
                  : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-amber-400/30'
              }`}
            >
              {isCardRead ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ تعلّمتها بنجاح (اضغط للإلغاء)</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 fill-amber-950" />
                  <span>⭐ تعلّمت هذه المعلومة (+1 نجمة)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card Quick Dots Navigator */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {station.cards.map((c, idx) => {
            const isRead = !!readCards[`${station.id}-${idx}`];
            const isActive = idx === activeCardIndex;
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundService.playTap();
                  setActiveCardIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-blue-600'
                    : isRead
                    ? 'w-2.5 bg-emerald-400'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`البطاقة ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-2 pt-2">
        {/* Next / Previous Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevCard}
            className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <button
            onClick={handleNextCard}
            className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Go to Challenge Banner */}
        <button
          onClick={() => {
            soundService.playSuccess();
            navigateTo('station_activity', station.id);
          }}
          className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer ${
            allCardsRead
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>
            {allCardsRead
              ? '🎉 أتقنت كل البطاقات! انطلق للتحدي العملي'
              : 'خوض التحدي العملي للمحطة (+3 نجوم)'}
          </span>
        </button>
      </div>
    </div>
  );
};
