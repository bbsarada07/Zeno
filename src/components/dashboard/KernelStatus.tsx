import React, { useEffect, useState } from 'react';
import { Activity, Radio, Cpu, RefreshCw } from 'lucide-react';
import { apiClient } from '../../lib/api';

export const KernelStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performHealthCheck = async () => {
      setIsChecking(true);
      const online = await apiClient.checkHealth();
      setIsOnline(online);
      setIsChecking(false);

      if (!online) {
        // If Render backend is sleeping or warming up, poll every 4 seconds
        timer = setTimeout(performHealthCheck, 4000);
      } else {
        // Re-check periodically every 30 seconds
        timer = setTimeout(performHealthCheck, 30000);
      }
    };

    performHealthCheck();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 font-mono text-xs font-bold select-none transition-all">
      {isOnline ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 dark:text-emerald-400 html-light:text-emerald-700 tracking-wider">
            KERNEL ONLINE // ZENO-K3K0
          </span>
        </>
      ) : (
        <>
          {isChecking ? (
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          ) : (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          )}
          <span className="text-amber-400 dark:text-amber-400 html-light:text-amber-700 tracking-wider">
            NEURAL KERNEL WARMING UP
          </span>
        </>
      )}
    </div>
  );
};
