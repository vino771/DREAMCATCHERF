import React, { useState } from 'react';
import DreamCard from './DreamCard';
import DreamForm from './DreamForm';
import { useDreams } from '../hooks/useDreams';
import { useAuth } from '../hooks/useAuth';
import { Dream } from '../types/dream';
import { Plus, Globe, Search, TrendingUp, Users } from 'lucide-react';

export default function PublicPage() {
  const { user } = useAuth();
  const { publicDreams, searchQuery, setSearchQuery, addDream, updateDream, likeDream } = useDreams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);

  const handleNewDream = () => {
    setEditingDream(null);
    setIsFormOpen(true);
  };

  const handleEditDream = (dream: Dream) => {
    // Only allow editing own dreams
    if (dream.author.id === user?.id) {
      setEditingDream(dream);
      setIsFormOpen(true);
    }
  };

  const handleSaveDream = (dreamData: Partial<Dream>) => {
    if (editingDream) {
      // Only allow editing own dreams
      if (editingDream.author.id === user?.id) {
        updateDream({ ...dreamData, id: editingDream.id });
      }
    } else {
      addDream({ ...dreamData, isPublic: true });
    }
    setIsFormOpen(false);
    setEditingDream(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Public Page Header */}
      <div className="bg-gradient-to-r from-indigo-900/20 via-black to-purple-900/20 border-b border-gray-700/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Dream Collective
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore the shared consciousness of dreamers worldwide. Discover, connect, and share your dreams 
              with the global dream community.
            </p>
          </div>

          {/* Public Page Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleNewDream}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Share a Dream</span>
            </button>
            
            {/* Search for public dreams */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Explore dreams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dreams Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {publicDreams.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-indigo-500/20">
                <Users className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                {searchQuery ? 'No dreams found' : 'Be the first to share'}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? 'No public dreams match your search. Try different keywords or be the first to share a dream about this topic.'
                  : 'The dream collective is waiting for your contribution. Share your dreams and connect with fellow dreamers around the world.'}
              </p>
              <button
                onClick={handleNewDream}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                Share Your First Dream
              </button>
            </div>
          ) : (
            <>
              {/* Community Stats */}
              <div className="bg-gray-900/30 backdrop-blur-lg border border-gray-700/30 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">{publicDreams.length}</div>
                    <div className="text-sm text-gray-400">Shared Dreams</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {new Set(publicDreams.map(dream => dream.author.id)).size}
                    </div>
                    <div className="text-sm text-gray-400">Dreamers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">
                      {publicDreams.reduce((acc, dream) => acc + dream.likes, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Likes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {new Set(publicDreams.flatMap(dream => dream.tags)).size}
                    </div>
                    <div className="text-sm text-gray-400">Unique Tags</div>
                  </div>
                </div>
              </div>

              {/* Trending Tags */}
              {!searchQuery && (
                <div className="bg-gray-900/30 backdrop-blur-lg border border-gray-700/30 rounded-xl p-6 mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-white">Trending Dream Themes</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(publicDreams.flatMap(dream => dream.tags)))
                      .slice(0, 8)
                      .map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-full text-sm text-indigo-300 hover:text-indigo-200 transition-all"
                        >
                          #{tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Dreams List */}
              {publicDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onLike={likeDream}
                  onEdit={dream.author.id === user?.id ? handleEditDream : undefined}
                  isOwner={dream.author.id === user?.id}
                />
              ))}
            </>
          )}
        </div>
      </main>

      {/* Dream Form Modal */}
      <DreamForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDream(null);
        }}
        onSave={handleSaveDream}
        initialDream={editingDream}
      />
    </div>
  );
}