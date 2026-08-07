import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertTriangle, ShieldCheck, MapPin, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationDrawerOpen, setIsNotificationDrawerOpen } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'HITL Action Awaiting Review',
      message: 'Medical Attendance Shortage Waiver Petition ready for HOD signoff.',
      timestamp: '5 mins ago',
      type: 'hitl',
    },
    {
      id: 'notif-[#2]',
      title: 'Google Placement Drive Eligible',
      message: 'Alex Rivera matched 94% skills for Google Software Engineer - AI Systems (L3).',
      timestamp: '30 mins ago',
      type: 'placement',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-y-0 right-0 max-w-sm w-full bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between text-foreground"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Bell className="w-4 h-4 text-primary" />
                <span>Executive Governance Notifications</span>
              </div>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-background border border-border space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="w-full py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl"
          >
            Close Panel
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
