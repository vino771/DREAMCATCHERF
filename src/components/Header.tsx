import React, { useState } from 'react';
import { Moon, User, LogOut, Settings } from 'lucide-react';
import { ViewMode } from '../types/dream';
import { useAuth } from '../hooks/useAuth';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAuthClick: () => void;
}

export default function Header({ viewMode, setViewMode, onAuthClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    setIsProfileModalOpen(true);
  };

  const handleSignOut = () => {
    setShowProfileDropdown(false);
    signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-lg border-b border-gray-700/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Dream Catcher
            </h1>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Mode Toggle */}
                <div className="flex items-center bg-gray-800/50 rounded-full p-1 border border-gray-600/30">
                  <button
                    onClick={() => setViewMode('private')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      viewMode === 'private'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Private
                  </button>
                  <button
                    onClick={() => setViewMode('public')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      viewMode === 'public'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Public
                  </button>
                </div>
              </>
            )}

            {/* Profile/Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-white text-sm font-medium">
                      {user.full_name || user.username}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {user.email}
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700/50 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-gray-700/50">
                      <div className="text-white font-medium">{user.full_name || user.username}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105"
              >
                Enter Realm
              </button>
            )}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showProfileDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileDropdown(false)}
          />
        )}
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}