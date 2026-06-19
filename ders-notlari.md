# Ders Notları - Todo List Projesi

Bu dosyada projede yaptığımız çalışmaların özetini tutuyoruz.

---

## Genel Plan (Adım Adım)

1. ✅ Genel iskelet ve görsel tasarım (statik)
2. ✅ Görev ekleme + listeleme (önceliğe göre renkli ve sıralı gösterim)
3. ✅ Tamamlandı işaretleme (tik + üstü çizili)
4. ✅ Düzenleme ve silme butonları
5. ✅ Öncelik yukarı/aşağı okları + otomatik yeniden sıralama
6. ✅ Filtreler (Tümü/Aktif/Tamamlanan) + Tamamlananları Sil
7. ✅ İstatistik kutuları
8. ✅ localStorage ile kalıcılık

---

## 1. Adım - Genel İskelet ve Görsel Tasarım (10 Haziran 2026)

- **index.html**: `.card` ana kutu (genişlik 690px); içinde header (başlık+açıklama),
  görev ekleme alanı, filtre satırı (Tümü/Aktif/Tamamlanan + Tamamlananları Sil),
  istatistik kutuları (Toplam/Aktif/Tamamlanan) ve görev listesi.
  - Görev ekleme alanı: solda 2 satırlık `<textarea id="todo-input">`, sağda üst üste
    2 satır - öncelik seçimi (gizli radio + buton gibi görünen `label`'lar: ▲ yüksek,
    ● normal, ▼ düşük) ve altında Ekle butonu.
  - Listede şimdilik 3 örnek görev var (yüksek/normal/tamamlanmış-düşük), sadece tasarımı
    görmek için eklendi - 2. adımda kaldırılıp JS ile dinamik hale gelecek.
- **style.css**: Açık/pastel tema. `body`de iki `radial-gradient` (sol üstten nane yeşili,
  sağ alttan pembe), beyaz `.card`, header/Ekle butonu/aktif filtre `rgba(77,103,190,0.5-0.6)`
  mavi tonunda, flexbox düzen. Öncelik renkleri: yüksek=kırmızı, normal=turuncu,
  düşük=sarı (`border-left`); tamamlanan görev önceliğe bakmaksızın yeşil şerit alır
  (`.task-item.completed` kuralı). Görev satırları `min-height: 60px` ile 2 satırlık
  metne göre simetrik. Yuvarlak check butonu, tamamlanan görevde üstü çizili gri yazı.
- **script.js**: Henüz boş, 2. adımda doldurulacak.
- **Öğrenilen kavramlar**: semantic etiketler (`<header>`, `<section>`), `<textarea>`,
  gizli `radio` + `label` ile özel buton tasarımı (`:checked + label` seçici),
  `data-*` öznitelikleri, `box-sizing: border-box`, `radial-gradient`, flexbox
  (`flex`, `gap`, `justify-content`, `flex-wrap`, `flex-direction: column`),
  `border-radius: 50%`, class kombinasyonları (`.task-item.priority-high` gibi),
  `text-decoration: line-through`, `rgba()` ile yarı saydam renkler.

---

## 2. Adım - Görev Ekleme + Listeleme (10 Haziran 2026)

- **index.html**: `.task-list` boş `<ul>` oldu (statik 3 örnek kaldırıldı). İstatistik
  kutularına `id="total-count"`, `id="active-count"`, `id="completed-count"` eklendi.
- **script.js**:
  - `createTaskElement(text, priority)`: eski statik görevlerle aynı yapıda
    (`check-btn`, `task-text`, öncelik okları + Düzenle/Sil) yeni bir `<li>` oluşturur,
    `class="task-item priority-X"` ve `data-priority="X"` ekler.
  - `insertTaskInOrder(li, priority)`: `PRIORITY_ORDER` (high=0, normal=1, low=2)
    değerine göre listede doğru konuma (`insertBefore`) yerleştirir - liste her zaman
    yüksek → normal → düşük sıralı kalır.
  - `updateStats()`: `.task-item` ve `.task-item.completed` sayılarını sayıp
    Toplam/Aktif/Tamamlanan kutularını günceller.
  - `addTask()`: textarea'daki metni okur (boşsa iptal), seçili önceliği
    (`input[name="priority"]:checked`) okur, görevi oluşturup sıraya ekler,
    istatistikleri günceller, textarea'yı temizler ve önceliği "Normal"a döndürür.
  - "Ekle" butonuna `click` olay dinleyicisi eklendi.
