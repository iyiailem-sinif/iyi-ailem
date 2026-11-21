/* İyi Ailem, İyi Mahallem
   Bütün veriler yalnız bu cihazda (localStorage) durur. Dışarıya hiçbir istek yapılmaz. */
'use strict';
(() => {

// ---------------------------------------------------------------- Sabitler
const ANAHTAR = 'iyiailem-v1';
const EN_AZ_HARF = 10;
const EN_COK_HARF = 140;

const TURLER = {
  iyilik:     { ad: 'İyilik', yer: 'Mahallem', ikon: '🤝', parca: 'cicek', parcaAd: 'çiçek', puan: 10 },
  sorumluluk: { ad: 'Sorumluluk', yer: 'Ailem', ikon: '🧹', parca: 'dal', parcaAd: 'dal', puan: 10 },
  kendim:     { ad: 'Kendime İyi Baktım', yer: 'İyilik Hâli', ikon: '💚', parca: 'yaprak', parcaAd: 'yaprak', puan: 10 },
  ekransiz:   { ad: 'Ekransız Aile Saati', yer: 'Ailem', ikon: '📵', parca: 'kus', parcaAd: 'kuş', puan: 15 }
};

const ASAMALAR = [
  { ad: 'Fidan',     ikon: '🌱', min: 0,   olcek: 0.55 },
  { ad: 'Genç Ağaç', ikon: '🌿', min: 50,  olcek: 0.7 },
  { ad: 'Ağaç',      ikon: '🌳', min: 120, olcek: 0.85 },
  { ad: 'Ulu Çınar', ikon: '🌳', min: 220, olcek: 1 }
];

const KART = [
  { id: 'su',      ikon: '💧', ad: 'Su',           soru: 'Bugün su içtim mi?',        etiket: ['Az', 'İçtim', 'Bol bol'] },
  { id: 'uyku',    ikon: '😴', ad: 'Uyku',         soru: 'Dün gece iyi uyudum mu?',   etiket: ['Az', 'İyi', 'Çok iyi'] },
  { id: 'hareket', ikon: '🏃', ad: 'Hareket',      soru: 'Koşup oynadım mı?',         etiket: ['Az', 'Biraz', 'Çok'] },
  { id: 'ekran',   ikon: '📱', ad: 'Ekran süresi', soru: 'Ekrana az mı baktım?',      etiket: ['Çok baktım', 'Biraz', 'Az baktım'] },
  { id: 'meyve',   ikon: '🍎', ad: 'Meyve-sebze',  soru: 'Meyve, sebze yedim mi?',    etiket: ['Yemedim', 'Biraz', 'Bol bol'] }
];
const YUZLER = ['😟', '🙂', '😄'];

const FIKIRLER = {
  iyilik: [
    'Komşuma alışverişte yardım ettim.', 'Parktaki çöpleri topladım.', 'Sokak hayvanlarına su koydum.',
    'Komşulara güler yüzle selam verdim.', 'Arkadaşıma oyuncağımı ödünç verdim.', 'Üzgün bir arkadaşımı sevindirdim.',
    'Yaşlı birine kapıyı tuttum.', 'Kardeşime ödevinde yardım ettim.'
  ],
  sorumluluk: [
    'Odamı kendim topladım.', 'Oyuncaklarımı yerine kaldırdım.', 'Sofrayı kurmaya yardım ettim.',
    'Okul çantamı kendim hazırladım.', 'Ödevimi zamanında bitirdim.', 'Evdeki çiçekleri suladım.'
  ],
  kendim: [
    'Bugün bol bol su içtim.', 'Erken yatıp iyi uyudum.', 'Dışarıda koşup oynadım.',
    'Meyve ve sebze yedim.', 'Ekran yerine kitap okudum.', 'Dişlerimi iki kez fırçaladım.'
  ]
};

const ORNEK = {
  iyilik: 'Örnek: Ninemin poşetlerini taşıdım.',
  sorumluluk: 'Örnek: Bugün çöpü ben attım.',
  kendim: 'Örnek: Bugün iki bardak süt içtim.'
};

const PASTEL = ['#f7a8c4', '#f9c97c', '#b9a7f5', '#8fd3f4', '#f5a3a3', '#ffd36e', '#d6a6ec', '#9ee0c0', '#ffb38a'];
const YAPRAK_RENK = [['#4caf50', '#2e7d32'], ['#66bb55', '#3a8a2e'], ['#3e9b5a', '#25703d']];
const KUS_RENK = ['#5aa9e6', '#f29e4c', '#e76f8a', '#8e7cc3', '#f2c14e'];

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const GUN_KISA = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// ---------------------------------------------------------------- Yardımcılar
const $ = (s, k = document) => k.querySelector(s);
const $$ = (s, k = document) => Array.from(k.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const yuvarla = n => Math.round(n * 10) / 10;

function gunAnahtari(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
const bugun = () => gunAnahtari();
function anahtardanTarih(k) { const [y, m, g] = k.split('-').map(Number); return new Date(y, m - 1, g); }
function tarihYaz(k, gunlu = true) {
  const d = anahtardanTarih(k);
  return d.getDate() + ' ' + AYLAR[d.getMonth()] + (gunlu ? ' ' + GUNLER[d.getDay()] : '');
}
function sonYediGun() {
  const g = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - i); g.push(gunAnahtari(d)); }
  return g;
}
function normal(s) {
  return s.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşüâîû\s]/g, '').replace(/\s+/g, ' ').trim();
}
const temizle = s => String(s || '').replace(/\s+/g, ' ').trim();
const yeniId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const rastgele = dizi => dizi[Math.floor(Math.random() * dizi.length)];

// ---------------------------------------------------------------- Veri
function bosVeri() {
  return {
    surum: 1, kayitlar: [], kart: {}, gorevler: [], gorevYapildi: {},
    rozetGoruldu: null, asamaGoruldu: 0, gunBitti: {}, tanitimGoruldu: false
  };
}
function yukle() {
  try {
    const h = JSON.parse(localStorage.getItem(ANAHTAR));
    if (h && h.surum === 1 && Array.isArray(h.kayitlar)) return Object.assign(bosVeri(), h);
  } catch (e) { /* bozuk ya da erişilemeyen kayıt: boş başla */ }
  return bosVeri();
}
let veri = yukle();
function kaydet() {
  try { localStorage.setItem(ANAHTAR, JSON.stringify(veri)); return true; }
  catch (e) { tost('Kaydedilemedi. Telefonda yer kalmamış olabilir.'); return false; }
}

const toplamPuan = (liste = veri.kayitlar) => liste.reduce((t, k) => t + (k.puan || 0), 0);
function asamaNo(p) { let n = 0; ASAMALAR.forEach((a, i) => { if (p >= a.min) n = i; }); return n; }
const bugunKayitlari = () => veri.kayitlar.filter(k => k.tarih === bugun());
const turSayisi = tur => veri.kayitlar.filter(k => k.tur === tur).length;
const kartDoluMu = gun => { const k = veri.kart[gun]; return !!k && KART.every(m => k[m.id]); };
const ekransizBugun = () => veri.kayitlar.some(k => k.tur === 'ekransiz' && k.tarih === bugun());

// ---------------------------------------------------------------- Ağaç geometrisi
// Ağaç her zaman aynı "büyük" ölçüde hesaplanır; aşamaya göre bütünü küçültülür.
const TABAN = { x: 160, y: 340 };
const GOVDE_BOY = 190;
const TAC = { cx: 160, cy: 140, rx: 122, ry: 92 };
const TAC_NORMAL = 90;   // tacın dolduğu yaprak+çiçek sayısı
const TAC_EN_COK = 130;
// [yön (-1 sol, 1 sağ), gövdedeki yükseklik oranı] — sağ-sol sırayla, dengeli
const DAL_SIRA = [[-1, .50], [1, .54], [-1, .66], [1, .70], [-1, .82], [1, .86], [-1, .58], [1, .62],
  [-1, .74], [1, .78], [-1, .90], [1, .94], [-1, .97], [1, .99]];
const ZEMIN_KUS = [48, 272, 78, 242, 22, 298, 106, 214];

const govdeYari = f => 13 - 8 * f;

