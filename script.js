// ===========================================
// 2. ADIM: GÖREV EKLEME + LİSTELEME
// ===========================================
// Bu adımda görevleri JavaScript ile dinamik olarak listeye ekliyoruz,
// önceliğe göre renklendirip doğru sıraya yerleştiriyoruz ve
// istatistik kutularını güncelliyoruz.

// --- Sayfadaki elemanlara referanslar ---
// getElementById/querySelector ile HTML'deki elemanları JS değişkenlerine bağlıyoruz
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.querySelector('.task-list');

const totalCountEl = document.getElementById('total-count');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');

const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Şu anda seçili olan filtre ('all' / 'active' / 'completed')
let currentFilter = 'all';

// Önceliklerin sıralama değeri -> küçük sayı listede daha üstte gösterilir
const PRIORITY_ORDER = {
    high: 0,
    normal: 1,
    low: 2
};

// Önceliklerin sırayla listesi -> ok butonlarına basınca bir sonraki/önceki
// önceliği bulmak için kullanılır (PRIORITY_ORDER'ın index'li hali)
const PRIORITY_LEVELS = ['high', 'normal', 'low'];

// localStorage'da görevleri saklamak için kullanılan anahtar (key)
const STORAGE_KEY = 'todo-tasks';

// --- Yeni bir görev satırı (li) oluşturan fonksiyon ---
// index.html'deki eski örnek görevlerle AYNI yapıda bir <li> üretir
function createTaskElement(text, priority, completed = false) {
    const li = document.createElement('li');
    li.className = `task-item priority-${priority}`;
    // dataset.priority -> sıralama yaparken önceliği kolayca okumak için
    li.dataset.priority = priority;

    // localStorage'dan yüklenirken görev zaten tamamlanmış olabilir
    if (completed) {
        li.classList.add('completed');
    }

    // Tamamlandı işaretleme butonu (yuvarlak)
    const checkBtn = document.createElement('button');
    checkBtn.className = completed ? 'check-btn checked' : 'check-btn';
    checkBtn.textContent = completed ? '✓' : '';

    // check-btn'e tıklanınca görevi tamamlandı/tamamlanmadı yap
    checkBtn.addEventListener('click', () => {
        // classList.toggle: class varsa kaldırır, yoksa ekler
        li.classList.toggle('completed');
        checkBtn.classList.toggle('checked');

        // Tamamlandıysa içine ✓ koy, değilse boş bırak
        checkBtn.textContent = checkBtn.classList.contains('checked') ? '✓' : '';

        // Tamamlanma durumu değiştiği için görevi listede doğru gruba taşı
        insertTaskInOrder(li);

        // Tamamlandıysa okları gizle, geri alındıysa tekrar göster
        updatePriorityArrows();

        // Filtre uygulanmışsa, görev tamamlanma durumuna göre görünür/gizli olsun
        applyFilter();

        updateStats();
        saveTasks();
    });

    // Görev metni
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = text;

    // Sağdaki butonlar (öncelik okları, düzenle, sil)
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.innerHTML = `
        <button class="priority-up-btn">▲</button>
        <button class="priority-down-btn">▼</button>
        <button class="edit-btn">✎</button>
        <button class="delete-btn">🗑️</button>
    `;

    // innerHTML ile eklenen butonlara erişmek için querySelector kullanıyoruz
    const priorityUpBtn = actions.querySelector('.priority-up-btn');
    const priorityDownBtn = actions.querySelector('.priority-down-btn');
    const editBtn = actions.querySelector('.edit-btn');
    const deleteBtn = actions.querySelector('.delete-btn');

    // Görevin önceliğine göre gereksiz oku gizler:
    // "high" -> zaten en üstte, ▲ gizlenir. "low" -> zaten en altta, ▼ gizlenir
    function updatePriorityArrows() {
        // Görev tamamlandıysa önceliğin bir önemi kalmaz, okların ikisi de gizlenir
        if (li.classList.contains('completed')) {
            priorityUpBtn.classList.add('hidden');
            priorityDownBtn.classList.add('hidden');
            return;
        }

        const index = PRIORITY_LEVELS.indexOf(li.dataset.priority);

        priorityUpBtn.classList.toggle('hidden', index === 0);
        priorityDownBtn.classList.toggle('hidden', index === PRIORITY_LEVELS.length - 1);
    }

    // Görevin önceliğini değiştirip listeyi yeniden sıralayan yardımcı fonksiyon
    function changeTaskPriority(newPriority) {
        // Eski öncelik class'ını kaldır, yenisini ekle
        li.classList.remove(`priority-${li.dataset.priority}`);
        li.classList.add(`priority-${newPriority}`);
        li.dataset.priority = newPriority;

        updatePriorityArrows();

        // Listeyi yeni önceliğe göre doğru sıraya koy
        insertTaskInOrder(li);

        saveTasks();
    }

    // Başlangıçtaki önceliğe göre doğru okları göster/gizle
    updatePriorityArrows();

    // ▲ -> önceliği bir seviye artırır (low -> normal -> high)
    priorityUpBtn.addEventListener('click', () => {
        const index = PRIORITY_LEVELS.indexOf(li.dataset.priority);
        changeTaskPriority(PRIORITY_LEVELS[index - 1]);
    });

    // ▼ -> önceliği bir seviye azaltır (high -> normal -> low)
    priorityDownBtn.addEventListener('click', () => {
        const index = PRIORITY_LEVELS.indexOf(li.dataset.priority);
        changeTaskPriority(PRIORITY_LEVELS[index + 1]);
    });

    // "Sil" butonuna tıklanınca görev satırını listeden kaldır
    deleteBtn.addEventListener('click', () => {
        li.remove(); // bu satırı (li) sayfadan tamamen kaldırır
        updateStats();
        saveTasks();
    });

    // "✎" butonuna tıklanınca satır içi düzenleme moduna geç/çık
    editBtn.addEventListener('click', () => {
        if (!li.classList.contains('editing')) {
            // --- ✎me moduna geç ---
            // task-text yerine, içinde mevcut metin olan bir input koy
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = taskText.textContent;

            // taskText'i sayfadan kaldırıp yerine editInput'u koy
            taskText.replaceWith(editInput);
            editInput.focus();

            editBtn.textContent = '💾';
            editBtn.classList.add('saving');
            li.classList.add('editing');
        } else {
            // --- Kaydet: input'taki yeni metni taskText'e geri yaz ---
            const editInput = li.querySelector('.edit-input');
            const newText = editInput.value.trim();

            // Boş bırakılırsa eski metni koru
            if (newText !== '') {
                taskText.textContent = newText;
            }

            // editInput'u kaldırıp yerine taskText'i geri koy
            editInput.replaceWith(taskText);

            editBtn.textContent = '✎';
            editBtn.classList.remove('saving');
            li.classList.remove('editing');

            saveTasks();
        }
    });

    li.appendChild(checkBtn);
    li.appendChild(taskText);
    li.appendChild(actions);

    return li;
}

