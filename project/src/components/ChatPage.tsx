// (No changes at the top)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Menu, Trash2, Paperclip } from 'lucide-react';
import { ApiClient } from '../utils/api';
import { Message, ChatSession } from '../types';
import Sidebar from './Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 pl-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ApiClient.isAuthenticated()) {
      navigate('/login');
      return;
    }
    const init = async () => {
      await fetchSessions();
      const savedSessionId = localStorage.getItem('currentSessionId');
      if (savedSessionId) {
        await loadChatHistory(savedSessionId);
      }
    };
    init();
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const sessionData = await ApiClient.getSessions();
      setSessions(sessionData);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const history = await ApiClient.getChatHistory(sessionId);
      setMessages(history);
      updateCurrentSession(sessionId);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const updateCurrentSession = (sessionId: string | null) => {
    setCurrentSessionId(sessionId);
    if (sessionId) localStorage.setItem('currentSessionId', sessionId);
    else localStorage.removeItem('currentSessionId');
  };

  const handleSessionSelect = (sessionId: string) => {
    loadChatHistory(sessionId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    updateCurrentSession(null);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setPdfUploaded(false);
  };

  const handleLogout = () => {
    ApiClient.logout();
    localStorage.removeItem('currentSessionId');
    navigate('/');
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await ApiClient.deleteSession(sessionId);
      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.removeItem(`messages-${sessionId}`);
      if (currentSessionId === sessionId) {
        updateCurrentSession(null);
        setMessages([]);
        setPdfUploaded(false);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      is_user: true,
      timestamp: new Date().toISOString(),
      session_id: currentSessionId || ''
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setShowTyping(true);

    try {
      const response = await ApiClient.sendMessage(inputMessage, currentSessionId || undefined);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        is_user: false,
        timestamp: new Date().toISOString(),
        session_id: response.session_id
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!currentSessionId) {
        updateCurrentSession(response.session_id);
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        is_user: false,
        timestamp: new Date().toISOString(),
        session_id: currentSessionId || ''
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setShowTyping(false);
    }
  };

  const handleClearPdf = async () => {
    try {
      if (!currentSessionId) return;
      await ApiClient.clearUploadedPdf(currentSessionId);
      setPdfUploaded(false);
      alert('PDF cleared successfully.');
    } catch (error) {
      console.error('Failed to clear PDF:', error);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSessionId) return;
    setUploading(true);
    try {
      await ApiClient.uploadPdf(file, currentSessionId);
      setPdfUploaded(true);
      alert('PDF uploaded successfully.');
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      alert('PDF upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-[15px] overflow-hidden">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onDeleteSession={handleDeleteSession}
      />

      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0 z-10">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {currentSessionId ? 'Legal Assistant' : 'New Chat'}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <label
              htmlFor="pdf-upload"
              className="flex items-center text-sm text-blue-600 border border-blue-500 px-2 sm:px-3 py-1 rounded-xl hover:bg-blue-50 cursor-pointer"
            >
              <Paperclip className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Upload PDF</span>
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
              disabled={!currentSessionId || uploading}
            />
            {pdfUploaded && currentSessionId && (
              <button
                onClick={handleClearPdf}
                className="text-sm text-red-600 border border-red-500 px-2 sm:px-3 py-1 rounded-xl hover:bg-red-50 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear PDF</span>
              </button>
            )}
            <div className="hidden sm:block text-sm text-gray-500 font-medium">
              Powered by Lex & Tech AI
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-full sm:max-w-3xl px-4 sm:px-5 py-3 rounded-2xl text-sm border ${
                  msg.is_user
                    ? 'bg-[#f0f0f0] text-gray-900 border-[#dfe1eb]'
                    : 'bg-white text-gray-900 border-gray-200 shadow-sm'
                }`}
              >
                <div className="markdown-content">
                <ReactMarkdown
                  key={msg.id}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="my-[0.2rem] leading-[1.4]">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside my-[0.2rem]">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside my-[0.2rem]">{children}</ol>,
                    li: ({ children }) => <li className="my-[0.1rem]">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-semibold my-[0.2rem]">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-semibold my-[0.2rem]">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold my-[0.2rem]">{children}</h3>,
                  }}
                >
                  {typeof msg.content === 'string' ? msg.content.replace(/^\d+\.\s+/gm, '') : ''}
                </ReactMarkdown>
              </div>
                <div className="text-xs text-gray-400 mt-2 text-right">
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing animation */}
          {showTyping && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-3xl px-5 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="fixed bottom-0 left-0 right-0 border-t border-gray-200 p-2 sm:p-4 bg-white flex items-center flex-shrink-0 z-10 md:left-80"
        >
          <input
            type="text"
            className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none w-full"
            placeholder="Ask a legal question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="ml-2 sm:ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl text-sm"
            disabled={loading}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
