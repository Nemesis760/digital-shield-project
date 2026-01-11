export const NETWORK_DEVICE_MATCHING = {
  id: "network_device_matching",
  activity_type: "network_device_matching",
  title_tr: "Ağ Cihazlarını Eşleştir",
  title_en: "Match Network Devices",
  description_tr:
    "Görselleri doğru isim kartlarıyla eşleştirerek ağ cihazlarını öğren.",
  description_en:
    "Match each picture with the correct name card to learn network devices.",
  instructions_tr: [
    "Bir cihaz görseline tıkla.",
    "Çizgi seni takip ederken doğru isim kartına tıkla.",
    "Yanlışsa tekrar dene, doğruysa çizgi yerinde kalır."
  ],
  instructions_en: [
    "Click a device image.",
    "While the line follows your cursor, click the correct name card.",
    "If it is wrong, try again. If it is correct, the line stays."
  ],
  feedback: {
    incorrect_tr: "Bu eşleşme yanlış çünkü bu cihazın görevi farklıdır.",
    incorrect_en:
      "This match is incorrect because this device has a different function."
  },
  devices: [
    {
      id: "modem",
      label_tr: "Modem",
      label_en: "Modem",
      detail_tr: "İnternet sinyalini alır ve ev ağına aktarır.",
      detail_en: "Receives the internet signal and passes it to the home network.",
      image: "/images/module3/matching/modem.png"
    },
    {
      id: "router",
      label_tr: "Router",
      label_en: "Router",
      detail_tr: "Cihazları ağa bağlar ve veri trafiğini yönlendirir.",
      detail_en: "Connects devices to the network and routes data traffic.",
      image: "/images/module3/matching/router.png"
    },
    {
      id: "switch",
      label_tr: "Switch",
      label_en: "Switch",
      detail_tr: "Kablolu cihazları aynı yerel ağda birleştirir.",
      detail_en: "Connects wired devices within the same local network.",
      image: "/images/module3/matching/switch.png"
    },
    {
      id: "ethernet_cable",
      label_tr: "Ethernet Kablosu",
      label_en: "Ethernet Cable",
      detail_tr: "Cihazlar arasında kablolu veri taşır.",
      detail_en: "Carries data between devices through a wired connection.",
      image: "/images/module3/matching/ethernet_cable.png"
    },
    {
      id: "ethernet_card",
      label_tr: "Ethernet Kartı",
      label_en: "Ethernet Card",
      detail_tr: "Bilgisayara kablolu ağ bağlantısı sağlar.",
      detail_en: "Provides a wired network connection for a computer.",
      image: "/images/module3/matching/ethernet_card.png"
    },
    {
      id: "wifi",
      label_tr: "Wi-Fi",
      label_en: "Wi-Fi",
      detail_tr: "Kablosuz bağlantı sağlar ve sinyali havadan iletir.",
      detail_en: "Provides wireless connectivity by sending signals through the air.",
      image: "/images/module3/matching/wifi.png"
    },
    {
      id: "bluetooth",
      label_tr: "Bluetooth",
      label_en: "Bluetooth",
      detail_tr: "Kısa mesafede kablosuz bağlantı kurar.",
      detail_en: "Creates short-range wireless connections.",
      image: "/images/module3/matching/bluetooth.png"
    }
  ]
};
