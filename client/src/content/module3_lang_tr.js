export const MODULE3_TR = {
  "module_3": {
    "title": "Modül 3: Bilgisayar Ağları ve Dijital İletişim",
    "subtitle": "🌐 Veri Yolculuğu ve Ağ Güvenliği",
    "hero_image": "/images/module_networks/hero.png",
    "sections": [
      {
        "id": 1,
        "title": "🌐 İnternet Nedir ve Veri Paketleri Nasıl Yolculuk Eder?",
        "subtitle": "Dijital Dünyanın Otoyolları",
        "intro": "İnternet, dünyadaki milyarlarca bilgisayarın birbirine bağlı olduğu dev bir ağdır. Tıpkı şehirler arası otoyollar gibi, veriler de bu ağ üzerinden yolculuk eder. Her mesaj, her fotoğraf, her video küçük paketlere bölünür ve hedefine ulaşır.",
        "content": {
          "1.1": {
            "title": "İnternet Nedir?",
            "description": "İnternet, dünyadaki milyarlarca bilgisayarın, telefonun ve diğer cihazların birbirine bağlı olduğu dev bir ağdır. Tıpkı bir şehirdeki yollar gibi, veriler bu ağ üzerinden yolculuk eder. Bir arkadaşına mesaj gönderdiğinde, o mesaj binlerce kilometre uzaktaki bir sunucuya gider ve sonra arkadaşının telefonuna ulaşır.",
            "image": "/images/module2/İnternet Nedir.png",
            "points": [
              "İnternet, dünyadaki tüm cihazları birbirine bağlayan dev bir ağdır",
              "Milyarlarca bilgisayar, telefon ve tablet birbirine bağlıdır",
              "Veriler bu ağ üzerinden saniyeler içinde dünyanın her yerine ulaşır",
              "İnternet olmadan çevrimiçi oyun oynayamaz, video izleyemez veya mesaj gönderemezsin"
            ],
            "examples": [
              "Bir video izlediğinde, o video binlerce kilometre uzaktaki bir sunucudan gelir",
              "Arkadaşına mesaj gönderdiğinde, mesaj önce bir sunucuya gider, sonra arkadaşının telefonuna ulaşır",
              "Bir web sitesine girdiğinde, o sitenin bilgileri dünyanın başka bir yerinden gelir"
            ]
          },
          "1.2": {
            "title": "Veri Paketleri Nasıl Yolculuk Eder?",
            "description": "Büyük dosyalar (video, fotoğraf, mesaj) küçük parçalara bölünür. Bu parçalara 'paket' denir. Her paket, tıpkı bir mektup gibi, hedef adresini içerir. Paketler farklı yollardan gidebilir ama hepsi aynı hedefe ulaşır. Varış noktasında paketler tekrar birleştirilir ve orijinal dosya oluşturulur.",
            "image": "/images/module_networks/packet_travel.png",
            "points": [
              "Büyük dosyalar küçük paketlere bölünür (tıpkı bir puzzle gibi)",
              "Her paket hedef adresini içerir",
              "Paketler farklı yollardan gidebilir ama hepsi aynı yere ulaşır",
              "Varış noktasında paketler tekrar birleştirilir",
              "Bu işlem saniyeler içinde gerçekleşir"
            ],
            "examples": [
              "Bir fotoğraf gönderdiğinde, fotoğraf 100 küçük pakete bölünür",
              "Her paket farklı bir yoldan gidebilir",
              "Tüm paketler arkadaşının telefonuna ulaşır ve fotoğraf tekrar oluşturulur"
            ]
          },
          "1.3": {
            "title": "İnternet Neden Önemlidir?",
            "description": "İnternet sayesinde dünyanın her yerindeki insanlarla anında iletişim kurabiliriz. Bilgiye hızlıca ulaşabilir, oyun oynayabilir, video izleyebiliriz. Ancak bu büyük ağ, güvenlik açısından da dikkatli olmamızı gerektirir.",
            "points": [
              "İnternet bilgiye hızlı erişim sağlar",
              "Dünyanın her yerindeki insanlarla iletişim kurmamızı sağlar",
              "Eğitim, eğlence ve iş için vazgeçilmezdir",
              "Ancak güvenlik konusunda dikkatli olmalıyız"
            ]
          }
        },
        "activity_title": "🎮 Aktivite: Paket Teslim Oyunu",
        "activity_desc": "Veri paketlerini doğru hedefe ulaştırmaya çalış. Paketleri yönlendir ve ağ üzerindeki yolculuklarını izle!",
        "activity_type": "packet_delivery"
      },
      {
        "id": 2,
        "title": "🏠 Ağ Türleri: Ev, Okul ve Halka Açık Wi-Fi",
        "subtitle": "Farklı Ağlar, Farklı Güvenlik Seviyeleri",
        "intro": "İnternete bağlanmak için farklı ağ türleri kullanırız. Her ağ türünün kendine özgü özellikleri ve güvenlik seviyeleri vardır. Bunları anlamak, güvenli bir şekilde çevrimiçi olmamıza yardımcı olur.",
        "content": {
          "2.1": {
            "title": "Ev Ağı (Home Network)",
            "description": "Ev ağı, evindeki tüm cihazları (bilgisayar, telefon, tablet, oyun konsolu) birbirine bağlayan ve onları internete bağlayan ağdır. Genellikle bir modem ve router ile oluşturulur. Ev ağı genellikle en güvenli ağ türüdür çünkü sadece sen ve ailen erişebilirsiniz.",
            "image": "/images/module2/Ağ Türleri.png",
            "points": [
              "Evindeki tüm cihazları birbirine bağlar",
              "Modem ve router ile oluşturulur",
              "Şifre korumalıdır, sadece sen ve ailen erişebilirsiniz",
              "En güvenli ağ türlerinden biridir"
            ],
            "examples": [
              "Evde Wi-Fi şifren sadece ailen tarafından bilinir",
              "Komşular senin ağına bağlanamaz (şifre olmasa bile)",
              "Ev ağında özel bilgilerini paylaşmak daha güvenlidir"
            ]
          },
          "2.2": {
            "title": "Okul Ağı (School Network)",
            "description": "Okul ağı, okuldaki tüm bilgisayarları ve cihazları birbirine bağlayan ağdır. Öğretmenler ve öğrenciler bu ağa bağlanabilir. Okul ağı genellikle filtreler içerir (zararlı sitelere erişimi engeller) ve kullanıcı aktivitelerini izleyebilir.",
            "image": "/images/module2/Ağ Türleri.png",
            "points": [
              "Okuldaki tüm cihazları birbirine bağlar",
              "Öğretmenler ve öğrenciler erişebilir",
              "Zararlı sitelere erişimi engelleyen filtreler içerir",
              "Kullanıcı aktiviteleri izlenebilir"
            ],
            "examples": [
              "Okulda oyun sitelerine erişim engellenmiş olabilir",
              "Öğretmenler hangi sitelere girdiğini görebilir",
              "Okul ağında dikkatli olmalısın"
            ]
          },
          "2.3": {
            "title": "Halka Açık Wi-Fi (Public Wi-Fi)",
            "description": "Halka açık Wi-Fi, kafeler, havaalanları, oteller gibi yerlerde bulunan ve herkesin kullanabileceği ağlardır. Bu ağlar genellikle şifresizdir veya herkese açık şifreleri vardır. Halka açık Wi-Fi'ler güvenli değildir çünkü başkaları da aynı ağa bağlıdır ve verilerinizi görebilir.",
            "image": "/images/module2/Ağ Türleri.png",
            "points": [
              "Kafeler, havaalanları, oteller gibi yerlerde bulunur",
              "Genellikle şifresizdir veya herkese açık şifreleri vardır",
              "Herkes bağlanabilir, bu yüzden güvenli değildir",
              "Özel bilgilerini (şifreler, banka bilgileri) paylaşmamalısın"
            ],
            "examples": [
              "❌ Kafede halka açık Wi-Fi'de banka hesabına girmek",
              "❌ Havaalanında şifrelerini girmek",
              "✅ Sadece genel web sitelerine bakmak (haber, hava durumu)",
              "✅ Önemli işlemleri ev ağında yapmak"
            ]
          }
        },
        "activity_title": "🎮 Aktivite: Ağ Türleri Eşleştirme",
        "activity_desc": "Verilen durumları oku ve doğru ağ türü ile eşleştir. Hangi ağ türü daha güvenli?",
        "activity_type": "card_matching"
      },
      {
        "id": 3,
        "title": "📡 Cihazlar Nasıl İletişim Kurar? (Modem, Router, Cihazlar)",
        "subtitle": "Dijital İletişimin Mimarisi",
        "intro": "Cihazların birbirleriyle iletişim kurması için özel cihazlar gerekir. Modem, router ve diğer ağ cihazları bu iletişimi sağlar. Her birinin farklı bir görevi vardır.",
        "content": {
          "3.1": {
            "title": "Modem Nedir?",
            "description": "Modem, evindeki ağı internete bağlayan cihazdır. Tıpkı bir kapı gibi, modem dış dünyaya (internete) açılan kapıdır. İnternet sağlayıcısından (Türk Telekom, Superonline gibi) gelen internet sinyalini alır ve evindeki cihazlara dağıtır.",
            "image": "/images/module_networks/modem.png",
            "points": [
              "Ev ağını internete bağlar",
              "İnternet sağlayıcısından sinyal alır",
              "Dış dünyaya açılan kapı gibidir",
              "Genellikle router ile birleşik olarak gelir"
            ],
            "examples": [
              "Modem olmadan internete bağlanamazsın",
              "İnternet sağlayıcısı modemi kurar",
              "Modem, internete açılan kapıdır"
            ]
          },
          "3.2": {
            "title": "Router (Yönlendirici) Nedir?",
            "description": "Router, evindeki cihazları birbirine bağlayan ve internete erişim sağlayan cihazdır. Wi-Fi sinyali yayar, böylece kablosuz olarak internete bağlanabilirsin. Router, evindeki cihazlar arasında trafiği yönetir - hangi cihazın hangi veriyi alacağını belirler.",
            "image": "/images/module_networks/router.png",
            "points": [
              "Evindeki cihazları birbirine bağlar",
              "Wi-Fi sinyali yayar",
              "Cihazlar arası trafiği yönetir",
              "Hangi cihazın hangi veriyi alacağını belirler"
            ],
            "examples": [
              "Router sayesinde telefonun Wi-Fi ile internete bağlanır",
              "Router, bilgisayarın ve telefonun aynı anda internete bağlanmasını sağlar",
              "Router olmadan kablosuz bağlantı olmaz"
            ]
          },
          "3.3": {
            "title": "Cihazlar Nasıl İletişim Kurar?",
            "description": "Cihazlar (telefon, bilgisayar, tablet) router'a bağlanır. Router, bu cihazların isteklerini alır ve internete iletir. İnternetten gelen cevapları da ilgili cihaza yönlendirir. Tıpkı bir postacı gibi, router doğru paketleri doğru adreslere ulaştırır.",
            "image": "/images/module2/Cihazlar Nasıl Haberleşir.png",
            "points": [
              "Cihazlar router'a bağlanır",
              "Router istekleri internete iletir",
              "İnternetten gelen cevapları ilgili cihaza yönlendirir",
              "Her cihaz kendi adresine sahiptir"
            ],
            "examples": [
              "Telefonun bir video izlemek istediğinde, router bu isteği internete iletir",
              "Video geldiğinde, router onu telefonuna yönlendirir",
              "Aynı anda bilgisayarın da internete bağlanabilir, router her ikisini de yönetir"
            ]
          }
        },
        "activity_title": "🎮 Aktivite: Ağ Cihazları Hotspot",
        "activity_desc": "Ağ cihazlarının üzerine tıkla ve her birinin görevini öğren. Modem, router ve diğer cihazlar nasıl çalışır?",
        "activity_type": "network_hotspot"
      },
      {
        "id": 4,
        "title": "🔌 Kablolu vs Kablosuz İletişim",
        "subtitle": "İki Farklı Yol, Aynı Hedef",
        "intro": "Cihazlar internete iki şekilde bağlanabilir: kablolu (Ethernet) veya kablosuz (Wi-Fi). Her ikisinin de avantaj ve dezavantajları vardır.",
        "content": {
          "4.1": {
            "title": "Kablolu İletişim (Ethernet)",
            "description": "Kablolu bağlantı, cihazın router'a bir kablo ile bağlanmasıdır. Bu bağlantı türü genellikle daha hızlı ve daha güvenilirdir. Oyun oynarken veya video izlerken daha az kesinti olur. Ancak cihazın router'a yakın olması gerekir.",
            "image": "/images/module2/Kablolu ve Kablosuz iletişim.png",
            "points": [
              "Daha hızlı ve güvenilir bağlantı",
              "Oyun ve video için daha iyi performans",
              "Daha az kesinti",
              "Ancak cihaz router'a yakın olmalı"
            ],
            "examples": [
              "✅ Oyun konsolu genellikle kablolu bağlantı kullanır (daha hızlı)",
              "✅ Masaüstü bilgisayarlar kablolu bağlantı kullanabilir",
              "❌ Telefon ve tablet kablolu bağlantı kullanamaz (pratik değil)"
            ]
          },
          "4.2": {
            "title": "Kablosuz İletişim (Wi-Fi)",
            "description": "Kablosuz bağlantı, cihazın router'dan yayılan Wi-Fi sinyalini kullanarak internete bağlanmasıdır. Bu bağlantı türü daha esnektir çünkü cihazı istediğin yere taşıyabilirsin. Ancak kablolu bağlantıdan biraz daha yavaş olabilir ve sinyal gücüne bağlıdır.",
            "image": "/images/module2/Kablolu ve Kablosuz iletişim.png",
            "points": [
              "Daha esnek, cihazı istediğin yere taşıyabilirsin",
              "Kablo gerekmez",
              "Ancak kablolu bağlantıdan biraz daha yavaş olabilir",
              "Sinyal gücüne bağlıdır (router'a yakın olmak önemli)"
            ],
            "examples": [
              "✅ Telefon ve tablet Wi-Fi kullanır",
              "✅ Laptop'lar genellikle Wi-Fi kullanır",
              "⚠️ Router'dan uzaklaştıkça sinyal zayıflar"
            ]
          },
          "4.3": {
            "title": "Hangisini Kullanmalıyım?",
            "description": "Her iki bağlantı türünün de kendine özgü kullanım alanları vardır. Oyun oynuyorsan veya hızlı internet istiyorsan kablolu bağlantı daha iyidir. Ancak esneklik istiyorsan Wi-Fi kullanabilirsin.",
            "points": [
              "Oyun ve hızlı internet için: Kablolu bağlantı",
              "Esneklik ve hareket için: Wi-Fi",
              "Her ikisi de güvenlidir (ev ağında)",
              "Halka açık Wi-Fi'de dikkatli ol"
            ],
            "examples": [
              "Oyun konsolu → Kablolu bağlantı",
              "Telefon → Wi-Fi",
              "Masaüstü bilgisayar → Kablolu bağlantı (mümkünse)",
              "Laptop → Wi-Fi (esneklik için)"
            ]
          }
        },
        "activity_title": "🎮 Aktivite: Doğru/Yanlış Quiz",
        "activity_desc": "Kablolu ve kablosuz iletişim hakkındaki ifadeleri oku ve doğru mu yanlış mı olduğunu belirle.",
        "activity_type": "truth_or_troll"
      },
      {
        "id": 5,
        "title": "🛡️ Neden Ağ Güvenliği Önemlidir?",
        "subtitle": "Dijital Dünyada Kendini Korumak",
        "intro": "Ağ güvenliği, dijital dünyada kendimizi korumak için çok önemlidir. Güvensiz ağlara bağlanmak veya güvenlik önlemlerini ihmal etmek, kişisel bilgilerimizin çalınmasına neden olabilir.",
        "content": {
          "5.1": {
            "title": "Ağ Güvenliği Neden Önemlidir?",
            "description": "Güvensiz ağlara bağlanmak, kişisel bilgilerimizin (şifreler, banka bilgileri, özel mesajlar) başkaları tarafından görülmesine neden olabilir. Kötü niyetli kişiler bu bilgileri çalabilir veya kötüye kullanabilir. Bu yüzden güvenli ağlar kullanmalı ve güvenlik önlemlerini almalıyız.",
            "image": "/images/module2/Ağlarda güvenlik neden önemli.png",
            "points": [
              "Güvensiz ağlarda kişisel bilgilerin çalınabilir",
              "Şifrelerin ve banka bilgilerin görülebilir",
              "Kötü niyetli kişiler bu bilgileri kötüye kullanabilir",
              "Güvenli ağlar kullanmalı ve güvenlik önlemlerini almalıyız"
            ],
            "examples": [
              "❌ Halka açık Wi-Fi'de banka hesabına girmek",
              "❌ Şifresiz ağlara bağlanmak",
              "✅ Ev ağında özel bilgileri paylaşmak",
              "✅ Güçlü Wi-Fi şifresi kullanmak"
            ]
          },
          "5.2": {
            "title": "Güvenli Ağ Kullanımı İpuçları",
            "description": "Güvenli bir şekilde internete bağlanmak için bazı önemli ipuçları:",
            "points": [
              "Ev ağında güçlü bir Wi-Fi şifresi kullan",
              "Halka açık Wi-Fi'de özel bilgilerini paylaşma",
              "Tanımadığın ağlara bağlanma",
              "Antivirüs yazılımı kullan",
              "Şüpheli bağlantılardan kaçın"
            ],
            "examples": [
              "✅ Wi-Fi şifren en az 12 karakter olsun",
              "✅ Halka açık Wi-Fi'de sadece genel sitelere bak",
              "❌ Tanımadığın 'Ücretsiz Wi-Fi' ağlarına bağlanma",
              "✅ Önemli işlemleri ev ağında yap"
            ]
          },
          "5.3": {
            "title": "Ağ Güvenliği Senaryoları",
            "description": "Farklı durumlarda nasıl davranmalıyız?",
            "points": [
              "Kafede halka açık Wi-Fi kullanırken: Sadece genel sitelere bak, şifre girme",
              "Ev ağında: Güvenli, özel bilgilerini paylaşabilirsin",
              "Okul ağında: Dikkatli ol, aktivitelerin izlenebilir",
              "Tanımadığın ağlar: Asla bağlanma"
            ],
            "quiz": [
              {
                "type": "true_false",
                "question": "Halka açık Wi-Fi'de banka hesabıma girmek güvenlidir.",
                "answer": false
              },
              {
                "type": "true_false",
                "question": "Ev ağında güçlü bir Wi-Fi şifresi kullanmak önemlidir.",
                "answer": true
              },
              {
                "type": "multiple_choice",
                "question": "Hangi durumda özel bilgilerini paylaşabilirsin?",
                "options": [
                  {
                    "text": "A) Halka açık Wi-Fi'de",
                    "correct": false
                  },
                  {
                    "text": "B) Ev ağında",
                    "correct": true
                  },
                  {
                    "text": "C) Tanımadığın bir ağda",
                    "correct": false
                  },
                  {
                    "text": "D) Şifresiz bir ağda",
                    "correct": false
                  }
                ]
              },
              {
                "type": "multiple_choice",
                "question": "Ağ güvenliği neden önemlidir?",
                "options": [
                  {
                    "text": "A) İnternet daha hızlı olur",
                    "correct": false
                  },
                  {
                    "text": "B) Kişisel bilgilerin çalınmasını önler",
                    "correct": true
                  },
                  {
                    "text": "C) Daha fazla oyun oynayabilirsin",
                    "correct": false
                  },
                  {
                    "text": "D) Daha fazla video izleyebilirsin",
                    "correct": false
                  }
                ]
              }
            ]
          }
        },
        "activity_title": "📝 Quiz: Ağ Güvenliği",
        "activity_desc": "Ağ güvenliği hakkındaki soruları cevapla ve bilgini test et.",
        "activity_type": "interactive_quiz"
      }
    ],
    "scenario_assessment": {
      "title": "🎯 Senaryo Bazlı Değerlendirme",
      "description": "Aşağıdaki senaryoyu oku ve doğru kararları ver.",
      "scenarios": [
        {
          "id": 1,
          "situation": "Ali bir kafede oturuyor ve halka açık Wi-Fi'ye bağlanmış. Arkadaşı ona bir video göndermiş ve Ali bu videoyu izlemek istiyor. Ayrıca ödevini kontrol etmek için okul hesabına girmesi gerekiyor.",
          "question": "Ali ne yapmalı?",
          "options": [
            {
              "text": "A) Hem videoyu izleyebilir hem de okul hesabına girebilir, halka açık Wi-Fi güvenlidir.",
              "correct": false,
              "feedback": "Halka açık Wi-Fi'de özel bilgilerini (okul hesabı) paylaşmamalısın. Video izlemek genel bir aktivite olduğu için sorun olmayabilir, ancak şifre gerektiren işlemler güvenli değildir."
            },
            {
              "text": "B) Sadece videoyu izleyebilir, okul hesabına girmek için ev ağına bağlanmayı beklemelidir.",
              "correct": true,
              "feedback": "Doğru! Halka açık Wi-Fi'de genel aktiviteler (video izleme) yapılabilir, ancak özel bilgiler gerektiren işlemler (okul hesabı) ev ağında yapılmalıdır."
            },
            {
              "text": "C) Hiçbir şey yapmamalı, halka açık Wi-Fi hiç güvenli değildir.",
              "correct": false,
              "feedback": "Halka açık Wi-Fi genel aktiviteler için kullanılabilir, ancak özel bilgiler gerektiren işlemler için güvenli değildir."
            }
          ]
        },
        {
          "id": 2,
          "situation": "Ayşe'nin evinde Wi-Fi şifresi yok. Komşuları ona şifresiz bir ağ olduğunu söylüyor ve Ayşe bu ağa bağlanmayı düşünüyor.",
          "question": "Ayşe ne yapmalı?",
          "options": [
            {
              "text": "A) Şifresiz ağa bağlanabilir, sorun olmaz.",
              "correct": false,
              "feedback": "Şifresiz ağlar güvenli değildir. Başkaları bu ağa bağlanabilir ve verilerinizi görebilir."
            },
            {
              "text": "B) Şifresiz ağa bağlanmamalı, güvenli bir ağ bulmalı veya kendi ağını kurmalıdır.",
              "correct": true,
              "feedback": "Doğru! Şifresiz ağlar güvenli değildir. Ayşe güvenli bir ağ bulmalı veya kendi güvenli ağını kurmalıdır."
            },
            {
              "text": "C) Sadece genel sitelere bakarsa sorun olmaz.",
              "correct": false,
              "feedback": "Şifresiz ağlarda bile genel aktiviteler yaparken dikkatli olmalısın. Mümkünse güvenli bir ağ kullan."
            }
          ]
        }
      ]
    }
  }
};
export default MODULE3_TR;
