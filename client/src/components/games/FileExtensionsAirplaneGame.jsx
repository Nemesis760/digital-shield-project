import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FILE_EXTENSIONS_ROUNDS from "./fileExtensionsData";

import airplanePng from "../../assets/module1/file-extensions-airplane/airplane.png";
import cloudPng from "../../assets/module1/file-extensions-airplane/cloud.png";
import cityPng from "../../assets/module1/file-extensions-airplane/city.png";
import skyPng from "../../assets/module1/file-extensions-airplane/sky.png";
import sfxCorrect from "../../assets/module1/file-extensions-airplane/sfx_correct.mp3";
import sfxWrong from "../../assets/module1/file-extensions-airplane/sfx_wrong.mp3";

const ASPECT_W = 960;
const ASPECT_H = 540;

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function useAudio(src) {
  const audioRef = useRef(null);
  useEffect(() => {
    try {
      audioRef.current = src ? new Audio(src) : null;
      if (audioRef.current) audioRef.current.volume = 0.5;
    } catch {
      audioRef.current = null;
    }
  }, [src]);

  return () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
}

function buildClouds(round) {
  const centerX = ASPECT_W / 2;
  const centerY = ASPECT_H / 2 + 10;
  const radiusX = 300;
  const radiusY = 140;
  const slots = round.options.length;
  const clouds = [];

  for (let i = 0; i < slots; i++) {
    const angle = (Math.PI * 2 * i) / slots;
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;
    clouds.push({
      id: `${round.promptTr}-${round.options[i]}`,
      label: round.options[i],
      isCorrect: round.correct.includes(round.options[i]),
      x,
      y,
      r: 44,
      hit: false,
      result: null,
      pop: 0,
    });
  }
  return clouds;
}

export default function FileExtensionsAirplaneGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const inputRef = useRef({ up: false, down: false, left: false, right: false });
  const dragRef = useRef(null);

  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [message, setMessage] = useState(null);
  const [shake, setShake] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const round = FILE_EXTENSIONS_ROUNDS[roundIndex];
  const totalRounds = FILE_EXTENSIONS_ROUNDS.length;

  const playCorrect = useAudio(sfxCorrect);
  const playWrong = useAudio(sfxWrong);

  const stateRef = useRef({
    plane: { x: 200, y: 260, vx: 0, vy: 0 },
    clouds: buildClouds(round),
    bg1: 0,
    bg2: 0,
    hitStop: 0,
    advancePending: false,
    effects: [],
  });

  useEffect(() => {
    stateRef.current.clouds = buildClouds(round);
    stateRef.current.plane = { x: 220, y: 260, vx: 0, vy: 0 };
    stateRef.current.advancePending = false;
  }, [roundIndex]);

  useEffect(() => {
    if (isRunning && !gameOver && !showAnswers) {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(id);
    }
    return undefined;
  }, [isRunning, gameOver, showAnswers]);

  useEffect(() => {
    if (gameOver) setIsRunning(false);
  }, [gameOver]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") inputRef.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") inputRef.current.down = true;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") inputRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") inputRef.current.right = true;
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") inputRef.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") inputRef.current.down = false;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") inputRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") inputRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isFullscreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext("2d");
    let running = true;

    const skyImg = new Image();
    skyImg.src = skyPng;
    const cityImg = new Image();
    cityImg.src = cityPng;
    const cloudImg = new Image();
    cloudImg.src = cloudPng;
    const planeImg = new Image();
    planeImg.src = airplanePng;

    const drawTiledImage = (img, y, height, offset, speed, alpha = 1) => {
      const aspect = img.naturalWidth / img.naturalHeight;
      const width = height * aspect;
      const nextOffset = offset - speed;
      let drawOffset = nextOffset % width;
      if (drawOffset > 0) drawOffset -= width;

      ctx.globalAlpha = alpha;
      for (let x = drawOffset; x < ASPECT_W + width; x += width) {
        ctx.drawImage(img, x, y, width, height);
      }

      ctx.globalAlpha = 0.3;
      for (let x = drawOffset; x < ASPECT_W + width; x += width) {
        const seamX = x + width - 8;
        const grad = ctx.createLinearGradient(seamX, 0, seamX + 16, 0);
        grad.addColorStop(0, "rgba(255,255,255,0.12)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(seamX, y, 16, height);
      }
      ctx.globalAlpha = 1;
      return drawOffset;
    };

    const drawBackground = (dt) => {
      const { bg1, bg2 } = stateRef.current;
      const speed1 = 10 * dt;
      const speed2 = 30 * dt;
      stateRef.current.bg1 = bg1 - speed1;
      stateRef.current.bg2 = bg2 - speed2;

      ctx.fillStyle = "#67b7ff";
      ctx.fillRect(0, 0, ASPECT_W, ASPECT_H);

      if (skyImg.complete && skyImg.naturalWidth > 0) {
        stateRef.current.bg1 = drawTiledImage(skyImg, 0, ASPECT_H, bg1, speed1, 0.92);
      }

      if (cityImg.complete && cityImg.naturalWidth > 0) {
        const y = ASPECT_H - 120;
        stateRef.current.bg2 = drawTiledImage(cityImg, y, 120, bg2, speed2, 0.9);
      } else {
        ctx.fillStyle = "rgba(24,36,64,0.6)";
        ctx.fillRect(0, ASPECT_H - 120, ASPECT_W, 120);
      }
    };

    const drawCloud = (cloud) => {
      const { x, y, r, hit, pop, result, label } = cloud;
      const alpha = hit ? Math.max(0, 1 - pop / 22) : 1;
      ctx.save();
      ctx.globalAlpha = alpha;

      if (cloudImg.complete && cloudImg.naturalWidth > 0) {
        ctx.drawImage(cloudImg, x - r - 18, y - r - 12, r * 2.2, r * 1.7);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.2, r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = "bold 20px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.strokeText(label.toUpperCase(), x, y + 2);
      ctx.fillStyle = "#0f172a";
      ctx.fillText(label.toUpperCase(), x, y + 2);

      if (result === "ok") {
        ctx.fillStyle = "rgba(34,197,94,0.9)";
        ctx.beginPath();
        ctx.arc(x + 34, y - 22, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("✓", x + 34, y - 22);
      }

      if (result === "bad") {
        ctx.fillStyle = "rgba(239,68,68,0.9)";
        ctx.beginPath();
        ctx.arc(x + 34, y - 22, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("✕", x + 34, y - 22);
      }

      ctx.restore();
    };

    const drawEffects = (dt) => {
      const effects = stateRef.current.effects;
      for (const effect of effects) {
        effect.age += dt;
        const t = effect.age / effect.duration;
        if (t >= 1) continue;
        ctx.save();
        if (effect.type === "ok") {
          ctx.globalAlpha = 1 - t;
          ctx.strokeStyle = "rgba(34,197,94,0.9)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, 10 + t * 40, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = "rgba(250,204,21,0.8)";
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, 6 + t * 26, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = "rgba(239,68,68,0.65)";
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, 8 + t * 34, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(148,163,184,0.6)";
          ctx.beginPath();
          ctx.arc(effect.x + 12, effect.y - 6, 6 + t * 20, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      stateRef.current.effects = effects.filter((e) => e.age < e.duration);
    };

    const drawPlane = (plane) => {
      const size = 86;
      ctx.save();
      ctx.translate(plane.x, plane.y);
      ctx.rotate(plane.vx * 0.002);
      if (planeImg.complete && planeImg.naturalWidth > 0) {
        ctx.drawImage(planeImg, -size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(-28, -18);
        ctx.lineTo(32, 0);
        ctx.lineTo(-28, 18);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const update = (dt) => {
      const state = stateRef.current;
      if (state.hitStop > 0) {
        state.hitStop -= dt * 1000;
        return;
      }

      const accel = 520;
      const damping = 0.86;
      const maxSpeed = 280;

      if (inputRef.current.up) state.plane.vy -= accel * dt;
      if (inputRef.current.down) state.plane.vy += accel * dt;

      if (dragRef.current) {
        const { dx, dy } = dragRef.current;
        state.plane.vx += dx * 12 * dt;
        state.plane.vy += dy * 12 * dt;
      }

      state.plane.vx *= damping;
      state.plane.vy *= damping;
      state.plane.vx = clamp(state.plane.vx, -maxSpeed, maxSpeed);
      state.plane.vy = clamp(state.plane.vy, -maxSpeed, maxSpeed);

      state.plane.y += state.plane.vy * dt;
      state.plane.x = 220;
      state.plane.y = clamp(state.plane.y, 50, ASPECT_H - 80);

      for (const cloud of state.clouds) {
        const drift = 90 * dt;
        cloud.x -= drift;
        if (cloud.x < -140) cloud.x = ASPECT_W + 140;

        if (cloud.hit) {
          cloud.pop += dt * 30;
          continue;
        }
        const dx = state.plane.x - cloud.x;
        const dy = state.plane.y - cloud.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cloud.r + 18) {
          cloud.hit = true;
          cloud.pop = 1;
          cloud.result = cloud.isCorrect ? "ok" : "bad";

          if (cloud.isCorrect) {
            playCorrect();
            setScore((s) => s + 10);
            setMessage({ type: "ok", text: "True!" });
            setTimeout(() => setMessage(null), 800);
            stateRef.current.effects.push({
              x: cloud.x,
              y: cloud.y,
              type: "ok",
              age: 0,
              duration: 0.6,
            });
          } else {
            playWrong();
            setLives((l) => Math.max(0, l - 1));
            setMessage({ type: "bad", text: "Wrong!" });
            setShake(12);
            state.hitStop = 80;
            setTimeout(() => setMessage(null), 800);
            stateRef.current.effects.push({
              x: cloud.x,
              y: cloud.y,
              type: "bad",
              age: 0,
              duration: 0.6,
            });
          }
        }
      }
    };

    const draw = (dt) => {
      ctx.save();
      if (shake > 0) {
        const s = (Math.random() - 0.5) * shake;
        ctx.translate(s, s);
      }
      drawBackground(dt);
      stateRef.current.clouds.forEach(drawCloud);
      drawEffects(dt);
      drawPlane(stateRef.current.plane);
      ctx.restore();
    };

    const loop = (t) => {
      if (!running) return;
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = Math.min(0.032, (t - lastTimeRef.current) / 1000);
      lastTimeRef.current = t;

      if (isRunning) {
        update(dt);
      }
      draw(dt);

      if (shake > 0) setShake((s) => Math.max(0, s - dt * 60));

      if (isRunning) {
        const allCorrect = stateRef.current.clouds
          .filter((c) => c.isCorrect)
          .every((c) => c.hit);

        if (allCorrect && !gameOver && !showAnswers && !stateRef.current.advancePending) {
          stateRef.current.advancePending = true;
          setTimeout(() => {
            if (roundIndex < totalRounds - 1) {
              setRoundIndex((i) => i + 1);
              stateRef.current.advancePending = false;
            } else {
              setGameOver(true);
            }
          }, 500);
        }

        if (lives <= 0 && !gameOver) {
          setGameOver(true);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform((rect.width / ASPECT_W) * dpr, 0, 0, (rect.height / ASPECT_H) * dpr, 0, 0);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [roundIndex, lives, gameOver, showAnswers, shake, isRunning]);

  const startAgain = () => {
    setRoundIndex(0);
    setScore(0);
    setLives(3);
    setTimer(0);
    setGameOver(false);
    setShowAnswers(false);
    setMessage(null);
    stateRef.current.clouds = buildClouds(FILE_EXTENSIONS_ROUNDS[0]);
    stateRef.current.plane = { x: 220, y: 260, vx: 0, vy: 0 };
    stateRef.current.advancePending = false;
  };

  const startGame = () => {
    startAgain();
    setIsRunning(true);
  };

  const showAnswersPanel = () => {
    setShowAnswers(true);
  };

  const onPointerDown = (e) => {
    if (!isRunning) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      dx: 0,
      dy: 0,
    };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current || !isRunning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragRef.current.dx = x - dragRef.current.startX;
    dragRef.current.dy = y - dragRef.current.startY;
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className={`w-full ${isFullscreen ? "fixed inset-0 z-50 bg-black/70 p-4" : ""}`}>
      <div className={`mx-auto w-full ${isFullscreen ? "h-full max-w-none" : "max-w-6xl"} bg-slate-900/90 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden`}>
        <div
          className={`relative ${isFullscreen ? "h-full" : "aspect-[16/9]"} bg-gradient-to-b from-sky-200/10 via-slate-900/70 to-slate-900`}
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-2xl bg-black/40 border border-white/15 px-4 py-2 text-white shadow-lg backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Airplane</div>
              <div className="text-lg font-extrabold">Dosya Uzant\u0131lar\u0131</div>
              <div className="text-sm text-slate-200">{round.promptTr}</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-3 text-sm text-white/90">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">\u23f1 {timer}s</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">Skor: {score}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-xl ${i < lives ? "opacity-100" : "opacity-20"}`}>\u2764\ufe0f</span>
                ))}
              </div>
              <div className="text-xs text-white/70">Soru {roundIndex + 1}/{totalRounds}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="absolute right-4 top-[92px] z-10 rounded-full bg-black/45 border border-white/20 px-3 py-2 text-white text-xs backdrop-blur-md hover:bg-black/60"
          >
            {isFullscreen ? "\u2715" : "\u26f6"}
          </button>

          <div className="absolute inset-x-4 bottom-4 z-10 rounded-xl bg-black/35 border border-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md">
            Ucagi dogru uzanti bulutlarindan gec. Yanlis buluta girersen canin azalir.
            <span className="hidden md:inline"> Klavye: WASD/oklar, Mobil: ekranda surukle.</span>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                className={`absolute top-24 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-white font-bold shadow-lg ${
                  message.type === "ok" ? "bg-green-500/80" : "bg-red-500/80"
                }`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {!isRunning && !gameOver && !showAnswers && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-sm">
              <div className="w-[min(480px,92vw)] rounded-2xl border border-white/15 bg-slate-900/90 p-6 text-white shadow-2xl">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Airplane</div>
                <h3 className="mt-1 text-2xl font-extrabold">Dosya Uzant\u0131lar\u0131</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Dogru uzanti bulutlarindan gec. Yanlis bulutlar can eksiltir.
                </p>
                <ul className="mt-3 text-sm text-slate-300 space-y-1">
                  <li>• Klavye: WASD / oklar</li>
                  <li>• Mobil: ekranda surukle</li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                    onClick={startGame}
                  >
                    Baslat
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                    onClick={() => setIsFullscreen(true)}
                  >
                    Tam ekran
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {gameOver && !showAnswers && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 text-white rounded-2xl p-6 w-[min(420px,90vw)] shadow-2xl border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold">Game Over</h3>
              <div className="mt-3 text-sm text-slate-300">Skor: {score}</div>
              <div className="text-sm text-slate-300">Sure: {timer}s</div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                  onClick={showAnswersPanel}
                >
                  Show answers
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                  onClick={startGame}
                >
                  Start again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnswers && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="min-h-screen flex items-center justify-center px-4 py-8">
              <div className="bg-slate-900 text-white rounded-2xl p-6 w-[min(700px,95vw)] shadow-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Cevaplar</h3>
                  <button
                    className="text-white/70 hover:text-white"
                    onClick={startGame}
                  >
                    Yeniden baslat
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {FILE_EXTENSIONS_ROUNDS.map((item, idx) => (
                    <div key={item.promptTr} className="border border-white/10 rounded-xl p-3 bg-white/5">
                      <div className="font-semibold">{idx + 1}. {item.promptTr}</div>
                      <div className="text-sm text-slate-300 mt-1">
                        Dogru: {item.correct.join(", ")}{item.optional ? ` (${item.optional.join(", ")} opsiyonel)` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}