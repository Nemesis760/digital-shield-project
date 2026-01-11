import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './network-device-matching.css';

const shuffleArray = (items) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const getAnchorPosition = (element, boardRect, side) => {
  if (!element || !boardRect) {
    return null;
  }
  const rect = element.getBoundingClientRect();
  const x =
    side === 'left' ? rect.left - boardRect.left : rect.right - boardRect.left;
  const y = rect.top - boardRect.top + rect.height / 2;
  return { x, y };
};

const getCurvePath = (start, end, intensity = 0.22) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy) || 1;
  const curve = Math.min(120, distance * intensity);
  const nx = -dy / distance;
  const ny = dx / distance;
  const controlX = start.x + dx * 0.5 + nx * curve;
  const controlY = start.y + dy * 0.5 + ny * curve;
  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
};

const NetworkDeviceMatchingGame = ({ isTurkish, data }) => {
  const devices = useMemo(() => data?.devices ?? [], [data]);
  const [shuffledLabels, setShuffledLabels] = useState(() => shuffleArray(devices));
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [connections, setConnections] = useState({});
  const [activeLine, setActiveLine] = useState(null);
  const [wrongLine, setWrongLine] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchors, setAnchors] = useState({ devices: {}, labels: {} });

  const containerRef = useRef(null);
  const boardRef = useRef(null);
  const deviceRefs = useRef({});
  const labelRefs = useRef({});

  useEffect(() => {
    setShuffledLabels(shuffleArray(devices));
  }, [devices]);

  const updateAnchors = useCallback(() => {
    if (!boardRef.current) {
      return;
    }
    const boardRect = boardRef.current.getBoundingClientRect();
    const nextAnchors = { devices: {}, labels: {} };

    devices.forEach((device) => {
      const element = deviceRefs.current[device.id];
      const anchor = getAnchorPosition(element, boardRect, 'right');
      if (anchor) {
        nextAnchors.devices[device.id] = anchor;
      }
    });

    shuffledLabels.forEach((label) => {
      const element = labelRefs.current[label.id];
      const anchor = getAnchorPosition(element, boardRect, 'left');
      if (anchor) {
        nextAnchors.labels[label.id] = anchor;
      }
    });

    setAnchors(nextAnchors);
  }, [devices, shuffledLabels]);

  const scheduleAnchorUpdate = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => updateAnchors());
    });
  }, [updateAnchors]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    scheduleAnchorUpdate();
    const timeoutId = setTimeout(scheduleAnchorUpdate, 160);
    return () => clearTimeout(timeoutId);
  }, [isFullscreen, scheduleAnchorUpdate]);

  useEffect(() => {
    scheduleAnchorUpdate();
    const handleResize = () => scheduleAnchorUpdate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scheduleAnchorUpdate]);

  useEffect(() => {
    if (!boardRef.current || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(() => scheduleAnchorUpdate());
    observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, [scheduleAnchorUpdate]);

  const handleDeviceSelect = (deviceId) => {
    if (connections[deviceId]) {
      return;
    }
    setActiveDeviceId(deviceId);
    setFeedback(null);
    scheduleAnchorUpdate();
  };

  const clearActiveLine = () => {
    setActiveLine(null);
  };

  const handlePointerMove = (event) => {
    if (!activeDeviceId || !boardRef.current) {
      return;
    }
    const boardRect = boardRef.current.getBoundingClientRect();
    const start =
      anchors.devices[activeDeviceId] ||
      getAnchorPosition(deviceRefs.current[activeDeviceId], boardRect, 'right');
    if (!start) {
      return;
    }
    const end = {
      x: event.clientX - boardRect.left,
      y: event.clientY - boardRect.top
    };
    setActiveLine({ start, end });
  };

  const handleLabelSelect = (labelId) => {
    if (!activeDeviceId) {
      return;
    }
    const usedLabels = Object.values(connections);
    if (usedLabels.includes(labelId)) {
      setActiveDeviceId(null);
      setActiveLine(null);
      return;
    }

    const boardRect = boardRef.current?.getBoundingClientRect();
    const start =
      anchors.devices[activeDeviceId] ||
      getAnchorPosition(deviceRefs.current[activeDeviceId], boardRect, 'right');
    const end =
      anchors.labels[labelId] ||
      getAnchorPosition(labelRefs.current[labelId], boardRect, 'left');

    if (activeDeviceId === labelId) {
      setConnections((prev) => ({ ...prev, [activeDeviceId]: labelId }));
      setActiveDeviceId(null);
      setActiveLine(null);
      setFeedback(null);
      return;
    }

    if (start && end) {
      setWrongLine({
        id: `${activeDeviceId}-${labelId}-${Date.now()}`,
        start,
        end
      });
      setTimeout(() => setWrongLine(null), 500);
    }

    const device = devices.find((item) => item.id === activeDeviceId);
    const label = devices.find((item) => item.id === labelId);
    const deviceName = isTurkish ? device.label_tr : device.label_en;
    const labelName = isTurkish ? label.label_tr : label.label_en;
    const deviceDetail = isTurkish ? device.detail_tr : device.detail_en;
    const labelDetail = isTurkish ? label.detail_tr : label.detail_en;
    const baseMessage = isTurkish
      ? data.feedback.incorrect_tr
      : data.feedback.incorrect_en;
    const detailMessage = isTurkish
      ? `${deviceName}: ${deviceDetail} Seçtiğin kart ${labelName} olduğu için bu eşleştirme yanlış. ${labelName}: ${labelDetail}`
      : `${deviceName}: ${deviceDetail} You selected ${labelName}, so this match is incorrect. ${labelName}: ${labelDetail}`;

    setActiveDeviceId(null);
    setActiveLine(null);
    setFeedback({
      type: 'wrong',
      title: baseMessage,
      message: detailMessage
    });

    setTimeout(() => setFeedback(null), 5000);
  };

  const handleReset = () => {
    setConnections({});
    setActiveDeviceId(null);
    setActiveLine(null);
    setWrongLine(null);
    setFeedback(null);
    setShuffledLabels(shuffleArray(devices));
    setTimeout(() => scheduleAnchorUpdate(), 50);
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const isComplete = devices.length > 0 && Object.keys(connections).length === devices.length;

  return (
    <div
      className={`network-device-matching ${isFullscreen ? 'is-fullscreen' : ''}`}
      ref={containerRef}
    >
      <div className="ndmg-overlay" aria-hidden="true" />
      <div className="ndmg-shell">
        <div className="ndmg-header">
          <div className="ndmg-header-text">
            <p className="ndmg-kicker">
              {isTurkish ? data.title_tr : data.title_en}
            </p>
            <h4 className="ndmg-title">
              {isTurkish ? data.description_tr : data.description_en}
            </h4>
          </div>
          <div className="ndmg-actions">
            <button className="ndmg-btn ghost" type="button" onClick={handleReset}>
              {isTurkish ? 'Yeniden başlat' : 'Restart'}
            </button>
            <button className="ndmg-btn" type="button" onClick={toggleFullscreen}>
              {isFullscreen
                ? isTurkish
                  ? 'Tam ekrandan çık'
                  : 'Exit fullscreen'
                : isTurkish
                ? 'Tam ekran'
                : 'Fullscreen'}
            </button>
          </div>
        </div>

        <div className="ndmg-instructions">
          <p>{isTurkish ? 'Yönerge' : 'Instructions'}</p>
          <ul>
            {(isTurkish ? data.instructions_tr : data.instructions_en).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div
          className={`ndmg-board ${activeDeviceId ? 'is-connecting' : ''}`}
          ref={boardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={clearActiveLine}
          onPointerDown={(event) => {
            if (event.target === boardRef.current) {
              setActiveDeviceId(null);
              setActiveLine(null);
            }
          }}
        >
          <svg className="ndmg-lines" aria-hidden="true">
            <defs>
              <marker
                id="ndmg-arrow"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 Z" className="ndmg-line-arrow" />
              </marker>
            </defs>

            {Object.entries(connections).map(([deviceId, labelId]) => {
              const start = anchors.devices[deviceId];
              const end = anchors.labels[labelId];
              if (!start || !end) {
                return null;
              }
              return (
                <motion.path
                  key={`${deviceId}-${labelId}`}
                  d={getCurvePath(start, end)}
                  className="ndmg-line ndmg-line-correct"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              );
            })}

            {wrongLine && (
              <motion.path
                key={wrongLine.id}
                d={getCurvePath(wrongLine.start, wrongLine.end)}
                className="ndmg-line ndmg-line-wrong"
                initial={{ pathLength: 1, opacity: 1 }}
                animate={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            )}

            {activeLine && (
              <path
                d={getCurvePath(activeLine.start, activeLine.end, 0.3)}
                className="ndmg-line ndmg-line-active"
                markerEnd="url(#ndmg-arrow)"
              />
            )}
          </svg>

          <div className="ndmg-columns">
            <div className="ndmg-device-column">
              {devices.map((device) => {
                const label = isTurkish ? device.label_tr : device.label_en;
                const isMatched = Boolean(connections[device.id]);
                return (
                  <button
                    type="button"
                    key={device.id}
                    ref={(el) => {
                      deviceRefs.current[device.id] = el;
                    }}
                    className={`ndmg-device-card ${isMatched ? 'is-matched' : ''} ${
                      activeDeviceId === device.id ? 'is-active' : ''
                    }`}
                    onClick={() => handleDeviceSelect(device.id)}
                    aria-pressed={activeDeviceId === device.id}
                    aria-label={label}
                    disabled={isMatched}
                  >
                    <img
                      src={device.image}
                      alt={label}
                      onLoad={() => updateAnchors()}
                    />
                    <span className="ndmg-anchor" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div className="ndmg-label-column">
              {shuffledLabels.map((labelItem) => {
                const label = isTurkish ? labelItem.label_tr : labelItem.label_en;
                const isMatched = Object.values(connections).includes(labelItem.id);
                return (
                  <button
                    type="button"
                    key={labelItem.id}
                    ref={(el) => {
                      labelRefs.current[labelItem.id] = el;
                    }}
                    className={`ndmg-label-card ${isMatched ? 'is-matched' : ''}`}
                    onClick={() => handleLabelSelect(labelItem.id)}
                    disabled={isMatched}
                  >
                    <span className="ndmg-label-text">{label}</span>
                    <span className="ndmg-anchor" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`ndmg-feedback ${feedback.type}`} role="status" aria-live="polite">
            {feedback.title && <strong>{feedback.title}</strong>}
            <span>{feedback.message}</span>
          </div>
        )}

        {isComplete && (
          <div className="ndmg-complete">
            {isTurkish
              ? 'Tüm eşleşmeleri tamamladın. Tebrikler!'
              : 'You completed all matches. Great job!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkDeviceMatchingGame;
