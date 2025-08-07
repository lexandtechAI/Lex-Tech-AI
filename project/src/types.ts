// src/types.ts

// Logged-in user details
export interface User {
  id: string;
  email: string;
}

// Each saved chat session
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// Individual message inside a session
export interface Message {
  id: string;
  content: string;
  is_user: boolean;
  timestamp: string;
  session_id: string;
}

// Response from the /login or /register endpoints
export interface AuthResponse {
  user_id: string;
  access_token: string;
}

// Response from the /rag chat endpoint
export interface ChatResponse {
  response: string;
  session_id: string;
}

export interface UserProfile {
  id: string;
  subscriptions: string;
  full_name: string;
  email:string,
  phone:string,
  is_admin: boolean;
  number_of_requests: string;
  user_id: string;
  created_at:string

}