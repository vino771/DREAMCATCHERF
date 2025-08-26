import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Calendar, Tag, Volume2 } from 'lucide-react';
import { Dream } from '../types/dream';
import { useAuth } from '../hooks/useAuth';

interface DreamCardProps {
  dream: Dream;
  onLike: (dreamId: string) => void;
  onEdit?: (dream: Dream) => void;
  isOwner?: boolean;
}

export default function DreamCard({ dream, onLike, onEdit, isOwner = false }: DreamCardProps) {
  const { user } = useAuth();
  const [showFullContent, setShowFullContent] = useState(false);
  
  const isLiked = user ? dream.likedBy.includes(user.id) : false;

  const handleLike = () => {
    if (user) {
      onLike(dream.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const truncatedContent = dream.content.length > 200 
    ? dream.content.substring(0, 200) + '...'
    : dream.content;

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/30 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {dream.author.avatar ? (
              <img src={dream.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">
                {dream.author.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{dream.author.username}</h3>
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(dream.createdAt)}
            </div>
          </div>
        </div>
        {isOwner && onEdit && (
          <button
            onClick={() => onEdit(dream)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-3">{dream.title}</h2>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-200 leading-relaxed">
          {showFullContent ? dream.content : truncatedContent}
        </p>
        {dream.content.length > 200 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-purple-400 hover:text-purple-300 text-sm mt-2 transition-colors"
          >
            {showFullContent ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Audio Player */}
      {dream.audioUrl && (
        <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Voice recording</span>
            <audio
              controls
              className="ml-auto"
              style={{
                filter: 'hue-rotate(270deg) saturate(0.5) brightness(0.8)',
                height: '30px'
              }}
            >
              <source src={dream.audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      )}

      {/* Images */}
      {dream.images.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${dream.images.length === 1 ? 'grid-cols-1' : dream.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
            {dream.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Dream image ${index + 1}`}
                className="rounded-lg object-cover w-full h-32 border border-gray-600/30"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {dream.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {dream.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-300 border border-gray-600/30"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center space-x-2 transition-all ${
              isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-300'
            } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{dream.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
        <div className="text-xs text-gray-500">
          {dream.isPublic ? 'Public' : 'Private'}
        </div>
      </div>
    </div>
  );
}