import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

const VideoPlayer = ({ isOpen, onClose, videoId, title }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="aspect-video w-full bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const VideoThumbnail = ({ thumbnail, title, onClick }) => (
  <div 
    className="group relative cursor-pointer rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
    onClick={onClick}
  >
    <img 
      src={thumbnail} 
      alt={title} 
      className="w-full aspect-video object-cover"
    />
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white">
        <Play size={32} fill="currentColor" />
      </div>
    </div>
    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
      <p className="text-white font-medium text-sm truncate">{title}</p>
    </div>
  </div>
);

export default VideoPlayer;