// --- Bir görevin sıralamadaki "anahtarını" hesaplayan yardımcı fonksiyon ---
// Aktif görevler için anahtar 0/1/2 (öncelik sırası), tamamlanmış görevler için
// 10/11/12 olur -> böylece tamamlanmış görevler HER ZAMAN aktiflerden sonra gelir,
// kendi aralarında ise yine önceliğe göre sıralanırlar
function getSortKey(item) {
    const priorityOrder = PRIORITY_ORDER[item.dataset.priority];
    const completedBonus = item.classList.contains('completed') ? 10 : 0;
    return completedBonus + priorityOrder;
}

// --- Görevi doğru sıraya yerleştirme ---
// Liste her zaman: önce aktif görevler (yüksek -> normal -> düşük),
// sonra tamamlanmış görevler (yine yüksek -> normal -> düşük) şeklinde sıralı kalır
function insertTaskInOrder(li) {
    const newKey = getSortKey(li);

    // Listedeki mevcut görev satırlarını sırayla kontrol et
    const existingItems = taskList.querySelectorAll('.task-item');

    for (const item of existingItems) {
        const itemKey = getSortKey(item);

        // Yeni görevden DAHA SONRA gelmesi gereken ilk satırı bulunca,
        // yeni görevi onun hemen ÖNÜNE ekle
        if (itemKey > newKey) {
            taskList.insertBefore(li, item);
            return;
        }
    }

    // Buraya gelindiyse yeni görev en sona ait -> listenin en sonuna ekle
    taskList.appendChild(li);
}