function anaDal(i) {
  const [yon, f] = DAL_SIRA[i];
  const x1 = TABAN.x + yon * (govdeYari(f) - 1.5), y1 = TABAN.y - f * GOVDE_BOY;
  const L = 95 - (f - .5) * 90;
  const t = (20 + (f - .5) * 90) * Math.PI / 180;
  const x2 = x1 + yon * L * Math.cos(t), y2 = y1 - L * Math.sin(t);
  return { x1, y1, cx: (x1 + x2) / 2 + yon * 4, cy: (y1 + y2) / 2 + 9, x2, y2, k: 6.5, yon, t, L };
}
function egriNokta(d, u) {
  const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
  return { x: a * d.x1 + b * d.cx + c * d.x2, y: a * d.y1 + b * d.cy + c * d.y2 };
}
function dalGeometrisi(yuva) {
  const ana = DAL_SIRA.length;
  if (yuva < ana) return anaDal(yuva);
  const kat = Math.floor(yuva / ana) % 4;         // 1, 2, 3: ince dallar
  const d = anaDal(yuva % ana);
  const ayar = [null, { u: .55, a: .6, b: .4, k: 4 }, { u: .8, a: -.45, b: .3, k: 3.5 }, { u: .35, a: 1.0, b: .3, k: 3.5 }][kat || 1];
  const p = egriNokta(d, ayar.u);
  const t = d.t + ayar.a, L = d.L * ayar.b;
  const x2 = p.x + d.yon * L * Math.cos(t), y2 = p.y - L * Math.sin(t);
  return { x1: p.x, y1: p.y, cx: (p.x + x2) / 2, cy: (p.y + y2) / 2 + 3, x2, y2, k: ayar.k, yon: d.yon };
}
function tacNoktasi(yuva) {
  const i = yuva % TAC_EN_COK, n = i + 1;
  const r = Math.sqrt(n) / Math.sqrt(TAC_NORMAL);
  const a = n * 2.39996323;
  const kaydir = Math.floor(yuva / TAC_EN_COK) * 6;
  return { x: TAC.cx + Math.cos(a) * r * TAC.rx + kaydir, y: TAC.cy + Math.sin(a) * r * TAC.ry + kaydir };
}
// Kuşlar önce ana dal yuvalarının ucuna (kendi ince dalıyla) konar, sonra çimene iner.
function kusNoktasi(yuva) {
  const dalSay = DAL_SIRA.length, top = dalSay + ZEMIN_KUS.length;
  const i = yuva % top;
  if (i < dalSay) {
    const d = anaDal(i);
    return { x: d.x2, y: d.y2 - 10, zemin: false, dal: d };
  }
  return { x: ZEMIN_KUS[i - dalSay], y: TABAN.y - 8, zemin: true };
}
const parcaGrubu = tip => (tip === 'dal' ? 'dal' : tip === 'kus' ? 'kus' : 'tac');

function yeniParca(tur) {
  const tip = TURLER[tur].parca, grup = parcaGrubu(tip);
  const dolu = new Set(veri.kayitlar.filter(k => k.parca && parcaGrubu(k.parca.tip) === grup).map(k => k.parca.yuva));
  let yuva = 0;
  while (dolu.has(yuva)) yuva++;
  const p = { tip, yuva };
  if (tip === 'dal') {
    const d = dalGeometrisi(yuva);
    Object.assign(p, { x1: yuvarla(d.x1), y1: yuvarla(d.y1), cx: yuvarla(d.cx), cy: yuvarla(d.cy), x2: yuvarla(d.x2), y2: yuvarla(d.y2), k: d.k });
  } else if (tip === 'kus') {
    const n = kusNoktasi(yuva);
    Object.assign(p, { x: yuvarla(n.x), y: yuvarla(n.y), zemin: n.zemin, yon: n.x < TAC.cx ? 1 : -1, renk: rastgele(KUS_RENK) });
    if (n.dal) p.dal = { x1: yuvarla(n.dal.x1), y1: yuvarla(n.dal.y1), cx: yuvarla(n.dal.cx), cy: yuvarla(n.dal.cy), x2: yuvarla(n.dal.x2), y2: yuvarla(n.dal.y2) };
  } else {
    const n = tacNoktasi(yuva);
    Object.assign(p, { x: yuvarla(n.x), y: yuvarla(n.y), aci: Math.round((n.x < TAC.cx ? -25 : 25) + (Math.random() * 70 - 35)) });
    if (tip === 'cicek') p.renk = rastgele(PASTEL);
    else p.ton = yuva % YAPRAK_RENK.length;
  }
  return p;
}

