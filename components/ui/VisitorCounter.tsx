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

export const VisitorCounter: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // If we already detected an error (like permission denied), don't try again
    if (error) return;

    try {
      // References
      const connectedRef = ref(database, '.info/connected');
      const connectionsRef = ref(database, 'visitors/connections');
      const totalVisitsRef = ref(database, 'visitors/total');

      // Handle presence (online users)
      const unsubscribeConnected = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          const con = push(connectionsRef);
          
          // When I disconnect, remove this device
          onDisconnect(con).remove().catch(err => {
             if (err.code === 'PERMISSION_DENIED') setError(true);
          });

          // Add this device to the connections list
          set(con, {
            joined: serverTimestamp(),
            agent: navigator.userAgent
          }).catch(err => {
             if (err.code === 'PERMISSION_DENIED') setError(true);
          });
        }
      }, (err) => {
        console.error("Firebase Connected Error:", err);
        if (err.message.includes('permission_denied')) setError(true);
      });

      // Count online users
      const unsubscribeOnline = onValue(connectionsRef, (snap) => {
        setOnlineCount(snap.size);
      }, (err) => {
         if (err.message.includes('permission_denied')) setError(true);
      });

      // Increment total visits (transactional)
      const sessionKey = 'portfolio_visit_session';
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, 'true');
        runTransaction(totalVisitsRef, (currentVisits) => {
          return (currentVisits || 0) + 1;
        }).catch(err => {
          if (err.message.includes('permission_denied')) setError(true);
        });
      }

      // Read total visits
      const unsubscribeTotal = onValue(totalVisitsRef, (snap) => {
        setTotalVisits(snap.val() || 0);
      }, (err) => {
        if (err.message.includes('permission_denied')) setError(true);
      });

      return () => {
        unsubscribeConnected();
        unsubscribeOnline();
        unsubscribeTotal();
      };
    } catch (err) {
      console.error("VisitorCounter Setup Error:", err);
      setError(true);
    }
  }, [error]);

  if (error) {
    // Fallback UI or return null to hide
    return null; 
  }

  return (
    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1.5" title="Online Users">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="font-semibold">{onlineCount}</span>
        <span className="hidden sm:inline">online</span>
      </div>
      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
      <div className="flex items-center gap-1.5" title="Total Visits">
        <Eye className="w-3 h-3" />
        <span className="font-semibold">{totalVisits.toLocaleString()}</span>
        <span className="hidden sm:inline">visits</span>
      </div>
    </div>
  );
export default VisitorCounter;
