import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

import "../modules.css";
import "./module4.css";

import { useLanguage } from "../contexts/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";

import { MODULE4_TR } from "../content/module4_lang_tr";
import { MODULE4_EN } from "../content/module4_lang_en";

import InteractiveQuiz from "../components/InteractiveQuiz";
import CardMatchGame from "../components/CardMatchGame";
import WordPuzzleGame from "../components/WordPuzzleGame";
import PasswordSmithGame from "../components/PasswordSmithGame";

/* ---------------------------
   Local helper games (kept here)
---------------------------- */

const PasswordGame = ({ tips = [], isTurkish }) => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    setStrength(score);
    if (score < 2) setFeedback(isTurkish ? "Zayıf 🔴" : "Weak 🔴");
    else if (score < 4) setFeedback(isTurkish ? "Orta 🟡" : "Medium 🟡");
    else setFeedback(isTurkish ? "Güçlü! 🟢" : "Strong! 🟢");
  };

  return (
    <div className="m4-game-container password-game">
      <input
        type="text"
        placeholder={isTurkish ? "Şifreni buraya yaz..." : "Type your password..."}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          checkStrength(e.target.value);
        }}
        className="m4-password-input"
      />
      <div className="m4-strength-bar">
        <div
          className="m4-strength-fill"
          style={{
            width: `${(strength / 4) * 100}%`,
            backgroundColor: strength < 2 ? "#ef4444" : strength < 4 ? "#f59e0b" : "#10b981",
          }}
        />
      </div>
      <p className="m4-feedback-text">{feedback}</p>

      <div className="m4-tips-box">
        <h4>{isTurkish ? "İpuçları:" : "Tips:"}</h4>
        <ul>{tips.map((tip, idx) => <li key={idx}>{tip}</li>)}</ul>
      </div>
    </div>
  );
};

