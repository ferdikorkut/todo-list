# Ders Notları - Todo List Projesi

Bu dosyada projede yaptığımız çalışmaların özetini tutuyoruz.

---

## Genel Plan (Adım Adım)

1. ✅ Genel iskelet ve görsel tasarım (statik)
2. ⬜ Görev ekleme + listeleme (önceliğe göre renkli ve sıralı gösterim)
3. ⬜ Tamamlandı işaretleme (tik + üstü çizili)
4. ⬜ Düzenleme ve silme butonları
5. ⬜ Öncelik yukarı/aşağı okları + otomatik yeniden sıralama
6. ⬜ Filtreler (Tümü/Aktif/Tamamlanan) + Tamamlananları Sil
7. ⬜ İstatistik kutuları
8. ⬜ localStorage ile kalıcılık

---

## 1. Adım - Genel İskelet ve Görsel Tasarım (10 Haziran 2026)

- **index.html**: `.card` ana kutu; içinde header (başlık+açıklama), görev ekleme alanı
  (input + öncelik select + Ekle butonu), filtre satırı (Tümü/Aktif/Tamamlanan +
  Tamamlananları Sil), istatistik kutuları (Toplam/Aktif/Tamamlanan) ve görev listesi.
  Listede şimdilik 3 örnek görev var (yüksek/normal/tamamlanmış-düşük), sadece tasarımı
  görmek için eklendi - bir sonraki adımda kaldırılıp JS ile dinamik hale gelecek.
- **style.css**: Açık/pastel tema. `body`de iki `radial-gradient` (sol üstten nane yeşili,
  sağ alttan pembe), beyaz `.card`, mor (#6c63ff) header ve butonlar, flexbox düzen,
  öncelik renkleri kırmızı/sarı/yeşil (`border-left`), yuvarlak check butonu, tamamlanan
  görevde üstü çizili gri yazı.
- **script.js**: Henüz boş, bir sonraki adımda doldurulacak.
- **Öğrenilen kavramlar**: semantic etiketler (`<header>`, `<section>`), `<select>`/`<option>`,
  `data-*` öznitelikleri, `box-sizing: border-box`, `radial-gradient`, flexbox
  (`flex`, `gap`, `justify-content`, `flex-wrap`), `border-radius: 50%`, class
  kombinasyonları (`.task-item.priority-high` gibi), `text-decoration: line-through`.

---

### Sırada ne var?

2. Adım: Görev ekleme + listeleme. Statik örnek görevleri kaldırıp, kullanıcının yazdığı
görevleri JS ile listeye ekleyeceğiz (önceliğe göre renklendirip doğru konuma yerleştirerek).
