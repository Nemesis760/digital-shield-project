import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import soundManager from '../utils/soundEffects';

/**
 * Data Factory Game - Module 1
 * Custom drag with Pointer Events (works with scroll + mobile)
 * + Edge auto-scroll while dragging
 * + Select & Tap fallback (mobile friendly)
 * + Ghost offset (not under finger)
 * + Better confetti
 * + Slightly shorter station boxes on large screens
 */

const DataFactoryGame = ({ isTurkish = true }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const [stations, setStations] = useState({
    input: [],
    process: [],
    output: [],
    storage: [],
  });

  const [availableItems, setAvailableItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  const [selectedItem, setSelectedItem] = useState(null);

  // Custom drag state
  const [dragState, setDragState] = useState({
    active: false,
    item: null,
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const scrollAreaRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  const dragStateRef = useRef(dragState);
  const dropHandledRef = useRef(false);

  // Ghost should be slightly above the pointer (so finger doesn't cover it)
  const GHOST_LIFT_Y = 36; // px

  const items = useMemo(
    () => [
      { id: 1, name: isTurkish ? 'Klavye' : 'Keyboard', category: 'input', emoji: '⌨️' },
      { id: 2, name: isTurkish ? 'Fare' : 'Mouse', category: 'input', emoji: '🖱️' },
      { id: 3, name: isTurkish ? 'Mikrofon' : 'Microphone', category: 'input', emoji: '🎤' },
      { id: 4, name: 'CPU', category: 'process', emoji: '💻' },
      { id: 5, name: isTurkish ? 'İşlemci' : 'Processor', category: 'process', emoji: '⚙️' },
      { id: 6, name: isTurkish ? 'Monitör' : 'Monitor', category: 'output', emoji: '🖥️' },
      { id: 7, name: isTurkish ? 'Hoparlör' : 'Speaker', category: 'output', emoji: '🔊' },
      { id: 8, name: isTurkish ? 'Yazıcı' : 'Printer', category: 'output', emoji: '🖨️' },
      { id: 9, name: isTurkish ? 'Sabit Disk' : 'Hard Drive', category: 'storage', emoji: '💾' },
      { id: 10, name: isTurkish ? 'USB Bellek' : 'USB Drive', category: 'storage', emoji: '💿' },
      { id: 11, name: 'RAM', category: 'storage', emoji: '🧠' },
    ],
    [isTurkish]
  );

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

  // Reset on language change
  useEffect(() => {
    setAvailableItems([...items]);
    setStations({ input: [], process: [], output: [], storage: [] });
    setScore(0);
    setFeedback(null);
    setGameComplete(false);
    setSelectedItem(null);
    setDragState({ active: false, item: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  }, [items]);

  // Cleanup feedback timeout
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  const clearFeedbackLater = () => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), 2000);
  };

  const handleReset = () => {
    setAvailableItems([...items]);
    setStations({ input: [], process: [], output: [], storage: [] });
    setScore(0);
    setFeedback(null);
    setGameComplete(false);
    setSelectedItem(null);
    setDragState({ active: false, item: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  };

  // Better confetti: 2 waves
  const confettiSuccess = () => {
    confetti({
      particleCount: 70,
      spread: 85,
      startVelocity: 42,
      gravity: 0.9,
      ticks: 220,
      origin: { y: 0.65 },
      scalar: 1.05,
    });

    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 120,
        startVelocity: 34,
        gravity: 1.05,
        ticks: 240,
        origin: { y: 0.62 },
        scalar: 0.95,
      });
    }, 120);
  };

  // Final confetti: short "rain"
  const confettiFinale = () => {
    const duration = 900;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 14,
        spread: 120,
        startVelocity: 48,
        gravity: 0.95,
        ticks: 260,
        origin: { x: Math.random(), y: 0.6 },
        scalar: 1.05,
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  const showSuccess = (activeItem) => {
    setFeedback({
      type: 'success',
      message: isTurkish ? `${activeItem.name} doğru yerde!` : `${activeItem.name} is correct!`,
    });

    soundManager.playCorrect();
    confettiSuccess();
    clearFeedbackLater();
  };

  const showError = (activeItem) => {
    soundManager.playWrong();
    setFeedback({
      type: 'error',
      message: isTurkish
        ? `${activeItem.name} buraya ait değil! Tekrar dene.`
        : `${activeItem.name} doesn't belong here! Try again.`,
    });
    clearFeedbackLater();
  };

  const completeGame = () => {
    setTimeout(() => {
      setGameComplete(true);
      soundManager.playSuccess();
      confettiFinale();
    }, 350);
  };

  const placeItemToStation = (stationKey, activeItem) => {
    const isCorrect = activeItem.category === stationKey;

    if (!isCorrect) {
      showError(activeItem);
      return;
    }

    setStations((prev) => ({
      ...prev,
      [stationKey]: [...prev[stationKey], activeItem],
    }));

    setAvailableItems((prev) => {
      const next = prev.filter((it) => it.id !== activeItem.id);
      if (next.length === 0) completeGame();
      return next;
    });

    setScore((prev) => prev + 10);
    showSuccess(activeItem);

    setSelectedItem(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item));
  };

  // Edge auto-scroll while dragging
  const autoScrollIfNeeded = (clientY) => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const edge = 90;
    const speed = 22;

    if (clientY < rect.top + edge) el.scrollBy({ top: -speed, behavior: 'auto' });
    else if (clientY > rect.bottom - edge) el.scrollBy({ top: speed, behavior: 'auto' });
  };

  // Pointer drag start
  const onPointerDownItem = (e, item) => {
    if (e.pointerType === 'mouse') e.preventDefault();

    const cardRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - cardRect.left;
    const offsetY = e.clientY - cardRect.top;

    dropHandledRef.current = false;
    const nextDragState = {
      active: true,
      item,
      x: e.clientX,
      y: e.clientY,
      offsetX,
      offsetY,
    };

    dragStateRef.current = nextDragState;
    setDragState(nextDragState);

    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Pointer move (inside scroll area)
  const onPointerMove = (e) => {
    if (!dragStateRef.current.active) return;

    setDragState((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
    }));

    autoScrollIfNeeded(e.clientY);
  };

  // Pointer up: decide drop target
  const onPointerUp = (e) => {
    const currentDrag = dragStateRef.current;
    if (!currentDrag.active || !currentDrag.item || dropHandledRef.current) return;
    dropHandledRef.current = true;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const stationEl = el?.closest?.('[data-station]');
    const stationKey = stationEl?.getAttribute?.('data-station');

    const activeItem = currentDrag.item;

    // End drag first
    const resetDragState = { active: false, item: null, x: 0, y: 0, offsetX: 0, offsetY: 0 };
    dragStateRef.current = resetDragState;
    setDragState(resetDragState);

    if (stationKey) {
      placeItemToStation(stationKey, activeItem);
    } else {
      setFeedback({
        type: 'error',
        message: isTurkish ? 'Bir istasyonun içine bırakmalısın!' : 'Drop it inside a station!',
      });
      clearFeedbackLater();
    }
  };

  useEffect(() => {
    if (!dragState.active) return;

    const handlePointerCancel = () => {
      const currentDrag = dragStateRef.current;
      if (!currentDrag.active || dropHandledRef.current) return;
      dropHandledRef.current = true;
      const resetDragState = { active: false, item: null, x: 0, y: 0, offsetX: 0, offsetY: 0 };
      dragStateRef.current = resetDragState;
      setDragState(resetDragState);
    };

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [dragState.active]);

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
    <div
      className={[
        'data-factory-game w-full bg-slate-900 overflow-hidden flex flex-col rounded-2xl',
        isOverlayOpen ? 'h-[100dvh]' : 'min-h-[520px]',
      ].join(' ')}
    >
      {/* HEADER */}
      <div className="p-4 md:p-6 shrink-0">
        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
            {isTurkish ? '🏭 Veri Fabrikası Oyunu' : '🏭 Data Factory Game'}
          </h3>
          <p className="text-slate-300 mb-4">
            {isTurkish
              ? 'Cihazları doğru istasyonlara sürükle! (IPOS: Input-Process-Output-Storage)'
              : 'Drag devices to the correct stations! (IPOS: Input-Process-Output-Storage)'}
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

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
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

      {/* Scroll area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 pb-6 touch-pan-y"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {Object.entries(stationsConfig).map(([key, config]) => (
            <motion.div
              key={key}
              data-station={key}
              className={[
                `bg-gradient-to-br ${config.color} rounded-xl border-2 border-white/20`,
                // ✅ height slightly reduced on large screens (more compact)
                // mobile/tablet still roomy; lg+ becomes shorter
                isOverlayOpen
                  ? 'min-h-[120px] md:min-h-[150px] xl:min-h-[180px] p-4 md:p-5'
                  : 'min-h-[100px] md:min-h-[135px] xl:min-h-[170px] p-4 md:p-5',
              ].join(' ')}
              onClick={() => {
                if (selectedItem) placeItemToStation(key, selectedItem);
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="text-center mb-3 md:mb-4 pointer-events-none">
                <div className="text-4xl mb-2">{config.emoji}</div>
                <h4 className="text-xl font-bold text-white mb-1">{config.title}</h4>
                <p className="text-sm text-white/80">{config.description}</p>
              </div>

              <div className="min-h-[70px] md:min-h-[85px] xl:min-h-[105px] bg-white/10 rounded-lg p-3 md:p-4 backdrop-blur-sm">
                <AnimatePresence>
                  {stations[key].map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.06 }}
                      className="inline-flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 m-1 text-white font-semibold"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span>{item.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stations[key].length === 0 && (
                  <p className="text-white/50 text-center text-sm py-6 lg:py-5">
                    {isTurkish
                      ? '✨ Buraya sürükle (veya seçip tıkla)! ✨'
                      : '✨ Drag here (or select & tap)! ✨'}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Available Items */}
        <div className="bg-slate-800 rounded-xl p-4 md:p-6">
          <h4 className="text-xl font-bold mb-4 text-center text-slate-200">
            {isTurkish ? '📦 Öğeler' : '📦 Items'}
          </h4>

          <div className="flex flex-wrap gap-3 justify-center max-h-[240px] sm:max-h-[280px] overflow-y-auto pr-2">
            <AnimatePresence>
              {availableItems.map((item) => {
                const isActiveDraggingThis = dragState.active && dragState.item?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    onPointerDown={(e) => onPointerDownItem(e, item)}
                    className={[
                      'bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg px-4 py-3',
                      'border-2 border-slate-600 hover:border-blue-500 transition-colors',
                      'select-none cursor-grab active:cursor-grabbing',
                      'touch-pan-y',
                      selectedItem?.id === item.id ? 'ring-2 ring-yellow-300' : '',
                      // ✅ when dragging this item, keep it lightly visible (no “vanish” feeling)
                      isActiveDraggingThis ? 'opacity-80' : '',
                    ].join(' ')}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="inline-flex items-center gap-2 pointer-events-none">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-white font-semibold">{item.name}</span>
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {selectedItem && (
            <p className="text-center text-slate-300 text-sm mt-4">
              {isTurkish
                ? `Seçildi: ${selectedItem.name}. Bir istasyona dokun.`
                : `Selected: ${selectedItem.name}. Tap a station.`}
            </p>
          )}
        </div>
      </div>

      {/* Drag ghost (follows pointer) */}
      <AnimatePresence>
        {dragState.active && dragState.item && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[99999] pointer-events-none"
            style={{
              left: dragState.x - dragState.offsetX,
              // ✅ lift ghost up so finger doesn’t cover it
              top: dragState.y - dragState.offsetY - GHOST_LIFT_Y,
              width: 240,
            }}
          >
            <div className="bg-slate-800/95 border-2 border-yellow-300/60 rounded-xl px-4 py-3 shadow-2xl ring-4 ring-yellow-300/20">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{dragState.item.emoji}</span>
                <span className="text-white font-semibold">{dragState.item.name}</span>
              </div>
              <div className="text-xs text-slate-200/90 mt-1">
                {isTurkish ? 'İstasyona bırak' : 'Drop into a station'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Modal */}
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 max-w-md text-center mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {isTurkish ? 'Tebrikler!' : 'Congratulations!'}
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                  {isTurkish
                    ? 'Tüm cihazları doğru istasyonlara yerleştirdin!'
                    : 'You placed all devices in the correct stations!'}
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
      <GameBody showFullscreenButton showModal={!isOverlayOpen} />

      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOverlayOpen(false)}
          >
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