- **Öğrenilen kavramlar**: `document.getElementById` / `querySelector` /
  `querySelectorAll`, `document.createElement` ve `appendChild` ile dinamik HTML
  oluşturma, `element.dataset` (data-* okuma/yazma), `insertBefore` ile sıralı
  ekleme, `addEventListener('click', ...)`, `:checked` seçili radio'yu okuma,
  şablon string (`` `...${değişken}...` ``).

---

## 3. Adım - Tamamlandı İşaretleme (10 Haziran 2026)

- **script.js**: `createTaskElement` içinde `checkBtn`'e bir `click` dinleyicisi eklendi.
  Tıklanınca:
  - `li.classList.toggle('completed')` ve `checkBtn.classList.toggle('checked')` ile
    iki class birden açılıp/kapatılıyor.
  - `checkBtn.classList.contains('checked')` true ise `textContent = '✓'`,
    değilse `''` yapılıyor (✓ işareti gösterilip gizleniyor).
  - `updateStats()` tekrar çağrılarak Aktif/Tamamlanan sayıları güncelleniyor.
- Görsel sonuç zaten var olan CSS kurallarıyla otomatik geliyor:
  `.check-btn.checked` (yeşil dolu daire), `.task-item.completed .task-text`
  (üstü çizili soluk yazı), `.task-item.completed` (yeşil sol şerit).
- **Öğrenilen kavramlar**: `classList.toggle()`, `classList.contains()`,
  `.check-btn` ile `.priority-option`'ın farkı - check-btn gerçek bir `<button>` ve
  "aktif" durumu JS ile class toggle'lanarak yönetiliyor; priority-option ise gizli
  bir `radio`'ya bağlı `<label>` ve durumu tarayıcının `:checked` seçicisiyle otomatik
  değişiyor (JS'siz).

---

## 4. Adım - Düzenleme ve Silme Butonları (11 Haziran 2026)

- **script.js**: `createTaskElement` içinde `editBtn` ve `deleteBtn`'e `click`
  dinleyicileri eklendi.
  - **Sil**: `deleteBtn`'e tıklanınca `li.remove()` ile görev satırı sayfadan
    tamamen kaldırılıyor, sonra `updateStats()` çağrılıyor.
  - **Düzenle**: `editBtn`'e tıklanınca satır içi düzenleme moduna geçiliyor:
    - `task-text` (`<span>`) yerine, içine mevcut metnin yazıldığı bir
      `<input type="text" class="edit-input">` konuyor (`taskText.replaceWith(editInput)`).
    - Buton yazısı "Düzenle" → "Kaydet" oluyor, satıra `editing` class'ı ekleniyor
      (hangi modda olduğumuzu bu class ile takip ediyoruz).
    - Tekrar tıklanınca (artık "Kaydet"): input'taki yeni metin okunuyor, boş değilse
      `taskText.textContent` güncelleniyor, `editInput.replaceWith(taskText)` ile
      input kaldırılıp eski `<span>` geri konuyor, buton tekrar "Düzenle" oluyor.
- **style.css**:
  - `.edit-input`: düzenleme sırasında görünen input'un görünümü (`task-text` ile
    uyumlu font boyutu, hafif border).
  - `.edit-btn { width: 64px }`: "Düzenle" ↔ "Kaydet" arasında metin uzunluğu
    değiştiğinde butonun küçülüp büyümesini engellemek için sabit genişlik.
- **Öğrenilen kavramlar**: `element.remove()` ile bir elemanı sayfadan tamamen
  kaldırma, `element.replaceWith(yeniEleman)` ile bir elemanı başka biriyle
  değiştirme (ve eski elemanı değişkende tutup sonra geri koyabilme), bir butonun
  "modunu" (düzenleme açık/kapalı) `classList` üzerinden takip etme, `<input>`
  elemanını JS ile oluşturup `value` ve `focus()` kullanma.

---

## 5. Adım - Öncelik Okları ve Otomatik Sıralama (11 Haziran 2026)

