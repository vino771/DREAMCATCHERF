export interface Dream {
  id: string;
  title: string;
  content: string;
  images: string[];
  audioUrl?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: string[];
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export type ViewMode = 'private' | 'public';