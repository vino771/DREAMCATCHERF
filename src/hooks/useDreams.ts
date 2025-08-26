import { useState, useEffect } from 'react';
import { Dream, ViewMode } from '../types/dream';
import { useAuth } from './useAuth';

// Mock data for demonstration
const mockDreams: Dream[] = [
  {
    id: '1',
    title: 'Flying Over Mountains',
    content: 'I dreamt I was soaring above snow-capped mountains with crystal clear skies. The wind felt so real against my face, and I could see eagles flying alongside me. There was this incredible sense of freedom and peace that I had never experienced before in waking life.',
    images: [
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    tags: ['flying', 'mountains', 'peaceful', 'freedom'],
    isPublic: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    likes: 12,
    likedBy: [],
    author: {
      id: 'demo-user-1',
      username: 'SkyDreamer',
    }
  },
  {
    id: '2',
    title: 'Underwater City',
    content: 'I found myself swimming through the streets of a beautiful underwater city. The buildings were made of coral and glowed with bioluminescent light. Fish swam around me like birds in the sky, and I could breathe perfectly underwater.',
    images: [
      'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    tags: ['underwater', 'city', 'magical', 'ocean'],
    isPublic: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    likes: 8,
    likedBy: [],
    author: {
      id: 'demo-user-2',
      username: 'OceanExplorer',
    }
  }
];

export function useDreams() {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>(mockDreams);
  const [searchQuery, setSearchQuery] = useState('');

  const getPublicDreams = () => {
    let filtered = dreams.filter(dream => dream.isPublic);

    if (searchQuery) {
      filtered = filtered.filter(dream =>
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const getPrivateDreams = () => {
    if (!user) return [];
    
    let filtered = dreams.filter(dream => 
      !dream.isPublic && dream.author.id === user.id
    );

    if (searchQuery) {
      filtered = filtered.filter(dream =>
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const addDream = (dreamData: Partial<Dream>) => {
    if (!user) {
      console.error('User must be logged in to add dreams');
      return;
    }

    const newDream: Dream = {
      id: Date.now().toString(),
      title: dreamData.title || '',
      content: dreamData.content || '',
      images: dreamData.images || [],
      audioUrl: dreamData.audioUrl,
      tags: dreamData.tags || [],
      isPublic: dreamData.isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      likedBy: [],
      author: {
        id: user.id,
        username: user.username,
        avatar: user.avatar_url
      }
    };

    setDreams(prev => [newDream, ...prev]);
  };

  const updateDream = (dreamData: Partial<Dream>) => {
    if (!dreamData.id || !user) return;

    setDreams(prev =>
      prev.map(dream =>
        dream.id === dreamData.id && dream.author.id === user.id
          ? { ...dream, ...dreamData, updatedAt: new Date() }
          : dream
      )
    );
  };

  const likeDream = (dreamId: string) => {
    if (!user) return;

    setDreams(prev =>
      prev.map(dream => {
        if (dream.id === dreamId) {
          const isLiked = dream.likedBy.includes(user.id);
          return {
            ...dream,
            likes: isLiked ? dream.likes - 1 : dream.likes + 1,
            likedBy: isLiked 
              ? dream.likedBy.filter(id => id !== user.id)
              : [...dream.likedBy, user.id]
          };
        }
        return dream;
      })
    );
  };

  const deleteDream = (dreamId: string) => {
    if (!user) return;
    
    setDreams(prev => prev.filter(dream => 
      dream.id !== dreamId || dream.author.id !== user.id
    ));
  };

  return {
    publicDreams: getPublicDreams(),
    privateDreams: getPrivateDreams(),
    searchQuery,
    setSearchQuery,
    addDream,
    updateDream,
    likeDream,
    deleteDream,
  };
}