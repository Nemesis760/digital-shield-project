import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import Module4MiniQuiz from "../components/Module4MiniQuiz";
import Module4ScenarioQuiz from "../components/Module4ScenarioQuiz";
import StrongPasswordGame from "../components/StrongPasswordGame";
import WordPuzzleGame from "../components/WordPuzzleGame";
import CardMatchGame from "../components/CardMatchGame";
import { MODULE4_TR } from "../content/module4_lang_tr";
import { MODULE4_EN } from "../content/module4_lang_en";

import "../modules.css";
import "./module4.css";

function Module4() {
  const { language } = useLanguage();
  const isTurkish = language === "tr";

  const [activeSection, setActiveSection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const moduleData = useMemo(() => (isTurkish ? MODULE4_TR.module_4 : MODULE4_EN.module_4), [isTurkish]);
  const sections = moduleData.sections;
  const currentSection = sections[activeSection - 1] || sections[0];
  const mainImage = Array.isArray(currentSection.images) && currentSection.images.length > 0 ? currentSection.images[0] : null;
  const mainCaption = mainImage
    ? isTurkish
      ? mainImage.alt_tr || mainImage.alt_en || ""
      : mainImage.alt_en || mainImage.alt_tr || ""
    : "";

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} isTurkish={isTurkish} />;
  }

  return (
    <div className="module-container module4">
      <div className="module-layout">
        <aside className="module-sidebar">
          <div className="sidebar-header">
            <Link href="/" className="back-home-btn">
              {isTurkish ? "Ana Sayfa" : "Home"}
            </Link>
            <h2>{moduleData.title}</h2>
            <p>{moduleData.subtitle}</p>
          </div>

          <div className="sections-nav">
            {sections.map((section, index) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === index + 1 ? "active" : ""}`}
                onClick={() => setActiveSection(index + 1)}
              >
                {section.title}
              </button>
            ))}
          </div>
        </aside>

        <main className="module-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="content-wrapper"
            >
              <div className="content-header">
                <h1>{currentSection.title}</h1>
              </div>

              <div className="section-content">
                <div className="m4-visual-block">
                  {mainImage && (
                    <div className="m4-image-wrapper">
                      <img
                        src={mainImage.src}
                        alt={mainCaption}
                        className="m4-section-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {mainCaption && <div className="m4-image-caption">{mainCaption}</div>}
                    </div>
                  )}

                  <div className="m4-text-block">
                    {currentSection.subtitle && <p className="m4-subtitle">{currentSection.subtitle}</p>}

                    <div className="section-intro">
                      <p>{currentSection.intro}</p>
                    </div>

                    <div className="m4-paragraphs">
                      {currentSection.content.map((paragraph, idx) => (
                        <p key={`${currentSection.id}-p-${idx}`}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {currentSection.activity && (
                  <div className="activity-box">
                    <h3>{currentSection.activity.title}</h3>
                    <p>{currentSection.activity.description}</p>
                    <ActivityRenderer activity={currentSection.activity} isTurkish={isTurkish} />
                  </div>
                )}

                {currentSection.game && (
                  <div className="activity-box">
                    <h3>{currentSection.game.title}</h3>
                    <p>{currentSection.game.description}</p>
                    <GameRenderer game={currentSection.game} isTurkish={isTurkish} />
                    {currentSection.game.type === "password_game" && Array.isArray(currentSection.game.tips) && (
                      <div className="m4-game-notes">
                        <p className="m4-game-notes-title">
                          {isTurkish ? "Güçlü parola için ipuçları:" : "Tips for a strong password:"}
                        </p>
                        <ul className="m4-game-tips">
                          {currentSection.game.tips.map((tip, idx) => (
                            <li key={`tip-${idx}`}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === sections.length && (
                  <div className="activity-box">
                    <h3>{moduleData.scenario.title}</h3>
                    <p>{moduleData.scenario.description}</p>
                    <Module4ScenarioQuiz isTurkish={isTurkish} />
                  </div>
                )}

                <div className="section-navigation">
                  <button
                    className="nav-btn prev"
                    onClick={() => setActiveSection((prev) => Math.max(1, prev - 1))}
                    disabled={activeSection === 1}
                  >
                    {isTurkish ? "Önceki" : "Previous"}
                  </button>
                  <button
                    className="nav-btn next"
                    onClick={() => setActiveSection((prev) => Math.min(sections.length, prev + 1))}
                    disabled={activeSection === sections.length}
                  >
                    {isTurkish ? "Sonraki" : "Next"}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ActivityRenderer({ activity, isTurkish }) {
  if (!activity) return null;

  if (activity.type === "mini_quiz") {
    return <Module4MiniQuiz isTurkish={isTurkish} questions={activity.questions} />;
  }

  if (activity.type === "flashcards") {
    return <Flashcards cards={activity.cards} />;
  }

  if (activity.type === "sorter") {
    return <Sorter activity={activity} isTurkish={isTurkish} />;
  }

  return (
    <div className="m4-activity-placeholder">
      {isTurkish ? "Aktivite yüklenemedi." : "Activity could not be loaded."}
    </div>
  );
}

function GameRenderer({ game, isTurkish }) {
  if (!game) return null;

  if (game.type === "password_game") {
    return <StrongPasswordGame isTurkish={isTurkish} />;
  }

  if (game.type === "word_puzzle") {
    return <WordPuzzleGame isTurkish={isTurkish} words={game.words} />;
  }

  if (game.type === "card_match") {
    return <CardMatchGame isTurkish={isTurkish} pairs={game.pairs} />;
  }

  return null;
}

function Flashcards({ cards = [] }) {
  const [flipped, setFlipped] = useState(() => new Set());

  return (
    <div className="m4-flashcards">
      {cards.map((card, idx) => {
        const isFlipped = flipped.has(idx);
        return (
          <button
            key={`${card.front}-${idx}`}
            className={`m4-flashcard ${isFlipped ? "flipped" : ""}`}
            onClick={() => {
              setFlipped((prev) => {
                const next = new Set(prev);
                next.has(idx) ? next.delete(idx) : next.add(idx);
                return next;
              });
            }}
          >
            <div className="m4-flashcard-inner">
              <div className="m4-flashcard-front">{card.front}</div>
              <div className="m4-flashcard-back">{card.back}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Sorter({ activity, isTurkish }) {
  const { categories, items } = activity;
  const [assignments, setAssignments] = useState({});
  const [checked, setChecked] = useState(false);

  const onPick = (itemId, categoryId) => {
    setAssignments((prev) => ({ ...prev, [itemId]: categoryId }));
    setChecked(false);
  };

  const reset = () => {
    setAssignments({});
    setChecked(false);
  };

  return (
    <div className="m4-sorter">
      {items.map((item) => {
        const selected = assignments[item.id];
        const isCorrect = selected && selected === item.correctCategory;
        return (
          <div
            key={item.id}
            className={`m4-sorter-item ${checked ? (isCorrect ? "correct" : "wrong") : ""}`}
          >
            <div className="m4-sorter-text">{item.text}</div>
            <div className="m4-sorter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`m4-sorter-btn ${selected === cat.id ? "active" : ""}`}
                  onClick={() => onPick(item.id, cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="m4-sorter-actions">
        <button className="m4-sorter-check" onClick={() => setChecked(true)} disabled={!items.length}>
          {isTurkish ? "Kontrol Et" : "Check"}
        </button>
        <button className="m4-sorter-reset" onClick={reset}>
          {isTurkish ? "Sıfırla" : "Reset"}
        </button>
      </div>
    </div>
  );
}

export default Module4;
