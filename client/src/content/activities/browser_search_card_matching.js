export const BROWSER_SEARCH_CARD_MATCHING = {
  id: 'browser_search',
  activity_type: 'card_matching',
  title_tr: 'Tarayıcı mı, Arama Motoru mu?',
  title_en: 'Browser or Search Engine?',
  description_tr: 'Verilen örnekleri doğru kategoriyle eşleştir.',
  description_en: 'Match each example with the correct category.',
  instructions_tr: [
    'Karttaki örneği oku.',
    'Doğru kategoriyi seç.',
    'Tüm kartları doğru eşleştir.'
  ],
  instructions_en: [
    'Read the example card.',
    'Select the correct category.',
    'Match all cards correctly.'
  ],
  situations: [
    {
      id: 1,
      text_tr: 'Google Chrome',
      text_en: 'Google Chrome',
      correct_match: 'browser'
    },
    {
      id: 2,
      text_tr: 'Mozilla Firefox',
      text_en: 'Mozilla Firefox',
      correct_match: 'browser'
    },
    {
      id: 3,
      text_tr: 'Google',
      text_en: 'Google',
      correct_match: 'search'
    },
    {
      id: 4,
      text_tr: 'Yandex',
      text_en: 'Yandex',
      correct_match: 'search'
    },
    {
      id: 5,
      text_tr: 'Microsoft Edge',
      text_en: 'Microsoft Edge',
      correct_match: 'browser'
    },
    {
      id: 6,
      text_tr: 'Bing',
      text_en: 'Bing',
      correct_match: 'search'
    }
  ],
  network_types: [
    {
      id: 'browser',
      label_tr: 'Tarayıcı',
      label_en: 'Browser'
    },
    {
      id: 'search',
      label_tr: 'Arama motoru',
      label_en: 'Search engine'
    }
  ],
  feedback: {
    correct_tr: 'Doğru! Bu örnek doğru kategoriye ait.',
    incorrect_tr: 'Yanlış! Tekrar düşün ve doğru kategoriyi seç.',
    correct_en: 'Correct! This example belongs to the correct category.',
    incorrect_en: 'Incorrect! Think again and choose the correct category.'
  }
};