// ---------------------------------------------------------------- Ağaç çizimi
function parcaSVG(k, yeni) {
  const p = k.parca;
  if (!p) return '';
  const sinif = yeni ? ' yeni' : '';
  if (p.tip === 'dal') {
    return `<g class="parca dal${sinif}" data-id="${esc(k.id)}"><path d="M${p.x1} ${p.y1} Q${p.cx} ${p.cy} ${p.x2} ${p.y2}" pathLength="1" stroke-width="${p.k}"/></g>`;
  }
  let ic = '';
  if (p.tip === 'yaprak') {
    const [dolgu, kenar] = YAPRAK_RENK[p.ton || 0];
    ic = `<path d="M0 -10 C7 -5 7 5 0 10 C-7 5 -7 -5 0 -10Z" fill="${dolgu}" stroke="${kenar}" stroke-width="1.4"/><path d="M0 -8 L0 8" stroke="${kenar}" stroke-width="1"/>`;
    return `<g class="parca yaprak" data-id="${esc(k.id)}" transform="translate(${p.x} ${p.y}) rotate(${p.aci})"><g class="ic${sinif}">${ic}</g></g>`;
  }
  if (p.tip === 'cicek') {
    let yap = '';
    for (let i = 0; i < 5; i++) {
      const a = i * 72 * Math.PI / 180;
      yap += `<circle cx="${yuvarla(Math.cos(a) * 5.2)}" cy="${yuvarla(Math.sin(a) * 5.2)}" r="4.6"/>`;
    }
    ic = `<g fill="${esc(p.renk)}" stroke="#ffffff" stroke-width=".9">${yap}</g><circle r="3.4" fill="#fff4b8" stroke="#d99a00" stroke-width="1"/>`;
    return `<g class="parca cicek" data-id="${esc(k.id)}" transform="translate(${p.x} ${p.y}) rotate(${p.aci})"><g class="ic${sinif}">${ic}</g></g>`;
  }
  // kuş
  const dal = p.zemin ? '' : `<path d="M-15 9 Q0 12 15 8" stroke="#7a4b2a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  ic = `${dal}<g transform="scale(${p.yon || 1} 1)">
    <path d="M-9 1 L-16 -3 L-15 4Z" fill="${esc(p.renk)}" stroke="#2b2b2b" stroke-width=".8"/>
    <ellipse cx="0" cy="1" rx="9" ry="7" fill="${esc(p.renk)}" stroke="#2b2b2b" stroke-width=".9"/>
    <circle cx="7" cy="-5" r="5" fill="${esc(p.renk)}" stroke="#2b2b2b" stroke-width=".9"/>
    <path d="M-4 -1 Q1 4 5 1" stroke="#2b2b2b" stroke-width="1" fill="none"/>
    <circle cx="8.6" cy="-6" r="1.2" fill="#1a1a1a"/>
    <path d="M11.6 -5 L16 -3.6 L11.6 -2.4Z" fill="#f2a516"/>
    <path d="M-1 8 L-1 10 M3 8 L3 10" stroke="#f2a516" stroke-width="1.3"/></g>`;
  const tunek = p.dal ? `<path class="kus-dal${sinif}" d="M${p.dal.x1} ${p.dal.y1} Q${p.dal.cx} ${p.dal.cy} ${p.dal.x2} ${p.dal.y2}" pathLength="1"/>` : '';
  return `<g class="parca kus" data-id="${esc(k.id)}">${tunek}<g transform="translate(${p.x} ${p.y})"><g class="ic${sinif}">${ic}</g></g></g>`;
}

function agacSVG({ yeniId: yid = null, olcek = null, statik = false } = {}) {
  const kayitlar = veri.kayitlar.filter(k => k.parca);
  const no = asamaNo(toplamPuan());
  const s = olcek == null ? ASAMALAR[no].olcek : olcek;
  const tac = kayitlar.filter(k => parcaGrubu(k.parca.tip) === 'tac');
  const enBuyukYuva = tac.reduce((m, k) => Math.max(m, k.parca.yuva % TAC_EN_COK), -1);

  // Tacın arkasındaki yumuşak yeşil bulut (yapraklar boşlukta durmasın)
  let bulut = '';
  if (tac.length >= 3) {
    const b = Math.min(1.12, .2 + Math.sqrt(enBuyukYuva + 1) / Math.sqrt(TAC_NORMAL));
    const daire = [[0, 0, .56], [-.5, .14, .42], [.5, .14, .42], [-.28, -.38, .44], [.28, -.38, .44], [-.72, -.08, .3], [.72, -.08, .3], [0, .42, .34]];
    bulut = '<g class="bulut">' + daire.map(([x, y, r]) =>
      `<ellipse cx="${yuvarla(TAC.cx + x * TAC.rx * b)}" cy="${yuvarla(TAC.cy + y * TAC.ry * b)}" rx="${yuvarla(r * TAC.rx * b)}" ry="${yuvarla(r * TAC.ry * b * 1.05)}"/>`).join('') + '</g>';
  }
  const filiz = tac.length < 3 ? `<g class="filiz">
      <path d="M160 152 C150 140 140 140 136 132 C148 130 157 136 160 152Z" fill="#6cc06a" stroke="#2e7d32" stroke-width="1.3"/>
      <path d="M160 152 C170 140 180 140 184 132 C172 130 163 136 160 152Z" fill="#6cc06a" stroke="#2e7d32" stroke-width="1.3"/></g>` : '';

  const dallar = kayitlar.filter(k => k.parca.tip === 'dal').map(k => parcaSVG(k, k.id === yid)).join('');
  const tacParca = tac.map(k => parcaSVG(k, k.id === yid)).join('');
  const kuslar = kayitlar.filter(k => k.parca.tip === 'kus').map(k => parcaSVG(k, k.id === yid)).join('');

  const govde = `<path class="govde" d="M146 341 C150 300 153 220 155.5 150 L164.5 150 C167 220 170 300 174 341 Z"/>
    <path class="kok" d="M147 338 C140 340 132 343 124 343 M173 338 C180 340 189 343 197 343"/>`;

  return `<svg class="agac-svg${statik ? ' statik' : ''}" viewBox="0 0 320 360" role="img" aria-label="Ağacım: ${esc(ASAMALAR[no].ad)}, ${kayitlar.length} parça">
    <ellipse class="zemin" cx="160" cy="345" rx="150" ry="12"/>
    <path class="cimen" d="M30 343 l4 -9 l3 9 M70 345 l3 -8 l3 8 M250 345 l3 -8 l3 8 M286 343 l4 -9 l3 9"/>
    <g class="agac-govde" style="transform: scale(${s})">
      ${bulut}${govde}${filiz}${dallar}${tacParca}${kuslar}
    </g>
  </svg>`;
}

// ---------------------------------------------------------------- Durum
let sekme = 'agac';
let sonYeniParca = null;     // ağaç ekranında bir kez büyüme animasyonu
let sonOlcek = null;         // aşama değişince gövde yumuşakça büyüsün
let sonYeniHalka = null;

// ---------------------------------------------------------------- Kayıt ekleme
function kayitEkle(tur, metin) {
  const temiz = temizle(metin).slice(0, EN_COK_HARF);
  if (tur !== 'ekransiz') {
    if (temiz.length < EN_AZ_HARF) return { hata: 'kisa' };
    const n = normal(temiz);
    if (!n || veri.kayitlar.some(k => k.tarih === bugun() && k.tur !== 'ekransiz' && normal(k.metin) === n)) return { hata: 'ayni' };
  } else if (ekransizBugun()) return { hata: 'ekransiz' };

  const oncekiAsama = asamaNo(toplamPuan());
  const k = { id: yeniId(), tarih: bugun(), zaman: Date.now(), tur, metin: tur === 'ekransiz' ? 'Ekransız aile saati yaptık.' : temiz, puan: TURLER[tur].puan, parca: yeniParca(tur) };
  veri.kayitlar.push(k);
  if (!kaydet()) { veri.kayitlar.pop(); return { hata: 'kayit' }; }
  sonYeniParca = k.id;
  if (tur === 'iyilik') sonYeniHalka = k.id;
  const yeniAsama = asamaNo(toplamPuan());
  if (yeniAsama > oncekiAsama && yeniAsama > (veri.asamaGoruldu || 0)) {
    veri.asamaGoruldu = yeniAsama; kaydet();
    kutlamaGoster(yeniAsama);
  }
  return { kayit: k };
}

function kayitSil(id) {
  const i = veri.kayitlar.findIndex(k => k.id === id);
  if (i < 0) return;
  veri.kayitlar.splice(i, 1);
  veri.asamaGoruldu = Math.min(veri.asamaGoruldu || 0, asamaNo(toplamPuan()));
  kaydet();
  rozetKontrol(true);
}

function sonrasiKontroller() {
  rozetKontrol();
  gunSonuKontrol();
}

// ---------------------------------------------------------------- Rozetler
const kartDoluGun = () => Object.keys(veri.kart).filter(kartDoluMu).length;
const yuzGun = alan => Object.keys(veri.kart).filter(g => veri.kart[g][alan] === 3).length;
const gorevTik = () => Object.values(veri.gorevYapildi).reduce((t, d) => t + d.length, 0);
const kayitGunu = () => new Set(veri.kayitlar.map(k => k.tarih)).size;

const ROZETLER = [
  { id: 'ilk',      ikon: '🌱', ad: 'İlk Filiz',         acik: 'İlk kaydını yaz.',                     hedef: 1,   deger: () => veri.kayitlar.length },
  { id: 'kart3',    ikon: '📋', ad: 'Kart Dostu',        acik: '3 gün İyilik Hâli Kartı doldur.',      hedef: 3,   deger: kartDoluGun },
  { id: 'ekransiz5',ikon: '📵', ad: 'Ekransız Aile',     acik: '5 kez ekransız aile saati yapın.',     hedef: 5,   deger: () => turSayisi('ekransiz') },
  { id: 'iyilik5',  ikon: '🤝', ad: 'İyilik Kahramanı',  acik: '5 iyilik yaz.',                        hedef: 5,   deger: () => turSayisi('iyilik') },
  { id: 'sorum5',   ikon: '🧹', ad: 'Sorumlu Eller',     acik: '5 sorumluluk yaz.',                    hedef: 5,   deger: () => turSayisi('sorumluluk') },
  { id: 'kendim5',  ikon: '💚', ad: 'Kendine İyi Bak',   acik: '5 kez kendine iyi baktığını yaz.',     hedef: 5,   deger: () => turSayisi('kendim') },
  { id: 'pano10',   ikon: '✅', ad: 'Aile Takımı',       acik: 'Aile panosunda 10 görev tikleyin.',    hedef: 10,  deger: gorevTik },
  { id: 'su3',      ikon: '💧', ad: 'Su Damlası',        acik: '3 gün bol bol su iç (😄).',            hedef: 3,   deger: () => yuzGun('su') },
  { id: 'uyku3',    ikon: '😴', ad: 'Tatlı Uyku',        acik: '3 gün çok iyi uyu (😄).',              hedef: 3,   deger: () => yuzGun('uyku') },
  { id: 'zincir10', ikon: '🔗', ad: 'Uzun Zincir',       acik: 'İyilik zincirine 10 halka ekle.',      hedef: 10,  deger: () => turSayisi('iyilik') },
  { id: 'gun7',     ikon: '📅', ad: 'Haftanın Yıldızı',  acik: '7 farklı gün kayıt yaz.',              hedef: 7,   deger: kayitGunu },
  { id: 'cinar',    ikon: '🌳', ad: 'Ulu Çınar',         acik: 'Ağacını Ulu Çınar yap.',               hedef: ASAMALAR[3].min, deger: () => toplamPuan() }
];
const kazanilanRozetler = () => ROZETLER.filter(r => r.deger() >= r.hedef).map(r => r.id);

function rozetKontrol(sessiz = false) {
  const simdi = kazanilanRozetler();
  if (!Array.isArray(veri.rozetGoruldu)) { veri.rozetGoruldu = simdi; kaydet(); return; }
  const yeni = simdi.filter(id => !veri.rozetGoruldu.includes(id));
  veri.rozetGoruldu = simdi;
  kaydet();
  if (sessiz) return;
  yeni.forEach(id => {
    const r = ROZETLER.find(x => x.id === id);
    pencereAc({ sinif: 'rozet-pencere', ikon: r.ikon, baslik: 'Yeni rozet!', metin: `<strong>${esc(r.ad)}</strong><br>${esc(r.acik)}`, dugmeler: [{ yazi: 'Harika!' }] });
  });
}

// ---------------------------------------------------------------- Gün sonu
const gunTamamMi = () => kartDoluMu(bugun()) && bugunKayitlari().length > 0;
function gunSonuKontrol() {
  const g = bugun();
  if (veri.gunBitti[g] || !gunTamamMi()) return;
  veri.gunBitti[g] = true; kaydet();
  pencereAc({
    sinif: 'gece', ikon: '🌙', baslik: 'Bugünlük bu kadar!',
    metin: 'Kartını doldurdun, ağacın büyüdü.<br><strong>Hadi ekranı kapat!</strong><br>Ailenle oyna, sohbet et. Yarın görüşürüz.',
    dugmeler: [{ yazi: 'Tamam, kapatıyorum 👋' }]
  });
}

// ---------------------------------------------------------------- Pencere (kuyruklu)
const kuyruk = [];
let pencereAcik = false;
function pencereAc(o) { kuyruk.push(o); if (!pencereAcik) siradakiPencere(); }
function siradakiPencere() {
  const k = $('#katman');
  const o = kuyruk.shift();
  if (!o) { pencereAcik = false; k.hidden = true; k.innerHTML = ''; return; }
  pencereAcik = true;
  k.hidden = false;
  const susler = o.sinif === 'kutlama' ? '<div class="dokulen" aria-hidden="true">' + Array.from({ length: 14 }, (_, i) =>
    `<span style="left:${(i * 7.3 + 3) % 100}%;animation-delay:${(i % 7) * 0.12}s">${['🍃', '🌸', '🌼', '🍀'][i % 4]}</span>`).join('') + '</div>' : '';
  k.innerHTML = `<div class="perde ${esc(o.sinif || '')}">${susler}<div class="pencere" role="dialog" aria-modal="true" aria-labelledby="pBaslik">
      ${o.ikon ? `<div class="p-ikon" aria-hidden="true">${o.ikon}</div>` : ''}
      <h2 id="pBaslik">${esc(o.baslik)}</h2>
      ${o.metin ? `<p>${o.metin}</p>` : ''}
      <div class="p-dugmeler">${(o.dugmeler || [{ yazi: 'Tamam' }]).map((d, i) =>
        `<button type="button" class="dugme ${esc(d.sinif || (i === 0 ? 'ana' : 'ikincil'))}" data-i="${i}">${esc(d.yazi)}</button>`).join('')}</div>
    </div></div>`;
  $$('.p-dugmeler button', k).forEach(b => b.addEventListener('click', () => {
    const d = (o.dugmeler || [])[+b.dataset.i];
    siradakiPencere();
    if (d && d.eylem) d.eylem();
  }));
  const ilk = $('.p-dugmeler button', k);
  if (ilk) ilk.focus();
  if (o.sure) setTimeout(() => { if ($('#katman .perde.' + o.sinif)) siradakiPencere(); }, o.sure);
}

function kutlamaGoster(no) {
  const a = ASAMALAR[no];
  pencereAc({
    sinif: 'kutlama', ikon: a.ikon, baslik: 'Ağacın büyüdü!',
    metin: `Artık bir <strong>${esc(a.ad)}</strong>. Aferin sana ve ailene!`,
    dugmeler: [{ yazi: 'Yaşasın!' }]
  });
}

let tostZaman = null;
function tost(yazi) {
  const t = $('#tost');
  t.textContent = yazi;
  t.classList.add('gorunur');
  clearTimeout(tostZaman);
  tostZaman = setTimeout(() => t.classList.remove('gorunur'), 2800);
}

// ---------------------------------------------------------------- Katmanlar ve geri tuşu
// Açık katmanlar (alt sayfa, tam ekran) telefonun geri tuşuyla kapanır.
const katmanlar = [];
function katmanAc(ad, kapat) {
  let gecmis = false;
  try { history.pushState({ katman: ad }, ''); gecmis = true; } catch (e) { /* geçmiş yoksa doğrudan kapatılır */ }
  katmanlar.push({ ad, kapat, gecmis });
}
function katmanKapat() {
  const ust = katmanlar[katmanlar.length - 1];
  if (!ust) return;
  if (ust.gecmis) history.back();
  else { katmanlar.pop(); ust.kapat(); }
}
window.addEventListener('popstate', () => {
  const k = katmanlar.pop();
  if (k) k.kapat();
});

// ---------------------------------------------------------------- Yazma sayfası
function yazmaAc(tur, sabit = false) {
  const el = $('#altSayfa');
  let secili = tur || 'iyilik';
  const ciz = () => {
    const t = TURLER[secili];
    el.innerHTML = `<div class="alt-perde" data-kapat="1"></div>
    <div class="alt-kutu" role="dialog" aria-modal="true" aria-labelledby="yBaslik">
      <h2 id="yBaslik">${t.ikon} ${esc(t.ad)}</h2>
      ${sabit ? '' : `<div class="tur-sec" role="radiogroup" aria-label="Tür">
        ${['iyilik', 'sorumluluk', 'kendim'].map(id => `<button type="button" role="radio" aria-checked="${id === secili}" data-tur="${id}" class="${id === secili ? 'secili' : ''}">${TURLER[id].ikon}<span>${esc(TURLER[id].ad)}</span></button>`).join('')}
      </div>`}
      <label for="yMetin" class="y-soru">${secili === 'iyilik' ? 'Kime, nasıl iyilik yaptın?' : secili === 'sorumluluk' ? 'Hangi sorumluluğunu yaptın?' : 'Kendine nasıl iyi baktın?'}<br><small>Kendi cümlenle yaz.</small></label>
      <textarea id="yMetin" rows="3" maxlength="${EN_COK_HARF}" placeholder="${esc(ORNEK[secili])}" autocomplete="off" spellcheck="true"></textarea>
      <div class="y-sayac" id="ySayac" aria-live="polite"></div>
      <p class="y-hata" id="yHata" role="alert"></p>
      <details class="fikirler"><summary>💡 Fikir lazım mı?</summary>
        <div class="fikir-liste">${FIKIRLER[secili].map(f => `<button type="button" class="fikir">${esc(f)}</button>`).join('')}</div>
        <small>Fikre dokun, sonra istersen değiştir.</small>
      </details>
      <div class="y-dugmeler">
        <button type="button" class="dugme ana buyuk" id="yKaydet">Kaydet · +${t.puan} puan</button>
        <button type="button" class="dugme ikincil" data-kapat="1">Vazgeç</button>
      </div>
    </div>`;
    const ta = $('#yMetin', el);
    const sayac = () => {
      const n = temizle(ta.value).length;
      const s = $('#ySayac', el);
      if (n >= EN_AZ_HARF) { s.textContent = '✓ Güzel!'; s.className = 'y-sayac tamam'; }
      else { s.textContent = `${n} / ${EN_AZ_HARF} harf`; s.className = 'y-sayac'; }
      $('#yHata', el).textContent = '';
    };
    ta.addEventListener('input', sayac);
    sayac();
    $$('.tur-sec button', el).forEach(b => b.addEventListener('click', () => {
      const yazi = ta.value; secili = b.dataset.tur; ciz(); $('#yMetin', el).value = yazi; $('#yMetin', el).dispatchEvent(new Event('input'));
    }));
    $$('.fikir', el).forEach(b => b.addEventListener('click', () => { ta.value = b.textContent; sayac(); ta.focus(); }));
    $$('[data-kapat]', el).forEach(b => b.addEventListener('click', katmanKapat));
    $('#yKaydet', el).addEventListener('click', () => {
      const s = kayitEkle(secili, ta.value);
      const h = $('#yHata', el);
      if (s.hata === 'kisa') { h.textContent = `Biraz daha anlat. En az ${EN_AZ_HARF} harf yazmalısın.`; ta.focus(); return; }
      if (s.hata === 'ayni') { h.textContent = 'Bunu bugün zaten yazdın. Aynı şeye iki kez puan yok. Başka bir şey yaz!'; ta.focus(); return; }
      if (s.hata) { h.textContent = 'Kaydedilemedi. Lütfen tekrar dene.'; return; }
      katmanKapat();
      tost(`+${t.puan} puan! Ağacına bir ${t.parcaAd} eklendi.`);
      ekraniCiz();
      sonrasiKontroller();
    });
  };
  ciz();
  el.hidden = false;
  document.body.classList.add('kilitli');
  katmanAc('yazma', () => { el.hidden = true; el.innerHTML = ''; document.body.classList.remove('kilitli'); });
  setTimeout(() => { const ta = $('#yMetin', el); if (ta) ta.focus({ preventScroll: true }); }, 60);
}

function ekransizSor() {
  if (ekransizBugun()) { tost('Bugünkü ekransız aile saatini zaten yaptınız. 👏'); return; }
  pencereAc({
    ikon: '📵', baslik: 'Ekransız aile saati',
    metin: 'Bir saat boyunca telefon, tablet ve televizyon olmadan hep birlikte vakit geçirdiniz mi?',
    dugmeler: [
      { yazi: 'Evet, yaptık! · +15', eylem: () => {
        const s = kayitEkle('ekransiz');
        if (s.hata) return;
        tost('+15 puan! Ağacına bir kuş kondu. 🐦');
        ekraniCiz();
        sonrasiKontroller();
      } },
      { yazi: 'Henüz değil' }
    ]
  });
}

// ---------------------------------------------------------------- Ekranlar
function ekraniCiz() {
  $$('.sekmeler button').forEach(b => { const a = b.dataset.sekme === sekme; b.classList.toggle('aktif', a); b.setAttribute('aria-current', a ? 'page' : 'false'); });
  const e = $('#ekran');
  ({ agac: ekranAgac, bugun: ekranBugun, ailem: ekranAilem, mahalle: ekranMahalle, rozet: ekranRozet }[sekme] || ekranAgac)(e);
}

function sekmeyeGec(ad) {
  sekme = ad;
  ekraniCiz();
  window.scrollTo(0, 0);
}

// ---- Ağacım
function ekranAgac(e) {
  const p = toplamPuan(), no = asamaNo(p), a = ASAMALAR[no], sonraki = ASAMALAR[no + 1];
  const oran = sonraki ? Math.round((p - a.min) / (sonraki.min - a.min) * 100) : 100;
  const yeniOlcek = a.olcek;
  const ilkOlcek = sonOlcek != null && sonOlcek !== yeniOlcek ? sonOlcek : yeniOlcek;
  const yid = sonYeniParca; sonYeniParca = null;
  const bitti = veri.gunBitti[bugun()];
  e.innerHTML = `
    ${bitti ? `<div class="bant gece-bant">🌙 Bugünlük bu kadar! Hadi ekranı kapat. Yarın görüşürüz.</div>` : ''}
    <section class="puan-kart" aria-label="Puanım">
      <div class="puan-satir"><div class="puan"><span class="puan-sayi">${p}</span><span class="puan-yazi">puan</span></div>
        <div class="asama-rozet">${a.ikon} ${esc(a.ad)}</div></div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${oran}" aria-label="Sonraki aşama"><div class="bar-dolu" style="width:${oran}%"></div></div>
      <div class="asamalar">${ASAMALAR.map((x, i) => `<span class="${i <= no ? 'gecti' : ''}">${esc(x.ad)}</span>`).join('')}</div>
      <p class="bar-yazi">${sonraki ? `<strong>${esc(sonraki.ad)}</strong> olmana <strong>${sonraki.min - p}</strong> puan kaldı.` : 'En büyük aşamadasın! 🎉'}</p>
    </section>
    <section class="agac-kutu" aria-label="Ağacım">
      <div class="agac-sahne" id="agacSahne">${agacSVG({ yeniId: yid, olcek: ilkOlcek })}<div class="balon" id="balon" hidden></div></div>
      <p class="kucuk ortala">Çiçeğe, yaprağa, dala ya da kuşa dokun.</p>
      <div class="lejant"><span>🌿 Dal = Sorumluluk</span><span>🌸 Çiçek = İyilik</span><span>🍃 Yaprak = Kendime iyi baktım</span><span>🐦 Kuş = Ekransız saat</span></div>
    </section>
    <section aria-labelledby="bugunNe">
      <h2 id="bugunNe" class="bolum-baslik">Bugün ne yaptın?</h2>
      <div class="tur-dugmeler">
        <button type="button" class="tur-dugme t-iyilik" data-yaz="iyilik"><span class="td-ikon">🤝</span><span class="td-yazi"><strong>İyilik</strong><small>Mahallem · çiçek açar</small></span><span class="td-puan">+10</span></button>
        <button type="button" class="tur-dugme t-sorumluluk" data-yaz="sorumluluk"><span class="td-ikon">🧹</span><span class="td-yazi"><strong>Sorumluluk</strong><small>Ailem · dal uzar</small></span><span class="td-puan">+10</span></button>
        <button type="button" class="tur-dugme t-kendim" data-yaz="kendim"><span class="td-ikon">💚</span><span class="td-yazi"><strong>Kendime İyi Baktım</strong><small>İyilik Hâli · yaprak çıkar</small></span><span class="td-puan">+10</span></button>
      </div>
      ${ekransizDugmesi()}
      <button type="button" class="dugme ikincil genis" id="yaptiklarim">📋 Yaptıklarım (${veri.kayitlar.length})</button>
    </section>`;
  $$('[data-yaz]', e).forEach(b => b.addEventListener('click', () => yazmaAc(b.dataset.yaz)));
  baglaEkransiz(e);
  $('#yaptiklarim', e).addEventListener('click', yaptiklarimAc);
  agacDokunma($('#agacSahne', e));
  if (ilkOlcek !== yeniOlcek) {
    const g = $('.agac-govde', e);
    requestAnimationFrame(() => requestAnimationFrame(() => { g.style.transform = `scale(${yeniOlcek})`; }));
  }
  sonOlcek = yeniOlcek;
}

function ekransizDugmesi() {
  const yapildi = ekransizBugun();
  return `<button type="button" class="ekransiz-dugme${yapildi ? ' yapildi' : ''}" data-ekransiz="1" ${yapildi ? 'aria-disabled="true"' : ''}>
    <span class="td-ikon">📵</span><span class="td-yazi"><strong>${yapildi ? 'Ekransız saat yapıldı ✓' : 'Ekransız aile saati yaptık'}</strong><small>${yapildi ? 'Ağacınıza bir kuş kondu.' : 'Ağaca kuş konar'}</small></span>${yapildi ? '' : '<span class="td-puan">+15</span>'}</button>`;
}
function baglaEkransiz(e) { $$('[data-ekransiz]', e).forEach(b => b.addEventListener('click', ekransizSor)); }

function parcaBul(svg, olay) {
  const g = $('.agac-govde', svg);
  const m = g.getScreenCTM();
  if (!m) return null;
  const nk = svg.createSVGPoint(); nk.x = olay.clientX; nk.y = olay.clientY;
  const p = nk.matrixTransform(m.inverse());
  const olcek = Math.abs(m.a) || 1;          // ekranda bir ağaç biriminin piksel boyu
  const sinir = Math.max(14, 24 / olcek);    // parmak için ~24 piksel
  let enIyi = null, enAz = Infinity;
  veri.kayitlar.forEach(k => {
    const c = k.parca; if (!c) return;
    let d;
    if (c.tip === 'dal') {
      d = Infinity;
      for (let u = .2; u <= 1.001; u += .1) { const q = egriNokta(c, u); d = Math.min(d, Math.hypot(q.x - p.x, q.y - p.y) + 4); }
    } else d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < enAz) { enAz = d; enIyi = k; }
  });
  return enAz <= sinir ? enIyi : null;
}

function agacDokunma(sahne) {
  const svg = $('svg', sahne), balon = $('#balon', sahne);
  let zaman = null;
  svg.addEventListener('click', olay => {
    const k = parcaBul(svg, olay);
    $$('.parca.secili', svg).forEach(x => x.classList.remove('secili'));
    if (!k) { balon.hidden = true; return; }
    const el = svg.querySelector(`.parca[data-id="${CSS.escape(k.id)}"]`);
    if (el) el.classList.add('secili');
    const t = TURLER[k.tur];
    balon.innerHTML = `<div class="b-ust">${t.ikon} ${esc(t.ad)} · ${esc(tarihYaz(k.tarih, false))}</div><div class="b-metin">“${esc(k.metin)}”</div>`;
    balon.hidden = false;
    const r = sahne.getBoundingClientRect();
    const x = olay.clientX - r.left, y = olay.clientY - r.top;
    const gen = Math.min(260, r.width - 16);
    balon.style.width = gen + 'px';
    balon.style.left = Math.max(8, Math.min(r.width - gen - 8, x - gen / 2)) + 'px';
    const yuk = balon.offsetHeight;
    balon.style.top = (y - yuk - 14 > 0 ? y - yuk - 14 : y + 18) + 'px';
    clearTimeout(zaman);
    zaman = setTimeout(() => { balon.hidden = true; $$('.parca.secili', svg).forEach(x => x.classList.remove('secili')); }, 6000);
  });
}

// ---- Bugün (İyilik Hâli Kartı)
function ekranBugun(e) {
  const g = bugun();
  const kart = veri.kart[g] || {};
  const dolu = KART.filter(m => kart[m.id]).length;
  e.innerHTML = `
    <h2 class="sayfa-baslik">İyilik Hâli Kartı</h2>
    <p class="tarih">${esc(tarihYaz(g))}</p>
    <p class="aciklama">Her biri için bir yüz seç.</p>
    <div class="kart-liste">${KART.map(m => `
      <fieldset class="kart-satir">
        <legend><span class="k-ikon" aria-hidden="true">${m.ikon}</span> <strong>${esc(m.ad)}</strong><small>${esc(m.soru)}</small></legend>
        <div class="yuzler">${YUZLER.map((y, i) => `<button type="button" class="yuz${kart[m.id] === i + 1 ? ' secili' : ''}" data-alan="${m.id}" data-deger="${i + 1}" aria-pressed="${kart[m.id] === i + 1}" aria-label="${esc(m.ad)}: ${esc(m.etiket[i])}"><span class="y-emoji">${y}</span><span class="y-etiket">${esc(m.etiket[i])}</span></button>`).join('')}</div>
      </fieldset>`).join('')}
    </div>
    <div class="ilerleme-yazi ${dolu === KART.length ? 'tamam' : ''}" aria-live="polite">${dolu === KART.length ? '✓ Kartın tamam! Aferin.' : `${dolu} / ${KART.length} işaretlendi`}</div>
    <button type="button" class="tur-dugme t-kendim" data-yaz="kendim"><span class="td-ikon">💚</span><span class="td-yazi"><strong>Kendime iyi baktım, yazayım</strong><small>Ağacına yaprak çıkar</small></span><span class="td-puan">+10</span></button>`;
  $$('.yuz', e).forEach(b => b.addEventListener('click', () => {
    const k = veri.kart[g] || (veri.kart[g] = {});
    k[b.dataset.alan] = +b.dataset.deger;
    kaydet();
    const y = window.scrollY;
    ekraniCiz();
    window.scrollTo(0, y);
    sonrasiKontroller();
  }));
  $('[data-yaz]', e).addEventListener('click', () => yazmaAc('kendim', true));
}

// ---- Ailem (Sorumluluk Panosu)
function ekranAilem(e) {
  const g = bugun();
  const yapilan = veri.gorevYapildi[g] || [];
  const sayi = veri.gorevler.filter(x => yapilan.includes(x.id)).length;
  e.innerHTML = `
    <h2 class="sayfa-baslik">Sorumluluk Panosu</h2>
    <p class="tarih">${esc(tarihYaz(g))}</p>
    <form class="gorev-ekle" id="gorevForm" autocomplete="off">
      <label for="gorevMetin">Yeni görev ekle</label>
      <div class="satir"><input id="gorevMetin" maxlength="60" placeholder="Örnek: Çöpü at - Baba" enterkeyhint="done">
      <button type="submit" class="dugme ana">Ekle</button></div>
      <small>İsim yazmayın; kim yapacaksa rolünü yazın: Anne, Baba, Ben, Kardeşim…</small>
      <p class="y-hata" id="gorevHata" role="alert"></p>
    </form>
    ${veri.gorevler.length ? `<p class="ilerleme-yazi ${sayi === veri.gorevler.length ? 'tamam' : ''}">Bugün ${sayi} / ${veri.gorevler.length} görev yapıldı</p>` : ''}
    <ul class="gorev-liste">${veri.gorevler.map(x => {
      const yp = yapilan.includes(x.id);
      return `<li class="${yp ? 'yapildi' : ''}">
        <button type="button" class="tik" data-tik="${esc(x.id)}" aria-pressed="${yp}" aria-label="${esc(x.metin)}: ${yp ? 'yapıldı' : 'yapılmadı'}"><span aria-hidden="true">${yp ? '✓' : ''}</span></button>
        <span class="g-metin">${esc(x.metin)}</span>
        <button type="button" class="sil" data-sil="${esc(x.id)}" aria-label="${esc(x.metin)} görevini sil">🗑️</button></li>`;
    }).join('') || '<li class="bos">Henüz görev yok. Yukarıdan ekleyin.</li>'}</ul>
    <button type="button" class="tur-dugme t-sorumluluk" data-yaz="sorumluluk"><span class="td-ikon">🧹</span><span class="td-yazi"><strong>Sorumluluğumu kendi cümlemle yazayım</strong><small>Ağacına dal eklenir</small></span><span class="td-puan">+10</span></button>
    ${ekransizDugmesi()}`;
  $('#gorevForm', e).addEventListener('submit', ev => {
    ev.preventDefault();
    const m = temizle($('#gorevMetin', e).value);
    if (m.length < 3) { $('#gorevHata', e).textContent = 'Görevi yazın. Örnek: Çöpü at - Baba'; return; }
    if (veri.gorevler.length >= 20) { $('#gorevHata', e).textContent = 'En fazla 20 görev olabilir.'; return; }
    veri.gorevler.push({ id: yeniId(), metin: m.slice(0, 60) });
    kaydet(); ekraniCiz();
    $('#gorevMetin').focus();
  });
  $$('[data-tik]', e).forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.tik;
    const d = veri.gorevYapildi[g] || (veri.gorevYapildi[g] = []);
    const i = d.indexOf(id);
    if (i >= 0) d.splice(i, 1); else { d.push(id); tost('Aferin! ✅ Şimdi bunu kendi cümlenle yaz, ağacına dal eklensin.'); }
    kaydet();
    const y = window.scrollY; ekraniCiz(); window.scrollTo(0, y);
    rozetKontrol();
  }));
  $$('[data-sil]', e).forEach(b => b.addEventListener('click', () => {
    const x = veri.gorevler.find(v => v.id === b.dataset.sil);
    pencereAc({
      ikon: '🗑️', baslik: 'Görevi silelim mi?', metin: esc(x ? x.metin : ''),
      dugmeler: [{ yazi: 'Evet, sil', sinif: 'tehlike', eylem: () => { veri.gorevler = veri.gorevler.filter(v => v.id !== b.dataset.sil); kaydet(); ekraniCiz(); } }, { yazi: 'Vazgeç', sinif: 'ikincil' }]
    });
  }));
  $('[data-yaz]', e).addEventListener('click', () => yazmaAc('sorumluluk', true));
  baglaEkransiz(e);
}

// ---- Mahallem (İyilik Zinciri)
function zincirSVG() {
  const liste = veri.kayitlar.filter(k => k.tur === 'iyilik').sort((a, b) => a.zaman - b.zaman);
  const sira = 8, aralik = 34, yuk = 52;
  const satir = Math.max(1, Math.ceil((liste.length + 1) / sira));
  let s = '';
  for (let i = 0; i <= liste.length; i++) {
    const r = Math.floor(i / sira), c = i % sira;
    const tersSatir = r % 2 === 1;
    const x = 40 + (tersSatir ? sira - 1 - c : c) * aralik, y = 30 + r * yuk;
    if (i === liste.length) {
      s += `<g transform="translate(${x} ${y})" class="halka-bos"><ellipse rx="22" ry="14"/><text y="5">+</text></g>`;
      break;
    }
    const k = liste[i];
    const renk = (k.parca && k.parca.renk) || PASTEL[i % PASTEL.length];
    const dik = i % 2 === 1;
    // satır sonunda aşağı inen halka dik durur
    s += `<g class="halka${k.id === sonYeniHalka ? ' yeni' : ''}" data-id="${esc(k.id)}" transform="translate(${x} ${y})"><g class="ic">
      <ellipse rx="${dik ? 13 : 22}" ry="${dik ? 20 : 14}" stroke="${esc(renk)}"/>
      <ellipse class="parlak" rx="${dik ? 13 : 22}" ry="${dik ? 20 : 14}"/></g></g>`;
  }
  return { svg: `<svg class="zincir" viewBox="0 0 320 ${satir * yuk + 10}" role="img" aria-label="İyilik zinciri: ${liste.length} halka">${s}</svg>`, sayi: liste.length };
}

function ekranMahalle(e) {
  const z = zincirSVG();
  sonYeniHalka = null;
  e.innerHTML = `
    <h2 class="sayfa-baslik">İyilik Zinciri</h2>
    <p class="aciklama">Her iyilik zincire bir halka ekler, ağacında bir çiçek açar.</p>
    <div class="zincir-kutu" id="zincirKutu">${z.svg}<div class="balon" id="zBalon" hidden></div></div>
    <p class="ilerleme-yazi">${z.sayi ? `Zincirde <strong>${z.sayi}</strong> halka var.` : 'Henüz halka yok. İlk iyiliğini yaz!'}</p>
    <h3 class="bolum-baslik">Bir iyilik seç ya da kendin yaz</h3>
    <div class="hazir-liste">${FIKIRLER.iyilik.map(f => `<button type="button" class="hazir" data-hazir="${esc(f)}">${esc(f)}</button>`).join('')}</div>
    <button type="button" class="tur-dugme t-iyilik" data-yaz="iyilik"><span class="td-ikon">✏️</span><span class="td-yazi"><strong>Kendi cümlemle yazayım</strong><small>Ağacında çiçek açar</small></span><span class="td-puan">+10</span></button>`;
  $$('[data-hazir]', e).forEach(b => b.addEventListener('click', () => {
    yazmaAc('iyilik', true);
    const ta = $('#yMetin'); ta.value = b.dataset.hazir; ta.dispatchEvent(new Event('input'));
  }));
  $('[data-yaz]', e).addEventListener('click', () => yazmaAc('iyilik', true));
  const kutu = $('#zincirKutu', e), balon = $('#zBalon', e);
  $$('.halka', kutu).forEach(h => h.addEventListener('click', ev => {
    const k = veri.kayitlar.find(x => x.id === h.dataset.id); if (!k) return;
    balon.innerHTML = `<div class="b-ust">🤝 ${esc(tarihYaz(k.tarih, false))}</div><div class="b-metin">“${esc(k.metin)}”</div>`;
    balon.hidden = false;
    const r = kutu.getBoundingClientRect(), gen = Math.min(260, r.width - 16);
    balon.style.width = gen + 'px';
    balon.style.left = Math.max(8, Math.min(r.width - gen - 8, ev.clientX - r.left - gen / 2)) + 'px';
    balon.style.top = Math.max(4, ev.clientY - r.top - balon.offsetHeight - 14) + 'px';
    ev.stopPropagation();
  }));
  kutu.addEventListener('click', () => { balon.hidden = true; });
}

// ---- Rozetler
function yediGunHtml() {
  const gunler = sonYediGun();
  return `<div class="yedi-gun" role="table" aria-label="Son 7 gün">
    ${gunler.map(g => {
      const d = anahtardanTarih(g);
      const kay = veri.kayitlar.filter(k => k.tarih === g);
      const kart = veri.kart[g] || {};
      const doluSayi = KART.filter(m => kart[m.id]).length;
      const ekr = kay.some(k => k.tur === 'ekransiz');
      const aktif = kay.length || doluSayi;
      return `<div class="gun${g === bugun() ? ' bugun' : ''}${aktif ? ' aktif' : ''}" role="row">
        <div class="g-ad" role="cell">${GUN_KISA[d.getDay()]}<small>${d.getDate()}</small></div>
        <div class="g-hucre" role="cell" title="Kart">${doluSayi === KART.length ? '📋' : doluSayi ? `<small>${doluSayi}/5</small>` : '·'}</div>
        <div class="g-hucre" role="cell" title="Kayıt">${kay.filter(k => k.tur !== 'ekransiz').length ? `⭐<small>${kay.filter(k => k.tur !== 'ekransiz').length}</small>` : '·'}</div>
        <div class="g-hucre" role="cell" title="Ekransız saat">${ekr ? '📵' : '·'}</div>
      </div>`;
    }).join('')}
  </div>
  <p class="kucuk">📋 kart tamam · ⭐ yazılan kayıt · 📵 ekransız saat</p>`;
}

function ekranRozet(e) {
  e.innerHTML = `
    <h2 class="sayfa-baslik">Rozetlerim</h2>
    <h3 class="bolum-baslik">Son 7 gün</h3>
    ${yediGunHtml()}
    <h3 class="bolum-baslik">Rozetler</h3>
    <div class="rozet-izgara">${ROZETLER.map(r => {
      const d = Math.min(r.deger(), r.hedef), ok = d >= r.hedef;
      return `<div class="rozet${ok ? ' acik' : ''}">
        <div class="r-ikon" aria-hidden="true">${ok ? r.ikon : '🔒'}</div>
        <strong>${esc(r.ad)}</strong><small>${esc(r.acik)}</small>
        ${ok ? '<span class="r-tamam">Kazandın!</span>' : `<div class="bar ince"><div class="bar-dolu" style="width:${Math.round(d / r.hedef * 100)}%"></div></div><span class="r-sayi">${d} / ${r.hedef}</span>`}
      </div>`;
    }).join('')}</div>
    <button type="button" class="dugme ana genis buyuk" id="haftamDugme">📄 Haftam (öğretmene götür)</button>`;
  $('#haftamDugme', e).addEventListener('click', haftamAc);
}

// ---------------------------------------------------------------- Tam ekranlar
function tamEkranAc(ad, baslik, icerik, sonra) {
  const el = $('#tamEkran');
  el.innerHTML = `<div class="tam-ust"><button type="button" class="geri" data-geri="1">◀ Geri</button><h2>${esc(baslik)}</h2></div><div class="tam-ic">${icerik}</div>`;
  el.hidden = false;
  document.body.classList.add('kilitli');
  $('[data-geri]', el).addEventListener('click', katmanKapat);
  katmanAc(ad, () => { el.hidden = true; el.innerHTML = ''; document.body.classList.remove('kilitli'); ekraniCiz(); });
  if (sonra) sonra(el);
  el.scrollTop = 0;
}

function yaptiklarimHtml() {
  const liste = veri.kayitlar.slice().sort((a, b) => b.zaman - a.zaman);
  if (!liste.length) return '<p class="bos-yazi">Henüz kayıt yok. Ağacım ekranından ilk kaydını yaz!</p>';
  const gruplar = {};
  liste.forEach(k => (gruplar[k.tarih] = gruplar[k.tarih] || []).push(k));
  return Object.keys(gruplar).sort().reverse().map(g => `
    <h3 class="liste-gun">${esc(tarihYaz(g))} <small>${toplamPuan(gruplar[g])} puan</small></h3>
    <ul class="kayit-liste">${gruplar[g].map(k => `<li>
      <span class="kl-ikon" aria-hidden="true">${TURLER[k.tur].ikon}</span>
      <span class="kl-metin"><small>${esc(TURLER[k.tur].ad)}</small>${esc(k.metin)}</span>
      <span class="kl-puan">+${k.puan}</span>
      <button type="button" class="sil" data-ksil="${esc(k.id)}" aria-label="Bu kaydı sil">🗑️</button></li>`).join('')}</ul>`).join('');
}

function yaptiklarimAc() {
  const bagla = el => {
    $$('[data-ksil]', el).forEach(b => b.addEventListener('click', () => {
      const k = veri.kayitlar.find(x => x.id === b.dataset.ksil); if (!k) return;
      pencereAc({
        ikon: '🗑️', baslik: 'Bu kaydı silelim mi?',
        metin: `“${esc(k.metin)}”<br><small>Ağaçtaki ${esc(TURLER[k.tur].parcaAd)} da kalkar, ${k.puan} puan düşer.</small>`,
        dugmeler: [{ yazi: 'Evet, sil', sinif: 'tehlike', eylem: () => {
          kayitSil(k.id);
          $('.tam-ic', el).innerHTML = yaptiklarimHtml();
          bagla(el);
          tost('Kayıt silindi.');
        } }, { yazi: 'Vazgeç', sinif: 'ikincil' }]
      });
    }));
  };
  tamEkranAc('yaptiklarim', '📋 Yaptıklarım', yaptiklarimHtml(), bagla);
}

function haftamHtml() {
  const gunler = sonYediGun();
  const hafta = veri.kayitlar.filter(k => gunler.includes(k.tarih)).sort((a, b) => a.zaman - b.zaman);
  const p = toplamPuan(), no = asamaNo(p);
  const sayilar = ['iyilik', 'sorumluluk', 'kendim', 'ekransiz'].map(t => ({ t, n: hafta.filter(k => k.tur === t).length }));
  const kazanilan = ROZETLER.filter(r => r.deger() >= r.hedef);
  return `<article class="haftam">
    <header class="h-ust">
      <h1>İyi Ailem, İyi Mahallem</h1>
      <p class="h-alt">Sorumluluk ve İyilik Hâli Haftası · <strong>Haftam</strong></p>
      <p class="h-tarih">${esc(tarihYaz(gunler[0], false))} – ${esc(tarihYaz(gunler[6], false))} ${anahtardanTarih(gunler[6]).getFullYear()}</p>
    </header>
    <div class="h-ozet">
      <div class="h-agac">${agacSVG({ statik: true })}</div>
      <div class="h-sayilar">
        <div class="h-puan"><span>${toplamPuan(hafta)}</span> puan bu hafta</div>
        <p>Toplam puan: <strong>${p}</strong><br>Ağacım: <strong>${ASAMALAR[no].ikon} ${esc(ASAMALAR[no].ad)}</strong></p>
        <ul>${sayilar.map(s => `<li>${TURLER[s.t].ikon} ${esc(TURLER[s.t].ad)}: <strong>${s.n}</strong></li>`).join('')}</ul>
      </div>
    </div>
    <h2>Yaptıklarım</h2>
    ${hafta.length ? `<table class="h-tablo"><thead><tr><th>Tarih</th><th>Tür</th><th>Ne yaptım?</th><th>Puan</th></tr></thead><tbody>
      ${hafta.map(k => `<tr><td>${esc(tarihYaz(k.tarih, false))}</td><td>${TURLER[k.tur].ikon} ${esc(TURLER[k.tur].ad)}</td><td>${esc(k.metin)}</td><td class="sag">${k.puan}</td></tr>`).join('')}
      <tr class="toplam"><td colspan="3">Toplam</td><td class="sag">${toplamPuan(hafta)}</td></tr></tbody></table>` : '<p>Bu hafta kayıt yok.</p>'}
    <h2>İyilik Hâli Kartım</h2>
    <table class="h-tablo kart-tablo"><thead><tr><th></th>${gunler.map(g => `<th>${GUN_KISA[anahtardanTarih(g).getDay()]}<br><small>${anahtardanTarih(g).getDate()}</small></th>`).join('')}</tr></thead><tbody>
      ${KART.map(m => `<tr><th>${m.ikon} ${esc(m.ad)}</th>${gunler.map(g => { const v = (veri.kart[g] || {})[m.id]; return `<td>${v ? YUZLER[v - 1] : '–'}</td>`; }).join('')}</tr>`).join('')}
    </tbody></table>
    <h2>Rozetlerim</h2>
    <p class="h-rozet">${kazanilan.length ? kazanilan.map(r => `<span>${r.ikon} ${esc(r.ad)}</span>`).join('') : 'Henüz rozet yok.'}</p>
    <div class="h-imza"><div>Öğrencinin adı: ..............................</div><div>Veli imzası: ..............................</div></div>
  </article>`;
}

function haftamAc() {
  const el = $('#yazdirAlani');
  el.innerHTML = `<div class="tam-ust yazdirma-yok"><button type="button" class="geri" data-geri="1">◀ Geri</button><h2>📄 Haftam</h2></div>
    <div class="yazdirma-yok yazdir-bilgi"><button type="button" class="dugme ana genis buyuk" id="yazdirDugme">🖨️ Yazdır / PDF kaydet</button>
    <p class="kucuk">Telefonda “Yazdır” ekranında PDF olarak kaydedip öğretmene gönderebilirsiniz.</p></div>
    ${haftamHtml()}`;
  el.hidden = false;
  document.body.classList.add('kilitli', 'haftam-acik');
  $('[data-geri]', el).addEventListener('click', katmanKapat);
  $('#yazdirDugme', el).addEventListener('click', () => window.print());
  katmanAc('haftam', () => { el.hidden = true; el.innerHTML = ''; document.body.classList.remove('kilitli', 'haftam-acik'); });
  el.scrollTop = 0;
}

function ayarlarAc() {
  const icerik = `
    <section class="ayar-kutu">
      <h3>Bu uygulama nasıl kullanılır?</h3>
      <ul class="madde">
        <li>Her gün çocuğunuzla birlikte 2-3 dakika açın.</li>
        <li><strong>Bugün</strong> sekmesinde İyilik Hâli Kartı’nı doldurun.</li>
        <li>Çocuk yaptığı iyiliği, sorumluluğu ya da kendine nasıl iyi baktığını <strong>kendi cümlesiyle</strong> yazsın. Her kayıt 10 puan, ağaca bir parça.</li>
        <li>Ekransız aile saati yaptığınız gün +15 puan, ağaca bir kuş.</li>
        <li>Hafta sonunda <strong>Rozetler → Haftam</strong> sayfasını yazdırıp öğretmene götürün.</li>
      </ul>
    </section>
    <section class="ayar-kutu">
      <h3>Gizlilik</h3>
      <p>Hesap, isim, fotoğraf ya da konum istenmez. Bütün kayıtlar yalnız bu telefonda durur, internete gönderilmez. Uygulama internetsiz de çalışır.</p>
      <p class="kucuk">Ana ekrana eklediyseniz uygulamayı hep ana ekrandaki simgeden açın; tarayıcıdaki kayıtlar ayrı tutulabilir.</p>
    </section>
    <section class="ayar-kutu tehlike-kutu">
      <h3>Verileri sil</h3>
      <p>Bütün kayıtlar, ağaç, kart, görevler ve rozetler silinir. Geri alınamaz.</p>
      <button type="button" class="dugme tehlike genis" id="hepsiniSil">🗑️ Tüm verileri sil</button>
    </section>
    <p class="kucuk ortala">İyi Ailem, İyi Mahallem · sürüm 1.0</p>`;
  tamEkranAc('ayarlar', '⚙️ Ayarlar', icerik, el => {
    $('#hepsiniSil', el).addEventListener('click', () => {
      pencereAc({
        ikon: '⚠️', baslik: 'Emin misiniz?',
        metin: 'Bütün kayıtlar, ağaç ve rozetler <strong>kalıcı olarak</strong> silinecek.',
        dugmeler: [{ yazi: 'Evet, hepsini sil', sinif: 'tehlike', eylem: () => {
          try { localStorage.removeItem(ANAHTAR); } catch (e) { /* yok */ }
          veri = bosVeri(); veri.tanitimGoruldu = true; veri.rozetGoruldu = []; kaydet();
          sonOlcek = null;
          katmanKapat();
          sekme = 'agac';
          tost('Bütün veriler silindi. Yeni bir fidan dikildi. 🌱');
        } }, { yazi: 'Vazgeç', sinif: 'ikincil' }]
      });
    });
  });
}

// ---------------------------------------------------------------- Başlangıç
function tanitim() {
  if (veri.tanitimGoruldu) return;
  pencereAc({
    ikon: '🌱', baslik: 'Merhaba!',
    metin: 'Her gün yaptığın iyiliği ve sorumluluğu <strong>kendi cümlenle</strong> yaz.<br>Her kayıtta ağacın büyür.<br><small>Günde 2-3 dakika yeter. Sonra ekranı kapat!</small>',
    dugmeler: [{ yazi: 'Başlayalım!', eylem: () => { veri.tanitimGoruldu = true; kaydet(); } }]
  });
}

function baslat() {
  $$('.sekmeler button').forEach(b => b.addEventListener('click', () => sekmeyeGec(b.dataset.sekme)));
  $('#ayarDugme').addEventListener('click', ayarlarAc);
  window.addEventListener('afterprint', () => document.body.classList.remove('yazdiriliyor'));
  window.addEventListener('beforeprint', () => {
    // Haftam açık değilken yazdırılırsa da özet çıksın
    if ($('#yazdirAlani').hidden) { $('#yazdirAlani').innerHTML = haftamHtml(); }
    document.body.classList.add('yazdiriliyor');
  });
  if (!Array.isArray(veri.rozetGoruldu)) rozetKontrol(true);
  ekraniCiz();
  tanitim();
  // Gün değişince (uygulama gece açık kaldıysa) ekranı yenile
  let gun = bugun();
  document.addEventListener('visibilitychange', () => { if (!document.hidden && bugun() !== gun) { gun = bugun(); ekraniCiz(); } });

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* çevrimdışı önbellek olmadan da çalışır */ });
  }
}

// Deneme için dışarıya küçük bir kapı (yalnız okuma/çağırma; veri yine cihazda)
window.IyiAilem = { kayitEkle, kayitSil, veri: () => veri, ekraniCiz, sekmeyeGec, agacSVG };

try { baslat(); }
catch (e) {
  // Beklenmedik bir hata olursa boş ekran yerine yol göster
  const ekr = document.getElementById('ekran');
  if (ekr) ekr.innerHTML = '<div style="margin:16px;padding:16px;background:#fff;border-radius:16px"><p><b>Uygulama açılırken bir sorun oldu.</b></p><p>Sayfayı yenileyin. Düzelmezse Chrome ya da Safari ile açın.</p></div>';
}
})();
