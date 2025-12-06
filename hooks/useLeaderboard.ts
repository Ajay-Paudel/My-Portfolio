import { useState, useEffect, useCallback } from 'react';
import { 
  ref, 
  onValue, 
  set, 
  get, 
  query, 
  orderByChild, 
  limitToLast, 
  update, 
  remove,
  startAt,
  endAt,
  equalTo
} from 'firebase/database';
import { database } from '../firebase';

const USER_ID_KEY = 'portfolio_leaderboard_uid';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}

export const useLeaderboard = () => {
  const [userId, setUserId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Initialize User ID
  useEffect(() => {
    let storedId = localStorage.getItem(USER_ID_KEY);
    if (!storedId) {
      storedId = crypto.randomUUID ? crypto.randomUUID() : `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, storedId);
    }
    setUserId(storedId);
  }, []);

  // Fetch Leaderboard (Realtime)
  useEffect(() => {
    if (!database) return;

    const leaderboardRef = query(ref(database, 'leaderboard'), orderByChild('score'), limitToLast(100));
    
    const unsubscribe = onValue(leaderboardRef, (snapshot) => {
      const data: LeaderboardEntry[] = [];
      snapshot.forEach((child) => {
        data.push({ id: child.key as string, ...child.val() });
      });
      // Firebase returns ascending order (low to high), we want Descending (high to low)
      const sorted = data.reverse();
      setLeaderboard(sorted);
      setLoading(false);

      // Find user rank
      if (userId) {
        const index = sorted.findIndex(entry => entry.id === userId);
        setUserRank(index !== -1 ? index + 1 : null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const submitScore = useCallback(async (name: string, score: number) => {
    if (!database || !userId) return { success: false, message: 'Database not ready' };
    
    const cleanName = name.trim().slice(0, 15); // limit name length
    if (!cleanName) return { success: false, message: 'Invalid name' };

    try {
      // 1. Check if name is taken by someone else
      // Note: This requires a query. In a real app we'd use a separate /usernames path for atomic checks.
      // For this frontend-only scope, we'll traverse the top 100 or do a query if rules allow.
      // Let's do a quick query on 'leaderboard' by name.
      const nameQuery = query(ref(database, 'leaderboard'), orderByChild('name'), equalTo(cleanName));
      const nameSnapshot = await get(nameQuery);
      
      let nameTaken = false;
      nameSnapshot.forEach((child) => {
        if (child.key !== userId) {
          nameTaken = true;
        }
      });

      if (nameTaken) {
        return { success: false, message: `Name "${cleanName}" is already taken.` };
      }

      // 2. Submit Score
      await set(ref(database, `leaderboard/${userId}`), {
        name: cleanName,
        score: score,
        updatedAt: Date.now()
      });

      // 3. Optional: Cleanup falls out of top 100
      // We fetched "limitToLast(100)". If we want to strictly keep DB small, we'd need to fetch 101 and delete the first.
      // But standard "limitToLast" query just gives us the view. 
      // Deleting data requires we know the KEY of the 101th item.
      // Let's rely on the query limit for display. Deletion is risky without backend auth.

      return { success: true, message: 'Score submitted!' };

    } catch (error: any) {
      console.error("Submit Score Error:", error);
      return { success: false, message: error.message || 'Failed to submit score.' };
    }
  }, [userId]);

  return { userId, leaderboard, loading, userRank, submitScore };
};
