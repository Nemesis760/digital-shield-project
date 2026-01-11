import { useEffect, useMemo, useRef, useState } from 'react';

const SLICE_COUNT = 10;
const SLICE_DEG = 360 / SLICE_COUNT;

const WheelQuizGame = ({ isTurkish, questions = [] }) => {
  const [started, setStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [usedIndices, setUsedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const totalQuestions = questions.length;

  const sliceColors = useMemo(
    () => [
      '#f9c74f',
      '#90be6d',
      '#f8961e',
      '#43aa8b',
      '#577590',
      '#f3722c',
      '#277da1',
      '#f9844a',
      '#4d908e',
      '#f94144'
    ],
    []
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const resetGame = () => {
    setStarted(false);
    setRotation(0);
    setSpinning(false);
    setCurrentIndex(null);
    setUsedIndices([]);
    setScore(0);
    setResult(null);
  };

  const handleSpin = () => {
    if (spinning || !started || totalQuestions === 0) {
      return;
    }
    if (currentIndex !== null && result === null) {
      return;
    }
    if (usedIndices.length >= totalQuestions) {
      return;
    }

    const remaining = questions
      .map((_, index) => index)
      .filter((index) => !usedIndices.includes(index));
    const randomIndex = remaining[Math.floor(Math.random() * remaining.length)];

    const sliceCenter = randomIndex * SLICE_DEG + SLICE_DEG / 2;
    const normalized = rotation % 360;
    const extraTurns = 2 + Math.floor(Math.random() * 2);
    const targetRotation = rotation + extraTurns * 360 + (360 - sliceCenter - normalized);

    setSpinning(true);
    setResult(null);
    setCurrentIndex(null);
    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setCurrentIndex(randomIndex);
    }, 2600);
  };

  const handleAnswer = (value) => {
    if (currentIndex === null || result !== null) {
      return;
    }
    const currentQuestion = questions[currentIndex];
    const isCorrect = value === currentQuestion.answer;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setUsedIndices((prev) => [...prev, currentIndex]);
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const isComplete = totalQuestions > 0 && usedIndices.length >= totalQuestions;
  const currentQuestion = currentIndex !== null ? questions[currentIndex] : null;

  const wheelGradient = `conic-gradient(${sliceColors
    .map((color, index) => `${color} ${index * SLICE_DEG}deg ${(index + 1) * SLICE_DEG}deg`)
    .join(', ')})`;

  return (
    <div className="wheel-quiz" ref={containerRef}>
      {!started ? (
        <div className="wheel-start">
          <h3>{isTurkish ? 'Carkifelek' : 'Wheel of Fortune'}</h3>
          <p>
            {isTurkish
              ? 'Baslamak icin oynat tusuna bas ve sorulari cevapla.'
              : 'Press play to start and answer the questions.'}
          </p>
          <button className="wheel-play-btn" onClick={() => setStarted(true)} aria-label={isTurkish ? 'Oyunu baslat' : 'Start game'}>
            <span className="wheel-play-icon" aria-hidden="true"></span>
            <span className="wheel-play-label">{isTurkish ? 'Baslat' : 'Play'}</span>
          </button>
        </div>
      ) : (
        <div className="wheel-stage">
          <div className="wheel-topbar">
            <div className="wheel-score">
              {isTurkish ? 'Skor' : 'Score'}: {score}/{totalQuestions || 10}
            </div>
            <button
              className="wheel-fullscreen-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? (isTurkish ? 'Tam ekrandan cik' : 'Exit fullscreen') : (isTurkish ? 'Tam ekran' : 'Enter fullscreen')}
            >
              {isFullscreen ? (isTurkish ? 'Kucult' : 'Exit Fullscreen') : (isTurkish ? 'Tam Ekran' : 'Fullscreen')}
            </button>
          </div>

          <div className="wheel-layout">
            <div className="wheel-wrapper">
              <div className="wheel-pointer" aria-hidden="true"></div>
              <div
                className={`wheel-circle ${spinning ? 'spinning' : ''}`}
                style={{ background: wheelGradient, transform: `rotate(${rotation}deg)` }}
              >
                <div className="wheel-center">
                  <span>{isTurkish ? 'Soru Carki' : 'Quiz Wheel'}</span>
                </div>
              </div>
            </div>

            <div className="wheel-panel">
              {isComplete ? (
                <div className="wheel-complete">
                  <h4>{isTurkish ? 'Oyun bitti!' : 'Game complete!'}</h4>
                  <p>
                    {isTurkish ? 'Skorun: ' : 'Your score: '}
                    {score}/{totalQuestions}
                  </p>
                  <button className="wheel-restart-btn" onClick={resetGame}>
                    {isTurkish ? 'Yeniden Baslat' : 'Restart'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="wheel-question">
                    {currentQuestion ? currentQuestion.question : isTurkish ? 'Carki dondur ve soruyu al.' : 'Spin the wheel to get a question.'}
                  </div>
                  <div className="wheel-actions">
                    <button
                      className="wheel-spin-btn"
                      onClick={handleSpin}
                      disabled={spinning || (currentIndex !== null && result === null)}
                      aria-label={isTurkish ? 'Carki dondur' : 'Spin wheel'}
                    >
                      {spinning ? (isTurkish ? 'Donuyor...' : 'Spinning...') : isTurkish ? 'Dondur' : 'Spin'}
                    </button>
                  </div>

                  <div className="wheel-answers">
                    <button
                      className="wheel-answer-btn true"
                      onClick={() => handleAnswer(true)}
                      disabled={spinning || currentIndex === null || result !== null}
                      aria-label={isTurkish ? 'Dogru' : 'True'}
                    >
                      {isTurkish ? 'Dogru' : 'True'}
                    </button>
                    <button
                      className="wheel-answer-btn false"
                      onClick={() => handleAnswer(false)}
                      disabled={spinning || currentIndex === null || result !== null}
                      aria-label={isTurkish ? 'Yanlis' : 'False'}
                    >
                      {isTurkish ? 'Yanlis' : 'False'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {result && (
            <div className={`wheel-result ${result}`}>
              <div className="wheel-result-icon">{result === 'correct' ? '\u2713' : '\u2717'}</div>
              <div className="wheel-result-text">
                {result === 'correct' ? '+1' : '0'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WheelQuizGame;
