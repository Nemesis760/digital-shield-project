import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './card-matching.css';

function CardMatchingGame({ isTurkish, data }) {
  // --- Veri Hazırlığı (Değişmedi) ---
  const legacyScenarios = [
    {
      id: 1,
      text: isTurkish
        ? "Arkadaşının doğum gününü kutlayan bir gönderi paylaştın."
        : "You shared a post celebrating your friend's birthday.",
      correct: 'active',
      explanation: isTurkish
        ? "Kendi isteğinle paylaştığın için bu aktif ayak izidir."
        : "This is an active footprint because you shared it intentionally."
    },
    {
      id: 2,
      text: isTurkish
        ? "Bir alışveriş sitesinde gezdin, bir şey almadın ama sonra o ürünün reklamını gördün."
        : "You browsed a shopping site, didn't buy anything, but then saw an ad for that product.",
      correct: 'passive',
      explanation: isTurkish
        ? "Farkında olmadan takip edildiğin için bu pasif ayak izidir."
        : "This is a passive footprint because you were tracked without your awareness."
    },
    {
      id: 3,
      text: isTurkish
        ? "Instagram'da bir fotoğraf yükledin."
        : "You uploaded a photo on Instagram.",
      correct: 'active',
      explanation: isTurkish
        ? "Bilerek paylaştığın için aktif ayak izidir."
        : "This is an active footprint because you shared it intentionally."
    },
    {
      id: 4,
      text: isTurkish
        ? "Bir web sitesi çerezlerle seni takip etti."
        : "A website tracked you with cookies.",
      correct: 'passive',
      explanation: isTurkish
        ? "Farkında olmadan oluştuğu için pasif ayak izidir."
        : "This is a passive footprint because it was created without your awareness."
    }
  ];

  const activity = useMemo(() => {
    if (!data || !Array.isArray(data.situations)) return null;
    const options = data.network_types || data.categories;
    if (!Array.isArray(options) || options.length === 0) return null;
    return { situations: data.situations, options };
  }, [data]);

  const scenarios = activity
    ? activity.situations.map((item) => ({
        id: item.id,
        text: isTurkish ? item.text_tr : item.text_en,
        correct: item.correct_match,
        explanation: isTurkish ? item.explanation_tr : item.explanation_en // Veriden geliyorsa
      }))
    : legacyScenarios;

  const optionList = activity
    ? activity.options.map((option) => ({
        id: option.id,
        label: isTurkish ? option.label_tr : option.label_en,
      }))
    : [
        { id: 'active', label: isTurkish ? '👆 Aktif' : '👆 Active' },
        { id: 'passive', label: isTurkish ? '👀 Pasif' : '👀 Passive' },
      ];

  const feedbackText = activity
    ? {
        correct: isTurkish ? data.feedback?.correct_tr : data.feedback?.correct_en,
        wrong: isTurkish ? data.feedback?.incorrect_tr : data.feedback?.incorrect_en,
      }
    : null;

  // --- Yeni State Yapısı ---
  const [currentIndex, setCurrentIndex] = useState(0); // Hangi sorudayız?
  const [feedback, setFeedback] = useState(null); // Cevap verildi mi? Sonuç ne?
  const [isFinished, setIsFinished] = useState(false); // Oyun bitti mi?

  const currentScenario = scenarios[currentIndex];

  // İlerleme çubuğu yüzdesi
  const progressPercentage = ((currentIndex) / scenarios.length) * 100;

  const handleCardClick = (type) => {
    if (feedback) return; // Zaten cevaplandıysa tıklamayı engelle

    const isCorrect = currentScenario.correct === type;
    const explanationText = currentScenario.explanation || (isCorrect 
      ? (isTurkish ? "Harika! Doğru bildin." : "Great! That's correct.") 
      : (isTurkish ? "Yanlış cevap." : "Incorrect answer."));

    setFeedback({
      type: isCorrect ? 'correct' : 'wrong',
      message: isCorrect 
        ? (feedbackText?.correct || (isTurkish ? '🎉 Doğru!' : '🎉 Correct!'))
        : (feedbackText?.wrong || (isTurkish ? '❌ Yanlış!' : '❌ Wrong!')),
      explanation: explanationText
    });
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Başlıklar
  const title = activity
    ? (isTurkish ? data.title_tr : data.title_en)
    : (isTurkish ? '👣 Hangi İz? Kart Oyunu' : '👣 Which Footprint? Card Game');

  const instructions = activity
    ? (isTurkish ? data.instructions_tr : data.instructions_en)
    : null;

  // --- Render ---
  return (
    <div className="card-matching-game single-mode">
      {/* Üst Bilgi ve Progress Bar */}
      <div className="game-header">
        <h3>{title}</h3>
        {!isFinished && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            <span className="progress-text">{currentIndex + 1} / {scenarios.length}</span>
          </div>
        )}
      </div>

      <div className="game-content-area">
        <AnimatePresence mode='wait'>
          {!isFinished ? (
            <motion.div
              key={currentScenario.id}
              className={`single-scenario-card ${feedback ? feedback.type : ''}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Soru Metni */}
              <div className="question-section">
                <p className="scenario-text-large">{currentScenario.text}</p>
              </div>

              {/* Seçenek Butonları */}
              <div className="options-grid">
                {optionList.map((option, index) => {
                  // Buton renklerini belirle
                  let btnClass = 'option-btn-large';
                  if (index === 0) btnClass += ' active-theme'; // Aktif için özel stil
                  if (index === 1) btnClass += ' passive-theme'; // Pasif için özel stil
                  
                  // Cevap verildiyse ve bu buton doğru cevapsa vurgula
                  if (feedback && currentScenario.correct === option.id) {
                     btnClass += ' correct-answer-highlight';
                  }
                  // Yanlış cevap verildiyse ve bu butona basıldıysa
                  if (feedback?.type === 'wrong' && feedback.selected === option.id) {
                     btnClass += ' wrong-answer-dim';
                  }

                  return (
                    <button
                      key={option.id}
                      className={btnClass}
                      onClick={() => handleCardClick(option.id)}
                      disabled={!!feedback} // Cevap verildiyse butonları kilitle
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Geri Bildirim ve Açıklama Alanı (SABİT) */}
              {feedback && (
                <motion.div 
                  className="feedback-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`feedback-status ${feedback.type}`}>
                    {feedback.message}
                  </div>
                  <p className="feedback-explanation-text">
                    {feedback.explanation}
                  </p>
                  
                  <button className="next-question-btn" onClick={handleNextQuestion}>
                    {currentIndex === scenarios.length - 1 
                      ? (isTurkish ? "Sonuçları Gör" : "See Results") 
                      : (isTurkish ? "Sonraki Soru ➜" : "Next Question ➜")}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Bitiş Ekranı
            <motion.div
              className="completion-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="completion-icon">🏆</div>
              <h3>{isTurkish ? 'Tebrikler!' : 'Congratulations!'}</h3>
              <p>
                {isTurkish 
                  ? 'Tüm senaryoları tamamladın.' 
                  : 'You have completed all scenarios.'}
              </p>
              <button className="restart-btn" onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setFeedback(null);
              }}>
                {isTurkish ? 'Tekrar Oyna' : 'Play Again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CardMatchingGame;