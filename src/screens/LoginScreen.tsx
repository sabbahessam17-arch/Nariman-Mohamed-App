import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVATARS } from '../data/engineeringData';
import { soundService } from '../services/soundService';
import { Sparkles, ArrowLeft, Volume2, VolumeX, ShieldCheck, Compass, Trophy, Gamepad2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, guestLogin, isMuted, toggleSound } = useApp();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setHasError(true);
      soundService.playError();
      return;
    }
    login(name.trim(), selectedAvatar);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between bg-gradient-to-b from-blue-50 via-slate-50 to-blue-100/50 p-5 text-slate-800 overflow-y-auto no-scrollbar">
      {/* Top Bar with Sound Toggle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <span className="font-black text-blue-700 text-lg tracking-tight">مهندس المستقبل</span>
        </div>
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
          aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
        </button>
      </div>

      {/* Main Card */}
      <div className="my-auto py-4">
        {/* Animated Avatar Bubble */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-5xl shadow-xl shadow-blue-500/25 border-4 border-white animate-bounce">
              {selectedAvatar}
            </div>
            <div className="absolute -bottom-2 -left-2 bg-amber-400 text-amber-950 p-1.5 rounded-full border-2 border-white shadow">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            مرحباً بك في عالم <span className="text-blue-600">الهندسة</span>!
          </h1>
          <p className="text-sm font-medium text-slate-500">
            اختر شخصيتك واكتب اسمك لتبدأ رحلتك التفاعلية
          </p>
        </div>

        {/* Avatar Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 mb-2 text-center">
            اختر صورتك الرمزية (Avatar)
          </label>
          <div className="flex justify-center gap-2 flex-wrap">
            {AVATARS.map((av) => {
              const isSelected = av === selectedAvatar;
              return (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(av);
                    soundService.playPick();
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-110 ring-4 ring-blue-100'
                      : 'bg-white border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {av}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المهندس الصغير
            </label>
            <div className="relative">
              <input
                id="name-input"
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (hasError) setHasError(false);
                }}
                placeholder="اكتب اسمك هنا (مثال: أحمد)"
                className={`w-full h-13 px-4 rounded-2xl bg-white border-2 text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  hasError
                    ? 'border-rose-500 ring-4 ring-rose-100 animate-pulse'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                }`}
              />
            </div>
            {hasError && (
              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                <span>⚠️</span> يرجى كتابة اسمك قبل المتابعة!
              </p>
            )}
          </div>

          {/* Primary Action Button (Flutter ElevatedButton style) */}
          <button
            type="submit"
            className="w-full h-13 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>ابدأ الرحلة الهندسية</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>

          {/* Guest Button (Flutter TextButton style) */}
          <button
            type="button"
            onClick={guestLogin}
            className="w-full py-2.5 text-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            المتابعة كضيف سريع
          </button>
        </form>
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 pt-2 pb-1">
        <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-slate-200/70">
          <Gamepad2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ألعاب سحب وإفلات</span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-slate-200/70">
          <Compass className="w-4 h-4 text-blue-600 shrink-0" />
          <span>٥ محطات استكشافية</span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-slate-200/70">
          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
          <span>شهادة إنجاز معتمدة</span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-slate-200/70">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>تطبيق فلاتر تفاعلي</span>
        </div>
      </div>
    </div>
  );
};
