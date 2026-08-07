import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthGatewayPage } from './components/auth/AuthGatewayPage';
import { ConsoleDashboard } from './components/dashboard/ConsoleDashboard';

const MainApp: React.FC = () => {
  const { authSession, isLoggingOut } = useApp();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05070A]">
      {/* SESSION TERMINATION OVERLAY TOAST */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#05070A]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-rose-400 font-mono space-y-4 select-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <Loader2 className="w-7 h-7 text-rose-400 animate-spin" />
            </div>

            <div className="text-center space-y-1">
              <div className="text-sm font-extrabold tracking-widest text-white uppercase flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>TERMINATING ENCRYPTED SESSION</span>
              </div>
              <div className="text-xs text-rose-400/80 font-mono">
                CLEARING ENCLAVE MEMORY // REVOKING ED25519 TOKENS...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
