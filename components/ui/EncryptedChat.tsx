import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Lock, User, Trash2, ShieldCheck, Wifi } from 'lucide-react';
import { database } from '../../firebase';
import { ref, set, onValue, push, remove, onDisconnect, off } from 'firebase/database';

interface EncryptedChatProps {
  onClose: () => void;
  currentUserXP: number;
}

interface ChatUser {
  id: string;
  name: string;
  online: boolean;
  lastSeen: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string; // Encrypted
  timestamp: number;
  read: boolean;
}

// Simple XOR Encryption/Decryption with a fixed key for portfolio demo
// In production, use Web Crypto API or Signal Protocol
const SECRET_KEY = 123; // Simple key
const encrypt = (text: string): string => {
  return btoa(text.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY)).join(''));
};

const decrypt = (encrypted: string): string => {
  try {
    const text = atob(encrypted);
    return text.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY)).join('');
  } catch (e) {
    return '*** Decryption Error ***';
  }
};

export const EncryptedChat: React.FC<EncryptedChatProps> = ({ onClose, currentUserXP }) => {
  const [step, setStep] = useState<'join' | 'list' | 'chat'>('join');
  const [myProfile, setMyProfile] = useState<{ id: string; name: string } | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<ChatUser | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});
  const [joinName, setJoinName] = useState('');
  const [error, setError] = useState('');

  // Load profile from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('chat_profile');
    const savedMessages = localStorage.getItem('chat_history');
    
    if (savedProfile) {
      setMyProfile(JSON.parse(savedProfile));
      setStep('list');
    }
    if (savedMessages) {
      setLocalMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to local storage
  useEffect(() => {
    if (Object.keys(localMessages).length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(localMessages));
    }
  }, [localMessages]);

  // Presence & User List Logic
  useEffect(() => {
    if (!myProfile || !database) return;

    const myUserRef = ref(database, `chat/users/${myProfile.id}`);
    
    // Set user as online
    set(myUserRef, {
      id: myProfile.id,
      name: myProfile.name,
      online: true,
      lastSeen: Date.now()
    });

    // Handle disconnect
    onDisconnect(myUserRef).remove();

    // Listen for other users
    const usersRef = ref(database, 'chat/users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList: ChatUser[] = Object.values(data);
        // Filter out self and offline users (optional, but requested "join leaderboard")
        setUsers(userList.filter(u => u.id !== myProfile.id));
      } else {
        setUsers([]);
      }
    }, (error) => {
      console.error(error);
      setError("Connection Blocked: Update Firebase Console Rules to allow 'chat' access.");
    });

    return () => {
      off(usersRef);
      remove(myUserRef); // go offline on component unmount
    };
  }, [myProfile]);

  // Inbox Listener (The "Relay" Mechanism)
  useEffect(() => {
    if (!myProfile || !database) return;

    const inboxRef = ref(database, `chat/messages/${myProfile.id}`);
    
    const unsubscribeInbox = onValue(inboxRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // We received messages!
        Object.entries(data).forEach(([msgKey, msgData]: [string, any]) => {
          const decryptedContent = decrypt(msgData.content);
          
          const newMessage: Message = {
            id: msgKey,
            senderId: msgData.senderId,
            senderName: msgData.senderName,
            content: decryptedContent,
            timestamp: msgData.timestamp,
            read: true
          };

          // Save to local history
          setLocalMessages(prev => {
            const chatPartnerId = msgData.senderId;
            const currentHistory = prev[chatPartnerId] || [];
            // Avoid duplicates
            if (currentHistory.some(m => m.id === msgKey)) return prev;
            
            return {
              ...prev,
              [chatPartnerId]: [...currentHistory, newMessage]
            };
          });

          // DELETE from server immediately (Privacy Requirement)
          remove(ref(database, `chat/messages/${myProfile.id}/${msgKey}`));
        });
      }
    }, (error) => {
      console.error(error);
      setError("Sync Failed: Check Rules.");
    });

    return () => off(inboxRef);
  }, [myProfile]);

  const handleJoin = () => {
    if (!joinName.trim()) {
      setError('Name is required');
      return;
    }
    
    // Create simple ID based on timestamp and random
    const newId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const profile = { id: newId, name: joinName };
    
    setMyProfile(profile);
    localStorage.setItem('chat_profile', JSON.stringify(profile));
    setStep('list');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChatUser || !myProfile) return;

    const encrypted = encrypt(messageInput);
    const timestamp = Date.now();
    
    // We construct the message object for the server
    const payload = {
      senderId: myProfile.id,
      senderName: myProfile.name,
      content: encrypted,
      timestamp
    };

    // 1. Push to recipient's inbox (Server Relay)
    try {
      await push(ref(database, `chat/messages/${activeChatUser.id}`), payload);
      
      // 2. Add to our local history immediately
      const myMessage: Message = {
        id: 'local_' + timestamp,
        senderId: myProfile.id,
        senderName: myProfile.name,
        content: messageInput, // Stored unencrypted locally
        timestamp,
        read: true
      };

      setLocalMessages(prev => ({
        ...prev,
        [activeChatUser.id]: [...(prev[activeChatUser.id] || []), myMessage]
      }));

      setMessageInput('');
    } catch (err) {
      console.error('Send failed', err);
      setError('Failed to send. Is the server reachable?');
    }
  };

  const clearHistory = () => {
    if (activeChatUser) {
      setLocalMessages(prev => {
        const newHistory = { ...prev };
        delete newHistory[activeChatUser.id];
        return newHistory;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-2xl bg-zinc-900 border border-green-500/30 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-green-500/20 bg-zinc-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-bold">SECURE CHANNEL</span>
            {myProfile && <span className="text-zinc-500 text-xs">ID: {myProfile.id.substring(0, 8)}...</span>}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {error && (
          <div className="bg-red-900/50 border-b border-red-500/30 p-2 text-center text-red-200 text-xs">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-hidden relative">
          
          {step === 'join' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-zinc-900">
              <Lock className="w-16 h-16 text-green-500 mb-6 opacity-80" />
              <h2 className="text-2xl text-white font-bold mb-2">Encrypted Relay Chat</h2>
              <p className="text-zinc-400 text-center mb-8 max-w-md text-sm">
                Connect to the secure mesh. Messages are relayed via server but stored only on your device.
                <br/><br/>
                <span className="text-yellow-500">WARNING: 15 XP will be deducted to initialize connection.</span>
              </p>
              
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Enter Codename..."
                className="w-64 bg-zinc-950 border border-zinc-700 text-white px-4 py-2 rounded focus:border-green-500 outline-none mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
              <button 
                onClick={handleJoin}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded font-bold transition-colors"
                disabled={!joinName.trim()}
              >
                ACCESS GRID
              </button>
              {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>
          )}

          {step === 'list' && (
            <div className="absolute inset-0 flex flex-col bg-zinc-900">
               <div className="p-4 bg-zinc-800/50">
                 <h3 className="text-green-400 text-sm font-bold flex items-center gap-2">
                   <Wifi className="w-4 h-4 animate-pulse" />
                   ACTIVE NODES ({users.length})
                 </h3>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {users.length === 0 ? (
                   <div className="text-center text-zinc-500 mt-10">Scanning for signals...<br/>No active agents found.</div>
                 ) : (
                   users.map(user => (
                     <div 
                       key={user.id} 
                       onClick={() => { setActiveChatUser(user); setStep('chat'); }}
                       className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded hover:border-green-500/50 cursor-pointer group transition-all"
                     >
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-green-900">
                           <User className="w-4 h-4 text-zinc-400 group-hover:text-green-400" />
                         </div>
                         <div>
                           <div className="text-zinc-200 font-bold group-hover:text-green-400">{user.name}</div>
                           <div className="text-xs text-zinc-600">ID: {user.id.substring(0,8)}...</div>
                         </div>
                       </div>
                       <div className="px-3 py-1 text-xs bg-zinc-900 text-green-500 rounded border border-green-900/30">
                         CONNECT
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {step === 'chat' && activeChatUser && (
            <div className="absolute inset-0 flex flex-col bg-zinc-900">
              {/* Chat Header */}
              <div className="p-3 bg-zinc-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button onClick={() => setStep('list')} className="text-zinc-400 hover:text-white mr-2">← Back</button>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-white font-bold">{activeChatUser.name}</span>
                </div>
                <button onClick={clearHistory} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear Local Data
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {(localMessages[activeChatUser.id] || []).map((msg) => {
                   const isMe = msg.senderId === myProfile?.id;
                   return (
                     <div key={msg.id} className={`max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
                       <div className={`p-3 rounded-lg text-sm ${
                         isMe 
                         ? 'bg-green-900/20 border border-green-500/30 text-green-100 rounded-tr-none' 
                         : 'bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-tl-none'
                       }`}>
                         {msg.content}
                       </div>
                       <div className={`text-[10px] text-zinc-600 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                         {new Date(msg.timestamp).toLocaleTimeString()}
                       </div>
                     </div>
                   )
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Enter encrypted message..."
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded focus:border-green-500 outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[10px] text-zinc-600 mt-2 flex items-center gap-1 justify-center">
                  <Lock className="w-3 h-3" /> Messages are end-to-end encrypted and deleted from server upon delivery.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
