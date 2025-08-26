import React, { useState } from 'react';
import DreamCard from './DreamCard';
import DreamForm from './DreamForm';
import { useDreams } from '../hooks/useDreams';
import { useAuth } from '../hooks/useAuth';
import { Dream } from '../types/dream';
import { Plus, BookOpen, Search } from 'lucide-react';

export default function PrivatePage() {
  const { user } = useAuth();
  const { privateDreams, searchQuery, setSearchQuery, addDream, updateDream, likeDream } = useDreams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);

  const handleNewDream = () => {
    setEditingDream(null);
    setIsFormOpen(true);
  };

  const handleEditDream = (dream: Dream) => {
    setEditingDream(dream);
    setIsFormOpen(true);
  };

  const handleSaveDream = (dreamData: Partial<Dream>) => {
    if (editingDream) {
      updateDream({ ...dreamData, id: editingDream.id });
    } else {
      addDream({ ...dreamData, isPublic: false });
    }
    setIsFormOpen(false);
    setEditingDream(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Private Page Header */}
      <div className="bg-gradient-to-r from-purple-900/20 via-black to-indigo-900/20 border-b border-gray-700/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Your Dream Sanctuary
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Welcome back, {user?.full_name || user?.username}. This is your private space where dreams remain hidden in the shadows, 
              safe from the outside world.
            </p>
          </div>

          {/* Private Page Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleNewDream}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Capture New Dream</span>
            </button>
            
            {/* Search for private dreams */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your dreams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dreams Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {privateDreams.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-purple-500/20">
                <BookOpen className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Your sanctuary awaits
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? 'No dreams match your search. Try different keywords or create a new dream.'
                  : 'Begin your journey into the mysterious realm of dreams. Your first dream entry will be kept safe in this private sanctuary.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleNewDream}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
                >
                  Write Your First Dream
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="bg-gray-900/30 backdrop-blur-lg border border-gray-700/30 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{privateDreams.length}</div>
                    <div className="text-sm text-gray-400">Private Dreams</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">
                      {privateDreams.reduce((acc, dream) => acc + dream.tags.length, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Tags</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {privateDreams.filter(dream => dream.images.length > 0).length}
                    </div>
                    <div className="text-sm text-gray-400">With Images</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">
                      {privateDreams.filter(dream => dream.audioUrl).length}
                    </div>
                    <div className="text-sm text-gray-400">With Audio</div>
                  </div>
                </div>
              </div>

              {/* Dreams List */}
              {privateDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onLike={likeDream}
                  onEdit={handleEditDream}
                  isOwner={true}
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