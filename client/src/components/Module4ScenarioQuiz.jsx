import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SCENARIO_DATA = {
  tr: {
    title: "Hafta Sonu Sohbet Grubu",
    intro:
      "Mira, arkadaşlarıyla bir sohbet grubunda hafta sonu planı yapıyor. Güvenli ve saygılı seçimler yap.",
    questions: [
      {
        id: 1,
        story: "Gruba yeni biri eklendi ve herkesten telefon numarasını istedi.",
        question: "Mira ne yapmalı?",
        options: [
          {
            text: "Numarasını hemen paylaşmalı",
            correct: false,
            feedback: "Kişisel bilgileri grupta paylaşmak risklidir."
          },
          {
            text: "Kibarca paylaşmayacağını söylemeli",
            correct: true,
            feedback: "Doğru. Kişisel bilgiler korunmalıdır."
          },
          {
            text: "Numarasını yazıp sonra silmeli",
            correct: false,
            feedback: "Mesaj silinse bile görüntü alınmış olabilir."
          }
        ]
      },
      {
        id: 2,
        story: "Bir link paylaşıldı: 'Ücretsiz oyun puanı kazan!'",
        question: "En güvenli hareket hangisi?",
        options: [
          {
            text: "Linke tıklayıp denemek",
            correct: false,
            feedback: "Bu tür linkler zararlı olabilir."
          },
          {
            text: "Linki görmezden gelip resmi mağazayı kontrol etmek",
            correct: true,
            feedback: "Doğru. Resmi kaynaklar daha güvenlidir."
          },
          {
            text: "Linki arkadaşlarına da göndermek",
            correct: false,
            feedback: "Riskli bir linki yaymak doğru değildir."
          }
        ]
      },
      {
        id: 3,
        story: "Mira'nın tableti güncelleme istiyor ama o oyun oynamak istiyor.",
        question: "Ne yapmalı?",
        options: [
          {
            text: "Güncellemeyi erteleyip hiç yapmamak",
            correct: false,
            feedback: "Güncellemeler güvenlik için gereklidir."
          },
          {
            text: "Oyundan sonra güncellemeyi yapmak",
            correct: true,
            feedback: "Doğru. Güncellemeleri geciktirmemek gerekir."
          },
          {
            text: "Güncellemeyi kapatıp unutmak",
            correct: false,
            feedback: "Bu, cihazı riskli hale getirir."
          }
        ]
      },
      {
        id: 4,
        story: "Bir arkadaş, Mira'ya oyun hesabının şifresini sordu.",
        question: "Mira ne cevap vermeli?",
        options: [
          {
            text: "Şifreyi paylaşmalı çünkü arkadaş",
            correct: false,
            feedback: "Şifreler asla paylaşılmaz."
          },
          {
            text: "Nazikçe paylaşamayacağını söylemeli",
            correct: true,
            feedback: "Doğru. Şifreler kişisel bilgidir."
          },
          {
            text: "Şifreyi sadece bir kez vermeli",
            correct: false,
            feedback: "Bir kez bile paylaşmak risklidir."
          }
        ]
      },
      {
        id: 5,
        story: "Mira okul hesabıyla ortak Wi-Fi'da ödev kontrol etmek istiyor.",
        question: "En güvenli seçim hangisi?",
        options: [
          {
            text: "Ortak Wi-Fi'da hesabına girmek",
            correct: false,
            feedback: "Ortak ağlar güvenli değildir."
          },
          {
            text: "Eve gidince kontrol etmek",
            correct: true,
            feedback: "Doğru. Güvenli ağları beklemek daha iyidir."
          },
          {
            text: "Şifreyi not edip sonra girmek",
            correct: false,
            feedback: "Şifreyi not etmek de riskli olabilir."
          }
        ]
      },
      {
        id: 6,
        story: "Grup sohbetinde biri kırıcı bir yorum yaptı.",
        question: "Mira nasıl davranmalı?",
        options: [
          {
            text: "Aynı şekilde kırıcı cevap vermeli",
            correct: false,
            feedback: "Bu durum kötüleşir."
          },
          {
            text: "Sakin kalıp saygılı konuşmalı",
            correct: true,
            feedback: "Doğru. Saygı ortamı korur."
          },
          {
            text: "Yorumun ekran görüntüsünü alıp yaymalı",
            correct: false,
            feedback: "Bunu yaymak sorunu büyütür."
          }
        ]
      },
      {
        id: 7,
        story: "Mira, bir uygulamanın konum izni istediğini görüyor.",
        question: "Ne yapmalı?",
        options: [
          {
            text: "Konumu her zaman açık bırakmalı",
            correct: false,
            feedback: "Gereksizse kapatmak daha güvenli olur."
          },
          {
            text: "İzinleri kontrol edip gerekirse kapatmalı",
            correct: true,
            feedback: "Doğru. İzinler kontrol edilmelidir."
          },
          {
            text: "İzni düşünmeden kabul etmeli",
            correct: false,
            feedback: "Düşünmeden izin vermek risklidir."
          }
        ]
      },
      {
        id: 8,
        story: "Mira'nın cihazında sürekli reklamlar çıkıyor.",
        question: "Bu neyin işareti olabilir?",
        options: [
          {
            text: "Güncelleme yapılması gerektiğinin",
            correct: false,
            feedback: "Bazı reklamlar zararlı yazılıma işaret edebilir."
          },
          {
            text: "Zararlı yazılım olabileceğinin",
            correct: true,
            feedback: "Doğru. Güvenilir bir tarama yapmak gerekir."
          },
          {
            text: "Cihazın çok güçlü olduğunun",
            correct: false,
            feedback: "Reklam patlaması güç göstergesi değildir."
          }
        ]
      },
      {
        id: 9,
        story: "Grup sohbetinde biri Mira'nın fotoğrafını izinsiz paylaştı.",
        question: "Mira ne yapmalı?",
        options: [
          {
            text: "Sessiz kalmalı",
            correct: false,
            feedback: "Bu yanlış. Yardım istemek gerekir."
          },
          {
            text: "Bildirip bir yetişkine söylemeli",
            correct: true,
            feedback: "Doğru. İzin dışı paylaşım ciddidir."
          },
          {
            text: "Fotoğrafı daha çok kişiye göndermeli",
            correct: false,
            feedback: "Bu durumu kötüleştirir."
          }
        ]
      },
      {
        id: 10,
        story: "Mira, bilgisayarını sınıfta paylaştı ve çıkış yapmayı unuttu.",
        question: "Bundan sonra en iyi adım nedir?",
        options: [
          {
            text: "Şifresini değiştirmek ve tüm cihazlardan çıkış yapmak",
            correct: true,
            feedback: "Doğru. Hesabı hızlıca güvene almak gerekir."
          },
          {
            text: "Hiçbir şey yapmamak",
            correct: false,
            feedback: "Bu risklidir."
          },
          {
            text: "Aynı şifreyi başka hesaplarda da kullanmak",
            correct: false,
            feedback: "Aynı şifreyi tekrar kullanmak güvenli değildir."
          }
        ]
      }
    ]
  },
  en: {
    title: "The Weekend Chat Group",
    intro:
      "Mira is planning the weekend with friends in a group chat. Make safe and respectful choices.",
    questions: [
      {
        id: 1,
        story: "A new person joined and asked everyone for their phone number.",
        question: "What should Mira do?",
        options: [
          {
            text: "Share the number right away",
            correct: false,
            feedback: "Personal information should not be shared in groups."
          },
          {
            text: "Politely say she will not share it",
            correct: true,
            feedback: "Correct. Personal data should be protected."
          },
          {
            text: "Send it and delete the message",
            correct: false,
            feedback: "The message could still be saved or screenshotted."
          }
        ]
      },
      {
        id: 2,
        story: "A link appears: 'Get free game points!'",
        question: "What is the safest move?",
        options: [
          {
            text: "Click and try it",
            correct: false,
            feedback: "These links can be dangerous."
          },
          {
            text: "Ignore the link and check the official store",
            correct: true,
            feedback: "Correct. Official sources are safer."
          },
          {
            text: "Share the link with friends",
            correct: false,
            feedback: "Spreading risky links is not safe."
          }
        ]
      },
      {
        id: 3,
        story: "Mira's tablet asks for an update but she wants to play a game.",
        question: "What should she do?",
        options: [
          {
            text: "Delay the update and never do it",
            correct: false,
            feedback: "Updates are important for security."
          },
          {
            text: "Update right after playing",
            correct: true,
            feedback: "Correct. Do not ignore updates."
          },
          {
            text: "Turn off updates forever",
            correct: false,
            feedback: "That makes the device risky."
          }
        ]
      },
      {
        id: 4,
        story: "A friend asks for Mira's game password.",
        question: "How should she reply?",
        options: [
          {
            text: "Share it because they are friends",
            correct: false,
            feedback: "Passwords should never be shared."
          },
          {
            text: "Say she cannot share it politely",
            correct: true,
            feedback: "Correct. Passwords are private."
          },
          {
            text: "Share it just once",
            correct: false,
            feedback: "Even once is risky."
          }
        ]
      },
      {
        id: 5,
        story: "Mira wants to check homework on public Wi-Fi.",
        question: "What is the safest choice?",
        options: [
          {
            text: "Log in on public Wi-Fi",
            correct: false,
            feedback: "Public networks are not secure."
          },
          {
            text: "Wait and check on a trusted network",
            correct: true,
            feedback: "Correct. Use secure networks for logins."
          },
          {
            text: "Write the password on paper and use it later",
            correct: false,
            feedback: "Passwords on paper can be risky."
          }
        ]
      },
      {
        id: 6,
        story: "Someone posts a hurtful comment in the group.",
        question: "How should Mira act?",
        options: [
          {
            text: "Reply with another hurtful joke",
            correct: false,
            feedback: "That makes the situation worse."
          },
          {
            text: "Stay calm and keep a respectful tone",
            correct: true,
            feedback: "Correct. Respect helps de-escalate."
          },
          {
            text: "Screenshot and spread it around",
            correct: false,
            feedback: "Spreading it increases harm."
          }
        ]
      },
      {
        id: 7,
        story: "Mira sees an app asking for location permission.",
        question: "What should she do?",
        options: [
          {
            text: "Leave location on all the time",
            correct: false,
            feedback: "Turn it off when it is not needed."
          },
          {
            text: "Review permissions and disable if unnecessary",
            correct: true,
            feedback: "Correct. Permissions should be checked."
          },
          {
            text: "Accept without thinking",
            correct: false,
            feedback: "Permissions should not be granted blindly."
          }
        ]
      },
      {
        id: 8,
        story: "Mira's device suddenly shows lots of pop-up ads.",
        question: "What could this be a sign of?",
        options: [
          {
            text: "A friendly update",
            correct: false,
            feedback: "Pop-ups can signal malware."
          },
          {
            text: "Possible malware",
            correct: true,
            feedback: "Correct. A security scan is needed."
          },
          {
            text: "A super powerful device",
            correct: false,
            feedback: "Pop-ups are not a power sign."
          }
        ]
      },
      {
        id: 9,
        story: "Someone shares Mira's photo without permission.",
        question: "What should she do?",
        options: [
          {
            text: "Stay silent",
            correct: false,
            feedback: "She should seek help."
          },
          {
            text: "Report it and tell a trusted adult",
            correct: true,
            feedback: "Correct. Unauthorized sharing is serious."
          },
          {
            text: "Share the photo even more",
            correct: false,
            feedback: "That makes things worse."
          }
        ]
      },
      {
        id: 10,
        story: "Mira used a shared computer and forgot to log out.",
        question: "What is the best next step?",
        options: [
          {
            text: "Change the password and sign out everywhere",
            correct: true,
            feedback: "Correct. Secure the account quickly."
          },
          {
            text: "Do nothing",
            correct: false,
            feedback: "That leaves the account exposed."
          },
          {
            text: "Reuse the same password everywhere",
            correct: false,
            feedback: "Reusing passwords increases risk."
          }
        ]
      }
    ]
  }
};

