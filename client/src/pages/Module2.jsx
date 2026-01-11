import { useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { MODULE2_TR } from '../content/module2_lang_tr';
import { MODULE2_EN } from '../content/module2_lang_en';
import LoadingScreen from '../components/LoadingScreen';
import { useLanguage } from '../contexts/LanguageContext';
import CardMatchingGame from '../components/CardMatchingGame';
import HardwareHotspot from '../components/HardwareHotspot';
import TruthOrTrollGame from '../components/TruthOrTrollGame';
import InteractiveQuiz from '../components/InteractiveQuiz';
import ScenarioGame from '../components/ScenarioGame';
import StoryMode from '../components/StoryMode';
import ContentQuizGame from '../components/ContentQuizGame';
import WheelQuizGame from '../components/WheelQuizGame';
import '../modules.css';

// Her bolum icin genel bir bilesen
const SectionComponent = ({ section, isTurkish }) => {
  const [showStory, setShowStory] = useState(false);
  const renderActivity = () => {
    const activityType = section.activity_type;

    switch (activityType) {
      case 'card_matching':
        return <CardMatchingGame isTurkish={isTurkish} />;
      case 'network_hotspot':
        // Network devices hotspot - we'll adapt HardwareHotspot or create a new one
        return <HardwareHotspot isTurkish={isTurkish} />;
      case 'truth_or_troll':
        return <TruthOrTrollGame isTurkish={isTurkish} />;
      case 'quiz':
      case 'content_quiz':
        return <ContentQuizGame section={section} isTurkish={isTurkish} />;
      case 'interactive_quiz': {
        // Section icindeki quiz sorularini bul
        let quizContent = null;
        if (section.content) {
          // Tum content item'larinda quiz ara
          for (const key in section.content) {
            if (section.content[key]?.quiz) {
              quizContent = section.content[key].quiz;
              break;
            }
          }
        }
        return quizContent ? (
          <InteractiveQuiz quizItems={quizContent} isTurkish={isTurkish} />
        ) : (
          <div className="activity-placeholder">
            <p className="activity-placeholder-text">
              {isTurkish ? 'Quiz soruları yükleniyor...' : 'Loading quiz questions...'}
            </p>
          </div>
        );
      }
      case 'scenario_game':
        return <ScenarioGame isTurkish={isTurkish} isModule2 />;
      case 'wheel_quiz': {
        const wheelQuestions = section?.content?.wheel_questions || section?.wheel_questions || [];
        return <WheelQuizGame isTurkish={isTurkish} questions={wheelQuestions} />;
      }
      default:
        return (
          <div className="activity-placeholder">
            <p className="activity-placeholder-text">
              {isTurkish ? 'Aktivite bileşeni yükleniyor...' : 'Loading activity component...'}
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="section-content"
    >
      {section.subtitle && (
        <div className="section-subtitle">
          <p>{section.subtitle}</p>
        </div>
      )}

      <div className="section-intro">
        <p>{section.intro}</p>
      </div>

      {/* Content Sections */}
      {section.content && (
        <div className="content-sections">
          {Object.entries(section.content).map(([key, contentItem]) => (
            <motion.div
              key={key}
              className="content-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="content-item-title">{contentItem.title}</h3>

              {contentItem.image && (
                <img
                  src={contentItem.image}
                  alt={contentItem.title}
                  className="content-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              <p className="content-description">{contentItem.description}</p>

              {contentItem.points && (
                <ul className="content-points">
                  {contentItem.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}

              {contentItem.examples && Array.isArray(contentItem.examples) && (
                <div className="content-examples">
                  <h4>{isTurkish ? 'Örnekler:' : 'Examples:'}</h4>
                  <ul>
                    {contentItem.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(contentItem.video_links) && contentItem.video_links.length > 0 && (
                <div className="video-cards">
                  <h4 className="video-cards-title">
                    {contentItem.video_title || (isTurkish ? 'Video Kartları' : 'Video Cards')}
                  </h4>
                  <div className="video-cards-grid">
                    {contentItem.video_links.map((video, idx) => (
                      <div className="video-card" key={`${key}-video-${idx}`}>
                        <div className="video-card-thumb">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="video-card-body">
                          <p className="video-card-title">{video.title}</p>
                          <button
                            className="video-card-btn"
                            onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}
                            aria-label={isTurkish ? 'Videoyu yeni sekmede aç' : 'Open video in new tab'}
                          >
                            {contentItem.video_cta || (isTurkish ? 'İzle' : 'Watch')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contentItem.quiz &&
                section.activity_type !== 'content_quiz' &&
                section.activity_type !== 'interactive_quiz' && (
                  <InteractiveQuiz quizItems={contentItem.quiz} isTurkish={isTurkish} />
                )}

              {contentItem.story_images && (
                <div className="story-images-section">
                  <button onClick={() => setShowStory(true)} className="story-open-btn">
                    {isTurkish ? 'Dijital Ayak İzi Hikayesini Oku' : 'Read Digital Footprint Story'}
                  </button>
                  <StoryMode isOpen={showStory} onClose={() => setShowStory(false)} isTurkish={isTurkish} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Aktivite Alani */}
      <div className="activity-box">
        <h3>{section.activity_title}</h3>
        <p>{section.activity_desc}</p>
        {renderActivity()}
      </div>
    </motion.div>
  );
};

// Ana Module2 Bileseni
function Module2() {
  const languageState = useLanguage?.();
  const language = languageState?.language || 'tr';
  const isTurkish = language === 'tr';
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const moduleData = isTurkish ? MODULE2_TR.module_2 : MODULE2_EN.module_2;

  const sections = moduleData.sections.map((section, index) => ({
    id: index + 1,
    title_tr: section.title,
    component: () => <SectionComponent section={section} isTurkish={isTurkish} />
  }));

  const handleSectionComplete = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);

      if (newCompleted.length === sections.length) {
        const progress = JSON.parse(localStorage.getItem('digitalShieldProgress') || '{}');
        progress.module2 = true;
        localStorage.setItem('digitalShieldProgress', JSON.stringify(progress));

        window.dispatchEvent(new CustomEvent('moduleCompleted', { detail: { module: 'module2' } }));

        setTimeout(() => {
          alert(
            isTurkish
              ? "Tebrikler! Modül 2'yi tamamladın! Artık Modül 3'e geçebilirsin!"
              : 'Congratulations! You completed Module 2! You can now access Module 3!'
          );
        }, 500);
      }
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  const SectionComponentToRender = currentSection?.component;

  if (isLoading) {
    setTimeout(() => setIsLoading(false), 1000);
    return <LoadingScreen onComplete={() => setIsLoading(false)} isTurkish={isTurkish} />;
  }

  return (
    <div className="module-container module-page module2">
      <div className="module-layout">
        {/* Sol Menu */}
        <div className="module-sidebar">
          <div className="sidebar-header">
            <Link href="/" className="back-home-btn">
              {'<-'} {isTurkish ? 'Ana Sayfa' : 'Home'}
            </Link>
            <h2>{moduleData.title}</h2>
            <p>{moduleData.subtitle}</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(completedSections.length / sections.length) * 100}%` }}></div>
          </div>
          <p className="progress-text">
            {completedSections.length}/{sections.length} {isTurkish ? 'Tamamlandı' : 'Completed'}
          </p>

          <div className="sections-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''} ${completedSections.includes(section.id) ? 'completed' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title_tr}
              </button>
            ))}
          </div>
        </div>

        {/* Ana Icerik */}
        <div className="module-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="content-wrapper"
            >
              <div className="content-header">
                <h1>{currentSection?.title_tr}</h1>
                <button
                  className="mark-complete-btn"
                  onClick={() => handleSectionComplete(activeSection)}
                  disabled={completedSections.includes(activeSection)}
                >
                  {completedSections.includes(activeSection)
                    ? isTurkish
                      ? 'Tamamlandı'
                      : 'Completed'
                    : isTurkish
                      ? 'Tamamla'
                      : 'Complete'}
                </button>
              </div>

              {SectionComponentToRender && <SectionComponentToRender />}
            </motion.div>
          </AnimatePresence>

          {/* Bolum Navigasyonu */}
          <div className="section-navigation">
            <button
              className="nav-btn prev"
              onClick={() => {
                setActiveSection((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={activeSection === 1}
            >
              {'<-'} {isTurkish ? 'Önceki' : 'Previous'}
            </button>

            <button
              className="nav-btn next"
              onClick={() => {
                handleSectionComplete(activeSection);
                setActiveSection((prev) => Math.min(sections.length, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={activeSection === sections.length}
            >
              {isTurkish ? 'Sonraki' : 'Next'} {'->'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Module2;
