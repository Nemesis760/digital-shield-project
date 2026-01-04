import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import soundManager from '../utils/soundEffects';

/**
 * Data Factory Game - Module 1
 * Kitchen metaphor for IPOS (Input-Process-Output-Storage)
 * Users drag items to correct kitchen stations
 */

const DataFactoryGame = ({ isTurkish = true }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [stations, setStations] = useState({
    input: [],
    process: [],
    output: [],
    storage: [],
  });
  const [feedback, setFeedback] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Items to categorize (memo so reset works correctly across renders)
  const items = useMemo(
    () => [
      { id: 1, name: isTurkish ? 'Klavye' : 'Keyboard', category: 'input', emoji: '⌨️' },
      { id: 2, name: isTurkish ? 'Fare' : 'Mouse', category: 'input', emoji: '🖱️' },
      { id: 3, name: isTurkish ? 'Mikrofon' : 'Microphone', category: 'input', emoji: '🎤' },
      { id: 4, name: isTurkish ? 'CPU' : 'CPU', category: 'process', emoji: '💻' },
      { id: 5, name: isTurkish ? 'İşlemci' : 'Processor', category: 'process', emoji: '⚙️' },
      { id: 6, name: isTurkish ? 'Monitör' : 'Monitor', category: 'output', emoji: '🖥️' },
      { id: 7, name: isTurkish ? 'Hoparlör' : 'Speaker', category: 'output', emoji: '🔊' },
      { id: 8, name: isTurkish ? 'Yazıcı' : 'Printer', category: 'output', emoji: '🖨️' },
      { id: 9, name: isTurkish ? 'Sabit Disk' : 'Hard Drive', category: 'storage', emoji: '💾' },
      { id: 10, name: isTurkish ? 'USB Bellek' : 'USB Drive', category: 'storage', emoji: '💿' },
      { id: 11, name: isTurkish ? 'RAM' : 'RAM', category: 'storage', emoji: '🧠' },
    ],
    [isTurkish]
  );

  const [availableItems, setAvailableItems] = useState([...items]);

  useEffect(() => {
    // language changes -> refresh available items
    setAvailableItems([...items]);
    setStations({ input: [], process: [], output: [], storage: [] });
    setScore(0);
    setFeedback(null);
    setGameComplete(false);
    setDraggedItem(null);
  }, [items]);

  const stationsConfig = {
    input: {
      title: isTurkish ? 'Malzeme Sepeti (Input)' : 'Ingredient Bin (Input)',
      description: isTurkish ? 'Bilgisayara veri girişi yapan cihazlar' : 'Devices that input data to computer',
      emoji: '📥',
      color: 'from-green-500 to-emerald-500',
    },
    process: {
      title: isTurkish ? 'Aşçı Fırını (Process)' : 'Chef Oven (Process)',
      description: isTurkish ? 'Verileri işleyen merkezi birim' : 'Central unit that processes data',
      emoji: '🔥',
      color: 'from-orange-500 to-red-500',
    },
    output: {
      title: isTurkish ? 'Servis Masası (Output)' : 'Service Table (Output)',
      description: isTurkish ? 'İşlenmiş veriyi gösteren cihazlar' : 'Devices that display processed data',
      emoji: '📤',
      color: 'from-blue-500 to-cyan-500',
    },
    storage: {
      title: isTurkish ? 'Buzdolabı (Storage)' : 'Fridge (Storage)',
      description: isTurkish ? 'Verileri saklayan cihazlar' : 'Devices that store data',
      emoji: '❄️',
      color: 'from-purple-500 to-pink-500',
    },
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (stationKey) => {
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === stationKey;

    if (isCorrect) {
      setStations((prev) => ({
        ...prev,
        [stationKey]: [...prev[stationKey], draggedItem],
      }));

      setAvailableItems((prev) => prev.filter((item) => item.id !== draggedItem.id));

      setScore((prev) => prev + 10);

      setFeedback({
        type: 'success',
        message: isTurkish ? `🎉 Harika! ${draggedItem.name} doğru yerde!` : `🎉 Great! ${draggedItem.name} is correct!`,
      });

      soundManager.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#fbbf24'],
      });

      if (availableItems.length === 1) {
        setTimeout(() => {
          setGameComplete(true);
          soundManager.playSuccess();
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#10b981', '#059669', '#34d399', '#fbbf24', '#f59e0b', '#6366f1'],
          });
        }, 500);
      }
    } else {
      soundManager.playWrong();
      setFeedback({
        type: 'error',
        message: isTurkish ? `❌ ${draggedItem.name} buraya ait değil! Tekrar dene.` : `❌ ${draggedItem.name} doesn't belong here! Try again.`,
      });
    }

    setDraggedItem(null);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleReset = () => {
    setStations({ input: [], process: [], output: [], storage: [] });
    setAvailableItems([...items]);
    setGameComplete(false);
    setScore(0);
    setFeedback(null);
    setDraggedItem(null);
  };

  // ESC closes overlay
  useEffect(() => {
    if (!isOverlayOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOverlayOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverlayOpen]);

  const GameBody = ({ showFullscreenButton, showModal }) => (
    // ✅ INLINE: max-h ile page şişmez | OVERLAY: full height
    <div
      className={[
        'data-factory-game w-full bg-slate-900 overflow-hidden flex flex-col rounded-2xl',
        isOverlayOpen ? 'h-[100dvh]' : 'max-h-[720px]',
      ].join(' ')}
    >
      {/* ✅ HEADER: sabit kalsın */}
      <div className="p-4 md:p-6 shrink-0">
        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
            {isTurkish ? '🏭 Veri Fabrikası Oyunu' : '🏭 Data Factory Game'}
          </h3>
          <p className="text-slate-300 mb-4">
            {isTurkish
              ? 'Cihazları doğru mutfak istasyonlarına sürükle! (IPOS: Input-Process-Output-Storage)'
              : 'Drag devices to the correct kitchen stations! (IPOS: Input-Process-Output-Storage)'}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400 text-sm">{isTurkish ? 'Puan' : 'Score'}: </span>
              <span className="text-yellow-400 font-bold text-xl">{score}</span>
            </div>

            <motion.button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isTurkish ? '🔄 Sıfırla' : '🔄 Reset'}
            </motion.button>

            {showFullscreenButton && (
              <motion.button
                onClick={() => setIsOverlayOpen(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isTurkish ? 'Tam ekran' : 'Fullscreen'}
                title={isTurkish ? 'Tam ekran' : 'Fullscreen'}
              >
                ⛶
              </motion.button>
            )}
          </div>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`text-center p-3 md:p-4 rounded-lg font-semibold ${
                feedback.type === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Scroll sadece burada: flex child için min-h-0 şart */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 pb-6">
        {/* Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {Object.entries(stationsConfig).map(([key, config]) => (
            <motion.div
              key={key}
              className={[
                `bg-gradient-to-br ${config.color} rounded-xl p-4 md:p-6 border-2 border-white/20`,
                isOverlayOpen ? 'min-h-[200px]' : 'min-h-[150px]',
              ].join(' ')}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(key)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center mb-3 md:mb-4">
                <div className="text-4xl mb-2">{config.emoji}</div>
                <h4 className="text-xl font-bold text-white mb-1">{config.title}</h4>
                <p className="text-sm text-white/80">{config.description}</p>
              </div>

              <div className="min-h-[100px] md:min-h-[120px] bg-white/10 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <AnimatePresence>
                  {stations[key].map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0, rotate: 180 }}
                      transition={{ delay: index * 0.08 }}
                      className="inline-block bg-white/20 rounded-lg px-3 py-2 m-1 text-white font-semibold"
                    >
                      {item.emoji} {item.name}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stations[key].length === 0 && (
                  <p className="text-white/50 text-center text-sm py-6 md:py-8">
                    {isTurkish ? '✨ Öğe sürükle buraya! ✨' : '✨ Drag items here! ✨'}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Available Items */}
        <div className="bg-slate-800 rounded-xl p-4 md:p-6">
          <h4 className="text-xl font-bold mb-4 text-center text-slate-200">
            {isTurkish ? '📦 Sürüklenecek Öğeler' : '📦 Items to Drag'}
          </h4>

          {/* ✅ Inline’da da taşma olmasın: içeride scroll */}
          <div className="flex flex-wrap gap-3 justify-center max-h-[220px] overflow-y-auto pr-2">
            <AnimatePresence>
              {availableItems.map((item) => (
                <motion.div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg px-4 py-3 cursor-grab active:cursor-grabbing border-2 border-slate-600 hover:border-blue-500 transition-colors touch-none select-none"
                  whileHover={{ scale: 1.06, rotate: 3 }}
                  whileDrag={{ scale: 1.12, rotate: 7, zIndex: 1000 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="ml-2 text-white font-semibold">{item.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Complete Modal: overlay açıkken de gösterilebilir */}
      {showModal && (
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleReset}
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 max-w-md text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {isTurkish ? 'Tebrikler!' : 'Congratulations!'}
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                  {isTurkish
                    ? 'Tüm cihazları doğru istasyonlara yerleştirdin! Dijital mutfak hazır!'
                    : 'You placed all devices in the correct stations! Digital kitchen is ready!'}
                </p>
                <p className="text-2xl font-bold text-white mb-6">
                  {isTurkish ? 'Toplam Puan' : 'Total Score'}: {score}
                </p>
                <motion.button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white text-orange-600 rounded-lg font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isTurkish ? 'Tekrar Oyna' : 'Play Again'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <>
      {/* Inline preview */}
      <GameBody showFullscreenButton showModal={!isOverlayOpen} />

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOverlayOpen(false)}
          >
            {/* ✅ KERPİKSIZ: dış scroll yok */}
            <div
              className="w-screen h-[100dvh] bg-slate-900 overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <button
                  type="button"
                  onClick={() => setIsOverlayOpen(false)}
                  className="absolute top-4 right-4 z-10 rounded-full bg-slate-800/80 text-white w-10 h-10 flex items-center justify-center hover:bg-slate-700 transition-colors"
                  aria-label={isTurkish ? 'Kapat' : 'Close'}
                  title={isTurkish ? 'Kapat (Esc)' : 'Close (Esc)'}
                >
                  ✕
                </button>

                {/* Overlay modda aynı component, h-[100dvh] devreye girer */}
                <GameBody showFullscreenButton={false} showModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DataFactoryGame;
