import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS_DATA, ActivityItem } from '../data/engineeringData';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';
import {
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Trophy,
  RotateCcw,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';

export const ActivityGameScreen: React.FC = () => {
  const {
    selectedStationId,
    completeActivity,
    completedActivities,
    navigateTo,
  } = useApp();

  const station = STATIONS_DATA[selectedStationId] || STATIONS_DATA[0];
  const act = station.activity;
  const isOrdering = act.type === 'ordering';

  // State for classification
  const [unplacedItems, setUnplacedItems] = useState<ActivityItem[]>([]);
  const [placedZones, setPlacedZones] = useState<Record<number, ActivityItem[]>>({});
  
  // State for ordering
  const [orderingPlaced, setOrderingPlaced] = useState<string[]>([]);
  const [orderingRemaining, setOrderingRemaining] = useState<string[]>([]);

  // Selection state for mobile tap-to-place
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ text: string; type: 'idle' | 'success' | 'error' }>({
    text: isOrdering
      ? 'اضغط على الخطوة المناسبة أو اسحبها إلى الخانة بالترتيب'
      : 'اضغط على البطاقة ثم اضغط على التصنيف المناسب (أو اسحبها)',
    type: 'idle',
  });

  const [shakingZone, setShakingZone] = useState<number | null>(null);
  const isAlreadyCompleted = !!completedActivities[station.id];

  // Initialize or reset game
  const initGame = () => {
    if (isOrdering && act.order) {
      // Shuffle ordering items
      const shuffled = [...act.order].sort(() => Math.random() - 0.5);
      setOrderingRemaining(shuffled);
      setOrderingPlaced([]);
    } else if (act.items) {
      // Shuffle classification items
      const shuffled = [...act.items].sort(() => Math.random() - 0.5);
      setUnplacedItems(shuffled);
      const initialZones: Record<number, ActivityItem[]> = {};
      act.zones?.forEach((_, idx) => {
        initialZones[idx] = [];
      });
      setPlacedZones(initialZones);
    }
    setSelectedItem(null);
    setSelectedOrderItem(null);
    setFeedback({
      text: isOrdering
        ? 'رتّب خطوات التفكير الهندسي من الخطوة الأولى إلى الأخيرة'
        : 'اختر البطاقة ثم حدد مكانها الصحيح',
      type: 'idle',
    });
  };

  useEffect(() => {
    initGame();
  }, [station.id]);

  // Check completion
  const checkCompletion = (remainingCount: number) => {
    if (remainingCount === 0) {
      soundService.playCelebration();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#F59E0B', '#10B981', '#EC4899', '#7C3AED'],
      });
      setFeedback({
        text: '🎉 رائع جداً! أنهيت التحدي بنجاح تام وحصلت على ٣ نجوم ⭐⭐⭐',
        type: 'success',
      });
      completeActivity(station.id);
    }
  };

  // Handle classification drop or tap-place
  const handlePlaceClassification = (item: ActivityItem, zoneIndex: number) => {
    if (item.targetZoneIndex === zoneIndex) {
      // Correct!
      soundService.playSuccess();
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.5 },
      });

      setUnplacedItems((prev) => {
        const next = prev.filter((i) => i.id !== item.id);
        checkCompletion(next.length);
        return next;
      });

      setPlacedZones((prev) => ({
        ...prev,
        [zoneIndex]: [...(prev[zoneIndex] || []), item],
      }));

      setSelectedItem(null);
      setFeedback({
        text: 'أحسنت! إجابة هندسية صحيحة 👏',
        type: 'success',
      });
    } else {
      // Wrong!
      soundService.playError();
      setShakingZone(zoneIndex);
      setTimeout(() => setShakingZone(null), 500);
      setFeedback({
        text: 'مكان غير مناسب، فكّر مجدداً وجرّب خياراً آخر 🤔',
        type: 'error',
      });
    }
  };

  // Handle ordering placement
  const handlePlaceOrder = (step: string) => {
    const currentStepIndex = orderingPlaced.length;
    const correctStep = act.order?.[currentStepIndex];

    if (step === correctStep) {
      soundService.playSuccess();
      const nextPlaced = [...orderingPlaced, step];
      const nextRemaining = orderingRemaining.filter((s) => s !== step);
      setOrderingPlaced(nextPlaced);
      setOrderingRemaining(nextRemaining);
      setSelectedOrderItem(null);

      checkCompletion(nextRemaining.length);
      setFeedback({
        text: 'ممتاز! خطوة صحيحة في الترتيب الهندسي 👍',
        type: 'success',
      });
    } else {
      soundService.playError();
      setFeedback({
        text: `ليست هذه الخطوة رقم ${currentStepIndex + 1}! حاول مرة أخرى.`,
        type: 'error',
      });
    }
  };

  const isAllDone = isOrdering
    ? orderingRemaining.length === 0
    : unplacedItems.length === 0;

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-slate-50 text-slate-800 p-4 overflow-y-auto no-scrollbar">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => {
              soundService.playTap();
              navigateTo('station_cards', station.id);
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-transform"
          >
            <ChevronRight className="w-4 h-4" />
            <span>البطاقات</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              تحدي {station.name}
            </span>
          </div>

          <button
            onClick={initGame}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            title="إعادة بدء التحدي"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs text-center mb-3">
          <h2 className="text-sm font-black text-slate-900 leading-snug">
            {act.question}
          </h2>
          <div
            className={`text-xs font-bold mt-1 transition-colors ${
              feedback.type === 'success'
                ? 'text-emerald-600'
                : feedback.type === 'error'
                ? 'text-rose-600'
                : 'text-blue-600'
            }`}
          >
            {feedback.text}
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="my-auto py-1">
        {isOrdering ? (
          /* Ordering Challenge Arena */
          <div className="space-y-3">
            {/* Target Slots */}
            <div className="space-y-2">
              {act.order?.map((_, idx) => {
                const placedItem = orderingPlaced[idx];
                const isNextSlot = idx === orderingPlaced.length;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 transition-all ${
                      placedItem
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : isNextSlot
                        ? 'bg-blue-50/70 border-dashed border-blue-400 animate-pulse'
                        : 'bg-white border-dashed border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        placedItem
                          ? 'bg-emerald-600 text-white'
                          : isNextSlot
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-xs font-bold truncate">
                      {placedItem ? (
                        <span className="flex items-center gap-1.5 text-slate-900 font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{placedItem}</span>
                        </span>
                      ) : isNextSlot ? (
                        <span className="text-blue-600 font-bold">
                          {selectedOrderItem
                            ? `اضغط هنا لوضع: ${selectedOrderItem}`
                            : 'اختر الخطوة التالية من الأسفل'}
                        </span>
                      ) : (
                        <span>الخطوة رقم {idx + 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remaining ordering chips */}
            {orderingRemaining.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-slate-200 shadow-xs mt-3">
                <div className="text-[11px] font-bold text-slate-400 mb-2">
                  الخيارات المتاحة (اضغط على الخطوة التالية):
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {orderingRemaining.map((step) => {
                    return (
                      <button
                        key={step}
                        onClick={() => handlePlaceOrder(step)}
                        className="py-2 px-3.5 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-xl text-xs font-black text-blue-900 shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        {step}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Classification Challenge Arena */
          <div className="space-y-3">
            {/* Zones */}
            <div className="grid grid-cols-1 gap-2.5">
              {act.zones?.map((zone, zIdx) => {
                const itemsInZone = placedZones[zIdx] || [];
                const isShaking = shakingZone === zIdx;
                const isSelected = selectedItem !== null;

                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      if (selectedItem) {
                        handlePlaceClassification(selectedItem, zIdx);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      try {
                        const raw = e.dataTransfer.getData('text/plain');
                        const data: ActivityItem = JSON.parse(raw);
                        handlePlaceClassification(data, zIdx);
                      } catch {}
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      isShaking ? 'animate-bounce border-rose-500 bg-rose-50' : ''
                    } ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50/50 hover:bg-blue-100/60 cursor-pointer ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs text-slate-800">
                        <span className="text-base">{zone.icon}</span>
                        <span>{zone.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {itemsInZone.length} عناصر
                      </span>
                    </div>

                    {/* Placed chips inside zone */}
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                      {itemsInZone.length === 0 ? (
                        <span className="text-[11px] font-medium text-slate-300 italic">
                          {isSelected ? 'اضغط هنا لوضع البطاقة المحددة' : 'فارغ'}
                        </span>
                      ) : (
                        itemsInZone.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-200 animate-in fade-in"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{item.text}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remaining items to classify */}
            {unplacedItems.length > 0 && (
              <div className="bg-white/90 backdrop-blur rounded-2xl p-3 border border-slate-200 shadow-xs mt-3">
                <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
                  <span>البطاقات المتبقية:</span>
                  <span className="text-blue-600 font-semibold text-[10px]">
                    (اضغط على بطاقة ثم اضغط على تصنيفها أعلاه)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center">
                  {unplacedItems.map((item) => {
                    const isPicked = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify(item));
                          soundService.playPick();
                        }}
                        onClick={() => {
                          soundService.playPick();
                          setSelectedItem(isPicked ? null : item);
                          setFeedback({
                            text: isPicked
                              ? 'اختر بطاقة لتصنيفها'
                              : `حددت "${item.text}"، الآن اضغط على التصنيف المناسب أعلاه 👆`,
                            type: 'idle',
                          });
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-black border-2 cursor-grab active:cursor-grabbing transition-all select-none ${
                          isPicked
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105 ring-2 ring-blue-300'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 shadow-xs'
                        }`}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA / Finished Banner */}
      <div className="pt-2">
        {isAllDone ? (
          <button
            onClick={() => {
              soundService.playCelebration();
              navigateTo('station_done', station.id);
            }}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-300" />
            <span>عرض نتائج المحطة والانتقال للتالي</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        ) : (
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>أكمل جميع العناصر لتحصل على علامة التفوق</span>
            </span>
            <span className="font-mono text-slate-400">
              {isOrdering
                ? `${orderingPlaced.length}/${act.order?.length}`
                : `${(act.items?.length || 0) - unplacedItems.length}/${act.items?.length}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
