import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Image, Video, FileText } from 'lucide-react';
import UploadDropzone from '@/components/UploadDropzone';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import * as mediaApi from '@/api/media';
import * as storiesApi from '@/api/stories';
import type { UploadTab } from '@/types';

const tabs: { key: UploadTab; label: string; icon: typeof Image }[] = [
  { key: 'photo', label: 'Photo', icon: Image },
  { key: 'video', label: 'Video', icon: Video },
  { key: 'story', label: 'Story', icon: FileText },
];

export default function Upload() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<UploadTab>('photo');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [storyForm, setStoryForm] = useState({ title: '', category: 'Story', content: '', authorName: '' });
  const [photoForm, setPhotoForm] = useState({ title: '', description: '', uploaderName: '' });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', uploaderName: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const { addToast } = useToast();

  const resetAll = () => {
    setUploadStatus('idle');
    setProgress(0);
    setPhotoFile(null);
    setVideoFile(null);
    setPhotoForm({ title: '', description: '', uploaderName: '' });
    setVideoForm({ title: '', description: '', uploaderName: '' });
    setStoryForm({ title: '', category: 'Story', content: '', authorName: '' });
    setErrorMessage('');
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      setErrorMessage('Please select a photo to upload');
      return;
    }
    setUploadStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      await mediaApi.uploadPhoto(
        photoFile,
        photoForm.title,
        photoForm.uploaderName,
        photoForm.description,
        setProgress
      );
      setUploadStatus('success');
      addToast('Photo uploaded successfully!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(message);
      setUploadStatus('error');
      addToast(message, 'error');
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setErrorMessage('Please select a video to upload');
      return;
    }
    setUploadStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      await mediaApi.uploadVideo(
        videoFile,
        videoForm.title,
        videoForm.uploaderName,
        videoForm.description,
        setProgress
      );
      setUploadStatus('success');
      addToast('Video uploaded successfully!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(message);
      setUploadStatus('error');
      addToast(message, 'error');
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      await storiesApi.createStory({
        title: storyForm.title,
        category: storyForm.category,
        content: storyForm.content,
        authorName: storyForm.authorName,
      });
      setUploadStatus('success');
      addToast('Story published successfully!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Publish failed';
      setErrorMessage(message);
      setUploadStatus('error');
      addToast(message, 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-[72px]">
        <section className="py-16 md:py-20 px-6" style={{ background: 'linear-gradient(135deg, #F7F2FB 0%, #F0EBF7 100%)' }}>
          <div className="max-w-content mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl text-violet-900">Upload Memories</h1>
            <p className="mt-4 text-lg text-slate-600">Please log in to upload photos, videos, and stories.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section
        className="py-16 md:py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #F7F2FB 0%, #F0EBF7 100%)' }}
      >
        <div className="max-w-content mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500"
          >
            Share with Delilah
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-5xl md:text-6xl text-violet-900 mt-3"
          >
            Upload Memories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-slate-600 max-w-xl"
          >
            Share photos, videos, or write a story for Delilah. She&apos;ll love seeing what you&apos;ve created!
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-section px-6">
        <div className="max-w-[720px] mx-auto">
          <div className="bg-white rounded-card shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-violet-100">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setUploadStatus('idle'); setErrorMessage(''); }}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-200
                      ${activeTab === tab.key
                        ? 'text-violet-900 border-b-2 border-violet-500'
                        : 'text-slate-400 hover:text-slate-600'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {uploadStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <Star size={48} className="text-violet-500 mx-auto animate-pulse-glow" />
                    <h2 className="font-display text-4xl text-violet-900 mt-5">Uploaded!</h2>
                    <p className="mt-3 text-base text-slate-600">
                      Delilah will love seeing this. Thank you for sharing!
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <button
                        onClick={resetAll}
                        className="px-6 py-3 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all"
                      >
                        Upload Another
                      </button>
                      <Link
                        to="/gallery"
                        className="px-6 py-3 border-[1.5px] border-violet-300 text-violet-500 text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-50 hover:border-violet-500 transition-all"
                      >
                        Go to Gallery
                      </Link>
                    </div>
                  </motion.div>
                ) : uploadStatus === 'uploading' ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="#EDE5F5" strokeWidth="4" />
                        <circle
                          cx="40" cy="40" r="36" fill="none" stroke="#7B5FB5" strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                          className="transition-all duration-100"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-violet-900">
                        {progress}%
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      {progress < 30 ? 'Uploading...' : progress < 70 ? 'Processing...' : 'Almost done...'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errorMessage && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {errorMessage}
                      </div>
                    )}

                    {activeTab === 'photo' && (
                      <form onSubmit={handlePhotoSubmit} className="space-y-6">
                        <UploadDropzone
                          accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                          maxSize={10 * 1024 * 1024}
                          onFileSelect={setPhotoFile}
                          fileType="photo"
                          selectedFile={photoFile}
                        />
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Give it a title <span className="text-violet-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={photoForm.title}
                            onChange={e => setPhotoForm(p => ({ ...p, title: e.target.value }))}
                            required
                            placeholder="e.g., 'Baking Cookies Together'"
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Add a description (optional)
                          </label>
                          <textarea
                            value={photoForm.description}
                            onChange={e => setPhotoForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Tell Delilah about this photo..."
                            rows={3}
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all resize-vertical"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Your name <span className="text-violet-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={photoForm.uploaderName}
                            onChange={e => setPhotoForm(p => ({ ...p, uploaderName: e.target.value }))}
                            required
                            placeholder="Who's sharing this?"
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97]"
                        >
                          Upload Photo
                        </button>
                      </form>
                    )}

                    {activeTab === 'video' && (
                      <form onSubmit={handleVideoSubmit} className="space-y-6">
                        <UploadDropzone
                          accept={{ 'video/*': ['.mp4', '.mov', '.webm'] }}
                          maxSize={100 * 1024 * 1024}
                          onFileSelect={setVideoFile}
                          fileType="video"
                          selectedFile={videoFile}
                        />
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Give it a title <span className="text-violet-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={videoForm.title}
                            onChange={e => setVideoForm(p => ({ ...p, title: e.target.value }))}
                            required
                            placeholder="e.g., 'Birthday Dance Party'"
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Add a description (optional)
                          </label>
                          <textarea
                            value={videoForm.description}
                            onChange={e => setVideoForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Tell Delilah about this video..."
                            rows={3}
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all resize-vertical"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Your name <span className="text-violet-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={videoForm.uploaderName}
                            onChange={e => setVideoForm(p => ({ ...p, uploaderName: e.target.value }))}
                            required
                            placeholder="Who's sharing this?"
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97]"
                        >
                          Upload Video
                        </button>
                      </form>
                    )}

                    {activeTab === 'story' && (
                      <form onSubmit={handleStorySubmit} className="space-y-6">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Story title <span className="text-violet-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={storyForm.title}
                            onChange={e => setStoryForm(p => ({ ...p, title: e.target.value }))}
                            required
                            placeholder="e.g., 'Our Day at the Park'"
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            What kind of story is this?
                          </label>
                          <select
                            value={storyForm.category}
                            onChange={e => setStoryForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm outline-none focus:border-violet-500 focus:shadow-glow transition-all bg-white"
                          >
                            <option>Story</option>
                            <option>Message</option>
                            <option>Update</option>
                            <option>Recipe</option>
                            <option>Activity</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Write your story <span className="text-violet-400">*</span>
                          </label>
                          <textarea
                            value={storyForm.content}
                            onChange={e => setStoryForm(p => ({ ...p, content: e.target.value }))}
                            required
                            minLength={10}
                            rows={8}
                            placeholder="Write something wonderful for Delilah..."
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all resize-vertical"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Your name <span className="text-violet-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={storyForm.authorName}
                            onChange={e => setStoryForm(p => ({ ...p, authorName: e.target.value }))}
                            required
                            placeholder="Who wrote this?"
                            className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97]"
                        >
                          Publish Story
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
