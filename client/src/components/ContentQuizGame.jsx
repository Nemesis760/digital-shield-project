import { useEffect, useMemo, useState } from 'react';
import './ContentQuizGame.css';

const ContentQuizGame = ({ section, isTurkish }) => {
  const questions = useMemo(() => {
    if (!section?.content) {
      return [];
    }
    const keys = Object.keys(section.content).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
    const merged = [];
    keys.forEach((key) => {
      const item = section.content[key];
      if (Array.isArray(item?.quiz)) {
        item.quiz.forEach((quizItem) => {
          merged.push(quizItem);
        });
      }
    });
    return merged;
  }, [section]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback('');
    setIsComplete(false);
  }, [section?.id, questions.length]);

  if (!questions.length) {
    return (
      <div className="content-quiz-game empty">
        <p>{isTurkish ? 'Bu bolum icin quiz bulunamadi.' : 'No quiz found for this section.'}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value, optionIndex = null) => {
    if (selected !== null || isComplete) {
      return;
    }
    let isCorrect = false;
    if (currentQuestion.type === 'true_false') {
      isCorrect = value === currentQuestion.answer;
    } else if (currentQuestion.type === 'multiple_choice' && Array.isArray(currentQuestion.options)) {
      isCorrect = Boolean(currentQuestion.options[optionIndex]?.correct);
    }

    setSelected(optionIndex ?? value);
    setFeedback(isCorrect ? (isTurkish ? 'Dogru!' : 'Correct!') : (isTurkish ? 'Yanlis.' : 'Wrong.'));
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setFeedback('');
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback('');
    setIsComplete(false);
  };

  return (
    <div className="content-quiz-game">
      <div className="content-quiz-header">
        <div className="content-quiz-progress">
          {isTurkish ? 'Soru' : 'Question'} {currentIndex + 1}/{questions.length}
        </div>
        <div className="content-quiz-score">
          {isTurkish ? 'Skor' : 'Score'}: {score}/{questions.length}
        </div>
      </div>

      {isComplete ? (
        <div className="content-quiz-complete">
          <h4>{isTurkish ? 'Tamamlandi!' : 'Completed!'}</h4>
          <p>
            {isTurkish ? 'Toplam skorun: ' : 'Your total score: '}
            {score}/{questions.length}
          </p>
          <button className="content-quiz-restart" onClick={handleRestart}>
            {isTurkish ? 'Tekrar Baslat' : 'Restart'}
          </button>
        </div>
      ) : (
        <>
          <div className="content-quiz-question">{currentQuestion.question}</div>

          {currentQuestion.type === 'multiple_choice' && (
            <div className="content-quiz-options">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selected === index;
                const optionClass = isSelected
                  ? option.correct
                    ? 'content-quiz-option correct'
                    : 'content-quiz-option wrong'
                  : 'content-quiz-option';
                return (
                  <button
                    key={`${currentIndex}-opt-${index}`}
                    className={optionClass}
                    onClick={() => handleAnswer(option.text, index)}
                    disabled={selected !== null}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'true_false' && (
            <div className="content-quiz-options true-false">
              <button
                className={`content-quiz-option ${selected === true ? (currentQuestion.answer ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleAnswer(true)}
                disabled={selected !== null}
              >
                {isTurkish ? 'Dogru' : 'True'}
              </button>
              <button
                className={`content-quiz-option ${selected === false ? (!currentQuestion.answer ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleAnswer(false)}
                disabled={selected !== null}
              >
                {isTurkish ? 'Yanlis' : 'False'}
              </button>
            </div>
          )}

          {feedback && (
            <div className={`content-quiz-feedback ${feedback.includes('Dogru') || feedback.includes('Correct') ? 'correct' : 'wrong'}`}>
              {feedback}
            </div>
          )}

          <div className="content-quiz-actions">
            <button className="content-quiz-next" onClick={handleNext} disabled={selected === null}>
              {currentIndex + 1 >= questions.length
                ? isTurkish
                  ? 'Bitir'
                  : 'Finish'
                : isTurkish
                  ? 'Sonraki'
                  : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentQuizGame;
