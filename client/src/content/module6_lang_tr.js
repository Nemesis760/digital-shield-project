export const MODULE6_TR = {
  "module_6": {
    "title": "Modül 6: Dijital Dedektif",
    "subtitle": "🔍 Olay Yeri İnceleme: NIST Detect & Respond",
    "sections": [
      {
        "id": 1,
        "title": "🚨 Kötü Amaçlı Yazılım Belirtileri (Malware Symptoms)",
        "intro": "Bilgisayarın hasta olduğunda verdiği sinyalleri tanımayı öğren. Yavaşlama, pop-up'lar, aşırı ısınma gibi.",
        "activity_title": "🎮 Aktivite: Tehdit Sinyallerini Tanı",
        "activity_desc": "Verilen senaryolarda hangi tehdit sinyallerinin bulunduğunu belirle.",
        "content": {
          "1.1": {
            "title": "Kötü Amaçlı Yazılım (Malware) Nedir?",
            "description": "Kötü amaçlı yazılım (malware), bilgisayarınıza zarar vermek, bilgi çalmak veya işlemleri bozmak için tasarlanmış yazılımdır. Dijital bir virüs gibidir!",
            "image": "/images/module6/threats.jpg",
            "points": [
              "Virüsler: Dosyadan dosyaya yayılır, sisteminize zarar verir",
              "Truva Atları: Kendilerini güvenli programlar gibi gösterir ama tehlikelidir",
              "Casus Yazılımlar: Gizlice çevrimiçi yaptıklarınızı izler",
              "Fidye Yazılımları: Dosyalarınızı kilitler ve açmak için para ister",
              "Reklam Yazılımları: İstenmeyen reklamlar gösterir"
            ],
            "examples": [
              "İndirdiğiniz bir dosya garip davranmaya başlar",
              "Bilgisayarınız aniden çok yavaşlar",
              "Gezinmediğiniz halde pop-up pencereler görünür"
            ]
          },
          "1.2": {
            "title": "Kötü Amaçlı Yazılım Uyarı İşaretleri",
            "description": "Bilgisayarınız bir şeylerin yanlış olduğunda size sinyaller verir. Bunları tanımayı öğrenin!",
            "points": [
              "Bilgisayar normalden çok daha yavaş çalışır",
              "Pop-up pencereler sık sık görünür",
              "Programlar çöker veya donar",
              "Tarayıcı ana sayfası izniniz olmadan değişir",
              "Dosyalar kaybolur veya bozulur",
              "Bilgisayar aşırı ısınır veya fan sürekli çalışır",
              "Garip hata mesajları görünür"
            ],
            "examples": [
              "✅ Normal: Bilgisayar 30 saniyede açılır",
              "❌ Uyarı: Bilgisayar 5 dakikada açılır",
              "✅ Normal: Tarayıcı ana sayfanıza açılır",
              "❌ Uyarı: Tarayıcı bilinmeyen bir web sitesine açılır"
            ]
          },
          "1.3": {
            "title": "Kötü Amaçlı Yazılımdan Nasıl Korunulur?",
            "description": "Önlemek tedaviden daha iyidir! İşte kötü amaçlı yazılımları uzak tutmanın yolları:",
            "points": [
              "Antivirüs yazılımı kurun ve düzenli olarak güncelleyin",
              "Şüpheli linklere veya pop-up'lara tıklamayın",
              "Bilinmeyen kaynaklardan dosya indirmeyin",
              "İşletim sisteminizi güncel tutun",
              "Güçlü şifreler kullanın",
              "Önemli dosyalarınızı düzenli olarak yedekleyin"
            ]
          }
        },
        "activity_type": "flappy_bird"
      },
      {
        "id": 2,
        "title": "🎣 Kimlik Avı (Phishing) Avcılığı",
        "intro": "Sahte e-postaları, mesajları ve web sitelerini nasıl tespit edeceğini öğrenerek oltaya gelmekten kaçın.",
        "activity_title": "📝 Quiz: Sahte E-posta Dedektifi",
        "activity_desc": "Gerçek ve sahte e-posta örneklerini karşılaştırarak ayırt et.",
        "content": {
          "2.1": {
            "title": "Kimlik Avı (Phishing) Nedir?",
            "description": "Kimlik avı, dolandırıcıların güvenilir bir şirket gibi davranarak şifreler veya kredi kartı numaraları gibi kişisel bilgilerinizi almak için sizi kandırmaya çalışmasıdır.",
            "image": "/images/module6/phishing.jpg",
            "points": [
              "Gerçek şirketlerden geliyormuş gibi görünen sahte e-postalar",
              "Şüpheli linklere tıklamanızı isteyen mesajlar",
              "Gerçek gibi görünen ama aslında sahte olan web siteleri",
              "Hızlı hareket etmenizi sağlamaya çalışan acil mesajlar",
              "Kişisel bilgi istekleri"
            ],
            "examples": [
              "Hesabınızın kapatılacağını iddia eden e-posta (şimdi doğrulamazsanız)",
              "Ödül kazandığınızı söyleyen ama bilgi vermenizi isteyen mesaj",
              "Banka web siteniz gibi görünen ama farklı URL'ye sahip link"
            ]
          },
          "2.2": {
            "title": "Kimlik Avını Nasıl Tespit Edilir?",
            "description": "Kimlik avı girişimlerinin belirgin işaretleri vardır. Bunları tanımayı öğrenin:",
            "points": [
              "Gönderenin e-posta adresini dikkatlice kontrol edin",
              "Yazım ve dil bilgisi hatalarını arayın",
              "Acil veya tehditkar mesajlardan şüphelenin",
              "Tıklamadan önce linklerin üzerine gelerek gerçek URL'yi görün",
              "Gerçek şirketler e-posta ile şifre istemez",
              "Web sitesi URL'sinin gerçek şirketin web sitesiyle eşleşip eşleşmediğini kontrol edin"
            ],
            "examples": [
              "❌ Şüpheli: 'Hesabınız kapatılacak!' (yazım hatası)",
              "✅ Güvenli: 'Hesabınız kapatılacak.' (doğru yazım)",
              "❌ Şüpheli: 'Hemen tıklayın yoksa erişimi kaybedersiniz!'",
              "✅ Güvenli: 'Lütfen hesabınıza giriş yaparak doğrulayın.'"
            ]
          },
          "2.3": {
            "title": "Kimlik Avından Şüphelenirseniz Ne Yapmalısınız?",
            "description": "Kimlik avı mesajı aldığınızı düşünüyorsanız, işte yapmanız gerekenler:",
            "points": [
              "Hiçbir linke tıklamayın veya ek indirmeyin",
              "Mesaja cevap vermeyin",
              "Gerçek şirkete bildirin (eğer onlar gibi davranıyorsa)",
              "Mesajı silin",
              "Zaten tıkladıysanız, şifrelerinizi hemen değiştirin",
              "Güvendiğiniz bir yetişkine söyleyin"
            ]
          }
        },
        "activity_type": "hotspot_quiz"
      },
      {
        "id": 3,
        "title": "🛠️ Siber Krizlere Müdahale Planı",
        "intro": "Bir saldırı veya kriz anında atılacak ilk adımlar hayat kurtarır. (İnterneti kes, ebeveyne/öğretmene haber ver, tarama yap).",
        "activity_title": "🎮 Aktivite: Kriz Simülasyonu",
        "activity_desc": "Siber saldırı senaryosunda doğru müdahale adımlarını sırala.",
        "content": {
          "3.1": {
            "title": "Siber Kriz Nedir?",
            "description": "Siber kriz, bilgisayarınızın veya hesaplarınızın saldırı altında olduğu zamandır. Kötü amaçlı yazılım, hack veya kimlik hırsızlığı olabilir.",
            "image": "/images/module6/crisis_response_hero.jpg",
            "points": [
              "Bilgisayarınız kötü amaçlı yazılımla enfekte olmuştur",
              "Birisi hesabınıza girmiştir",
              "Kişisel bilgileriniz çalınmıştır",
              "Dosyalarınız fidye yazılımı tarafından kilitlenmiştir",
              "Bir kimlik avı tuzağına düşmüşsünüzdür"
            ],
            "examples": [
              "Dosyalarınıza erişemezsiniz",
              "Ekranınızda garip mesajlar görünür",
              "Hesabınız yapmadığınız aktiviteler gösterir"
            ]
          },
          "3.2": {
            "title": "STOP Müdahale Planı",
            "description": "Siber krizle karşılaştığınızda STOP'u hatırlayın:",
            "points": [
              "S - Stop (Dur): Yaptığınız şeyi hemen durdurun",
              "T - Tell (Söyle): Hemen güvendiğiniz bir yetişkine söyleyin (ebeveyn, öğretmen)",
              "O - Offline (Çevrimdışı): Mümkünse internetten bağlantıyı kesin",
              "P - Protect (Koru): Diğer hesaplarınızı şifrelerinizi değiştirerek koruyun"
            ],
            "examples": [
              "Şüpheli bir mesaj görürseniz, durun ve hiçbir şeye tıklamayın",
              "Hemen ebeveyninize veya öğretmeninize söyleyin",
              "İnternet kablosunu çıkarın veya Wi-Fi'yi kapatın",
              "Tüm önemli hesaplarınızın şifrelerini değiştirin"
            ]
          },
          "3.3": {
            "title": "Önleme Kontrol Listesi",
            "description": "En iyi savunma önlemektir. Bu kontrol listesini takip edin:",
            "points": [
              "✅ Antivirüs yazılımını güncel tutun",
              "✅ Şifrelerinizi kimseyle paylaşmayın",
              "✅ Tıklamadan önce düşünün",
              "✅ Güvenmeden önce doğrulayın",
              "✅ Önemli dosyaları düzenli olarak yedekleyin",
              "✅ Yazılımları güncel tutun",
              "✅ Güçlü, benzersiz şifreler kullanın"
            ]
          }
        },
        "activity_type": "crisis_simulation"
      }
    ]
  }
};
export default MODULE6_TR;