- **script.js**:
  - `PRIORITY_LEVELS = ['high', 'normal', 'low']`: `PRIORITY_ORDER`'ın tersi,
    sıra numarasından öncelik adını bulmak için.
  - `createTaskElement` içinde ▲ ve ▼ butonları `priority-up-btn` /
    `priority-down-btn` class'larıyla ayırt edildi.
    - **▲**: önceliği bir seviye artırır (düşük→normal→yüksek). Zaten "yüksek"se
      bir şey yapmaz.
    - **▼**: önceliği bir seviye azaltır (yüksek→normal→düşük). Zaten "düşük"se
      bir şey yapmaz.
    - `changeTaskPriority(newPriority)`: `priority-X` class'ını ve
      `data-priority`'yi günceller, sonra `insertTaskInOrder(li)` ile listeyi
      yeniden sıralar.
  - **Sıralama mantığı genişletildi** (`getSortKey` + `insertTaskInOrder`):
    artık her görevin bir "anahtarı" var -> aktif görevler 0/1/2 (öncelik),
    tamamlanmış görevler 10/11/12. Böylece liste her zaman önce aktif görevler
    (öncelik sırasına göre), sonra tamamlanmış görevler (yine öncelik sırasına
    göre) şeklinde sıralı kalıyor. check-btn'e tıklanınca da `insertTaskInOrder(li)`
    çağrılıyor, böylece görev tamamlanır tamamlanmaz doğru gruba kayıyor.
- **Öğrenilen kavramlar**: bir elemanın "sıralama anahtarı"nı (sort key) tek bir
  sayıya indirgeyip karşılaştırma yapma, birden fazla kritere göre (önce
  tamamlanma durumu, sonra öncelik) sıralama, mevcut bir DOM elemanını
  `insertBefore`/`appendChild` ile başka bir konuma "taşıma" (otomatik olarak eski
  yerinden kalkar).

---

## 6. Adım - Filtreler ve Tamamlananları Sil (11 Haziran 2026)

- **script.js**:
  - `currentFilter` değişkeni: şu an seçili filtreyi tutar (`'all'` / `'active'` / `'completed'`).
  - `applyFilter()`: listedeki her `.task-item`'ı kontrol eder, görevin tamamlanma
    durumu ile `currentFilter`'a göre gösterilip gösterilmeyeceğine karar verir,
    uymuyorsa `hidden` class'ı ekler (CSS ile `display: none` yapar).
  - Filtre butonlarına (`Tümü`/`Aktif`/`Tamamlanan`) `click` dinleyicisi eklendi:
    tıklanan butona `active` class'ı verilir (diğerlerinden kaldırılır),
    `data-filter` özniteliğinden okunan değer `currentFilter`'a atanır,
    sonra `applyFilter()` çağrılır.
  - "Tamamlananları Sil" butonuna tıklanınca tüm `.task-item.completed`
    elemanları `remove()` ile listeden kaldırılır, `updateStats()` çağrılır.
  - `addTask()` ve check-btn tıklamasından sonra da `applyFilter()` çağrılarak
    yeni eklenen/durumu değişen görevler de filtreye uysun diye kontrol edilir.
- **Öğrenilen kavramlar**: `classList.toggle(class, kosul)` -> ikinci parametre
  `true`/`false` verilince class'ı eklemek/kaldırmak yerine doğrudan o duruma
  ayarlar; `querySelectorAll` ile seçilen birden fazla elemanı `forEach` ile
  tek tek `remove()` etme; CSS ile "gizleme" (`display: none`) ve JS class
  yönetiminin birlikte çalışması.

---

## 7. Adım - İstatistik Kutuları (11 Haziran 2026)

- Bu adımın kodu aslında 2. Adım'da yazılmıştı: `updateStats()` fonksiyonu
  `.task-item` ve `.task-item.completed` sayılarını sayıp Toplam/Aktif/Tamamlanan
  kutularını günceller. O zamandan beri her görev ekleme, tamamlama, silme ve
  "Tamamlananları Sil" işleminden sonra çağrılıyor - yani bu adım fiilen
  tamamlanmıştı, burada sadece planda işaretliyoruz.

---

## Görsel İyileştirmeler (11 Haziran 2026)

Numaralı adımların dışında, mevcut özelliklerin görünümünde birkaç değişiklik yapıldı:

- **Öncelik okları artık "akıllı"**: Her görevde ▲ (öncelik artır) ve ▼ (öncelik
  azalt) butonları var, ama gereksiz olan gizleniyor:
  - Yüksek öncelikte ▲ gizli (zaten daha yukarı çıkamaz).
  - Düşük öncelikte ▼ gizli (zaten daha aşağı inemez).
  - Görev tamamlandığında ikisi de gizleniyor (artık önceliğin önemi kalmadığı için).
  - `PRIORITY_LEVELS = ['high', 'normal', 'low']` dizisi eklendi; `updatePriorityArrows()`
    fonksiyonu `li.dataset.priority`'nin bu dizideki sırasına bakarak hangi okun
    gizleneceğine karar veriyor.
- **Düzenle/Sil butonları artık ikon**: "Sil" yerine 🗑️, "Düzenle" yerine ✎,
  düzenleme modundayken (Kaydet) ✎ yerine 💾 gösteriliyor. `editBtn`'e `saving`
  class'ı eklenip kaldırılarak ✎ ve 💾 durumlarının font boyutu/padding'i
  CSS'te (`.edit-btn` ve `.edit-btn.saving`) birbirinden bağımsız ayarlanabiliyor.
- **Görev ekleme alanı yeniden tasarlandı**: Öncelik seçimi için kullanılan
  radio butonları (▲●▼) kaldırıldı. Artık `#todo-input` tam genişlik, altında
  3 ayrı "+" butonu var (kırmızı/turuncu/sarı = yüksek/normal/düşük). Hangisine
  tıklanırsa görev o öncelikle ekleniyor. Butonların arka planı beyaz, kenarlığı
  ve "+" sembolünün rengi önceliğin rengiyle aynı.
  - `addTask(priority)` artık önceliği parametre olarak alıyor (radio okuma kodu kalktı).
  - 3 butona `addBtns.forEach(...)` ile tek tek `click` dinleyicisi eklendi,
    her biri kendi `data-priority`'sini `addTask()`'e yolluyor.
- **`.hidden` class'ı genelleştirildi**: Daha önce sadece `.task-item.hidden`
  için tanımlıydı, artık herhangi bir elemanı gizlemek için kullanılan genel
  bir yardımcı (utility) class.

---

## 8. Adım - localStorage ile Kalıcılık (13 Haziran 2026)

- **script.js**:
  - `STORAGE_KEY = 'todo-tasks'`: `localStorage`'da görevlerin saklandığı anahtar adı.
  - `createTaskElement(text, priority, completed)`: üçüncü bir parametre (`completed`,
    varsayılan `false`) eklendi. `true` ise satır oluşturulurken `li`'ye `completed`
    class'ı, `checkBtn`'e `checked` class'ı ve `✓` metni baştan veriliyor - böylece
    kaydedilmiş tamamlanmış görevler doğru görünümle (tik, üstü çizili, gizli oklar)
    geri geliyor.
  - `saveTasks()`: listedeki tüm `.task-item`'ları `{ text, priority, completed }`
    şeklinde objelere çevirip bir diziye toplar, `JSON.stringify` ile metne çevirip
    `localStorage.setItem(STORAGE_KEY, ...)` ile kaydeder.
  - `loadTasks()`: sayfa açılırken `localStorage.getItem(STORAGE_KEY)` ile kayıtlı
    diziyi okur (`JSON.parse`), her görev için `createTaskElement(...)` çağırıp
    `insertTaskInOrder(...)` ile listeye ekler, sonunda `applyFilter()` ve
    `updateStats()` çalıştırır. Kayıt yoksa (`null`) hiçbir şey yapmaz.
  - `saveTasks()` artık şu işlemlerin sonunda çağrılıyor: görev ekleme (`addTask`),
    tamamlandı işaretleme (check-btn), silme (`deleteBtn`), düzenleme kaydetme
    (`editBtn`), öncelik değiştirme (`changeTaskPriority`) ve "Tamamlananları Sil".
    Yani her değişiklik anında kaydediliyor.
  - Dosyanın en altına `loadTasks();` çağrısı eklendi - sayfa ilk açıldığında
    kayıtlı görevler geri yüklenir.
- **Öğrenilen kavramlar**: `localStorage.setItem`/`getItem` ile tarayıcıda veri
  saklama (sayfa yenilenince/kapanınca silinmiyor), `JSON.stringify`/`JSON.parse`
  ile JS objesi ↔ metin dönüşümü (localStorage sadece string saklayabildiği için),
  fonksiyon parametrelerine varsayılan değer verme (`completed = false`),
  fonksiyon tanımlarının "hoisting"i sayesinde `saveTasks`/`loadTasks` gibi
  fonksiyonların, dosyada daha yukarıda tanımlanan kod içinden çağrılabilmesi.

