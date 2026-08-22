import type { MarketPhrasebook } from './types';

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} ve ${items[items.length - 1]}`;
}

function capitalize(s: string): string {
  return s ? `${s.charAt(0).toLocaleUpperCase('tr')}${s.slice(1)}` : s;
}

export const tr: MarketPhrasebook = {
  sector: {
    finance: 'finans',
    technology: 'teknoloji',
    healthcare: 'sağlık',
    education: 'eğitim',
    media: 'medya',
    tourism: 'turizm ve otelcilik',
    logistics: 'lojistik',
    energy: 'enerji',
    publicSector: 'kamu sektörü',
    manufacturing: 'sanayi',
    research: 'araştırma',
    retail: 'perakende',
    construction: 'inşaat',
    startups: 'girişimler',
    legal: 'hukuk hizmetleri',
  },

  norm: {
    noPhoto: 'fotoğraf, doğum tarihi ve medeni durum yazılmaz',
    photoCommon: 'profesyonel bir vesikalık hâlâ olağan ve çoğu zaman bekleniyor',
    onePage: 'çok kıdemli değilseniz tek sayfa',
    twoPages: 'kabul gören uzunluk iki sayfa',
    attestedCertificates: 'diplomalar tasdikli ve ibraz edilmeye hazır olmalı',
    workAuthorization: 'vize veya çalışma izni durumunuzu açıkça belirtin',
    referencesOnRequest: 'referanslar «talep hâlinde iletilir» şeklinde yazılabilir',
    localContactDetails: 'açık adres yerine yerel bir telefon numarası ve şehir',
    languageLevels: 'belirsiz ifadeler yerine dil seviyeleri (A1–C2)',
    reverseChronological: 'tersten kronolojik sıra ve açıklanmamış boşluk bırakmamak',
  },

  credentialKind: {
    registration: 'kayıt',
    licence: 'lisans',
    certification: 'sertifika',
    qualification: 'yeterlilik',
    attestation: 'tasdik',
  },

  credentialProof: (name, kind, city) => {
    const detail =
      kind === 'registration' || kind === 'licence'
        ? 'kurumu, numaranızı ve geçerlilik tarihini'
        : kind === 'certification'
          ? 'veren kurumu ve aldığınız tarihi'
          : kind === 'attestation'
            ? 'neyin tasdik edildiğini ve ne zaman tasdik edildiğini'
            : 'aldığınız kurumu ve tamamlama yılını';
    return `${city ? `${city}'deki işverenler ` : 'İşverenler '}her şeyden önce ${name} arıyor; ${detail} eke değil, doğrudan CV'ye yazın.`;
  },

  categoryProof: {
    healthcare:
      'Kayıt kurumları ülkeye göre değişir: bağlı olduğunuz kurumu, kayıt numaranızı ve geçerlilik tarihini CV’nin en üstünde belirtin.',
    technology:
      'Teknolojide gösterilecek bir lisans yok: işe alımcılar teknoloji yığınınızı, yayına aldığınız işleri ve arkasındaki sayıları okur.',
    education:
      'Öğretmenlik yeterlilikleri erken kontrol edilir: yeterliliğinizi, okuttuğunuz müfredatları ve belge durumunuzu en başta yazın.',
    finance:
      'İlk eleme yeterlilikler ve raporlama standartları üzerinden yapılır: devam eden sınavlar dâhil ikisini de belirtin.',
    creative:
      'Yaratıcı işlerde kısa liste portfolyoya göre belirlenir: CV’nin görevi portfolyonun açılmasını sağlamaktır.',
    business:
      'Burada ruhsat gerektiren bir şey yok: bütçe, ekip büyüklüğü ve sonuçlar gibi kapsam kanıtları bu işi görür.',
    engineering:
      'Yetkili mühendislik durumu neyi imzalayabileceğinizi belirler: kaydınızı, uzmanlık alanınızı ve uyduğunuz standartları yazın.',
    trades:
      'Bir taşeronun ilk baktığı şey belgenizdir: sınıfı, numarası ve geçerlilik tarihiyle başlayın.',
  },

  genericProof:
    'İşe alımcılar kanıt arar: neyi yönettiğinizi, hangi ölçekte yaptığınızı ve bunun neyi değiştirdiğini.',

  introSkillCity: [
    (c) =>
      `${c.city}'de ${list(c.sectors.slice(0, 2))} alanındaki işverenler yıl boyunca ${c.skill} arıyor ve ilanların çoğu ${c.boards} üzerinde yayımlanıyor. ${c.proof} Ücretsiz CV oluşturucumuz bu bilgileri, dakikalar içinde PDF olarak indirebileceğiniz, ATS uyumlu ve düzenli bir ${c.skill} CV'sine dönüştürür.`,
    (c) =>
      `${c.city}'deki ${c.skill} ilanları ${c.anchors} çevresinde yoğunlaşıyor. ${c.proof} Bu kanıtları öne çıkaran bir ${c.skill} CV'si hazırlayın — ${c.norms[0]} — ve ücretsiz, hesap açmadan PDF olarak dışa aktarın.`,
    (c) =>
      `${c.city}'de işe yarayan bir ${c.skill} CV'si, başka bir ülkeye göndereceğiniz belgeyle aynı değildir: ${c.norms[0]}, ${c.norms[1]}. ${c.proof} Ücretsiz aracımız biçimlendirmeyi üstlenir, siz içeriğe odaklanırsınız.`,
  ],

  introSkill: [
    (c) =>
      `İyi bir ${c.skill} CV'si sıfatlarla değil kanıtlarla kurulur. ${c.proof} Ücretsiz CV oluşturucumuz sizi bölüm bölüm — özet, deneyim, beceriler, eğitim — yönlendirir ve dakikalar içinde ATS uyumlu bir PDF üretir.`,
    (c) =>
      `${c.skill} başvurularının çoğu, ayrıntıya bakılmadan ilk taramada elenir. ${c.proof} Ücretsiz aracımızla belirleyici bilgiyi sayfanın ilk üçte birine yerleştirin ve CV'nizi PDF olarak indirin.`,
    (c) =>
      `İşe alımcılar ${c.skill} CV'lerini, mutlaka bulmaları gereken kısa bir listeye göre karşılaştırır. ${c.proof} Ücretsiz çevrimiçi oluşturucumuz bunları öne çıkaran bir yapı, üç profesyonel şablon ve anında PDF çıktısı sunar.`,
  ],

  introCity: [
    (c) =>
      `${c.city}'de işe alımı ${list(c.sectors)} sürüklüyor ve açık pozisyonlar ${c.anchors} çevresinde toplanıyor. ${c.proof} Ücretsiz CV oluşturucumuz size profesyonel, ATS uyumlu bir CV verir — ${c.norms[0]} — PDF olarak indirmeye hazır.`,
    (c) =>
      `${c.city}'de yerel kuralları zaten uygulayan adaylarla yarışıyorsunuz: ${c.norms[0]}, ${c.norms[1]}. ${c.proof} Bunlara uyan bir CV'yi dakikalar içinde, ücretsiz ve kayıt olmadan hazırlayın.`,
    (c) =>
      `${c.city}'deki ilanların çoğu ${c.boards} üzerinde yayımlanıyor ve her pozisyona onlarca CV geliyor. ${c.proof} Ücretsiz CV oluşturucumuz, bu ilk elemeyi geçen net ve düzenli bir PDF hazırlamanıza yardımcı olur.`,
  ],

  categoryTips: {
    healthcare: [
      'Kayıtlı olduğunuz kurumu, numaranızı ve geçerlilik tarihini en üste yazın: her şeyden önce bu kontrol edilir.',
      'Çalıştığınız birimleri ve rotasyonları (yoğun bakım, ameliyathane, evde bakım) yatak veya hasta sayısıyla verin ki kıdeminiz görünsün.',
      'Zorunlu eğitimleri (TYD/İKYD, hasta taşıma, hasta güvenliği) ayrı bir blokta toplayın.',
      'Vardiya uygunluğunuzu ve işe başlama tarihinizi belirtin: klinik başvuruları en çok nöbet çizelgesinde takılır.',
    ],
    technology: [
      'Bir teknoloji yığını satırıyla başlayın — diller, framework’ler, bulut, araçlar — böylece anahtar kelime taramasını ilk geçişte geçersiniz.',
      'Sistemleri ölçekle anlatın: saniyedeki istek, veri hacmi, hizmet verilen kullanıcı, düşürdüğünüz gecikme veya maliyet.',
      'Bir depo veya yayında olan bir proje bağlantısı ekleyin: teknik yöneticiler bunu özeti bitirmekten daha sık açar.',
      'Ekibin yol haritasını değil, sahiplendiğiniz işi anlatın: neyi tasarladınız, ne bozuldu, neyi değiştirdiniz.',
    ],
    education: [
      'İlk bölümde okuttuğunuz yaş gruplarını, dersleri ve müfredatları (MEB müfredatı, IB, AP) belirtin.',
      'Sonuçları sayılarla verin: başarı artışı, sınıf mevcudu, sınav geçme oranları — görev listesi değil.',
      'Çocuk koruma eğitimlerini ve belge durumunuzu yazın: okullar bunu erken kontrol eder.',
      'Kulüpleri, etüt ve rehberlik sorumluluklarını ekleyin: öğretmen kısa listelerinde gerçekten ağırlığı vardır.',
    ],
    finance: [
      'Çalıştığınız standart ve sistemleri yazın — IFRS, TFRS, SAP, Oracle, NetSuite — filtreler bunların üzerine kurulu.',
      'Büyüklük verin: yönettiğiniz bütçe, portföy değeri, ay sonu kapanış süreleri, denetim kapsamı.',
      'Mesleki yeterliliğinizin durumunu, sınav aşaması ve beklenen bitiş tarihiyle gösterin.',
      'Teknik muhasebeyi analiz ve paydaş işlerinden ayırın ki ikisi de hızla taranabilsin.',
    ],
    creative: [
      'Portfolyo bağlantısını başlığa koyun: portfolyosuz bir yaratıcı CV nadiren ikinci kez okunur.',
      'Teslim edilen işi değil sonucu anlatın: erişim, dönüşüm, elde tutma veya işin getirdiği gelir.',
      'Gerçekten hâkim olduğunuz araçları (Figma, Adobe CC, CMS, analitik) tek bir okunur blokta toplayın.',
      'Pozisyona uygun üç ila beş iş seçin ve her birinde tam olarak sizin payınızın ne olduğunu yazın.',
    ],
    business: [
      'Her görevi bir yetki alanı olarak kurgulayın: neyi sahiplendiniz, hangi bütçe veya ekiple, hangi sonuçla.',
      'Kıyaslanabilir metrikler kullanın: döngü süresi, satış hattı, elde tutma, sağlanan tasarruf.',
      'Moda sözcük listesi yerine gerçekten kullandığınız yöntem ve araçları yazın (Agile, PRINCE2, Salesforce, Jira, SQL).',
      'Kapsamınızı gösterin: birlikte çalıştığınız ekipler, bölgeler, üst yöneticiler ve iş ortakları.',
    ],
    engineering: [
      'Kayıt durumunuzu ve uzmanlık alanınızı en üste koyun: hangi işi imzalayabileceğinizi bunlar belirler.',
      'Projeleri bedeli, ölçeği ve gerçek rolünüzle listeleyin: tasarım, şantiye denetimi, ruhsat süreçleri.',
      'Uyduğunuz yönetmelik, standart ve yazılımları yazın (Eurocode, TBDY, AutoCAD, Revit, ETABS).',
      'İş güvenliği ve kalite sertifikalarını ekleyin: müteahhitler bunları görüşmeden önce kontrol eder.',
    ],
    trades: [
      'Belgenizle başlayın: sınıfı, numarası ve geçerlilik tarihi.',
      'Çalıştığınız tesisat türlerini — konut, ticari, endüstriyel, güneş enerjisi, yüksek gerilim — gerilim değerleriyle yazın.',
      'Test ve güvenlik sertifikalarını, ehliyetinizi ve kendi takımınızın olup olmadığını ekleyin.',
      'Şantiye şeflerinden referans ekleyin: teknik mesleklerde bu, tanıtım paragrafından daha ağır basar.',
    ],
  },

  genericTips: [
    'Pozisyon adı ve temel beceriler için ilanın kelimelerini kullanın: tarama araçları birebir eşleşme arar.',
    'Alanınızı, deneyim yılınızı ve sağladığınız sonucu söyleyen dört satırlık bir özetle başlayın.',
    'Sayılabilecek her şeyi sayıyla verin: hızlı okumada sayılar kalır, sıfatlar kalmaz.',
    'Her pozisyon türü için ayrı bir CV tutun: genel bir CV, hedeflenmiş bir CV’ye neredeyse her zaman kaybeder.',
  ],

  localTip: (c) =>
    c.city
      ? `${c.city} kurallarına uyun: ${c.norms[0]}, ${c.norms[1]}.`
      : 'Başvurduğunuz ülkenin CV geleneklerine uyun: uzunluk, fotoğraf ve kişisel bilgiler ülkeden ülkeye çok değişir.',

  localTitle: (c) =>
    c.skill && c.city
      ? `${c.city}'deki işverenler bir ${c.skill} CV'sinde ne bekliyor?`
      : c.city
        ? `${c.city}'deki işverenler bir CV'de ne bekliyor?`
        : `İşverenler bir ${c.skill} CV'sinde ne bekliyor?`,

  localLines: (c) => {
    const lines: string[] = [c.proof];
    if (c.norms.length > 0) {
      lines.push(`Yerel CV kuralları: ${list(c.norms)}.`);
    }
    if (c.sectors.length > 0 && c.anchors) {
      lines.push(
        `Talep ${list(c.sectors)} alanlarında — ${c.anchors} çevresinde — yoğunlaşıyor; bu sözcükleri özetinizde ve becerilerinizde kullanın.`,
      );
    }
    if (c.boards) {
      lines.push(
        `İlanlar ağırlıklı olarak ${c.boards} üzerinde yayımlanır: başvurmadan önce uyarlanmış bir PDF'iniz hazır olsun.`,
      );
    }
    return lines;
  },

  faqs: (c) => {
    const entries = [];

    entries.push({
      q:
        c.skill && c.city
          ? `${c.city}'deki işler için bir ${c.skill} CV'si ne içermeli?`
          : c.skill
            ? `Bir ${c.skill} CV'si ne içermeli?`
            : `${c.city}'deki işler için bir CV ne içermeli?`,
      a: `${c.credential ? `${c.credential} ile başlayın, ardından` : 'Dört satırlık bir özetle başlayın, ardından'} ölçülebilir sonuçlarla yazılmış deneyim, eğitim ve ilanla örtüşen bir beceri bloğu gelsin.${
        c.norms.length > 0 ? ` Yerel kurallar: ${list(c.norms)}.` : ''
      }`,
    });

    if (c.credential) {
      entries.push({
        q: `${c.city ? `${c.city}'de ` : ''}başvurmak için ${c.credential} gerekli mi?`,
        a: `Yerel işverenler ${c.skill ?? 'bu tür'} pozisyonların çoğunda bunu istiyor ve işe alımdan önce genellikle doğruluyor. Süreciniz devam ediyorsa bunu yazın: belgeyi «süreç devam ediyor» notu ve beklenen tarihle birlikte belirtmek, hiç yazmamaktan çok daha iyidir.`,
      });
    } else {
      entries.push({
        q: `${c.city ? `${c.city}'de ` : ''}bir ${c.skill ?? 'profesyonel'} CV'si kaç sayfa olmalı?`,
        a: `${c.lengthNorm ? `${capitalize(c.lengthNorm)}.` : 'Bir ila iki sayfa.'} Daha uzunu okunmaz, göz gezdirilir: eski pozisyonları birer satıra indirin.`,
      });
    }

    if (c.city && c.boards) {
      entries.push({
        q: `${c.city}'de ${c.skill ? `${c.skill} ` : ''}ilanları nerede yayımlanıyor?`,
        a: `Büyük ölçüde ${c.boards} üzerinde${c.anchors ? `; en büyük işverenler ${c.anchors} çevresinde` : ''}. Başvurular önce otomatik olarak eleniyor: pozisyon adını ve temel becerileri ilandaki sözcüklerle yazın.`,
      });
    } else {
      entries.push({
        q: `Bu CV, ATS taramasından geçer mi?`,
        a: `Şablonlarımız tek sütunlu, gerçek metne dayalı ve standart bölüm başlıkları olan bir düzen kullanır; işe alım yazılımlarının en güvenilir okuduğu biçim budur. Pozisyon adlarını ve becerileri ilandaki sözcüklerle koruyun.`,
      });
    }

    entries.push({
      q: `CV Builder Pro ücretsiz mi?`,
      a: `Evet — tamamen ücretsiz, kayıt yok, gizli ücret yok. Bilgilerinizi girin, bir şablon seçin ve CV'nizi hemen PDF olarak indirin.`,
    });

    return entries;
  },
};