function Module4ScenarioQuiz({ isTurkish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const data = useMemo(() => (isTurkish ? SCENARIO_DATA.tr : SCENARIO_DATA.en), [isTurkish]);
  const current = data.questions[index];
  const progress = Math.round(((index + 1) / data.questions.length) * 100);

  const selectOption = (optIndex) => {
    if (showFeedback) return;
    setSelected(optIndex);
    setShowFeedback(true);
    if (current.options[optIndex]?.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    if (index + 1 < data.questions.length) {
      setIndex((prev) => prev + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
  };

  const isDone = index + 1 === data.questions.length && showFeedback;

  return (
    <div className="m4-scenario-quiz">
      <div className="m4-scenario-header">
        <div>
          <div className="m4-scenario-title">{data.title}</div>
          <div className="m4-scenario-intro">{data.intro}</div>
        </div>
        <div className="m4-scenario-score">
          {isTurkish ? "Puan" : "Score"}: {score}/{data.questions.length}
        </div>
      </div>

      <div className="m4-scenario-progress">
        <div className="m4-scenario-progress-bar">
          <div className="m4-scenario-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="m4-scenario-progress-text">
          {isTurkish ? "Soru" : "Question"} {index + 1}/{data.questions.length}
        </div>
      </div>

      <div className="m4-scenario-card">
        <div className="m4-scenario-story">{current.story}</div>
        <div className="m4-scenario-question">{current.question}</div>

        <div className="m4-scenario-options">
          {current.options.map((opt, i) => {
            const isPicked = selected === i;
            const isCorrect = opt.correct;
            const status =
              showFeedback && isPicked ? (isCorrect ? "correct" : "wrong") : showFeedback && isCorrect ? "correct" : "";
            return (
              <button
                key={`${opt.text}-${i}`}
                className={`m4-scenario-option ${status} ${isPicked ? "picked" : ""}`}
                onClick={() => selectOption(i)}
                disabled={showFeedback}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showFeedback && selected !== null && (
            <motion.div
              className={`m4-scenario-feedback ${current.options[selected]?.correct ? "ok" : "bad"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="m4-scenario-feedback-title">
                {current.options[selected]?.correct
                  ? isTurkish
                    ? "Doğru seçim!"
                    : "Correct choice!"
                  : isTurkish
                    ? "Dikkat et!"
                    : "Not quite!"}
              </div>
              <div className="m4-scenario-feedback-text">{current.options[selected]?.feedback}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="m4-scenario-actions">
        {index + 1 < data.questions.length ? (
          <button className="m4-scenario-btn primary" onClick={next} disabled={!showFeedback}>
            {isTurkish ? "Sonraki" : "Next"}
          </button>
        ) : (
          <button className="m4-scenario-btn primary" onClick={restart}>
            {isTurkish ? "Tekrar Başla" : "Restart"}
          </button>
        )}
        {isDone && (
          <div className="m4-scenario-summary">
            {isTurkish
              ? `Tamamlandı! Puanın: ${score}/${data.questions.length}`
              : `Completed! Your score: ${score}/${data.questions.length}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default Module4ScenarioQuiz;
