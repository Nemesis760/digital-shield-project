import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingScreen from "../components/LoadingScreen";
import Module4MiniQuiz from "../components/Module4MiniQuiz";
import Module4ScenarioQuiz from "../components/Module4ScenarioQuiz";
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
  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];

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
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
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
                <img
                  src={moduleData.hero_image}
                  alt={isTurkish ? "Dijital güvenlik görseli" : "Digital safety visual"}
                  className="section-hero-image"
                />

                <div className="section-intro">
                  <p>{currentSection.intro}</p>
                </div>

                <div className="m4-paragraphs">
                  {currentSection.content.map((paragraph, idx) => (
                    <p key={`${currentSection.id}-p-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="m4-image-note">
                  {isTurkish
                    ? "Not: Görseller placeholder olarak eklendi. Dosyalar eklendiğinde otomatik görünecek."
                    : "Note: Images are placeholders. They will appear automatically once added."}
                </div>

                <div className="m4-image-grid">
                  {currentSection.images.map((img, idx) => (
                    <figure key={`${currentSection.id}-img-${idx}`} className="m4-image-card">
                      <img src={img.src} alt={isTurkish ? img.alt_tr : img.alt_en} loading="lazy" />
                      <figcaption>{isTurkish ? img.alt_tr : img.alt_en}</figcaption>
                    </figure>
                  ))}
                </div>

                <div className="activity-box">
                  <h3>{currentSection.activity.title}</h3>
                  <p>{currentSection.activity.description}</p>
                  <ActivityRenderer activity={currentSection.activity} isTurkish={isTurkish} />
                </div>

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
