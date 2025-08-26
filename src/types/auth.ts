export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  email: string;
  created_at: string;
  updated_at: string;
}