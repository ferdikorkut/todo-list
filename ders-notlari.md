# Ders Notları - Todo List Projesi

Bu dosyada projede yaptığımız çalışmaların özetini tutuyoruz.

---

## Genel Plan (Adım Adım)

1. ✅ Genel iskelet ve görsel tasarım (statik)
2. ✅ Görev ekleme + listeleme (önceliğe göre renkli ve sıralı gösterim)
3. ✅ Tamamlandı işaretleme (tik + üstü çizili)
4. ✅ Düzenleme ve silme butonları
5. ✅ Öncelik yukarı/aşağı okları + otomatik yeniden sıralama
6. ⬜ Filtreler (Tümü/Aktif/Tamamlanan) + Tamamlananları Sil
7. ⬜ İstatistik kutuları
8. ⬜ localStorage ile kalıcılık

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

### Sırada ne var?

6. Adım: Filtreler (Tümü/Aktif/Tamamlanan) + Tamamlananları Sil. Filtre
butonlarına tıklanınca listede sadece ilgili görevler görünecek (örn. "Aktif"
seçilince tamamlanmış görevler gizlenecek). "Tamamlananları Sil" butonuna
tıklanınca tüm tamamlanmış görevler listeden kaldırılacak.