// --- Seçili filtreye göre görevleri göster/gizle ---
function applyFilter() {
    const items = taskList.querySelectorAll('.task-item');

    items.forEach((item) => {
        const isCompleted = item.classList.contains('completed');

        // Filtreye göre bu görev gösterilmeli mi?
        let shouldShow = true;
        if (currentFilter === 'active') {
            shouldShow = !isCompleted;
        } else if (currentFilter === 'completed') {
            shouldShow = isCompleted;
        }

        // shouldShow false ise "hidden" class'ı ekle (CSS ile gizlenir)
        item.classList.toggle('hidden', !shouldShow);
    });
}

// --- İstatistik kutularını (Toplam / Aktif / Tamamlanan) güncelleme ---
function updateStats() {
    const total = taskList.querySelectorAll('.task-item').length;
    const completed = taskList.querySelectorAll('.task-item.completed').length;
    const active = total - completed;

    totalCountEl.textContent = total;
    activeCountEl.textContent = active;
    completedCountEl.textContent = completed;
}

// --- Görevleri localStorage'a kaydetme ---
function saveTasks() {
    const items = taskList.querySelectorAll('.task-item');

    // Her görevi basit bir objeye çevirip diziye ekliyoruz
    const tasks = [];
    items.forEach((item) => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            priority: item.dataset.priority,
            completed: item.classList.contains('completed')
        });
    });

    // localStorage sadece string saklayabilir, JSON.stringify ile diziyi metne çeviriyoruz
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// --- Sayfa açılınca localStorage'daki görevleri listeye geri yükleme ---
function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);

    // Daha önce kayıt yoksa hiçbir şey yapma
    if (!saved) {
        return;
    }

    const tasks = JSON.parse(saved);

    tasks.forEach((task) => {
        const li = createTaskElement(task.text, task.priority, task.completed);
        insertTaskInOrder(li);
    });

    applyFilter();
    updateStats();
}

// --- Yeni görev ekleme işlemi ---
function addTask() {
    // Başındaki/sonundaki boşlukları temizle
    const text = todoInput.value.trim();

    // Boş görev eklenmesin
    if (text === '') {
        return;
    }

    // İşaretli (seçili) öncelik radio'sunun value'sunu oku
    const selectedPriority = document.querySelector('input[name="priority"]:checked').value;

    const newTask = createTaskElement(text, selectedPriority);
    insertTaskInOrder(newTask);

    // Yeni görev de seçili filtreye göre gösterilsin/gizlensin
    applyFilter();

    updateStats();
    saveTasks();

    // Textarea'yı temizle ve önceliği tekrar "Normal"a getir
    todoInput.value = '';
    document.getElementById('priority-normal').checked = true;
    todoInput.focus();
}

// --- "Ekle" butonuna tıklanınca addTask fonksiyonunu çalıştır ---
addBtn.addEventListener('click', addTask);

// --- Filtre butonlarına (Tümü/Aktif/Tamamlanan) tıklanınca ---
filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // "active" class'ını önce tüm filtre butonlarından kaldır,
        // sonra sadece tıklanan butona ekle
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // data-filter özniteliğinden seçilen filtreyi oku ve uygula
        currentFilter = btn.dataset.filter;
        applyFilter();
    });
});

// --- "Tamamlananları Sil" butonuna tıklanınca ---
clearCompletedBtn.addEventListener('click', () => {
    const completedItems = taskList.querySelectorAll('.task-item.completed');

    completedItems.forEach((item) => item.remove());

    updateStats();
    saveTasks();
});

// --- Sayfa ilk açıldığında localStorage'daki görevleri yükle ---
loadTasks();
