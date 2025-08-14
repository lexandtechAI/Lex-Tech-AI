import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Scale, Plus, MessageCircle, LogOut, X, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile,ChatSession } from '../types';
import { ApiClient } from '../utils/api';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onDeleteSession: (sessionId: string) => void; // ✅ new prop
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  onLogout,
  isOpen,
  onToggle,
  onDeleteSession,
}) => {

  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const userData = await ApiClient.getCurrentUser();
      setUser(userData); // assuming userData is of type User
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  fetchUser();
}, []);

  const navigate = useNavigate();

  const handleUserClick = async () => {
    try {
      const userData = await ApiClient.getCurrentUser();
      setUser(userData); // optional, depending on your app
      navigate('/user', { state: { user: userData } });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-80' : '-translate-x-full'} md:relative md:translate-x-0 ${isOpen ? 'md:w-80' : 'md:w-16'} flex flex-col h-screen`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div className={`flex items-center space-x-3 overflow-hidden ${!isOpen && 'hidden'}`}>
            <div className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl shadow-lg flex-shrink-0">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Lex & Tech AI</h1>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-gray-700 transition-colors md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-shrink-0">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 transform hover:scale-105 shadow-lg ${!isOpen && 'justify-center px-0 py-3'}`}
          >
            <Plus className="w-5 h-5" />
            <span className={`font-semibold ${!isOpen && 'hidden'}`}>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-3">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 ${
                  currentSessionId === session.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                    : 'hover:bg-gray-700 text-gray-300'
                } ${!isOpen && 'justify-center px-0 py-3'}`}
              >
                <button
                  onClick={() => onSessionSelect(session.id)}
                  className={`flex items-center space-x-3 overflow-hidden flex-1 text-left ${!isOpen && 'justify-center flex-grow-0'}`}
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{session.title || 'New Chat'}</div>
                    <div className="text-xs opacity-70">{formatDate(session.created_at)}</div>
                  </div>}
                </button>
                {isOpen && <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this chat?')) {
                      onDeleteSession(session.id);
                    }
                  }}
                  className="p-1 rounded hover:bg-gray-600 transition-colors"
                  title="Delete"
                >
                  <Trash className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex-shrink-0">
          <div className={`flex items-center ${isOpen ? 'justify-between' : 'flex-col space-y-2'}`}>
            <button onClick={handleUserClick} className={`flex items-center space-x-3 ${isOpen ? 'w-full' : 'flex-col space-y-1'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-sm font-semibold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {isOpen && <div className="flex-1 min-w-0" >
                <div className="text-sm font-medium truncate">{user?.email || 'User'}</div>
              </div>}
            </button>
            {isOpen && <button
              onClick={onLogout}
              className={`p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors flex-shrink-0 ${!isOpen && 'flex flex-col items-center space-y-1'}`}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-2">Logout</span>
            </button>}
          </div>
        </div>
      </div>
      <div className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={onToggle}
          className="p-2 bg-gray-800 text-white rounded-r-xl shadow-lg hover:bg-gray-700 transition-colors"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
