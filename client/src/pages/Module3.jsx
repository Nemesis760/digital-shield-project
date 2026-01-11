// -*- coding: utf-8 -*-
import { useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';

import { MODULE3_TR } from '../content/module3_lang_tr';
import { MODULE3_EN } from '../content/module3_lang_en';

import LoadingScreen from '../components/LoadingScreen';
import { useLanguage } from '../contexts/LanguageContext';

import CardMatchingGame from '../components/CardMatchingGame';
import HardwareHotspot from '../components/HardwareHotspot';
import NetworkDeviceMatchingGame from '../components/NetworkDeviceMatchingGame';
import TruthOrTrollGame from '../components/TruthOrTrollGame';
import InteractiveQuiz from '../components/InteractiveQuiz';
import ScenarioGame from '../components/ScenarioGame';

import { BROWSER_SEARCH_CARD_MATCHING } from '../content/activities/browser_search_card_matching';
import { CLIENT_SERVER_CARD_MATCHING } from '../content/activities/client_server_card_matching';
import { URL_PARTS_QUIZ } from '../content/activities/url_parts_quiz';
import { NETWORK_TYPES_CARD_MATCHING } from '../content/activities/network_types_card_matching';
import { DEVICE_COMMUNICATION_HOTSPOT } from '../content/activities/device_communication_hotspot';
import { NETWORK_DEVICE_MATCHING } from '../content/activities/network_device_matching';
import { WIRED_WIRELESS_TRUTH_OR_TROLL } from '../content/activities/wired_wireless_truth_or_troll';
import { NETWORK_SECURITY_QUIZ } from '../content/activities/network_security_quiz';
import { NETWORK_LOST_PACKET_SCENARIO } from '../content/activities/network_lost_packet_scenario';

import StoryMode from '../components/StoryMode';

import '../modules.css';

// ------------------------------------------------------
// Section Component
// ------------------------------------------------------
const SectionComponent = ({ section, isTurkish }) => {
  const [showStory, setShowStory] = useState(false);

  // Content icinde quiz varsa ve activity_type=interactive_quiz ise icerikteki quiz'i tekrar basma
  const shouldRenderInlineQuiz = section.activity_type !== 'interactive_quiz';
  const isDeviceSection = section.id === 7;

  const getActivityData = (currentSection) => {
    if (!currentSection) return null;
    const { activity_type, activity_key } = currentSection;

    switch (activity_type) {
      case 'card_matching': {
        const map = {
          network_types: NETWORK_TYPES_CARD_MATCHING,
          browser_search: BROWSER_SEARCH_CARD_MATCHING,
          client_server: CLIENT_SERVER_CARD_MATCHING,
        };
        return map[activity_key] || null;
      }

      case 'interactive_quiz': {
        const map = {
          network_security: NETWORK_SECURITY_QUIZ.quiz,
          url_parts: URL_PARTS_QUIZ.quiz,
        };

        if (activity_key) {
          return map[activity_key] || null;
        }

        if (currentSection.content) {
          for (const key in currentSection.content) {
            if (currentSection.content[key]?.quiz) {
              return currentSection.content[key].quiz;
            }
          }
        }

        return null;
      }

      case 'network_hotspot': {
        const map = {
          device_communication: DEVICE_COMMUNICATION_HOTSPOT,
        };
        return map[activity_key] || null;
      }

      case 'network_device_matching': {
        if (activity_key === 'network_device_matching') return NETWORK_DEVICE_MATCHING;
        return null;
      }

      case 'truth_or_troll': {
        const map = {
          wired_wireless: WIRED_WIRELESS_TRUTH_OR_TROLL,
        };
        return map[activity_key] || null;
      }

      case 'scenario_game': {
        const map = {
          lost_packet: NETWORK_LOST_PACKET_SCENARIO,
        };
        return map[activity_key] || null;
      }

      default:
        return null;
    }
  };

  const renderActivity = (activityData) => {
    switch (section.activity_type) {
      case 'card_matching':
        if (!activityData) return null;
        return <CardMatchingGame isTurkish={isTurkish} data={activityData} />;

      case 'network_hotspot':
        if (!activityData) return null;
        return <HardwareHotspot isTurkish={isTurkish} data={activityData} />;

      case 'network_device_matching':
        if (!activityData) return null;
        return <NetworkDeviceMatchingGame isTurkish={isTurkish} data={activityData} />;

      case 'truth_or_troll':
        if (!activityData) return null;
        return <TruthOrTrollGame isTurkish={isTurkish} data={activityData} />;

      case 'interactive_quiz': {
        if (!activityData) return null;
        return <InteractiveQuiz quizItems={activityData} isTurkish={isTurkish} />;
      }

      case 'scenario_game':
        if (!activityData) return null;
        return <ScenarioGame isTurkish={isTurkish} data={activityData} />;

      default:
        return null;
    }
  };

  const activityData = getActivityData(section);
  const activityElement =
    section.activity_type && activityData ? renderActivity(activityData) : null;

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

      {section.content && (
        <div className={`content-sections ${isDeviceSection ? 'module3-device-grid' : ''}`}>
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
                    e.currentTarget.style.display = 'none';
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

              {Array.isArray(contentItem.examples) && contentItem.examples.length > 0 && (
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
                              e.currentTarget.style.display = 'none';
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

              {/* Inline quiz sadece interactive_quiz bolumunde degilse bas */}
              {shouldRenderInlineQuiz && contentItem.quiz && (
                <InteractiveQuiz quizItems={contentItem.quiz} isTurkish={isTurkish} />
              )}

              {contentItem.story_images && (
                <div className="story-images-section">
                  <button onClick={() => setShowStory(true)} className="story-open-btn">
                    📖 {isTurkish ? 'Hikayeyi Oku' : 'Read Story'}
                  </button>

                  <StoryMode
                    isOpen={showStory}
                    onClose={() => setShowStory(false)}
                    isTurkish={isTurkish}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {section.activity_type && !activityData && (
        <div className="activity-placeholder">
          <p className="activity-placeholder-text">
            {isTurkish
              ? `Aktivite verisi eksik: ${section.activity_type} / ${section.activity_key || 'key yok'}`
              : `Activity data missing: ${section.activity_type} / ${section.activity_key || 'no key'}`}
          </p>
        </div>
      )}
      {activityElement && (
        <div className="activity-box">
          <h3>{section.activity_title}</h3>
          <p>{section.activity_desc}</p>
          {activityElement}
        </div>
      )}
    </motion.div>
  );
};

// ------------------------------------------------------
// Main Module
// ------------------------------------------------------
function Module3() {
  const { language } = useLanguage();
  const isTurkish = language === 'tr';

  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const moduleData = isTurkish ? MODULE3_TR.module_3 : MODULE3_EN.module_3;

  const sections = moduleData.sections.map((section, index) => ({
    id: index + 1,
    title_tr: section.title,
    component: () => <SectionComponent section={section} isTurkish={isTurkish} />,
  }));

  const handleSectionComplete = (sectionId) => {
    if (completedSections.includes(sectionId)) return;

    const newCompleted = [...completedSections, sectionId];
    setCompletedSections(newCompleted);

    if (newCompleted.length === sections.length) {
      const progress = JSON.parse(localStorage.getItem('digitalShieldProgress') || '{}');
      progress.module3 = true;
      localStorage.setItem('digitalShieldProgress', JSON.stringify(progress));
      window.dispatchEvent(new CustomEvent('moduleCompleted', { detail: { module: 'module3' } }));

      setTimeout(() => {
        alert(
          isTurkish
            ? "🎉 Tebrikler! Bilgisayar Ağları ve Dijital İletişim modülünü tamamladın! Artık Modül 4'e geçebilirsin!"
            : '🎉 Congratulations! You completed the Computer Networks & Digital Communication module! You can now access Module 4!'
        );
      }, 500);
    }
  };

  const currentSection = sections.find((s) => s.id === activeSection);
  const SectionComponentToRender = currentSection?.component;

  if (isLoading) {
    setTimeout(() => setIsLoading(false), 1000);
    return <LoadingScreen onComplete={() => setIsLoading(false)} isTurkish={isTurkish} />;
  }

  return (
    <div className="module-container module-page module3">
      <div className="module-layout">
        <div className="module-sidebar">
          <div className="sidebar-header">
            <Link href="/" className="back-home-btn">
              ← {isTurkish ? 'Ana Sayfa' : 'Home'}
            </Link>

            <h2>{moduleData.title}</h2>
            <p>{moduleData.subtitle}</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
            />
          </div>

          <p className="progress-text">
            {completedSections.length}/{sections.length} {isTurkish ? 'Tamamlandı' : 'Completed'}
          </p>

          <div className="sections-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''} ${
                  completedSections.includes(section.id) ? 'completed' : ''
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title_tr}
              </button>
            ))}
          </div>
        </div>

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
                      ? 'Tamamlandı ✓'
                      : 'Completed ✓'
                    : isTurkish
                    ? 'Tamamla'
                    : 'Complete'}
                </button>
              </div>

              {SectionComponentToRender && <SectionComponentToRender />}
            </motion.div>
          </AnimatePresence>

          <div className="section-navigation">
            <button
              className="nav-btn prev"
              onClick={() => {
                setActiveSection((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={activeSection === 1}
            >
              {isTurkish ? 'Önceki' : 'Previous'}
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
              {isTurkish ? 'Sonraki' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Module3;
