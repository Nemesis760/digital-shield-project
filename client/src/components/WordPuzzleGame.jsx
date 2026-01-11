import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Delete, Lightbulb } from "lucide-react";

const FIXED_LEN = 5; // ✅ çocuklar için sabit uzunluk (Wordle gibi)

const WordPuzzleGame = ({ isTurkish, words }) => {
  // ✅ Hepsi 5 harf (ASCII)
  const defaultWordsTr = ["GUVEN", "VIRUS", "YEDEK", "SIFRE", "BULUT", "SIBER", "TUZAK", "SAHTE", "KILIT", "IZINL"];
  const defaultWordsEn = ["TRUST", "CHECK", "STORE", "PATCH", "ALLOW", "GUARD", "CLOUD", "CYBER", "VIRUS", "LOCKS"];

  const wordList = useMemo(() => {
    const fallback = isTurkish ? defaultWordsTr : defaultWordsEn;
    const input = Array.isArray(words) && words.length ? words : fallback;

    // ✅ normalize + filtre (sadece A-Z + sabit uzunluk)
    const cleaned = input
      .map((w) => String(w).toUpperCase().replace(/[^A-Z]/g, ""))
      .filter((w) => w.length === FIXED_LEN);

    // Eğer dışarıdan karışık uzunluk geldiyse oyun bozulmasın
    return cleaned.length ? cleaned : fallback.filter((w) => w.length === FIXED_LEN);
  }, [isTurkish, words]);

  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing | won | lost
  const [hintUsed, setHintUsed] = useState(false);
  const [revealedIndexes, setRevealedIndexes] = useState([]); // reveal 1 letter index

  const initGame = useCallback(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)] || "";
    setTargetWord(randomWord.toUpperCase());
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setCurrentRow(0);
    setGameState("playing");
    setHintUsed(false);
    setRevealedIndexes([]);
  }, [wordList]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const onKeyPress = (key) => {
    if (gameState !== "playing") return;

    if (key === "ENTER") {
      if (currentGuess.length !== FIXED_LEN) return;

      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);

      if (currentGuess === targetWord) {
        setGameState("won");
      } else if (currentRow === 5) {
        setGameState("lost");
      } else {
        setCurrentRow(currentRow + 1);
        setCurrentGuess("");
      }
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < FIXED_LEN && /^[A-Z]$/i.test(key)) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") onKeyPress("ENTER");
      else if (e.key === "Backspace") onKeyPress("BACKSPACE");
      else onKeyPress(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, targetWord, currentRow, currentGuess]);

  // ✅ Klavye renklendirme için harf durumları
  const letterStatus = useMemo(() => {
    // status: green > yellow > gray
    const status = {};
    for (let r = 0; r < currentRow; r++) {
      const g = guesses[r] || "";
      for (let i = 0; i < FIXED_LEN; i++) {
        const ch = g[i];
        if (!ch) continue;

        const isGreen = targetWord[i] === ch;
        const isYellow = !isGreen && targetWord.includes(ch);

        const next = isGreen ? "green" : isYellow ? "yellow" : "gray";
        const prev = status[ch];

        // prioritize
        const rank = { green: 3, yellow: 2, gray: 1, undefined: 0 };
        if (!prev || rank[next] > rank[prev]) status[ch] = next;
      }
    }
    return status;
  }, [guesses, currentRow, targetWord]);

  const getLetterClass = (letter, index, rowIdx) => {
    // Current typing row -> neutral
    if (rowIdx > currentRow) return "bg-white border-slate-200 text-slate-800";
    if (rowIdx === currentRow) return "bg-white border-slate-200 text-slate-800";

    if (!letter) return "bg-white border-slate-200 text-slate-800";
    if (targetWord[index] === letter) return "bg-green-500 border-green-600 text-white";
    if (targetWord.includes(letter)) return "bg-yellow-500 border-yellow-600 text-white";
    return "bg-slate-400 border-slate-500 text-white";
  };

  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const keyClass = (key) => {
    if (key === "ENTER" || key === "BACKSPACE") return "bg-slate-300 px-4";
    const st = letterStatus[key];
    if (st === "green") return "bg-green-300";
    if (st === "yellow") return "bg-yellow-300";
    if (st === "gray") return "bg-slate-300";
    return "bg-slate-200";
  };

  // ✅ 1 kez ipucu: 1 harfi aç
  const useHint = () => {
    if (hintUsed || gameState !== "playing" || !targetWord) return;
    // reveal a random index not revealed
    const candidates = Array.from({ length: FIXED_LEN }, (_, i) => i).filter((i) => !revealedIndexes.includes(i));
    if (!candidates.length) return;
    const idx = candidates[Math.floor(Math.random() * candidates.length)];
    setRevealedIndexes((prev) => [...prev, idx]);
    setHintUsed(true);

    // also pre-fill currentGuess at that index if empty
    setCurrentGuess((prev) => {
      const arr = prev.padEnd(FIXED_LEN, " ").split("");
      arr[idx] = targetWord[idx];
      return arr.join("").replace(/ /g, "");
    });
  };

  const helpText = isTurkish
    ? "5 harf yaz → ENTER. Yeşil: doğru yer, Sarı: var ama yeri yanlış, Gri: yok."
    : "Type 5 letters → ENTER. Green: correct spot, Yellow: in word wrong spot, Gray: not in word.";

  const hintText = isTurkish
    ? "İpucu: 1 harfi açar (1 kez)."
    : "Hint: reveals 1 letter (once).";

  return (
    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl shadow-inner my-8 max-w-xl mx-auto">
      <div className="w-full flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {isTurkish ? "Kelime Bulmacası" : "Security Wordle"}
          </h2>
          <p className="text-sm text-slate-600">{helpText}</p>
        </div>

        <button
          onClick={useHint}
          disabled={hintUsed || gameState !== "playing"}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border ${
            hintUsed ? "bg-slate-200 text-slate-500" : "bg-white hover:bg-slate-100 text-slate-700"
          }`}
          title={hintText}
        >
          <Lightbulb size={16} />
          {isTurkish ? "İpucu" : "Hint"}
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700 justify-center">
        <span className="px-2 py-1 rounded bg-green-100 border border-green-200">✓ {isTurkish ? "Doğru Yer" : "Right spot"}</span>
        <span className="px-2 py-1 rounded bg-yellow-100 border border-yellow-200">~ {isTurkish ? "Yanlış Yer" : "Wrong spot"}</span>
        <span className="px-2 py-1 rounded bg-slate-200 border border-slate-300">× {isTurkish ? "Yok" : "Not in word"}</span>
      </div>

      <div className="grid gap-2 my-8">
        {guesses.map((guess, i) => (
          <div key={i} className="flex gap-2">
            {Array.from({ length: FIXED_LEN }).map((_, j) => {
              const letter = i === currentRow ? currentGuess[j] : guess[j];
              const revealed = revealedIndexes.includes(j) && i === currentRow;

              return (
                <motion.div
                  key={j}
                  initial={false}
                  animate={guess && i < currentRow ? { rotateX: 360 } : {}}
                  className={`w-12 h-12 flex items-center justify-center text-xl font-bold border-2 rounded-lg transition-colors ${
                    getLetterClass(letter, j, i)
                  } ${revealed ? "ring-2 ring-blue-300" : ""}`}
                >
                  {revealed ? targetWord[j] : letter}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="grid gap-2 w-full">
        {keyboard.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 flex-wrap">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`px-2 py-3 rounded font-bold text-sm transition-all ${keyClass(key)} hover:bg-slate-300 active:scale-95`}
              >
                {key === "BACKSPACE" ? <Delete size={18} /> : isTurkish && key === "ENTER" ? "GÖNDER" : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-slate-600">
        {isTurkish ? `Kalan deneme: ${6 - currentRow}` : `Tries left: ${6 - currentRow}`}
      </div>

      <AnimatePresence>
        {gameState !== "playing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-white rounded-xl shadow-xl text-center border-2 border-blue-100"
          >
            {gameState === "won" ? (
              <div className="text-green-700">
                <Trophy className="mx-auto mb-2" size={48} />
                <h3 className="text-xl font-bold">{isTurkish ? "Tebrikler!" : "Congratulations!"}</h3>
                <p>{isTurkish ? "Kelimeyi buldun!" : "You found the word!"}</p>
              </div>
            ) : (
              <div className="text-red-700">
                <h3 className="text-xl font-bold">{isTurkish ? "Oyun Bitti" : "Game Over"}</h3>
                <p>{isTurkish ? `Doğru kelime: ${targetWord}` : `The word was: ${targetWord}`}</p>
              </div>
            )}

            {/* Educational feedback */}
            <div className="mt-4 text-slate-700 text-sm">
              {isTurkish ? (
                <p>
                  İpucu: Güvenli indirmede <b>kaynağa güven</b>, <b>izinleri kontrol et</b> ve <b>şüpheli dosyalardan kaçın</b>.
                </p>
              ) : (
                <p>
                  Tip: For safe downloads, <b>trust the source</b>, <b>check permissions</b>, and <b>avoid suspicious files</b>.
                </p>
              )}
            </div>

            <button
              onClick={initGame}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full mx-auto hover:bg-blue-700 transition-colors"
            >
              <RotateCcw size={18} />
              {isTurkish ? "Tekrar Dene" : "Try Again"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordPuzzleGame;
