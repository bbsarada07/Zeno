import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { AuthGatewayPage } from './components/auth/AuthGatewayPage';
import { ConsoleDashboard } from './components/dashboard/ConsoleDashboard';

const MainApp: React.FC = () => {
  const { authSession } = useApp();

  return (
    <AnimatePresence mode="wait">
      {authSession?.isAuthenticated ? (
        <motion.div
          key="dashboard-workspace"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="h-screen w-screen overflow-hidden"
        >
          <ConsoleDashboard />
        </motion.div>
      ) : (
        <motion.div
          key="auth-gateway-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen overflow-hidden"
        >
          <AuthGatewayPage />
        </motion.div>
      )}
    </AnimatePresence>
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
