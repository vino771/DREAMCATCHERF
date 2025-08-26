import React, { useState, useRef } from 'react';
import { X, Camera, Mic, MicOff, Tag, Save, Eye, EyeOff } from 'lucide-react';
import { Dream } from '../types/dream';

interface DreamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dream: Partial<Dream>) => void;
  initialDream?: Dream | null;
}

export default function DreamForm({ isOpen, onClose, onSave, initialDream }: DreamFormProps) {
  const [title, setTitle] = useState(initialDream?.title || '');
  const [content, setContent] = useState(initialDream?.content || '');
  const [tags, setTags] = useState<string[]>(initialDream?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>(initialDream?.images || []);
  const [isPublic, setIsPublic] = useState(initialDream?.isPublic || false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(initialDream?.audioUrl);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const dreamData: Partial<Dream> = {
      id: initialDream?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags,
      images,
      audioUrl,
      isPublic,
      createdAt: initialDream?.createdAt || new Date(),
      updatedAt: new Date(),
      likes: initialDream?.likes || 0,
      likedBy: initialDream?.likedBy || [],
      author: initialDream?.author || {
        id: 'user1',
        username: 'DreamKeeper',
        avatar: undefined
      }
    };

    onSave(dreamData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
          <h2 className="text-xl font-bold text-white">
            {initialDream ? 'Edit Dream' : 'New Dream'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dream Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your dream a title..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dream Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your dream in detail..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
            />
          </div>

          {/* Voice Recording */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Voice Recording
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/30'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </button>
              {audioUrl && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Recording ready</span>
                  <audio controls className="h-8" style={{ filter: 'hue-rotate(270deg) saturate(0.5) brightness(0.8)' }}>
                    <source src={audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/30 rounded-lg transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Add Images</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-600/30"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700/50 text-gray-300 border border-gray-600/30"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Visibility Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visibility
            </label>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                isPublic
                  ? 'bg-green-500/20 border-green-500/30 text-green-200'
                  : 'bg-gray-700/50 border-gray-600/30 text-gray-300'
              }`}
            >
              {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{isPublic ? 'Public - Others can see this dream' : 'Private - Only you can see this dream'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700/30">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save Dream</span>
          </button>
        </div>
      </div>
    </div>
  );
}