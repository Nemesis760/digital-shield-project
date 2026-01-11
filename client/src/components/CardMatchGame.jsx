import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const CardMatchGame = ({ isTurkish, pairs }) => {
  const defaultPairsTr = [
    { term: 'Ekran Kilidi', def: 'Cihazı yetkisiz erişime karşı koruyan ilk kalkan.' },
    { term: 'Güncelleme', def: 'Güvenlik açıklarını kapatan yazılım iyileştirmesi.' },
    { term: 'Yedekleme', def: 'Verilerin kaybolma riskine karşı kopyalanması.' },
    { term: 'Zararlı Yazılım', def: 'Cihaza zarar veren veya veri çalan programlar.' },
    { term: 'Gizlilik Ayarı', def: 'Verilerin kimlerle paylaşılacağını belirleyen kontrol.' },
    { term: 'Siber Zorbalık', def: 'Dijital ortamda başkalarını üzen davranışlar.' }
  ];
  const defaultPairsEn = [
    { term: 'Screen Lock', def: 'The first shield protecting device from unauthorized access.' },
    { term: 'Update', def: 'Software improvement that closes security vulnerabilities.' },
    { term: 'Backup', def: 'Copying data to prevent loss in case of failure.' },
    { term: 'Malware', def: 'Programs that damage devices or steal data.' },
    { term: 'Privacy Setting', def: 'Control that determines who can see your data.' },
    { term: 'Cyberbullying', def: 'Behaviors that upset others in digital environments.' }
  ];

  const pairsData = useMemo(() => {
    const fallback = isTurkish ? defaultPairsTr : defaultPairsEn;
    if (Array.isArray(pairs) && pairs.length) {
      return pairs.map((pair) => {
        if (Array.isArray(pair)) {
          return { term: pair[0], def: pair[1] };
        }
        return { term: pair.term, def: pair.def };
      });
    }
    return fallback;
  }, [isTurkish, pairs]);

  const cardsData = useMemo(
    () => pairsData.map((pair, idx) => ({ id: idx + 1, term: pair.term, def: pair.def })),
    [pairsData]
  );

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const initGame = () => {
    const shuffled = [...cardsData.map(c => ({ ...c, type: 'term' })), ...cardsData.map(c => ({ ...c, type: 'def' }))]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setFeedback(null);
  };

  useEffect(() => {
    initGame();
  }, [cardsData]);

  const handleFlip = (card) => {
    if (flipped.length === 2 || flipped.includes(card.uniqueId) || matched.includes(card.id)) return;

    const newFlipped = [...flipped, card.uniqueId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find(c => c.uniqueId === newFlipped[0]);
      const secondCard = cards.find(c => c.uniqueId === newFlipped[1]);

      if (firstCard.id === secondCard.id && firstCard.type !== secondCard.type) {
        setMatched([...matched, firstCard.id]);
        setFeedback({
          type: 'success',
          message: isTurkish ? 'Doğru eşleşme!' : 'Correct match!'
        });
        setFlipped([]);
      } else {
        setFeedback({
          type: 'error',
          message: isTurkish ? 'Yanlış eşleşme. Tekrar dene.' : 'Not a match. Try again.'
        });
        setTimeout(() => setFlipped([]), 1200);
      }

      setTimeout(() => setFeedback(null), 1600);
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-2xl shadow-inner my-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Brain className="text-blue-600" size={32} />
          <h2 className="text-2xl font-bold text-slate-800">
            {isTurkish ? "Hafıza Kartı Eşleştirme" : "Memory Card Match"}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-600">
            {isTurkish ? "Hamle:" : "Moves:"} {moves}
          </span>
          <button
            onClick={initGame}
            className="p-2 bg-white rounded-full shadow hover:shadow-md transition-all text-blue-600"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uniqueId) || matched.includes(card.id);
          return (
            <div
              key={card.uniqueId}
              className="perspective-1000 h-32 cursor-pointer"
              onClick={() => handleFlip(card)}
            >
              <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
              >
                <div className="absolute inset-0 bg-blue-600 rounded-xl flex items-center justify-center backface-hidden shadow-lg">
                  <div className="w-12 h-12 border-4 border-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">?</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center p-3 backface-hidden shadow-lg border-2 border-blue-200 rotate-y-180">
                  <p className={`text-center font-bold leading-tight ${card.type === 'term' ? 'text-blue-700 text-lg' : 'text-slate-600 text-xs'}`}>
                    {card.type === 'term' ? card.term : card.def}
                  </p>
                  {matched.includes(card.id) && (
                    <div className="absolute top-1 right-1 text-green-500">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {matched.length === cardsData.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-green-600 text-white rounded-xl text-center shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-2">
            {isTurkish ? "Harika iş!" : "Great Job!"}
          </h3>
          <p>{isTurkish ? `Tüm kartları ${moves} hamlede eşleştirdin.` : `You matched all cards in ${moves} moves.`}</p>
          <button
            onClick={initGame}
            className="mt-4 px-8 py-2 bg-white text-green-600 font-bold rounded-full hover:bg-green-50 transition-colors"
          >
            {isTurkish ? "Tekrar Oyna" : "Play Again"}
          </button>
        </motion.div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default CardMatchGame;
