export interface User {
  id: string;
  name: string;
  phone?: string;
  date_of_birth?: string;
  is_active: boolean;
  role: 'user' | 'moderator';
  profile_picture?: string;
  bio?: string;
  address?: string;
  status: 'pending' | 'verified' | 'banned' | 'deleted';
  created_at: string;
  updated_at: string;
  last_login?: string;
  signup_date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  profile_picture?: string;
  signup_date: string;
}
