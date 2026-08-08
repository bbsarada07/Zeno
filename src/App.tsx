import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { ZenoSplashLanding } from './components/auth/ZenoSplashLanding';
import { AuthGatewayPage } from './components/auth/AuthGatewayPage';
import { ConsoleDashboard } from './components/dashboard/ConsoleDashboard';

const MainApp: React.FC = () => {
  const { authSession } = useApp();
  const [hasEnteredLanding, setHasEnteredLanding] = useState<boolean>(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05070A] transition-colors duration-300">
      <AnimatePresence mode="wait">
        {authSession?.isAuthenticated ? (
          <motion.div
            key="dashboard-workspace"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen w-screen overflow-hidden"
          >
            <ConsoleDashboard />
          </motion.div>
        ) : !hasEnteredLanding ? (
          <motion.div
            key="landing-splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen w-screen overflow-hidden"
          >
            <ZenoSplashLanding onEnter={() => setHasEnteredLanding(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="auth-gateway-screen"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen w-screen overflow-hidden"
          >
            <AuthGatewayPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