---

## Görsel İyileştirmeler (13 Haziran 2026)

8. Adım'dan sonra, mevcut tasarımda birkaç küçük değişiklik daha yapıldı:

- **Görev satırlarına renkli arka plan geçişi eklendi**: `.task-item` artık düz
  `#fafafa` renk yerine, soldaki öncelik şeridiyle aynı renkten (hafif transparan,
  `rgba(..., 0.15)`) başlayıp sağa doğru `#fafafa`'ya geçen bir `linear-gradient`
  arka plana sahip. Tamamlanan görevlerde bu geçiş yeşil tonunda.
- **Header'daki açıklama paragrafı kaldırıldı**: "Görevlerini ekle, önceliklendir..."
  yazısı ve buna ait `.card-header p` CSS kuralı silindi, sadece başlık kaldı.
- **Öncelik seçim butonları sadeleştirildi**:
  - Seçili olmayan `.priority-option`'ların kenarlığı (`border: 1px solid #ddd`)
    `transparent` yapıldı - artık görünmüyor ama yer kaplamaya devam ediyor
    (seçilince boyut kaymıyor).
  - Seçili olanın (`:checked`) kenarlık rengi, artık görev satırlarındaki arka plan
    geçişiyle aynı rgba renklerini kullanıyor (fark edilsin diye opaklık `0.5`'e
    çıkarıldı).
- **"Tamamlananları Sil" butonu yeniden renklendirildi**: Kırmızı (`#fdecea` /
  `#e74c3c`) yerine, yanındaki filtre butonlarıyla aynı mor/mavi ton (`#f0eefc` /
  `rgba(77, 103, 190, 0.6)`) kullanılıyor, böylece satırla bütünleşiyor.
  `:hover` durumunda eski kırmızı tona dönüyor - "silme" işlemi olduğu fareyle
  üzerine gelince hatırlatılıyor.

---

## Silme Onayı Eklendi (13 Haziran 2026)

Görev silme tek tıkla anında oluyordu, yanlış tıklamalara karşı bir onay adımı eklendi:

- **script.js**: `deleteBtn`'in `click` dinleyicisi artık 2 aşamalı çalışıyor.
  - 1. tıklama: buton `confirming` class'ı alır, içeriği 🗑️'den `✓`'a değişir.
    Aynı zamanda 3 saniyelik bir `setTimeout` başlar.
  - 2. tıklama (3 saniye içinde, hâlâ `confirming` modundayken): `clearTimeout`
    ile zamanlayıcı durdurulur, asıl silme işlemi (`li.remove()`, `updateStats()`,
    `saveTasks()`) çalışır.
  - 3 saniye içinde tekrar tıklanmazsa `setTimeout` içindeki kod çalışır, buton
    otomatik olarak eski haline (🗑️, `confirming` class'ı kaldırılmış) döner.
  - Her görev satırının kendi `confirmTimeoutId` değişkeni var (`createTaskElement`
    içinde tanımlı) - böylece her görevin onay zamanlayıcısı birbirinden bağımsız.
- **style.css**: `.delete-btn.confirming` kuralı eklendi - dolu kırmızı arka plan
  + beyaz `✓` ile "tekrar tıkla, sil" net bir şekilde gösteriliyor. `✓` karakteri
  🗑️ emojisinden farklı boyutta göründüğü için `font-size`/`padding` değerleri
  ayrıca ince ayar yapıldı (kayma olmasın diye).
- **Öğrenilen kavramlar**: `setTimeout`/`clearTimeout` ile zamanlayıcı kurma ve
  gerektiğinde iptal etme, bir butonun "iki aşamalı" durumunu (normal/onay
  bekliyor) `classList` üzerinden takip etme - `editBtn`'deki ✎↔💾 mantığıyla
  aynı desen.

---

### Sırada ne var?

Proje şimdilik tamamlandı: 8 adımlık plan + görsel iyileştirmeler + silme onayı
bitti. Yeni bir özellik/iyileştirme fikri olduğunda birlikte konuşup planlayacağız.
