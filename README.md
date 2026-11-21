# İyi Ailem, İyi Mahallem

Yeşilay "Sorumluluk ve İyilik Hâli" haftası için 7-10 yaş çocuklar ve aileleri için küçük bir web uygulaması.
Velinin telefonundan açılır, aile her gün 2-3 dakika birlikte kullanır.

- Çocuk yaptığı iyiliği, sorumluluğu ya da kendine nasıl iyi baktığını **kendi cümlesiyle** yazar: her kayıt 10 puan, ekransız aile saati 15 puan.
- Her kayıt ağaca bir parça ekler: sorumluluk → dal, iyilik → çiçek, kendime iyi baktım → yaprak, ekransız saat → kuş.
- Ağaç puanla büyür: Fidan (0) → Genç Ağaç (50) → Ağaç (120) → Ulu Çınar (220).
- Sekmeler: Ağacım, Bugün (İyilik Hâli Kartı), Ailem (Sorumluluk Panosu), Mahallem (İyilik Zinciri), Rozetler (7 gün, rozetler, yazdırılabilir "Haftam").

## Gizlilik
- Hesap, isim, fotoğraf, konum istenmez.
- Bütün veriler yalnız o telefonun tarayıcısında (`localStorage`) durur.
- Hiçbir dış istek yoktur (yazı tipi, CDN, analitik yok). `index.html` içindeki güvenlik kuralı (CSP) başka adrese bağlanmayı da engeller.
- Ayarlar → "Tüm verileri sil" her şeyi siler.

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sayfa iskeleti |
| `style.css` | Görünüm (yeşil tema, yazdırma ayarları) |
| `app.js` | Bütün uygulama: kayıtlar, ağaç çizimi, rozetler, Haftam |
| `manifest.json` | Ana ekrana ekleme bilgileri |
| `sw.js` | İnternetsiz çalışma (dosyaları telefona saklar) |
| `ikon/` | Uygulama simgeleri |

Derleme adımı yoktur; dosyalar olduğu gibi yayınlanır.

## GitHub Pages'te yayınlama
1. GitHub'da yeni bir depo açın (ör. `iyi-ailem`). Pages ücretsiz hesapta yalnız **herkese açık** depolarda çalışır; depoda kişisel bilgi yoktur.
2. Bu klasördeki dosyaları depoya yükleyin (web'den "Add file → Upload files" ya da `git push`).
3. Depoda **Settings → Pages** → "Build and deployment" altında **Source: Deploy from a branch**, **Branch: main**, klasör **/(root)** → **Save**.
4. 1-2 dakika sonra adres hazır olur: `https://<kullanıcı-adı>.github.io/iyi-ailem/`
5. Bu adresi velilere gönderin (isterseniz QR koda çevirin).

Komut satırıyla (gh yüklüyse):
```
git init && git add -A && git commit -m "İlk sürüm"
gh repo create iyi-ailem --public --source . --push
gh api -X POST repos/<kullanıcı-adı>/iyi-ailem/pages -f "source[branch]=main" -f "source[path]=/"
```

## Ana ekrana ekleme (veliler için)
- **Android (Chrome):** adresi açın → sağ üstteki ⋮ → "Ana ekrana ekle" / "Uygulamayı yükle".
- **iPhone (Safari):** adresi açın → alttaki paylaş düğmesi → "Ana Ekrana Ekle".
- Ekledikten sonra uygulamayı **hep ana ekrandaki simgeden** açın. (iPhone'da Safari ile ana ekran simgesi kayıtları ayrı tutar.)

## Güncelleme yaparken
Dosyalardan biri değişirse `sw.js` içindeki `SURUM` değerini artırın (ör. `iyiailem-1.0.1`). Telefonlar yeni sürümü bir sonraki açılışta alır.

## Yerelde deneme
```
python -m http.server 8000
```
sonra tarayıcıda `http://localhost:8000/`. (Dosyaya çift tıklayınca da açılır ama internetsiz çalışma yalnız `http(s)` adresinde etkinleşir.)

## Bilinen sınırlar
- Veriler cihaza bağlıdır: telefon değişirse ya da tarayıcı verileri silinirse kayıtlar gider. Yedekleme/aktarma yoktur (bilerek: veri dışarı çıkmasın).
- iPhone'da yalnız Safari sekmesinde kullanılıp ana ekrana eklenmezse, uzun süre açılmayan sitelerin verilerini iOS silebilir. Ana ekrana eklemek bunu önler.
- 10 harf ve "aynı gün aynı cümle" kuralı dışında yazılan cümlenin doğruluğu denetlenmez; aile birlikte kullanır.
- Ağaçta çok fazla parça olursa (yaklaşık 130 yaprak+çiçek, 56 dal, 22 kuş üstü) yeni parçalar eskilerin yakınına biner.
