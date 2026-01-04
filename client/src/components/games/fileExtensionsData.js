export const FILE_EXTENSIONS_ROUNDS = [
  {
    promptTr: "Görsel dosyası uzantıları",
    options: ["docx", "jpg", "png", "avi", "bmp", "gif"],
    correct: ["jpg", "png", "bmp", "gif"],
  },
  {
    promptTr: "Metin dosyası uzantıları",
    options: ["png", "docx", "mp3", "rar", "txt", "rtf"],
    correct: ["docx", "txt", "rtf"],
  },
  {
    promptTr: "Ses dosyası uzantıları",
    options: ["avi", "png", "bmp", "mp3", "wav", "wma"],
    correct: ["mp3", "wav", "wma"],
  },
  {
    promptTr: "Sıkıştırılmış uzantılar",
    options: ["mp3", "docx", "rar", "mov", "avi", "zip"],
    correct: ["rar", "zip"],
  },
  {
    promptTr: "Video uzantıları",
    options: ["mov", "avi", "mpeg", "docx", "jpeg", "mp4"],
    correct: ["mov", "avi", "mpeg", "mp4"],
  },
  {
    promptTr: "Elektronik kitap uzantıları",
    options: ["pdf", "knf", "trt", "epub", "movi", "pubg"],
    correct: ["pdf", "epub"],
    optional: ["knf"],
  },
  {
    promptTr: "Uygulama/Program uzantıları",
    options: ["exe", "avax", "com", "xlsx", "apk", "jpg"],
    correct: ["exe", "com", "apk"],
  },
];

export default FILE_EXTENSIONS_ROUNDS;
