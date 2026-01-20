export const URL_PARTS_QUIZ = {
  id: 'url_parts_quiz',
  quiz: [
    {
      type: 'multiple_choice',
      question_tr: "www.meb.gov.tr adresinde 'gov' neyi anlatır?",
      question_en: "In the address www.meb.gov.tr, what does 'gov' show?",
      options: [
        { text_tr: 'A) Ülke kodu', text_en: 'A) Country code', correct: false },
        { text_tr: 'B) Devlet kurumu uzantısı', text_en: 'B) Government extension', correct: true },
        { text_tr: 'C) Site adı', text_en: 'C) Site name', correct: false },
        { text_tr: 'D) İnternet hızı', text_en: 'D) Internet speed', correct: false },
      ],

      // (Eski alanlar kalsın; InteractiveQuiz bunları okuyabilir)
      correctFeedback: "'gov' uzantısı, sitenin devlet kurumuna ait olduğunu gösterir.",
      wrongFeedback: "'gov' ülke kodu değildir; devlet kurumlarını ifade eden uzantıdır.",

      // ✅ Yeni, temiz yapı (senin istediğin): reason_tr / reason_en
      reason_tr: {
        correct:
          "'gov' (government) uzantısı, sitenin bir devlet kurumuna ait olduğunu gösterir.",
        wrong:
          "'gov' ülke kodu değildir. Devlet kurumlarını ifade eden uzantıdır (Türkiye ülke kodu 'tr'dir).",
      },
      reason_en: {
        correct:
          "'gov' stands for government and indicates the site belongs to a government institution.",
        wrong:
          "'gov' is not a country code. It indicates government-related websites (the country code here is 'tr').",
      },

      // (Eski explanation alanları da kalsın)
      correct_explanation_tr: "'gov' uzantısı, sitenin devlet kurumuna ait olduğunu gösterir.",
      wrong_explanation_tr: "'gov' ülke kodu değildir; devlet kurumlarını ifade eden uzantıdır.",
      correct_explanation_en: "'gov' indicates a government website.",
      wrong_explanation_en: "'gov' is not a country code; it indicates government sites.",
    },

    {
      type: 'true_false',
      question_tr: "'tr' uzantısı, sitenin ülke kodunu gösterir.",
      question_en: "The 'tr' extension shows the country code of the website.",
      answer: true,

      correctFeedback: "Evet. 'tr' Türkiye ülke kodudur.",
      wrongFeedback: "'tr' ülke kodudur; Türkiye'yi gösterir.",

      // ✅ Yeni reason yapısı (InteractiveQuiz dosyan da bunu okuyacak)
      reason_tr: {
        correct: "Doğru. 'tr' uzantısı Türkiye ülke kodunu ifade eder.",
        wrong: "Yanlış. 'tr' uzantısı ülke kodudur ve Türkiye'yi gösterir.",
      },
      reason_en: {
        correct: "Correct. 'tr' is the country code for Türkiye.",
        wrong: "Incorrect. 'tr' is a country code and it represents Türkiye.",
      },

      correct_explanation_tr: "Evet. 'tr' Türkiye ülke kodudur.",
      wrong_explanation_tr: "'tr' ülke kodudur; Türkiye'yi gösterir.",
      correct_explanation_en: "Yes. 'tr' is the country code for Türkiye.",
      wrong_explanation_en: "'tr' is a country code for Türkiye.",
    },
  ],
};
