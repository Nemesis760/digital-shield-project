import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Module4MiniQuiz({ isTurkish, questions = [] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!questions.length) {
    return <div className="m4-mini-quiz-empty">{isTurkish ? "Soru bulunamadı." : "No questions found."}</div>;
  }

  const q = questions[index];
  const isCorrect =
    q.type === "tf" ? picked === q.answer : q.type === "mcq" ? picked === q.answerIndex : false;

  const next = () => {
    setPicked(null);
    setShowFeedback(false);
    setIndex((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
  };

  return (
    <div className="m4-mini-quiz">
      <div className="m4-mini-quiz-header">
        <span className="m4-mini-quiz-count">
          {index + 1}/{questions.length}
        </span>
        <div className="m4-mini-quiz-question">{q.question}</div>
      </div>

      {q.type === "tf" && (
        <div className="m4-mini-quiz-options">
          <button
            className={`m4-mini-quiz-option ${picked === true ? "active" : ""}`}
            onClick={() => setPicked(true)}
          >
            {isTurkish ? "Doğru" : "True"}
          </button>
          <button
            className={`m4-mini-quiz-option ${picked === false ? "active" : ""}`}
            onClick={() => setPicked(false)}
          >
            {isTurkish ? "Yanlış" : "False"}
          </button>
        </div>
      )}

      {q.type === "mcq" && (
        <div className="m4-mini-quiz-options grid">
          {q.options.map((opt, i) => (
            <button
              key={`${opt}-${i}`}
              className={`m4-mini-quiz-option ${picked === i ? "active" : ""}`}
              onClick={() => setPicked(i)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <div className="m4-mini-quiz-actions">
        <button
          className="m4-mini-quiz-btn primary"
          onClick={() => setShowFeedback(true)}
          disabled={picked === null}
        >
          {isTurkish ? "Kontrol Et" : "Check"}
        </button>
        <button className="m4-mini-quiz-btn" onClick={next}>
          {isTurkish ? "Sonraki" : "Next"}
        </button>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className={`m4-mini-quiz-feedback ${isCorrect ? "ok" : "bad"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="m4-mini-quiz-feedback-title">
              {isCorrect ? (isTurkish ? "Doğru!" : "Correct!") : isTurkish ? "Yanlış!" : "Incorrect!"}
            </div>
            <div className="m4-mini-quiz-feedback-text">{q.explanation}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Module4MiniQuiz;
