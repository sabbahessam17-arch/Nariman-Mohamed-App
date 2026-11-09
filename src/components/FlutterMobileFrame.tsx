import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';
import { downloadFlutterProjectZip } from '../data/flutterCodeSnippets';
import {
  MapPin,
  BookOpen,
  Gamepad2,
  Award,
  Code2,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  Signal,
  FolderArchive,
} from 'lucide-react';

interface FlutterMobileFrameProps {
  children: React.ReactNode;
}

export const FlutterMobileFrame: React.FC<FlutterMobileFrameProps> = ({ children }) => {
  const {
    currentScreen,
    navigateTo,
    user,
    deviceMode,
    setDeviceMode,
    setFlutterInspectorOpen,
    selectedStationId,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');

  // Live mobile status bar clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isLoginScreen = currentScreen === 'login';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Top Utility Bar on Desktop */}
      <div className="w-full max-w-[430px] hidden sm:flex items-center justify-between pb-3 px-2 text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">Flutter Project (lib/ + pubspec.yaml)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Switch Mode: Frame vs Full */}
          <button
            onClick={() => {
              soundService.playTap();
              setDeviceMode(deviceMode === 'phone_frame' ? 'full_screen' : 'phone_frame');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer text-[11px]"
            title="تبديل وضع العرض"
          >
            {deviceMode === 'phone_frame' ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>ملء الشاشة</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>إطار الهاتف</span>
              </>
            )}
          </button>

          {/* Download Flutter ZIP directly */}
          <button
            onClick={() => {
              soundService.playCelebration();
              downloadFlutterProjectZip();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer text-[11px] font-bold shadow-xs"
            title="تحميل مشروع Flutter كامل بصيغة ZIP"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>تحميل Flutter ZIP</span>
          </button>

          {/* Open Flutter Code */}
          <button
            onClick={() => {
              soundService.playTap();
              setFlutterInspectorOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer text-[11px] font-bold shadow-xs"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>ملفات Dart</span>
          </button>
        </div>
      </div>

      {/* Mobile Device Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col overflow-hidden ${
          deviceMode === 'phone_frame'
            ? 'sm:max-w-[412px] sm:h-[840px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-2xl sm:shadow-blue-900/30 sm:ring-1 sm:ring-slate-700/60'
            : 'max-w-md h-screen'
        } bg-slate-50`}
      >
        {/* Mobile Status Bar (Simulated Flutter StatusBar) */}
        <div className="h-10 bg-slate-900 text-slate-200 px-6 flex items-center justify-between text-xs font-mono font-medium shrink-0 z-30 select-none">
          {/* Time (LTR for phone status) */}
          <span className="font-semibold tracking-tight text-[11px] font-mono">
            {currentTime || '09:41'}
          </span>

          {/* Dynamic Island / Speaker Notch Pill */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto hidden sm:flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 ml-auto mr-1" />
          </div>

          {/* Icons: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Viewport Content */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>

        {/* Flutter Material 3 Bottom Navigation Bar */}
        {!isLoginScreen && user.isLoggedIn && (
          <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 grid grid-cols-5 items-center px-2 shrink-0 z-30 shadow-xs">
            {/* Home / Map Tab */}
            <button
              onClick={() => {
                soundService.playTap();
                navigateTo('map');
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'map'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  currentScreen === 'map' ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">الخريطة</span>
            </button>

            {/* Learn Cards Tab */}
            <button
              onClick={() => {
                soundService.playTap();
                navigateTo('station_cards', selectedStationId);
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'station_cards' || currentScreen === 'station_intro'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  currentScreen === 'station_cards' || currentScreen === 'station_intro'
                    ? 'bg-blue-100 text-blue-700'
                    : ''
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">البطاقات</span>
            </button>

            {/* Challenge Tab */}
            <button
              onClick={() => {
                soundService.playTap();
                navigateTo('station_activity', selectedStationId);
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'station_activity' || currentScreen === 'station_done'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  currentScreen === 'station_activity' || currentScreen === 'station_done'
                    ? 'bg-blue-100 text-blue-700'
                    : ''
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">التحدي</span>
            </button>

            {/* Certificate Tab */}
            <button
              onClick={() => {
                soundService.playStar();
                navigateTo('certificate');
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'certificate'
                  ? 'text-amber-600 font-black'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  currentScreen === 'certificate' ? 'bg-amber-100 text-amber-700' : ''
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">الشهادة</span>
            </button>

            {/* Flutter Code Tab */}
            <button
              onClick={() => {
                soundService.playTap();
                setFlutterInspectorOpen(true);
              }}
              className="flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-slate-400 hover:text-blue-600 font-semibold transition-all cursor-pointer"
            >
              <div className="p-1 rounded-full">
                <Code2 className="w-4 h-4 text-cyan-600" />
              </div>
              <span className="text-[10px] tracking-tight">كود فلاتر</span>
            </button>
          </nav>
        )}

        {/* Home Indicator Bar (iOS/Android gesture bar) */}
        <div className="h-4 bg-white flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
