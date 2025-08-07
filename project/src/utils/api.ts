// src/utils/api.ts

// Use the VITE_API_URL from environment variables in production,
// otherwise default to localhost for development.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SUPABASE_PROJECT_ID = 'emwqtiubjhvkcarysrcs';

import { ChatSession, Message } from '../types';

export const ApiClient = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('supbasetoken', data.supbasetoken);
    return data;
  },

  register: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, subscriptions: "Free" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    // console.log(data)
    // localStorage.setItem('token', data.access_token);
    // localStorage.setItem('user_id', data.user_id);
    // localStorage.setItem('supbasetoken', data.supbasetoken);
    return data;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('supbasetoken');
    localStorage.removeItem('currentSessionId');
  },

  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/profiles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return  data;
  },

  updateUserProfile: async (userId: string, profileData: any): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update profile');
    }
    return response.json();
  },

  getSessions: async (): Promise<ChatSession[]> => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const supbasetoken = localStorage.getItem('supbasetoken');

    if (!token || !userId) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `https://${SUPABASE_PROJECT_ID}.supabase.co/rest/v1/chat_sessions?user_id=eq.${userId}&select=*`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(supbasetoken ? { 'apikey': supbasetoken } : {}),
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    const data = await response.json();
    return data;
  },

  sendMessage: async (
    message: string,
    sessionId?: string
  ): Promise<{ response: string; session_id: string }> => {
    const token = localStorage.getItem('token');

    const body = {
      query: message,
      session_id: sessionId || crypto.randomUUID(),
    };

    const response = await fetch(`${BASE_URL}/rag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    return {
      response: (await response.json()).answer,
      session_id: body.session_id,
    };
  },

  sendMessageStream: async (
    message: string,
    sessionId: string | undefined,
    onChunk: (chunk: string) => void
  ): Promise<{ response: string; session_id: string }> => {
    const token = localStorage.getItem('token');
    const body = {
      query: message,
      session_id: sessionId || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)),
    };
    const response = await fetch(`${BASE_URL}/rag/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok || !response.body) {
      throw new Error('Failed to send message (stream)');
    }
    const reader = response.body.getReader();
    let fullText = '';
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk(chunk);
    }
    return { response: fullText, session_id: body.session_id };
  },

  getChatHistory: async (sessionId: string): Promise<Message[]> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/history/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.history || [];
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const supbasetoken = localStorage.getItem('supbasetoken');


    const response = await fetch(
      `https://${SUPABASE_PROJECT_ID}.supabase.co/rest/v1/chat_sessions?id=eq.${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(supbasetoken ? { 'apikey': supbasetoken } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  },

  uploadPdf: async (file: File, sessionId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'PDF upload failed');
    }
  },

  clearUploadedPdf: async (sessionId: string): Promise<void> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/clear_pdf/${sessionId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear uploaded PDF');
    }
  },

  submitForm: async (formData: any): Promise<void> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/form-submissions`,
     {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Form submission failed');
    }
  },
};
