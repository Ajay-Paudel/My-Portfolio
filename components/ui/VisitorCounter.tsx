import React, { useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  push, 
  onDisconnect, 
  set, 
  serverTimestamp,
  increment,
  runTransaction
} from 'firebase/database';
import { Users, Eye } from 'lucide-react';
import { FIREBASE_CONFIG } from '../../constants';

// Initialize Firebase only once
let app;
let db: any;

try {
  if (getApps().length === 0) {
    app = initializeApp(FIREBASE_CONFIG);
  } else {
    app = getApp();
  }
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const VisitorCounter = () => {
  const [onlineUsers, setOnlineUsers] = useState<number>(1);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!db) return;

    // References
    const connectionsRef = ref(db, 'visitors/connections');
    const lastOnlineRef = ref(db, 'visitors/connections');
    const totalVisitsRef = ref(db, 'visitors/total');
    const connectedRef = ref(db, '.info/connected');

    // 1. Monitor connection state
    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)!
        
        // Create a reference to this user's specific connection
        const con = push(connectionsRef);

        // When I disconnect, remove this device
        onDisconnect(con).remove();

        // Add this device to our connections list
        set(con, {
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent
        });
        
        // Handle "Total Visits" - Using a transaction to ensure accuracy
        // Only increment if we haven't counted this session yet
        const sessionKey = 'has_visited_portfolio';
        if (!sessionStorage.getItem(sessionKey)) {
            runTransaction(totalVisitsRef, (currentTotal) => {
                return (currentTotal || 0) + 1;
            }).then(() => {
                sessionStorage.setItem(sessionKey, 'true');
            });
        }
      }
    });

    // 2. Count online users
    // Just counting the number of child nodes in 'visitors/connections'
    const unsubscribeOnline = onValue(connectionsRef, (snap) => {
      setOnlineUsers(snap.size || 1);
    });

    // 3. Monitor total visits
    const unsubscribeTotal = onValue(totalVisitsRef, (snap) => {
      setTotalVisits(snap.val() || 0);
    });

    return () => {
      unsubscribeConnected();
      unsubscribeOnline();
      unsubscribeTotal();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-2 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2" title="Users currently online">
        <div className="relative">
          <Users className="w-4 h-4 text-green-500" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">{onlineUsers}</span> Online
        </span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-600"></div>

      <div className="flex items-center gap-2" title="Total unique visits">
        <Eye className="w-4 h-4 text-brand-indigo" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">{totalVisits.toLocaleString()}</span> Visits
        </span>
      </div>
    </div>
  );
};

export default VisitorCounter;
