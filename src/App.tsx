/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FlutterMobileFrame } from './components/FlutterMobileFrame';
import { LoginScreen } from './screens/LoginScreen';
import { RoadmapScreen } from './screens/RoadmapScreen';
import { StationIntroScreen } from './screens/StationIntroScreen';
import { CardsViewScreen } from './screens/CardsViewScreen';
import { ActivityGameScreen } from './screens/ActivityGameScreen';
import { StationDoneScreen } from './screens/StationDoneScreen';
import { CertificateScreen } from './screens/CertificateScreen';
import { FlutterCodeInspector } from './components/FlutterCodeInspector';

const MainScreenRouter: React.FC = () => {
  const { currentScreen, flutterInspectorOpen, setFlutterInspectorOpen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'map':
        return <RoadmapScreen />;
      case 'station_intro':
        return <StationIntroScreen />;
      case 'station_cards':
        return <CardsViewScreen />;
      case 'station_activity':
        return <ActivityGameScreen />;
      case 'station_done':
        return <StationDoneScreen />;
      case 'certificate':
        return <CertificateScreen />;
      default:
        return <RoadmapScreen />;
    }
  };

  return (
    <>
      <FlutterMobileFrame>{renderScreen()}</FlutterMobileFrame>
      <FlutterCodeInspector
        isOpen={flutterInspectorOpen}
        onClose={() => setFlutterInspectorOpen(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreenRouter />
    </AppProvider>
  );
}
