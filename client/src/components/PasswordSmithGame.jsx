import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Password Smith (No Tailwind, No Confetti)
 * - TR/EN via isTurkish
 * - Optional tips[] to show teacher hints
 * - Visual "forge" theme with sword tiers
 */

export default function PasswordSmithGame({ isTurkish = true, tips = [] }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState("rusty"); // rusty | iron | steel | diamond
  const [items, setItems] = useState([]);

  const t = useMemo(
    () => ({
      title: isTurkish ? "⚒️ Şifre Demircisi" : "⚒️ Password Smith",
      subtitle: isTurkish
        ? "Bir şifre yaz. Kuralları tamamla. Kılıcını güçlendir!"
        : "Type a password. Complete the checklist. Forge your sword!",
      inputLabel: isTurkish ? "Şifreni Yaz" : "Type a Password",
      placeholder: isTurkish ? "Şifre yaz..." : "Type password...",
      show: isTurkish ? "Göster" : "Show",
      hide: isTurkish ? "Gizle" : "Hide",
      meter: isTurkish ? "Şifre Gücü" : "Password Strength",
      checklist: isTurkish ? "Kontrol Listesi" : "Checklist",
      clear: isTurkish ? "🔄 Temizle" : "🔄 Clear",
      tipsTitle: isTurkish ? "İpuçları" : "Tips",
      legend:
        isTurkish
          ? "İpucu: Güçlü şifre = uzun + büyük/küçük harf + rakam + özel karakter."
          : "Tip: Strong password = long + upper/lowercase + number + special character.",
      finalTitle: isTurkish ? "🎉 Harika! Elmas kılıç!" : "🎉 Great! Diamond sword!",
      finalDesc: isTurkish
        ? "Güçlü bir şifreye benziyor. Yine de kimseyle paylaşma ve mümkünse 2FA kullan."
        : "Looks strong. Still: never share it and enable 2FA when possible.",
      labels: {
        veryWeak: isTurkish ? "Çok Zayıf" : "Very Weak",
        weak: isTurkish ? "Zayıf" : "Weak",
        medium: isTurkish ? "Orta" : "Medium",
        strong: isTurkish ? "Güçlü" : "Strong",
        veryStrong: isTurkish ? "Çok Güçlü!" : "Very Strong!",
      },
      req: {
        len8: isTurkish ? "En az 8 karakter" : "At least 8 characters",
        upper: isTurkish ? "Büyük harf (A-Z)" : "Uppercase letter (A-Z)",
        lower: isTurkish ? "Küçük harf (a-z)" : "Lowercase letter (a-z)",
        num: isTurkish ? "Rakam (0-9)" : "Number (0-9)",
        spec: isTurkish ? "Özel karakter (!@#...)" : "Special character (!@#...)",
        len12: isTurkish ? "12+ karakter bonusu" : "12+ length bonus",
      },
    }),
    [isTurkish]
  );

  const swordLevels = useMemo(
    () => ({
      rusty: {
        name: isTurkish ? "Paslı Kılıç" : "Rusty Sword",
        emoji: "🗡️",
        badge: isTurkish ? "Seviye 1" : "Level 1",
        bg: "ps-rusty",
        min: 0,
      },
      iron: {
        name: isTurkish ? "Demir Kılıç" : "Iron Sword",
        emoji: "⚔️",
        badge: isTurkish ? "Seviye 2" : "Level 2",
        bg: "ps-iron",
        min: 25,
      },
      steel: {
        name: isTurkish ? "Çelik Kılıç" : "Steel Sword",
        emoji: "🔪",
        badge: isTurkish ? "Seviye 3" : "Level 3",
        bg: "ps-steel",
        min: 50,
      },
      diamond: {
        name: isTurkish ? "Elmas Kılıç" : "Diamond Sword",
        emoji: "💎",
        badge: isTurkish ? "Seviye 4" : "Level 4",
        bg: "ps-diamond",
        min: 75,
      },
    }),
    [isTurkish]
  );

  function calc(pwd) {
    const list = [];

    const hasLen8 = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /\d/.test(pwd);
    const hasSpec = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;'|]/.test(pwd);
    const hasLen12 = pwd.length >= 12;

    // Score (max 100)
    let s = 0;
    if (hasLen8) s += 20;
    if (hasUpper) s += 15;
    if (hasLower) s += 15;
    if (hasNum) s += 20;
    if (hasSpec) s += 20;
    if (hasLen12) s += 10;

    // Checklist entries (show missing too)
    list.push({ key: "len8", ok: hasLen8, text: t.req.len8 });
    list.push({ key: "upper", ok: hasUpper, text: t.req.upper });
    list.push({ key: "lower", ok: hasLower, text: t.req.lower });
    list.push({ key: "num", ok: hasNum, text: t.req.num });
    list.push({ key: "spec", ok: hasSpec, text: t.req.spec });
    list.push({ key: "len12", ok: hasLen12, text: t.req.len12, optional: true });

    setStrength(Math.min(100, s));
    setItems(list);

    if (s >= 75) setLevel("diamond");
    else if (s >= 50) setLevel("steel");
    else if (s >= 25) setLevel("iron");
    else setLevel("rusty");
  }

  useEffect(() => {
    calc(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, isTurkish]);

  const currentSword = swordLevels[level];

  function strengthLabel() {
    if (strength < 25) return t.labels.veryWeak;
    if (strength < 50) return t.labels.weak;
    if (strength < 75) return t.labels.medium;
    if (strength < 100) return t.labels.strong;
    return t.labels.veryStrong;
  }

  function meterClass() {
    if (strength < 25) return "ps-meter ps-red";
    if (strength < 50) return "ps-meter ps-orange";
    if (strength < 75) return "ps-meter ps-yellow";
    return "ps-meter ps-green";
  }

  function reset() {
    setPassword("");
    setShowPassword(false);
    setStrength(0);
    setLevel("rusty");
    setItems([]);
  }

  const lvlIndex = Object.keys(swordLevels).indexOf(level) + 1;

  return (
    <div className="ps-wrap">
      <div className="ps-head">
        <h3 className="ps-title">{t.title}</h3>
        <p className="ps-subtitle">{t.subtitle}</p>
      </div>

      <div className="ps-main">
        {/* Sword card */}
        <div className="ps-sword-area">
          <motion.div
            className={`ps-sword-card ${currentSword.bg}`}
            animate={{
              scale: strength === 100 ? [1, 1.03, 1] : 1,
            }}
            transition={{ duration: 1, repeat: strength === 100 ? Infinity : 0 }}
          >
            <div className="ps-sparkles" aria-hidden="true" />
            <div className="ps-sword-emoji">{currentSword.emoji}</div>
          </motion.div>

          <div className="ps-sword-meta">
            <div className="ps-sword-name">{currentSword.name}</div>
            <div className="ps-sword-badge">
              {currentSword.badge} • {lvlIndex}/4
            </div>
          </div>
        </div>

        {/* Input + meter */}
        <div className="ps-panel">
          <div className="ps-field">
            <label className="ps-label">{t.inputLabel}</label>

            <div className="ps-input-row">
              <input
                className="ps-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.placeholder}
                autoComplete="off"
              />
              <button
                type="button"
                className="ps-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t.hide : t.show}
                title={showPassword ? t.hide : t.show}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className="ps-legend">{t.legend}</div>
          </div>

          <div className="ps-meter-block">
            <div className="ps-meter-top">
              <div className="ps-meter-label">{t.meter}</div>
              <div className="ps-meter-value">
                {strengthLabel()} <span className="ps-meter-pct">({strength}%)</span>
              </div>
            </div>

            <div className="ps-meter-rail">
              <motion.div
                className={meterClass()}
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>

          <div className="ps-checklist">
            <div className="ps-checklist-title">{t.checklist}</div>

            <div className="ps-items">
              {items.length === 0 ? (
                <div className="ps-empty">
                  {isTurkish ? "Şifre yazmaya başla..." : "Start typing your password..."}
                </div>
              ) : (
                items.map((it) => (
                  <motion.div
                    key={it.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`ps-item ${it.ok ? "ok" : "no"} ${it.optional ? "opt" : ""}`}
                  >
                    <span className="ps-item-icon">{it.ok ? "✅" : "⬜"}</span>
                    <span className="ps-item-text">{it.text}</span>
                    {it.optional && <span className="ps-opt">{isTurkish ? "BONUS" : "BONUS"}</span>}
                  </motion.div>
                ))
              )}
            </div>

            <div className="ps-actions">
              <motion.button
                type="button"
                className="ps-btn"
                onClick={reset}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {t.clear}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {strength === 100 && (
              <motion.div
                className="ps-win"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.25 }}
              >
                <div className="ps-win-title">{t.finalTitle}</div>
                <div className="ps-win-desc">{t.finalDesc}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {Array.isArray(tips) && tips.length > 0 && (
            <div className="ps-tips">
              <div className="ps-tips-title">{t.tipsTitle}</div>
              <ul className="ps-tips-list">
                {tips.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ps-wrap{
          width:100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 18px;
          border-radius: 22px;
          border: 1px solid rgba(99,102,241,.18);
          background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.80));
          box-shadow: 0 14px 36px rgba(2,6,23,.08);
        }
        .ps-head{ text-align:center; margin-bottom: 14px; }
        .ps-title{
          margin: 0 0 6px 0;
          font-size: 1.55rem;
          font-weight: 1000;
          letter-spacing: .2px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .ps-subtitle{ margin:0; font-weight: 800; opacity: .85; }

        .ps-main{
          display:grid;
          grid-template-columns: 280px 1fr;
          gap: 16px;
          align-items: start;
        }

        .ps-sword-area{
          position: sticky;
          top: 16px;
          display:flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        .ps-sword-card{
          width: 240px;
          height: 240px;
          border-radius: 22px;
          display:flex;
          align-items:center;
          justify-content:center;
          position: relative;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,.35);
          box-shadow: 0 18px 40px rgba(2,6,23,.18);
        }

        .ps-rusty{ background: linear-gradient(135deg, #94a3b8, #475569); }
        .ps-iron{ background: linear-gradient(135deg, #cbd5e1, #64748b); }
        .ps-steel{ background: linear-gradient(135deg, #60a5fa, #2563eb); }
        .ps-diamond{ background: linear-gradient(135deg, #a78bfa, #ec4899); }

        .ps-sword-emoji{
          font-size: 5.2rem;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,.25));
          z-index: 2;
        }

        /* sparkle overlay (dependency-free celebration) */
        .ps-sparkles{
          position:absolute; inset:0;
          background:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,.30), transparent 35%),
            radial-gradient(circle at 75% 40%, rgba(255,255,255,.22), transparent 38%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,.18), transparent 45%);
          opacity: 0.0;
          z-index: 1;
          transition: opacity .2s ease;
        }
        .ps-diamond .ps-sparkles{ opacity: .55; animation: psShimmer 1.6s linear infinite; }
        @keyframes psShimmer{
          0%{ transform: translateX(-6%); }
          50%{ transform: translateX(6%); }
          100%{ transform: translateX(-6%); }
        }

        .ps-sword-meta{ text-align:center; }
        .ps-sword-name{ font-weight: 1000; font-size: 1.15rem; }
        .ps-sword-badge{
          display:inline-flex;
          gap: 8px;
          align-items:center;
          margin-top: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(15,23,42,.12);
          background: rgba(255,255,255,.85);
          font-weight: 900;
          opacity: .9;
          box-shadow: 0 10px 22px rgba(2,6,23,.06);
        }

        .ps-panel{
          border-radius: 20px;
          border: 1px solid rgba(15,23,42,.10);
          background: rgba(255,255,255,.82);
          box-shadow: 0 10px 24px rgba(2,6,23,.06);
          padding: 14px;
        }

        .ps-field{ margin-bottom: 12px; }
        .ps-label{ display:block; font-weight: 1000; margin-bottom: 8px; }
        .ps-input-row{ position:relative; display:flex; gap: 10px; align-items:center; }
        .ps-input{
          width: 100%;
          padding: 12px 12px;
          border-radius: 14px;
          border: 1.5px solid rgba(15,23,42,.12);
          outline: none;
          font-weight: 900;
          letter-spacing: .8px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          background: rgba(255,255,255,.94);
          box-shadow: 0 10px 22px rgba(2,6,23,.06);
        }
        .ps-input:focus{
          border-color: rgba(59,130,246,.70);
          box-shadow: 0 0 0 4px rgba(59,130,246,.14), 0 10px 22px rgba(2,6,23,.06);
        }
        .ps-eye{
          flex: 0 0 auto;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(15,23,42,.12);
          background: rgba(255,255,255,.92);
          cursor: pointer;
          font-weight: 900;
          box-shadow: 0 10px 22px rgba(2,6,23,.06);
        }
        .ps-eye:active{ transform: scale(.98); }

        .ps-legend{
          margin-top: 10px;
          font-weight: 800;
          opacity: .82;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(99,102,241,.14);
          background: rgba(99,102,241,.06);
        }

        .ps-meter-block{
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(15,23,42,.10);
          background: rgba(255,255,255,.88);
          box-shadow: 0 10px 22px rgba(2,6,23,.05);
        }
        .ps-meter-top{
          display:flex;
          justify-content:space-between;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 10px;
        }
        .ps-meter-label{ font-weight: 1000; }
        .ps-meter-value{ font-weight: 1000; }
        .ps-meter-pct{ opacity: .8; font-weight: 900; }

        .ps-meter-rail{
          width: 100%;
          height: 14px;
          border-radius: 999px;
          background: rgba(15,23,42,.08);
          overflow:hidden;
          border: 1px solid rgba(15,23,42,.08);
        }
        .ps-meter{
          height: 100%;
          border-radius: 999px;
        }
        .ps-red{ background: linear-gradient(90deg, #ef4444, #b91c1c); }
        .ps-orange{ background: linear-gradient(90deg, #f97316, #c2410c); }
        .ps-yellow{ background: linear-gradient(90deg, #f59e0b, #b45309); }
        .ps-green{ background: linear-gradient(90deg, #22c55e, #059669); }

        .ps-checklist{
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(15,23,42,.10);
          background: rgba(255,255,255,.88);
          box-shadow: 0 10px 22px rgba(2,6,23,.05);
        }
        .ps-checklist-title{ font-weight: 1000; margin-bottom: 10px; }
        .ps-items{ display:grid; gap: 8px; }
        .ps-empty{ opacity:.7; font-weight: 800; padding: 8px 0; }

        .ps-item{
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(15,23,42,.10);
          background: rgba(255,255,255,.92);
          box-shadow: 0 10px 22px rgba(2,6,23,.04);
        }
        .ps-item.ok{ border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.08); }
        .ps-item.no{ border-color: rgba(148,163,184,.22); background: rgba(148,163,184,.06); }
        .ps-item-icon{ width: 22px; text-align:center; }
        .ps-item-text{ font-weight: 900; }
        .ps-opt{
          margin-left:auto;
          padding: 4px 8px;
          border-radius: 999px;
          font-weight: 1000;
          border: 1px solid rgba(236,72,153,.25);
          background: rgba(236,72,153,.08);
          opacity: .95;
          font-size: .78rem;
        }

        .ps-actions{
          display:flex;
          justify-content:flex-end;
          margin-top: 10px;
        }
        .ps-btn{
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(15,23,42,.12);
          background: rgba(255,255,255,.92);
          cursor:pointer;
          font-weight: 1000;
          box-shadow: 0 10px 22px rgba(2,6,23,.06);
        }
        .ps-btn:active{ transform: scale(.98); }

        .ps-win{
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(34,197,94,.35);
          background: rgba(34,197,94,.10);
          box-shadow: 0 10px 22px rgba(2,6,23,.05);
        }
        .ps-win-title{ font-weight: 1000; margin-bottom: 6px; }
        .ps-win-desc{ font-weight: 800; opacity: .9; }

        .ps-tips{
          margin-top: 12px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(99,102,241,.16);
          background: rgba(99,102,241,.06);
        }
        .ps-tips-title{ font-weight: 1000; margin-bottom: 6px; }
        .ps-tips-list{ margin: 0; padding-left: 18px; font-weight: 800; line-height: 1.5; }

        @media (max-width: 860px){
          .ps-main{ grid-template-columns: 1fr; }
          .ps-sword-area{ position: static; }
          .ps-sword-card{ width: 100%; max-width: 420px; height: 220px; }
        }
      `}</style>
    </div>
  );
}