const FlashcardsGame = ({ cards = [] }) => {
  const [flippedIndex, setFlippedIndex] = useState(null);

  return (
    <div className="m4-flashcards-grid">
      {cards.map((card, idx) => (
        <button
          key={idx}
          type="button"
          className={`m4-flashcard ${flippedIndex === idx ? "flipped" : ""}`}
          onClick={() => setFlippedIndex(flippedIndex === idx ? null : idx)}
        >
          <div className="m4-flashcard-inner">
            <div className="m4-flashcard-front">
              <p>{card.front}</p>
              <span className="m4-flip-icon">↻</span>
            </div>
            <div className="m4-flashcard-back">
              <p>{card.back}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const SorterGame = ({ activity, isTurkish }) => {
  const items = activity?.items || [];

  const [placement, setPlacement] = useState(() => ({})); // itemId -> 'pool'|'safe'|'risky'
  const [draggedId, setDraggedId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const init = {};
    for (const it of items) init[it.id] = "pool";
    setPlacement(init);
    setDraggedId(null);
    setShowResults(false);
    setFeedback("");
  }, [activity]); // reset when section changes

  const poolItems = items.filter((it) => (placement[it.id] || "pool") === "pool");
  const safeItems = items.filter((it) => placement[it.id] === "safe");
  const riskyItems = items.filter((it) => placement[it.id] === "risky");

  const allPlaced = items.length > 0 && poolItems.length === 0;

  const onDragStart = (e, id) => {
    setDraggedId(id);
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(id));
    } catch {
      // no-op
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = "move";
    } catch {
      // no-op
    }
  };

  const moveTo = (id, zone) => {
    setPlacement((prev) => ({ ...prev, [id]: zone }));
    setShowResults(false);
    setFeedback("");
  };

  const onDrop = (e, zone) => {
    e.preventDefault();
    const idFromDt = (() => {
      try {
        return e.dataTransfer.getData("text/plain");
      } catch {
        return "";
      }
    })();
    const id = idFromDt || draggedId;
    if (!id) return;
    moveTo(id, zone);
    setDraggedId(null);
  };

  const checkAnswers = () => {
    if (!allPlaced) return;
    setShowResults(true);
    const wrongCount = items.filter((it) => placement[it.id] !== it.correctCategory).length;
    if (wrongCount === 0) {
      setFeedback(isTurkish ? "Harika! Hepsi doğru. ✅" : "Great! All correct. ✅");
    } else {
      setFeedback(
        isTurkish
          ? `Bazıları yanlış. ${wrongCount} tane tekrar dene. 🔁`
          : `Some are wrong. Try again: ${wrongCount} item(s). 🔁`
      );
    }
  };

  const cardClass = (it) => {
    if (!showResults) return "m4-sorter-card";
    const ok = placement[it.id] === it.correctCategory;
    return `m4-sorter-card ${ok ? "is-correct" : "is-wrong"}`;
  };

  return (
    <div className="m4-sorter-dnd">
      <div className="m4-sorter-top">
        <h4 className="m4-sorter-title">Sort It: Safe or Risky?</h4>
        <p className="m4-sorter-instr">
          {isTurkish ? "Davranışları doğru kutuya sürükle." : "Drag each action into the correct box."}
        </p>
      </div>

      <div className="m4-sorter-board">
        {/* LEFT: DRAGGABLE ACTIONS */}
        <div className="m4-sorter-col">
          <div className="m4-sorter-col-head">
            <span className="m4-sorter-col-title">{isTurkish ? "Kartlar" : "Cards"}</span>
          </div>

          <div className="m4-sorter-pool" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "pool")}>
            {poolItems.length === 0 ? (
              <div className="m4-sorter-empty">{isTurkish ? "Tüm kartları kutulara bıraktın!" : "You placed all cards!"}</div>
            ) : (
              poolItems.map((it) => (
                <div
                  key={it.id}
                  className={cardClass(it)}
                  draggable
                  onDragStart={(e) => onDragStart(e, it.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") moveTo(it.id, "safe");
                  }}
                  title={isTurkish ? "Sürükle" : "Drag"}
                >
                  {it.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: DROP ZONES */}
        <div className="m4-sorter-zones">
          <div className="m4-sorter-zone safe" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "safe")}>
            <div className="m4-sorter-zone-head">
              <div className="m4-sorter-zone-badge safe">SAFE</div>
              <div className="m4-sorter-zone-sub">{isTurkish ? "Güvenli" : "Safe"}</div>
            </div>
            <div className="m4-sorter-zone-body">
              {safeItems.length === 0 ? (
                <div className="m4-sorter-empty">{isTurkish ? "Buraya bırak" : "Drop here"}</div>
              ) : (
                safeItems.map((it) => (
                  <div
                    key={it.id}
                    className={cardClass(it)}
                    draggable={!showResults}
                    onDragStart={(e) => onDragStart(e, it.id)}
                  >
                    {it.text}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="m4-sorter-zone risky" onDragOver={onDragOver} onDrop={(e) => onDrop(e, "risky")}>
            <div className="m4-sorter-zone-head">
              <div className="m4-sorter-zone-badge risky">RISKY</div>
              <div className="m4-sorter-zone-sub">{isTurkish ? "Riskli" : "Risky"}</div>
            </div>
            <div className="m4-sorter-zone-body">
              {riskyItems.length === 0 ? (
                <div className="m4-sorter-empty">{isTurkish ? "Buraya bırak" : "Drop here"}</div>
              ) : (
                riskyItems.map((it) => (
                  <div
                    key={it.id}
                    className={cardClass(it)}
                    draggable={!showResults}
                    onDragStart={(e) => onDragStart(e, it.id)}
                  >
                    {it.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="m4-sorter-actions">
        <button type="button" className="m4-check-btn" onClick={checkAnswers} disabled={!allPlaced}>
          {isTurkish ? "Kontrol Et" : "Check Answers"}
        </button>
        <button
          type="button"
          className="m4-sorter-reset"
          onClick={() => {
            const init = {};
            for (const it of items) init[it.id] = "pool";
            setPlacement(init);
            setShowResults(false);
            setFeedback("");
          }}
        >
          {isTurkish ? "Sıfırla" : "Reset"}
        </button>
      </div>

      {feedback && <div className="m4-sorter-feedback">{feedback}</div>}
    </div>
  );
};

/* ---------------------------
   Render helpers (activity/game)
---------------------------- */

function formatMiniQuizQuestionsToInteractiveQuiz(questions = []) {
  // InteractiveQuiz beklediği yapıya çeviriyoruz:
  // {id,type:true_false|multiple_choice, question, options:[{text,correct}], answer, explanation_tr, explanation_en}
  //
  // Not: Module4 içerikleri TR/EN dosyalarından ayrı ayrı geldiği için `explanation`
  // zaten doğru dilde oluyor. InteractiveQuiz ise explanation_tr/en beklediğinden
  // aynı metni her iki alana da koyuyoruz (şema değiştirmeden uyumluluk için).
  return questions.map((q, i) => {
    if (q.type === "tf") {
      return {
        id: i,
        type: "true_false",
        question: q.question,
        options: [],
        answer: q.answer,
        explanation_tr: q.explanation,
        explanation_en: q.explanation,
      };
    }
    // mcq
    return {
      id: i,
      type: "multiple_choice",
      question: q.question,
      options: (q.options || []).map((opt, idx) => ({ text: opt, correct: idx === q.answerIndex })),
      answer: q.answerIndex,
      explanation_tr: q.explanation,
      explanation_en: q.explanation,
    };
  });
}

function ActivityRenderer({ activity, isTurkish }) {
  if (!activity) return null;

  if (activity.type === "mini_quiz") {
    const quizItems = formatMiniQuizQuestionsToInteractiveQuiz(activity.questions || []);
    return <InteractiveQuiz quizItems={quizItems} isTurkish={isTurkish} />;
  }

  if (activity.type === "flashcards") {
    return <FlashcardsGame cards={activity.cards || []} />;
  }

  if (activity.type === "sorter") {
    return <SorterGame activity={activity} isTurkish={isTurkish} />;
  }

  return null;
}

function GameRenderer({ game, isTurkish }) {
  if (!game) return null;

  if (game.type === "password_game") {
    return <PasswordSmithGame isTurkish={isTurkish} tips={game.tips || []} />;
  }

  if (game.type === "word_puzzle") {
    return <WordPuzzleGame isTurkish={isTurkish} words={game.words || []} />;
  }

  if (game.type === "card_match") {
    return <CardMatchGame isTurkish={isTurkish} pairs={game.pairs || []} />;
  }

  return null;
}

/* ---------------------------
   Main Module
---------------------------- */

export default function Module4() {
  const { language } = useLanguage();
  const isTurkish = language === "tr";

  const moduleData = useMemo(() => (isTurkish ? MODULE4_TR.module_4 : MODULE4_EN.module_4), [isTurkish]);
  const sections = moduleData?.sections || [];

  const [activeSection, setActiveSection] = useState(1);
  const [completed, setCompleted] = useState(() => new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const current = sections.find((s) => s.id === activeSection) || sections[0];

  const markComplete = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const progressPct = sections.length ? Math.round((completed.size / sections.length) * 100) : 0;

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} isTurkish={isTurkish} />;
  }

  if (!current) {
    return <div className="module-container module-page module4">Section not found</div>;
  }

  const sectionImages = current.images || [];
  const sectionContent = current.content || [];

  const maxPairs = Math.max(sectionContent.length, sectionImages.length);
  const hasPairedFlow = sectionContent.length > 0 && sectionImages.length > 0;

  return (
    <div className="module-container module-page module4 m4-page">
      <div className="module-layout">
        {/* SIDEBAR */}
        <div className="module-sidebar">
          <div className="sidebar-header">
            {/* ✅ nested <a> yok: wouter Link doğru kullanım */}
            <Link href="/">
              <a className="back-home-btn">← {isTurkish ? "Ana Sayfa" : "Home"}</a>
            </Link>

            <h2>{moduleData.title}</h2>
            <p className="m4-subtitle">{moduleData.subtitle}</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="progress-text">
            {completed.size}/{sections.length} {isTurkish ? "Tamamlandı" : "Completed"} • %{progressPct}
          </p>

          <div className="sections-nav">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`nav-item ${activeSection === s.id ? "active" : ""} ${completed.has(s.id) ? "completed" : ""}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="module-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className="content-wrapper"
            >
              <div className="content-header">
                <h1>{current.title}</h1>

                <button
                  type="button"
                  className="mark-complete-btn"
                  onClick={() => markComplete(activeSection)}
                  disabled={completed.has(activeSection)}
                >
                  {completed.has(activeSection) ? (isTurkish ? "Tamamlandı ✓" : "Completed ✓") : isTurkish ? "Tamamla" : "Complete"}
                </button>
              </div>

              {/* HERO (istersen sadece ilk bölümde göster) */}
              {moduleData.hero_image && activeSection === 1 && (
                <div className="m4-visual-container">
                  <img
                    src={moduleData.hero_image}
                    alt={isTurkish ? "Dijital güvenlik" : "Digital safety"}
                    className="m4-main-image"
                  />
                </div>
              )}

              {/* SECTION BODY */}
              <div className="section-content">
                <div className="section-intro">
                  <p>{current.intro}</p>
                </div>

                {/* Extra helper content (akışı bozmadan, data şemasını değiştirmeden) */}
                <div className="m4-learn-box">
                  <h3 className="m4-learn-title">{isTurkish ? "Bu bölümde neler var?" : "What’s in this section?"}</h3>
                  <p className="m4-learn-sub">
                    {isTurkish
                      ? `Toplam ${sectionContent.length} kısa madde ve ${sectionImages.length} görsel var. Maddeyi oku, resmi incele.`
                      : `You have ${sectionContent.length} short points and ${sectionImages.length} images. Read the point, then look at the picture.`}
                  </p>
                </div>

                {/* CONTENT + IMAGES (Module 3 benzeri “konu anlatımı” akışı) */}
                {hasPairedFlow ? (
                  <div className="m4-flow">
                    {Array.from({ length: maxPairs }).map((_, idx) => {
                      const text = sectionContent[idx];
                      const img = sectionImages[idx];

                      return (
                        <div key={`${current.id}-flow-${idx}`} className="m4-flow-item">
                          <div className="m4-flow-text">
                            {text ? (
                              <div className="m4-flow-bullet">
                                <span className="m4-flow-dot" aria-hidden="true">✓</span>
                                <span>{text}</span>
                              </div>
                            ) : null}
                          </div>

                          <div className="m4-flow-image">
                            {img ? (
                              <img
                                src={img.src}
                                alt={isTurkish ? img.alt_tr : img.alt_en}
                                className="m4-section-image"
                                loading="lazy"
                              />
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="m4-visual-block">
                    <div className="m4-text-block">
                      <ul className="m4-keypoints-list">
                        {sectionContent.map((t, idx) => (
                          <li key={`${current.id}-c-${idx}`}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="m4-image-wrapper">
                      {sectionImages.map((img, idx) => (
                        <div key={`${current.id}-img-${idx}`} style={{ marginBottom: 14 }}>
                          <img
                            src={img.src}
                            alt={isTurkish ? img.alt_tr : img.alt_en}
                            className="m4-section-image"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIVITY */}
                {current.activity && (
                  <div className="activity-box">
                    <h3>{current.activity.title}</h3>
                    <p>{current.activity.description}</p>
                    <ActivityRenderer activity={current.activity} isTurkish={isTurkish} />
                  </div>
                )}

                {/* GAME */}
                {current.game && (
                  <div className="activity-box m4-game-box">
                    <h3 style={{ color: "#ec4899" }}>🎮 {current.game.title}</h3>
                    <p>{current.game.description}</p>
                    <GameRenderer game={current.game} isTurkish={isTurkish} />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* NAV */}
          <div className="section-navigation">
            <button
              type="button"
              className="nav-btn prev"
              onClick={() => {
                setActiveSection((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={activeSection === 1}
            >
              {isTurkish ? "Önceki" : "Previous"}
            </button>

            <button
              type="button"
              className="nav-btn next"
              onClick={() => {
                markComplete(activeSection);
                setActiveSection((p) => Math.min(sections.length, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={activeSection === sections.length}
            >
              {isTurkish ? "Sonraki" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
