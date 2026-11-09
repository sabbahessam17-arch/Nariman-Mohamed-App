import React, { createContext, useContext, useState, useEffect } from 'react';
import { STATIONS_DATA } from '../data/engineeringData';
import { soundService } from '../services/soundService';

export type ScreenType =
  | 'login'
  | 'map'
  | 'station_intro'
  | 'station_cards'
  | 'station_activity'
  | 'station_done'
  | 'certificate'
  | 'flutter_code';

export interface UserProfile {
  name: string;
  avatar: string;
  isLoggedIn: boolean;
}

interface AppContextType {
  user: UserProfile;
  currentScreen: ScreenType;
  selectedStationId: number;
  readCards: Record<string, boolean>;
  completedActivities: Record<number, boolean>;
  totalStars: number;
  maxStars: number;
  isMuted: boolean;
  deviceMode: 'phone_frame' | 'full_screen';
  flutterInspectorOpen: boolean;
  setFlutterInspectorOpen: (open: boolean) => void;
  setDeviceMode: (mode: 'phone_frame' | 'full_screen') => void;
  login: (name: string, avatar: string) => void;
  guestLogin: () => void;
  logout: () => void;
  navigateTo: (screen: ScreenType, stationId?: number) => void;
  toggleCardRead: (stationId: number, cardIndex: number) => boolean;
  completeActivity: (stationId: number) => void;
  toggleSound: () => void;
  resetProgress: () => void;
  isStationDone: (stationId: number) => boolean;
  getStationReadCount: (stationId: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'future_engineer_flutter_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.user.isLoggedIn) {
          return parsed.user;
        }
      }
    } catch {}
    return { name: '', avatar: '👷‍♀️', isLoggedIn: false };
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.user.isLoggedIn) {
          return 'map';
        }
      }
    } catch {}
    return 'login';
  });

  const [selectedStationId, setSelectedStationId] = useState<number>(0);
  const [readCards, setReadCards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.readCards || {};
      }
    } catch {}
    return {};
  });

  const [completedActivities, setCompletedActivities] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedActivities || {};
      }
    } catch {}
    return {};
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => soundService.isMuted());
  const [deviceMode, setDeviceMode] = useState<'phone_frame' | 'full_screen'>('phone_frame');
  const [flutterInspectorOpen, setFlutterInspectorOpen] = useState<boolean>(false);

  // Calculate stars
  const totalStars =
    Object.keys(readCards).filter((k) => readCards[k]).length +
    Object.keys(completedActivities).filter((k) => completedActivities[Number(k)]).length * 3;

  const maxStars = STATIONS_DATA.reduce((sum, s) => sum + s.cards.length + 3, 0);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          readCards,
          completedActivities,
        })
      );
    } catch {}
  }, [user, readCards, completedActivities]);

  const login = (name: string, avatar: string) => {
    const trimmed = name.trim() || 'مهندس صغير';
    const profile = { name: trimmed, avatar, isLoggedIn: true };
    setUser(profile);
    setCurrentScreen('map');
    soundService.playSuccess();
  };

  const guestLogin = () => {
    login('مهندس المستقبل', '👷‍♂️');
  };

  const logout = () => {
    setUser({ name: '', avatar: '👷‍♀️', isLoggedIn: false });
    setCurrentScreen('login');
    soundService.playTap();
  };

  const navigateTo = (screen: ScreenType, stationId?: number) => {
    if (typeof stationId === 'number') {
      setSelectedStationId(stationId);
    }
    setCurrentScreen(screen);
    soundService.playTap();
  };

  const toggleCardRead = (stationId: number, cardIndex: number): boolean => {
    const key = `${stationId}-${cardIndex}`;
    const newState = !readCards[key];
    setReadCards((prev) => ({
      ...prev,
      [key]: newState,
    }));

    if (newState) {
      soundService.playStar();
    } else {
      soundService.playTap();
    }
    return newState;
  };

  const completeActivity = (stationId: number) => {
    setCompletedActivities((prev) => ({
      ...prev,
      [stationId]: true,
    }));
    soundService.playCelebration();
  };

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const resetProgress = () => {
    setReadCards({});
    setCompletedActivities({});
    soundService.playTap();
  };

  const isStationDone = (stationId: number): boolean => {
    const station = STATIONS_DATA[stationId];
    if (!station) return false;
    const cardsDone = station.cards.every((_, idx) => !!readCards[`${stationId}-${idx}`]);
    const actDone = !!completedActivities[stationId];
    return cardsDone && actDone;
  };

  const getStationReadCount = (stationId: number): number => {
    const station = STATIONS_DATA[stationId];
    if (!station) return 0;
    return station.cards.filter((_, idx) => !!readCards[`${stationId}-${idx}`]).length;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentScreen,
        selectedStationId,
        readCards,
        completedActivities,
        totalStars,
        maxStars,
        isMuted,
        deviceMode,
        flutterInspectorOpen,
        setFlutterInspectorOpen,
        setDeviceMode,
        login,
        guestLogin,
        logout,
        navigateTo,
        toggleCardRead,
        completeActivity,
        toggleSound,
        resetProgress,
        isStationDone,
        getStationReadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
