import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../modules.css';

function InteractiveQuiz({ quizItems, isTurkish }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});

  const isCorrectAnswer = (quizItem, selected) => {
    if (quizItem.type === 'true_false') return selected === quizItem.answer;
    if (quizItem.type === 'multiple_choice') return quizItem.options?.[selected]?.correct === true;
    return false;
  };

  const getOptionText = (option) => {
    if (!option) return '';
    return option.text || (isTurkish ? option.text_tr : option.text_en) || '';
  };

  const getCorrectText = (quizItem) => {
    if (quizItem.type === 'true_false') {
      return quizItem.answer ? (isTurkish ? 'Do?ru' : 'True') : (isTurkish ? 'Yanl??' : 'False');
    }
    if (quizItem.type === 'multiple_choice') {
      const correctOpt = quizItem.options?.find((o) => o.correct);
      return getOptionText(correctOpt);
    }
    return '';
  };

  const resolveFeedback = (feedback) => {
    if (!feedback) return '';
    if (typeof feedback === 'string') return feedback;
    if (typeof feedback === 'object') {
      return isTurkish ? feedback.tr || '' : feedback.en || '';
    }
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
        <p>{isTurkish ? 'Quiz sorular? bulunamad?.' : 'Quiz questions not found.'}</p>
      </div>
    );
  }

  return (
    <div className="interactive-quiz-container">
      <h4 className="quiz-section-title">{isTurkish ? 'Kendini Test Et:' : 'Test Yourself:'}</h4>

      {quizItems.map((quizItem, quizIndex) => {
        const answered = !!showResults[quizIndex];
        const selected = selectedAnswers[quizIndex];
        const correct = answered ? isCorrectAnswer(quizItem, selected) : null;
        const questionText =
          quizItem.question || (isTurkish ? quizItem.question_tr : quizItem.question_en);

        const explanation = isTurkish ? quizItem.explanation_tr : quizItem.explanation_en;
        const baseCorrectFeedback = resolveFeedback(quizItem.correctFeedback) || (isTurkish
          ? `Do?ru. Bu sorunun mant???: ${explanation || 'do?ru se?imi yapt?n.'}`
          : `Correct. The reasoning: ${explanation || 'you selected the right choice.'}`);
        const baseWrongFeedback = resolveFeedback(quizItem.wrongFeedback) || (isTurkish
          ? `Yanl??. Do?rusu ?u y?zden: ${explanation || 'do?ru se?enek farkl?d?r.'}`
          : `Incorrect. The reason is: ${explanation || 'the correct choice is different.'}`);
        const correctText = getCorrectText(quizItem);
        const wrongFeedback =
          quizItem.type === 'multiple_choice' && correctText
            ? `${baseWrongFeedback} ${isTurkish ? 'Do?ru cevap:' : 'Correct answer:'} ${correctText}`
            : baseWrongFeedback;

        const explanationText =
          explanation ||
          (isTurkish
            ? `Bu sorunun mant???: do?ru cevap ${getCorrectText(quizItem)}.`
            : `The logic: the correct answer is ${getCorrectText(quizItem)}.`);

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
                    answered && selected === true ? (quizItem.answer === true ? 'correct' : 'wrong') : ''
                  } ${answered && quizItem.answer === true ? 'show-correct' : ''}`}
                  onClick={() => handleTF(quizIndex, true)}
                  disabled={answered}
                >
                  {isTurkish ? '? Do?ru' : '? True'}
                </motion.button>

                <motion.button
                  className={`true-false-btn false-btn ${
                    answered && selected === false ? (quizItem.answer === false ? 'correct' : 'wrong') : ''
                  } ${answered && quizItem.answer === false ? 'show-correct' : ''}`}
                  onClick={() => handleTF(quizIndex, false)}
                  disabled={answered}
                >
                  {isTurkish ? '? Yanl??' : '? False'}
                </motion.button>
              </div>
            )}

            {quizItem.type === 'multiple_choice' && (
              <div className="interactive-quiz-options">
                {quizItem.options.map((option, optIndex) => {
                  const isSelected = selected === optIndex;
                  const isCorrect = option.correct === true;

                  return (
                    <motion.button
                      key={optIndex}
                      className={`interactive-quiz-option ${
                        answered
                          ? isCorrect
                            ? 'correct'
                            : isSelected && !isCorrect
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
                      {answered && isCorrect && <span className="option-icon">?</span>}
                      {answered && isSelected && !isCorrect && <span className="option-icon">?</span>}
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
                      <p>? {isTurkish ? 'Do?ru!' : 'Correct!'}</p>
                      <p className="quiz-explain">{baseCorrectFeedback}</p>
                      {quizItem.type === 'true_false' && (
                        <p className="quiz-explain">{explanationText}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>? {isTurkish ? 'Yanl??!' : 'Incorrect!'}</p>
                      <p className="quiz-explain">{wrongFeedback}</p>
                      {quizItem.type === 'true_false' && (
                        <p className="quiz-explain">{explanationText}</p>
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
