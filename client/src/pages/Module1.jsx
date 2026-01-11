import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { MODULE1_TR } from '../content/module1_lang_tr';
import { MODULE1_EN } from '../content/module1_lang_en';
import LoadingScreen from '../components/LoadingScreen';
import { useLanguage } from '../contexts/LanguageContext';
import DataFactoryGame from '../components/DataFactoryGame';
import DataUnitsCrosswordWordwall from '../components/DataUnitsCrosswordWordwall';
import HardwareHotspot from '../components/HardwareHotspot';
import SoftwareSorting from '../components/SoftwareSorting';
import FileExtensionFlashcards from '../components/FileExtensionFlashcards';
import FileExtensionsAirplaneGame from '../components/games/FileExtensionsAirplaneGame';
import ScenarioTest from '../components/ScenarioTest';
import BoxGame from '../components/BoxGame';
import VideoLinks from '../components/VideoLinks';
import { handleImgError } from '../utils/imageFallback';
import '../modules.css';

// Her bölüm için genel bir bileşen
const SectionComponent = ({ section, isTurkish }) => {
  const renderActivityByType = (activityType) => {
    switch(activityType) {
      case 'data_factory':
        return (
          <div className="dfg-wrap">
            <div className="dfg-viewport">
              <DataFactoryGame isTurkish={isTurkish} />
            </div>
          </div>
        );
      case 'data_units_crossword':
      case 'data_units_crossword_wordwall':
        return <DataUnitsCrosswordWordwall />;
      case 'hardware_hotspot':
        return <HardwareHotspot isTurkish={isTurkish} />;
      case 'software_sorting':
        return <SoftwareSorting isTurkish={isTurkish} />;
      case 'box_game':
        return <BoxGame isTurkish={isTurkish} />;
      case 'file_extensions_airplane':
        return <FileExtensionsAirplaneGame />;
      case 'file_flashcards':
        return <FileExtensionFlashcards isTurkish={isTurkish} />;
      case 'scenario_test':
        return <ScenarioTest isTurkish={isTurkish} />;
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
                  onError={handleImgError}
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

              {contentItem.table && (
                <div className="content-table">
                  {Object.entries(contentItem.table).map(([category, data]) => (
                    <div key={category} className="table-item">
                      <h4>{category}</h4>
                      <p><strong>{isTurkish ? 'Görev:' : 'Function:'}</strong> {data['görev'] || data.function}</p>
                      <p><strong>{isTurkish ? 'Örnekler:' : 'Examples:'}</strong> {data['örnekler'] || data.examples}</p>
                      {data.image && (
                        <img 
                          src={data.image} 
                          alt={category}
                          className="table-image"
                          onError={handleImgError}
                        />
                      )}
                      {data.images && (
                        <div className="table-images-grid">
                          {Object.entries(data.images).map(([key, imgSrc]) => (
                            <div key={key} className="table-image-item">
                              <img 
                                src={imgSrc} 
                                alt={key}
                                className="table-image-small"
                                onError={handleImgError}
                              />
                              <p className="table-image-label">{key}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {contentItem.detailed_parts && (
                <div className="detailed-parts">
                  {contentItem.detailed_parts.map((part, idx) => (
                    <div key={idx} className="part-card">
                      {part.image && (
                        <img 
                          src={part.image} 
                          alt={part.name}
                          className="part-image"
                          onError={handleImgError}
                        />
                      )}
                      <h4>{part.name}</h4>
                      <p><strong>{isTurkish ? 'Görev:' : 'Role:'}</strong> {part.role}</p>
                      <p><em>{part.analogy}</em></p>
                    </div>
                  ))}
                </div>
              )}

              {contentItem.visual_comparison && (
                <div className="visual-comparison">
                  {contentItem.visual_comparison.map((item, idx) => (
                    <div key={idx} className="comparison-item">
                      <strong>{item.unit}</strong>: {item.size} - {item.example}
                    </div>
                  ))}
                </div>
              )}

              {contentItem.common_extensions && (
                <div className="extensions-grid">
                  {contentItem.common_extensions.map((ext, idx) => (
                    <div key={idx} className="extension-card">
                      <span className="ext-icon">{ext.icon}</span>
                      <span className="ext-name">{ext.ext}</span>
                      <span className="ext-type">{ext.type}</span>
                      <span className="ext-example">{ext.example}</span>
                    </div>
                  ))}
                </div>
              )}

              {contentItem.organization_tips && (
                <ul className="tips-list">
                  {contentItem.organization_tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              )}

              {contentItem.checklist && (
                <div className="checklist">
                  {contentItem.checklist.map((item, idx) => (
                    <div key={idx} className="checklist-item">{item}</div>
                  ))}
                </div>
              )}

              {contentItem.threat_types && (
                <div className="threat-types">
                  {contentItem.threat_types.map((threat, idx) => (
                    <div key={idx} className="threat-card">
                      <h4>{threat.name}</h4>
                      <p>{threat.description}</p>
                      <p><strong>{isTurkish ? 'Korunma:' : 'Protection:'}</strong> {threat.protection}</p>
                    </div>
                  ))}
                </div>
              )}

              {contentItem.password_rules && (
                <div className="password-rules">
                  {contentItem.password_rules.map((rule, idx) => (
                    <div key={idx} className="rule-item">{rule}</div>
                  ))}
                </div>
              )}

              {contentItem.examples && contentItem.examples.bad && (
                <div className="password-examples">
                  <div className="bad-examples">
                    <h4>{isTurkish ? 'Kötü Şifreler:' : 'Bad Passwords:'}</h4>
                    <ul>
                      {contentItem.examples.bad.map((pwd, idx) => (
                        <li key={idx}>{pwd}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="good-examples">
                    <h4>{isTurkish ? 'İyi Şifreler:' : 'Good Passwords:'}</h4>
                    <ul>
                      {contentItem.examples.good.map((pwd, idx) => (
                        <li key={idx}>{pwd}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {contentItem.scenarios && (
                <div className="scenarios">
                  {contentItem.scenarios.map((scenario, idx) => (
                    <div key={idx} className="scenario-card">
                      <h4>{scenario.situation}</h4>
                      <p><strong>{isTurkish ? 'Yanlış:' : 'Wrong:'}</strong> {scenario.wrong}</p>
                      <p><strong>{isTurkish ? 'Doğru:' : 'Right:'}</strong> {scenario.right}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Aktivite Alanı */}
      <VideoLinks videoLinks={section.video_links} />

      {Array.isArray(section.activities) && section.activities.length > 0 ? (
        section.activities.map((activity, index) => (
          <div className="activity-box" key={`${activity.activity_type}-${index}`}>
            <h3>{activity.activity_title}</h3>
            <p>{activity.activity_desc}</p>
            {renderActivityByType(activity.activity_type)}
          </div>
        ))
      ) : section.activity_type ? (
        <div className="activity-box">
          <h3>{section.activity_title}</h3>
          <p>{section.activity_desc}</p>
          {renderActivityByType(section.activity_type)}
        </div>
      ) : null}
    </motion.div>
  );
};

// Ana Module1 Bileï¿½xeni
function Module1() {
  const { language } = useLanguage();
  const isTurkish = language === 'tr';
  const [activeSection, setActiveSection] = useState(() => {
    const stored = localStorage.getItem('module1ActiveSection');
    const parsed = Number(stored);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
  });
  const [completedSections, setCompletedSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get module data based on language
  const moduleData = isTurkish ? MODULE1_TR.module_1 : MODULE1_EN.module_1;

  const sections = moduleData.sections.map((section, index) => ({
    id: index + 1,
    title_tr: section.title,
    component: () => <SectionComponent section={section} isTurkish={isTurkish} />,
  }));

  useEffect(() => {
    const clamped = Math.min(Math.max(activeSection, 1), sections.length);
    if (clamped !== activeSection) {
      setActiveSection(clamped);
      return;
    }
    localStorage.setItem('module1ActiveSection', String(activeSection));
  }, [activeSection, sections.length]);

  const handleSectionComplete = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      
      // Check if all sections are completed
      if (newCompleted.length === sections.length) {
        // Mark module as completed in localStorage
        const progress = JSON.parse(localStorage.getItem('digitalShieldProgress') || '{}');
        progress.module1 = true;
        localStorage.setItem('digitalShieldProgress', JSON.stringify(progress));
        
        // Dispatch custom event to notify Home page
        window.dispatchEvent(new CustomEvent('moduleCompleted', { detail: { module: 'module1' } }));
        
        // Show completion message
        setTimeout(() => {
          alert(isTurkish 
            ? 'Tebrikler! Modül 1\'i tamamladın! Artık Modül 2\'ye geçebilirsin!'
            : 'Congratulations! You completed Module 1! You can now access Module 2!');
        }, 500);
      }
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);
  const SectionComponentToRender = currentSection?.component;

  // Simülasyon için Loading ekranını kaldır
  if (isLoading) {
    setTimeout(() => setIsLoading(false), 1000);
    return <LoadingScreen onComplete={() => setIsLoading(false)} isTurkish={isTurkish} />;
  }

  return (
    <div className="module-container module-page module1">
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
            <div 
              className="progress-fill"
              style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
            ></div>
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

        {/* Ana İçerik */}
        <div className="module-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
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
                    ? (isTurkish ? 'Tamamlandı' : 'Completed')
                    : (isTurkish ? 'Tamamla' : 'Complete')}
                </button>
              </div>

              {SectionComponentToRender && <SectionComponentToRender />}
            </motion.div>
          </AnimatePresence>

          {/* Bölüm Navigasyonu */}
          <div className="section-navigation">
            <button 
              className="nav-btn prev"
              onClick={() => {
                setActiveSection(prev => Math.max(1, prev - 1));
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
                setActiveSection(prev => Math.min(sections.length, prev + 1));
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

export default Module1;






