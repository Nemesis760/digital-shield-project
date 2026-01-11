export const URL_PARTS_QUIZ = {
  id: 'url_parts_quiz',
  quiz: [
    {
      type: 'multiple_choice',
      question_tr: 'www.meb.gov.tr adresinde ?gov? neyi anlat?r?',
      question_en: 'In the address www.meb.gov.tr, what does ?gov? show?',
      options: [
        { text_tr: 'A) ?lke kodu', text_en: 'A) Country code', correct: false },
        { text_tr: 'B) Devlet kurumu uzant?s?', text_en: 'B) Government extension', correct: true },
        { text_tr: 'C) Site ad?', text_en: 'C) Site name', correct: false },
        { text_tr: 'D) ?nternet h?z?', text_en: 'D) Internet speed', correct: false },
      ],
      correctFeedback: '?gov? uzant?s?, sitenin devlet kurumuna ait oldu?unu g?sterir.',
      wrongFeedback: '?gov? ?lke kodu de?ildir; devlet kurumlar?n? ifade eden uzant?d?r.',
      correct_explanation_tr: '?gov? uzant?s?, sitenin devlet kurumuna ait oldu?unu g?sterir.',
      wrong_explanation_tr: '?gov? ?lke kodu de?ildir; devlet kurumlar?n? ifade eden uzant?d?r.',
      correct_explanation_en: '"gov" indicates a government website.',
      wrong_explanation_en: '"gov" is not a country code; it indicates government sites.'
    },
    {
      type: 'true_false',
      question_tr: '?tr? uzant?s?, sitenin ?lke kodunu g?sterir.',
      question_en: 'The ?tr? extension shows the country code of the website.',
      answer: true,
      correctFeedback: 'Evet. ?tr? T?rkiye ?lke kodudur.',
      wrongFeedback: '?tr? ?lke kodudur; T?rkiye?yi g?sterir.',
      correct_explanation_tr: 'Evet. ?tr? T?rkiye ?lke kodudur.',
      wrong_explanation_tr: '?tr? ?lke kodudur; T?rkiye?yi g?sterir.',
      correct_explanation_en: 'Yes. ?tr? is the country code for T?rkiye.',
      wrong_explanation_en: '?tr? is a country code for T?rkiye.'
    },
  ]
};
