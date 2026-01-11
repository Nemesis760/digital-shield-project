export const CLIENT_SERVER_CARD_MATCHING = {
  id: 'client_server',
  activity_type: 'card_matching',
  title_tr: 'İstemci mi, Sunucu mu?',
  title_en: 'Client or Server?',
  description_tr: 'Durumları okuyup doğru kategoriyle eşleştir.',
  description_en: 'Read each situation and match it with the correct category.',
  instructions_tr: [
    'Durumu oku.',
    'İstemci mi sunucu mu olduğuna karar ver.',
    'Doğru kartı seç.'
  ],
  instructions_en: [
    'Read the situation.',
    'Decide if it is a client or a server.',
    'Choose the correct card.'
  ],
  situations: [
    {
      id: 1,
      text_tr: 'Web sitesini açan tarayıcı',
      text_en: 'A browser opening a website',
      correct_match: 'client'
    },
    {
      id: 2,
      text_tr: 'YouTube videosunu gönderen bilgisayar',
      text_en: 'A computer sending YouTube videos',
      correct_match: 'server'
    },
    {
      id: 3,
      text_tr: 'EBA’ya giriş yapan öğrenci tableti',
      text_en: 'A student tablet logging into EBA',
      correct_match: 'client'
    },
    {
      id: 4,
      text_tr: 'Oyunlarda çok kişiye aynı anda veri gönderen sistem',
      text_en: 'A system sending data to many players at once',
      correct_match: 'server'
    }
  ],
  network_types: [
    {
      id: 'client',
      label_tr: 'İstemci',
      label_en: 'Client'
    },
    {
      id: 'server',
      label_tr: 'Sunucu',
      label_en: 'Server'
    }
  ],
  feedback: {
    correct_tr: 'Doğru! Bu örnek doğru kategoriye ait.',
    incorrect_tr: 'Yanlış! İstemci ve sunucu farkını tekrar düşün.',
    correct_en: 'Correct! This example belongs to the correct category.',
    incorrect_en: 'Incorrect! Think again about the client/server difference.'
  }
};

