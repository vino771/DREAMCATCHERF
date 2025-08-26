import React, { useState } from 'react';
import Header from './components/Header';
import PrivatePage from './components/PrivatePage';
import PublicPage from './components/PublicPage';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { ViewMode } from './types/dream';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Entering the dream realm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAuthClick={handleAuthClick}
      />

      {user ? (
        <div className="relative z-10">
          {viewMode === 'private' ? <PrivatePage /> : <PublicPage />}
        </div>
      ) : (
        /* Landing Page for Non-Authenticated Users */
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🌙</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Dream Catcher
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Enter the mysterious realm where dreams come alive. Capture your nocturnal adventures, 
              share them with fellow dream walkers, or keep them hidden in the shadows of your private journal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleAuthClick}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Enter the Mystery
              </button>
            </div>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
              <div className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 backdrop-blur-lg">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Capture Dreams</h3>
                <p className="text-gray-400">Record your dreams with text, voice, and images to preserve every mysterious detail.</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 backdrop-blur-lg">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Share & Discover</h3>
                <p className="text-gray-400">Connect with other dreamers and explore the collective unconscious together.</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 backdrop-blur-lg">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Private Journal</h3>
                <p className="text-gray-400">Keep your most personal dreams safe in your encrypted shadow vault.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;