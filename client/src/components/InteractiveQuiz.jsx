import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../modules.css';

function InteractiveQuiz({ quizItems, isTurkish }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});

  const isCorrectAnswer = (quizItem, selected) => {
    if (quizItem.type === 'true_false') return selected === quizItem.answer;
    if (quizItem.type === 'multiple_choice')
      return quizItem.options?.[selected]?.correct === true;
    return false;
  };

  const getOptionText = (option) => {
    if (!option) return '';
    return option.text || (isTurkish ? option.text_tr : option.text_en) || '';
  };

  const getCorrectText = (quizItem) => {
    if (quizItem.type === 'true_false') {
      return quizItem.answer
        ? (isTurkish ? 'Doğru' : 'True')
        : (isTurkish ? 'Yanlış' : 'False');
    }

    if (quizItem.type === 'multiple_choice') {
      const correctOpt = quizItem.options?.find((o) => o.correct);
      return getOptionText(correctOpt);
    }

    return '';
  };

  // ✅ reason_tr / reason_en (preferred)
  // Supports:
  // reason_tr: { correct: "...", wrong: "..." }
  // reason_en: { correct: "...", wrong: "..." }
  const getReasonText = (quizItem, isCorrect) => {
    const reason = isTurkish ? quizItem.reason_tr : quizItem.reason_en;

    if (reason && typeof reason === 'object') {
      return isCorrect ? reason.correct || '' : reason.wrong || '';
    }

    if (typeof reason === 'string') return reason;

    // fallback (older content)
    const expl = isTurkish ? quizItem.explanation_tr : quizItem.explanation_en;
    return expl || '';
  };

  // fallback helper for older feedback objects/strings
  const resolveFeedback = (feedback) => {
    if (!feedback) return '';
    if (typeof feedback === 'string') return feedback;
    if (typeof feedback === 'object') return isTurkish ? feedback.tr || '' : feedback.en || '';
    return '';
  };

  const handleMC = (quizIndex, optIndex) => {
    if (showResults[quizIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizIndex]: optIndex }));
    setShowResults((prev) => ({ ...prev, [quizIndex]: true }));
  };

  const handleTF = (quizIndex, val) => {
    if (showResults[quizIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizIndex]: val }));
    setShowResults((prev) => ({ ...prev, [quizIndex]: true }));
  };

  if (!quizItems || quizItems.length === 0) {
    return (
      <div className="interactive-quiz-container">
        <p>{isTurkish ? 'Quiz soruları bulunamadı.' : 'Quiz questions not found.'}</p>
      </div>
    );
  }

  return (
    <div className="interactive-quiz-container">
      <h4 className="quiz-section-title">
        {isTurkish ? 'Kendini Test Et:' : 'Test Yourself:'}
      </h4>

      {quizItems.map((quizItem, quizIndex) => {
        const answered = !!showResults[quizIndex];
        const selected = selectedAnswers[quizIndex];
        const correct = answered ? isCorrectAnswer(quizItem, selected) : null;

        const questionText =
          quizItem.question || (isTurkish ? quizItem.question_tr : quizItem.question_en);

        // Legacy feedback fallback (if reason_* not provided)
        const legacyExplanation = isTurkish ? quizItem.explanation_tr : quizItem.explanation_en;

        const legacyCorrectFeedback =
          resolveFeedback(quizItem.correctFeedback) ||
          (isTurkish
            ? `Doğru. ${legacyExplanation || ''}`.trim()
            : `Correct. ${legacyExplanation || ''}`.trim());

        const legacyWrongFeedback =
          resolveFeedback(quizItem.wrongFeedback) ||
          (isTurkish
            ? `Yanlış. ${legacyExplanation || ''}`.trim()
            : `Incorrect. ${legacyExplanation || ''}`.trim());

        const correctText = getCorrectText(quizItem);

        // For BOTH true_false and multiple_choice:
        // Prefer reason_text; if empty, fall back to legacy feedback.
        const reasonCorrect = getReasonText(quizItem, true);
        const reasonWrong = getReasonText(quizItem, false);

        const finalCorrectReason = reasonCorrect || legacyCorrectFeedback;
        const finalWrongReason = reasonWrong || legacyWrongFeedback;

        return (
          <motion.div
            key={quizIndex}
            className="interactive-quiz-item"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: quizIndex * 0.06 }}
          >
            <p className="interactive-quiz-question">{questionText}</p>

            {quizItem.type === 'true_false' && (
              <div className="quiz-true-false-buttons">
                <motion.button
                  className={`true-false-btn true-btn ${
                    answered && selected === true
                      ? quizItem.answer === true
                        ? 'correct'
                        : 'wrong'
                      : ''
                  } ${answered && quizItem.answer === true ? 'show-correct' : ''}`}
                  onClick={() => handleTF(quizIndex, true)}
                  disabled={answered}
                >
                  {isTurkish ? '✔ Doğru' : '✔ True'}
                </motion.button>

                <motion.button
                  className={`true-false-btn false-btn ${
                    answered && selected === false
                      ? quizItem.answer === false
                        ? 'correct'
                        : 'wrong'
                      : ''
                  } ${answered && quizItem.answer === false ? 'show-correct' : ''}`}
                  onClick={() => handleTF(quizIndex, false)}
                  disabled={answered}
                >
                  {isTurkish ? '✘ Yanlış' : '✘ False'}
                </motion.button>
              </div>
            )}

            {quizItem.type === 'multiple_choice' && (
              <div className="interactive-quiz-options">
                {quizItem.options?.map((option, optIndex) => {
                  const isSelected = selected === optIndex;
                  const isOptCorrect = option.correct === true;

                  return (
                    <motion.button
                      key={optIndex}
                      className={`interactive-quiz-option ${
                        answered
                          ? isOptCorrect
                            ? 'correct'
                            : isSelected && !isOptCorrect
                            ? 'wrong'
                            : ''
                          : isSelected
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => handleMC(quizIndex, optIndex)}
                      disabled={answered}
                    >
                      <span className="option-text">{getOptionText(option)}</span>
                      {answered && isOptCorrect && <span className="option-icon">✔</span>}
                      {answered && isSelected && !isOptCorrect && <span className="option-icon">✘</span>}
                    </motion.button>
                  );
                })}
              </div>
            )}

            <AnimatePresence>
              {answered && (
                <motion.div
                  className={`quiz-feedback ${correct ? 'correct-feedback' : 'wrong-feedback'}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {correct ? (
                    <div>
                      <p>✔ {isTurkish ? 'Doğru!' : 'Correct!'}</p>
                      <p className="quiz-explain">
                        {isTurkish ? 'Neden doğru? ' : 'Why correct? '}
                        {finalCorrectReason}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>✘ {isTurkish ? 'Yanlış!' : 'Incorrect!'}</p>
                      <p className="quiz-explain">
                        {isTurkish ? 'Neden yanlış? ' : 'Why wrong? '}
                        {finalWrongReason}
                      </p>

                      {/* Always show correct answer on wrong */}
                      {correctText && (
                        <p className="quiz-explain">
                          {isTurkish ? 'Doğru cevap:' : 'Correct answer:'} {correctText}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default InteractiveQuiz;
