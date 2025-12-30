import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Hotspot Quiz (Module 4)
 * - Click hotspots on a phishing-like image and get animated feedback
 * - Includes simple audio feedback (WebAudio) without external deps
 */

function playTone(type = 'ok') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'sine';
    o.frequency.value = type === 'ok' ? 880 : 220;

    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    o.stop(ctx.currentTime + 0.24);

    setTimeout(() => ctx.close?.(), 300);
  } catch {
    // ignore if blocked
  }
}

export default function HotspotQuiz_Module4({ isTurkish }) {
  const data = useMemo(() => {
    // Image should show a fake "free gems" message/email with URL, sender, urgency etc.
    const img = '/images/module4/phishing_scam_example.png';

    const hotspots = [
      {
        id: 'sender',
        x: 14,
        y: 18,
        r: 12,
        correct: true,
        tr: {
          title: 'Gönderici adresi',
          text: 'Gönderici adı gerçek gibi görünse bile e-posta adresine bak. Garip bir domain şüpheli olabilir.'
        },
        en: {
          title: 'Sender address',
          text: 'Even if the name looks real, check the email domain. Weird domains can be suspicious.'
        }
      },
      {
        id: 'url',
        x: 62,
        y: 56,
        r: 14,
        correct: true,
        tr: {
          title: 'Şüpheli URL',
          text: 'Linkin yazımına bak: harf oyunları (lnstagram gibi) veya garip uzantılar olabilir.'
        },
        en: {
          title: 'Suspicious URL',
          text: 'Check the spelling: lookalike domains (lnstagram) or strange endings.'
        }
      },
      {
        id: 'urgency',
        x: 72,
        y: 28,
        r: 12,
        correct: true,
        tr: {
          title: 'Aşırı aciliyet',
          text: '"Hemen tıkla, yoksa kapanır!" gibi baskı kuruyorsa kırmızı bayraktır.'
        },
        en: {
          title: 'Extreme urgency',
          text: 'Pressure like "Click now or you lose access!" is a red flag.'
        }
      },
      {
        id: 'reward',
        x: 30,
        y: 64,
        r: 12,
        correct: true,
        tr: {
          title: 'Bedava ödül vaadi',
          text: '"Bedava elmas/hediye" vaatleri oltalama tuzağı olabilir.'
        },
        en: {
          title: 'Free reward promise',
          text: '"Free gems/gifts" can be a phishing trap.'
        }
      },
      {
        id: 'random',
        x: 44,
        y: 34,
        r: 11,
        correct: false,
        tr: {
          title: 'Bu ipucu değil',
          text: 'Bu bölgede kritik bir "phishing işareti" yok. Asıl ipuçları adres, URL, aciliyet ve ödül vaadi.'
        },
        en: {
          title: 'Not a clue',
          text: 'No key phishing clue here. Focus on sender, URL, urgency, and reward promises.'
        }
      }
    ];

    return { img, hotspots };
  }, []);

  const [found, setFound] = useState(() => new Set());
  const [last, setLast] = useState(null);

  const totalCorrect = data.hotspots.filter((h) => h.correct).length;
  const foundCorrect = Array.from(found).filter((id) => data.hotspots.find((h) => h.id === id)?.correct).length;

  useEffect(() => {
    // reset "last" after a moment
    if (!last) return;
    const t = setTimeout(() => setLast(null), 2600);
    return () => clearTimeout(t);
  }, [last]);

  const reset = () => {
    setFound(new Set());
    setLast(null);
  };

  return (
    <div className="m4-hotspot">
      <div className="m4-hotspot-top">
        <div className="m4-hotspot-title">
          {isTurkish ? 'Hotspot Görevi' : 'Hotspot Mission'} •{' '}
          {isTurkish ? 'Şüpheli ipuçlarını bul' : 'Find suspicious clues'}
        </div>
        <div className="m4-hotspot-progress">
          {isTurkish ? 'Bulunan doğru ipucu:' : 'Correct clues found:'} {foundCorrect}/{totalCorrect}
        </div>
      </div>

      <div className="m4-hotspot-stage">
        <img src={data.img} alt="Hotspot" className="m4-hotspot-img" />

        {data.hotspots.map((h) => {
          const isFound = found.has(h.id);
          return (
            <button
              key={h.id}
              className={`m4-hotspot-dot ${isFound ? 'found' : ''} ${h.correct ? 'good' : 'bad'}`}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.r * 2}px`,
                height: `${h.r * 2}px`
              }}
              onClick={() => {
                setFound((prev) => {
                  const n = new Set(prev);
                  n.add(h.id);
                  return n;
                });
                setLast(h);
                playTone(h.correct ? 'ok' : 'bad');
              }}
              aria-label={isTurkish ? h.tr.title : h.en.title}
              title={isTurkish ? h.tr.title : h.en.title}
            />
          );
        })}

        <AnimatePresence>
          {last && (
            <motion.div
              className={`m4-hotspot-toast ${last.correct ? 'ok' : 'bad'}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
            >
              <div className="m4-hotspot-toast-title">
                {last.correct ? (isTurkish ? '✅ Doğru ipucu!' : '✅ Correct clue!') : isTurkish ? '❌ Bu değil!' : '❌ Not this one!'}
              </div>
              <div className="m4-hotspot-toast-sub">{isTurkish ? last.tr.title : last.en.title}</div>
              <div className="m4-hotspot-toast-text">{isTurkish ? last.tr.text : last.en.text}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="m4-hotspot-actions">
        <button className="m4-btn" onClick={reset}>
          {isTurkish ? 'Sıfırla' : 'Reset'}
        </button>
        <div className="m4-hotspot-help">
          {isTurkish
            ? 'İpucu: URL, gönderici adresi, aciliyet ve "bedava ödül" vaatlerine bak.'
            : 'Tip: Check URL, sender address, urgency, and "free reward" promises.'}
        </div>
      </div>
    </div>
  );
}

