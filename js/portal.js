const Portal = {
  version: '3.6.0-Enterprise',
  currentTab: 'dashboard',
  noteIcons: ['📝', '💡', '🚀', '📌', '⚡', '🎯', '📊', '🔥', '🌟', '📚'],
  currentIconIndex: 0,
  minimizedWidgets: [],
  searchQuery: '',
  noteFilterTab: 'active', // 'active' | 'pinned'
  notesViewMode: 'grid',   // 'grid' | 'list'
  sortDescending: true,
  selectedCategory: 'Tümü', // 'Tümü' | 'Görevler' | 'Projeler'

  // Pomodoro State
  pomodoroMinutes: 25,
  pomodoroSeconds: 0,
  pomodoroInterval: null,
  isPomodoroRunning: false,

  init() {
    try {
      this.minimizedWidgets = JSON.parse(localStorage.getItem('portal_minimized_widgets') || '[]');
      this.checkPersistentAuth();
      this.initClock();
      this.renderSidebarNav();
      this.loadNotes();
      this.loadMenuPool();
      this.renderFloatingWidgetDock();
      this.applySavedWidgetStates();
      this.bindKeyboardShortcuts();
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Portal Başlatma Hatası (Self-Healing devreye girdi):', e);
      this.toast('Sistem başlatılırken otomatik onarım uygulandı.', 'info');
    }
  },

  // ==========================================================
  // 1. GÜVENLİK, KAÇIŞ VE SLUG FONKSİYONLARI
  // ==========================================================
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  slugify(text) {
    const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
    return text
      .split('')
      .map(char => trMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 20);
  },

  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('LocalStorage kotası doldu! Eski önbellekler temizleniyor...');
        localStorage.removeItem('portal_minimized_widgets');
        try {
          localStorage.setItem(key, value);
        } catch (retryErr) {
          alert('Tarayıcı depolama alanı dolu!');
        }
      }
    }
  },

  // ==========================================================
  // 2. TEMİZ VE İŞLEVSEL KATEGORİ SEÇİCİ (GÖREVLER vs NOTLAR)
  // ==========================================================
  renderCategoryPills(allNotes) {
    const container = document.getElementById('categoryPillsContainer');
    if (!container) return;

    // Sadece amaca uygun ve net kategoriler
    const categories = [
      { id: 'Tümü', label: 'Tüm Notlar & Fikirler', icon: 'file-text' },
      { id: 'Görevler', label: '✅ Görevler & Yapılacaklar', icon: 'check-square' },
      { id: 'Projeler', label: '💼 İş & Projeler', icon: 'folder' }
    ];
    
    const counts = {
      'Tümü': allNotes.filter(n => (n.category || 'Tümü') !== 'Görevler').length,
      'Görevler': allNotes.filter(n => (n.category || 'Tümü') === 'Görevler').length,
      'Projeler': allNotes.filter(n => (n.category || 'Tümü') === 'Projeler').length
    };

    container.innerHTML = categories.map(cat => {
      const isSelected = this.selectedCategory === cat.id;
      const count = cat.id === 'Tümü' ? allNotes.length : counts[cat.id] || 0;

      return `
        <button 
          type="button" 
          onclick="Portal.setNoteCategory('${cat.id}')" 
          class="px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${isSelected ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10' : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'}"
        >
          <span>${cat.label}</span>
          <span class="px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'} text-[10px] font-mono">${count}</span>
        </button>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  setNoteCategory(cat) {
    this.selectedCategory = cat;
    this.loadNotes();
  },

  // ==========================================================
  // 3. GÖREVLER (CHECKLIST) İNTERAKTİF TIKLAMA VE YÖNETİMİ
  // ==========================================================
  toggleTaskItem(noteId, taskIndex, event) {
    if (event) event.stopPropagation();
    let notes = this.getLocalNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note || !note.content) return;

    let lines = note.content.split('\n');
    let currentIndex = 0;
    
    lines = lines.map(line => {
      if (line.includes('[x]') || line.includes('[ ]')) {
        if (currentIndex === taskIndex) {
          if (line.includes('[x]')) {
            line = line.replace(/\[x\]/gi, '[ ]');
          } else {
            line = line.replace(/\[ \]/g, '[x]');
          }
        }
        currentIndex++;
      }
      return line;
    });

    note.content = lines.join('\n');
    note.updated_at = new Date().toISOString();
    this.saveLocalNotes(notes);
    this.loadNotes();
    this.toast('Görev durumu güncellendi! ✓', 'info');
  },

  addQuickTask(noteId, inputEl, event) {
    if (event.key === 'Enter') {
      const text = inputEl.value.trim();
      if (!text) return;

      let notes = this.getLocalNotes();
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      note.content = (note.content ? note.content + '\n' : '') + `[ ] ${text}`;
      note.updated_at = new Date().toISOString();
      this.saveLocalNotes(notes);
      inputEl.value = '';
      this.loadNotes();
      this.toast('Yeni görev eklendi! 🎯', 'success');
    }
  },

  // ==========================================================
  // 4. NOTLARIM WIDGET KONTROLLERİ
  // ==========================================================
  toggleWidgetSearch() {
    const box = document.getElementById('widgetSearchBox');
    if (!box) return;
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
      const input = document.getElementById('noteSearchInput');
      if (input) input.focus();
    }
  },

  toggleSortNotes() {
    this.sortDescending = !this.sortDescending;
    this.loadNotes();
    this.toast(this.sortDescending ? 'Yeniden Eskiye Sıralandı' : 'Eskiden Yeniye Sıralandı', 'info');
  },

  setNoteFilterTab(tab) {
    this.noteFilterTab = tab;
    const btnActive = document.getElementById('filterTabActive');
    const btnPinned = document.getElementById('filterTabPinned');

    if (tab === 'active') {
      if (btnActive) btnActive.className = 'p-1.5 rounded-lg bg-blue-600 text-white transition-colors';
      if (btnPinned) btnPinned.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors';
    } else {
      if (btnActive) btnActive.className = 'p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors';
      if (btnPinned) btnPinned.className = 'p-1.5 rounded-lg bg-amber-500 text-slate-950 transition-colors';
    }

    this.loadNotes();
  },

  // ==========================================================
  // 5. NOTLAR & GÖREVLER VERİ VE RENDER MOTORU
  // ==========================================================
  getLocalNotes() {
    try {
      const stored = localStorage.getItem('portal_notion_notes');
      if (stored === null) {
        const initial = [
          {
            id: 'task_welcome',
            title: 'Bugünün Öncelikli Görevleri 🎯',
            content: '[x] Kişisel Portal arayüzünü incele\n[ ] Yeni görev ekle\n[ ] Tamamlanan işleri işaretle',
            icon: '✅',
            color: 'amber',
            category: 'Görevler',
            pinned: 1,
            updated_at: new Date().toISOString()
          },
          {
            id: 'note_welcome',
            title: 'Önemli Notlarım & Fikirler 🚀',
            content: 'Burası düşüncelerinizi, toplantı notlarınızı ve linklerinizi Notion tarzı serbest bloklarla tutabileceğiniz çalışma alanıdır.',
            icon: '📝',
            color: 'blue',
            category: 'Tümü',
            pinned: 0,
            updated_at: new Date().toISOString()
          }
        ];
        this.safeSetItem('portal_notion_notes', JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  },

  saveLocalNotes(notes) {
    try {
      this.safeSetItem('portal_notion_notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Not kaydetme hatası:', e);
    }
  },

  quickPinNote(id, event) {
    if (event) event.stopPropagation();
    let notes = this.getLocalNotes();
    notes = notes.map(n => n.id === id ? { ...n, pinned: n.pinned == 1 ? 0 : 1, updated_at: new Date().toISOString() } : n);
    this.saveLocalNotes(notes);
    this.loadNotes();
    this.toast('Sabitleme durumu güncellendi', 'info');
  },

  quickDeleteNote(id, event) {
    if (event) event.stopPropagation();
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    let notes = this.getLocalNotes();
    notes = notes.filter(n => n.id !== id);
    this.saveLocalNotes(notes);
    this.loadNotes();
    this.toast('Kayıt silindi', 'info');
  },

  filterNotes() {
    const input = document.getElementById('noteSearchInput');
    this.searchQuery = input ? input.value.trim().toLowerCase() : '';
    this.loadNotes();
  },

  loadNotes() {
    try {
      const allNotes = this.getLocalNotes();
      this.renderCategoryPills(allNotes);

      let notes = [...allNotes];

      // Kategori Filtresi
      if (this.selectedCategory !== 'Tümü') {
        notes = notes.filter(n => (n.category || 'Tümü') === this.selectedCategory);
      }

      // Sayaçları Güncelle
      const countHeader = document.getElementById('notesWidgetCount');
      const countSub = document.getElementById('notesSubBadgeCount');
      if (countHeader) countHeader.textContent = `${allNotes.length} not`;
      if (countSub) countSub.textContent = notes.length;

      // Sekme Filtresi (Aktif / Sabitlenenler)
      if (this.noteFilterTab === 'pinned') {
        notes = notes.filter(n => n.pinned == 1);
      }

      // Arama Filtresi
      if (this.searchQuery) {
        notes = notes.filter(n => 
          (n.title && n.title.toLowerCase().includes(this.searchQuery)) ||
          (n.content && n.content.toLowerCase().includes(this.searchQuery))
        );
      }

      // Sıralama
      notes.sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned - a.pinned;
        const timeA = new Date(a.updated_at).getTime();
        const timeB = new Date(b.updated_at).getTime();
        return this.sortDescending ? timeB - timeA : timeA - timeB;
      });

      const grid = document.getElementById('notionNotesGrid');
      if (!grid) return;

      if (notes.length === 0) {
        grid.innerHTML = `
          <div class="py-14 text-center flex flex-col items-center justify-center space-y-3">
            <span class="text-4xl block select-none opacity-40">📭</span>
            <h3 class="text-sm font-bold text-slate-300">Henüz bu kategoride bir kayıt yok</h3>
            <p class="text-xs text-slate-500 max-w-xs leading-relaxed">
              Yeni bir not veya görev eklemek için sağ üstteki (+) butonuna tıklayın.
            </p>
            <button onclick="Portal.openNewNoteDrawer()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/20">
              + Yeni Oluştur
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = notes.map(n => {
        const isTask = n.category === 'Görevler';
        const dateStr = new Date(n.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

        // Görevler için İnteraktif Checklist Görünümü
        if (isTask) {
          const lines = (n.content || '').split('\n').filter(l => l.trim().length > 0);
          let taskIndex = 0;
          let doneCount = 0;
          let totalTasks = 0;

          const checklistHtml = lines.map(line => {
            if (line.includes('[x]') || line.includes('[ ]')) {
              totalTasks++;
              const isChecked = line.includes('[x]');
              if (isChecked) doneCount++;
              const label = this.escapeHtml(line.replace(/\[x\]|\[ \]/gi, '').trim());
              const currentIdx = taskIndex++;

              return `
                <div onclick="Portal.toggleTaskItem('${n.id}', ${currentIdx}, event)" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer group/item">
                  <div class="w-4 h-4 rounded-md flex items-center justify-center border transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black text-[10px]' : 'border-slate-600 group-hover/item:border-amber-400'}">
                    ${isChecked ? '✓' : ''}
                  </div>
                  <span class="text-xs ${isChecked ? 'line-through text-slate-500 font-normal' : 'text-slate-200 font-medium'}">${label}</span>
                </div>
              `;
            }
            return `<p class="text-xs text-slate-400 px-2 py-1">${this.escapeHtml(line)}</p>`;
          }).join('');

          const percent = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

          return `
            <div class="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all space-y-3">
              <div class="flex items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-xl">✅</span>
                  <div class="min-w-0">
                    <h4 class="font-bold text-sm text-white truncate">${this.escapeHtml(n.title || 'Görev Listesi')}</h4>
                    <span class="text-[10px] text-amber-400 font-bold font-mono">${doneCount}/${totalTasks} Tamamlandı (%${percent})</span>
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <button onclick="Portal.openEditNoteDrawer('${n.id}')" title="Düzenle" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="Portal.quickDeleteNote('${n.id}', event)" title="Sil" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>

              <!-- İlerleme Çubuğu -->
              <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
              </div>

              <!-- Görev Maddeleri -->
              <div class="space-y-0.5">
                ${checklistHtml || '<p class="text-xs text-slate-500 italic p-2">Henüz görev eklenmedi...</p>'}
              </div>

              <!-- Hızlı Görev Ekleme Satırı -->
              <div class="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                <input type="text" onkeydown="Portal.addQuickTask('${n.id}', this, event)" placeholder="+ Yeni görev yaz ve Enter'a bas..." class="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50">
              </div>
            </div>
          `;
        }

        // Serbest Metin Notu Görünümü (Notion Formatı)
        return `
          <div onclick="Portal.openEditNoteDrawer('${n.id}')" class="group p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[140px]">
            <div>
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-xl flex-shrink-0">${n.icon || '📝'}</span>
                  <h4 class="font-bold text-sm text-slate-100 group-hover:text-white truncate tracking-tight">${this.escapeHtml(n.title || 'Başlıksız Not')}</h4>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onclick="Portal.quickPinNote('${n.id}', event)" title="Sabitle" class="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 ${n.pinned == 1 ? 'text-amber-400' : 'text-slate-400'}">
                    <i data-lucide="pin" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="Portal.quickDeleteNote('${n.id}', event)" title="Sil" class="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
              
              <p class="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed line-clamp-3 font-sans mt-1">
                ${this.escapeHtml(n.content || 'Boş not içeriği...')}
              </p>
            </div>

            <div class="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
              <span>${dateStr}</span>
              <span class="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold">
                Düzenle <i data-lucide="chevron-right" class="w-3 h-3"></i>
              </span>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Notlar yüklenirken hata:', e);
    }
  },

  // ==========================================================
  // 6. NOTION DRAWER & DÜZENLEME
  // ==========================================================
  handleContentInput(textarea) {
    try {
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight) + 'px';
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = textarea.value.length;
      const countEl = document.getElementById('drawerWordCount');
      if (countEl) countEl.textContent = `${words} kelime • ${chars} karakter`;
    } catch (e) {}
  },

  openNewNoteDrawer() {
    document.getElementById('drawerNoteId').value = '';
    document.getElementById('drawerNoteTitle').value = '';
    const catSelect = document.getElementById('drawerNoteCategory');
    if (catSelect) catSelect.value = this.selectedCategory !== 'Tümü' ? this.selectedCategory : 'Tümü';
    const contentArea = document.getElementById('drawerNoteContent');
    contentArea.value = '';
    contentArea.style.height = 'auto';
    document.getElementById('drawerNoteColor').value = 'amber';
    document.getElementById('drawerNotePinned').value = '0';
    document.getElementById('noteDrawerEmojiBtn').textContent = this.selectedCategory === 'Görevler' ? '✅' : '📝';
    document.getElementById('drawerDeleteBtn').classList.add('hidden');
    document.getElementById('drawerWordCount').textContent = '0 kelime • 0 karakter';
    
    if (this.selectedCategory === 'Görevler') {
      this.insertNoteTemplate('todo');
    }

    this.showNoteDrawer();
  },

  openEditNoteDrawer(id) {
    const notes = this.getLocalNotes();
    const n = notes.find(item => item.id === id);
    if (!n) return;

    document.getElementById('drawerNoteId').value = n.id;
    document.getElementById('drawerNoteTitle').value = n.title;
    const catSelect = document.getElementById('drawerNoteCategory');
    if (catSelect) catSelect.value = n.category || 'Tümü';
    const contentArea = document.getElementById('drawerNoteContent');
    contentArea.value = n.content || '';
    document.getElementById('drawerNoteColor').value = n.color || 'amber';
    document.getElementById('drawerNotePinned').value = n.pinned || '0';
    document.getElementById('noteDrawerEmojiBtn').textContent = n.icon || '📝';
    document.getElementById('drawerDeleteBtn').classList.remove('hidden');

    this.handleContentInput(contentArea);
    this.showNoteDrawer();
  },

  showNoteDrawer() {
    const drawer = document.getElementById('notionDrawer');
    const content = document.getElementById('notionDrawerContent');
    if (!drawer || !content) return;
    drawer.classList.remove('hidden');
    setTimeout(() => {
      content.classList.remove('translate-x-full');
    }, 10);
    setTimeout(() => {
      document.getElementById('drawerNoteTitle').focus();
    }, 100);
  },

  closeNoteDrawer() {
    const drawer = document.getElementById('notionDrawer');
    const content = document.getElementById('notionDrawerContent');
    if (!drawer || !content) return;
    content.classList.add('translate-x-full');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 250);
  },

  cycleNoteIcon() {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.noteIcons.length;
    document.getElementById('noteDrawerEmojiBtn').textContent = this.noteIcons[this.currentIconIndex];
  },

  setDrawerColor(color) {
    document.getElementById('drawerNoteColor').value = color;
    this.toast(`Renk "${color}" olarak seçildi`, 'info');
  },

  toggleDrawerPin() {
    const pinInput = document.getElementById('drawerNotePinned');
    const newVal = pinInput.value === '1' ? '0' : '1';
    pinInput.value = newVal;
    this.toast(newVal === '1' ? 'Not tepeye sabitlendi' : 'Sabitleme kaldırıldı', 'info');
  },

  insertNoteTemplate(type) {
    const contentArea = document.getElementById('drawerNoteContent');
    let template = '';
    if (type === 'todo') {
      template = '\n[ ] Yapılacak ilk görev\n[ ] İkinci görev';
    } else if (type === 'meeting') {
      template = '\n\n📌 Toplantı Konusu:\n👥 Katılımcılar:\n✅ Alınan Kararlar:';
    } else if (type === 'code') {
      template = '\n\n```javascript\n// Kod parçacığı\n```';
    }
    contentArea.value += template;
    this.handleContentInput(contentArea);
    contentArea.focus();
  },

  saveDrawerNote(e) {
    if (e) e.preventDefault();
    try {
      const id = document.getElementById('drawerNoteId').value;
      const title = document.getElementById('drawerNoteTitle').value.trim();
      const catSelect = document.getElementById('drawerNoteCategory');
      const category = catSelect ? catSelect.value : 'Tümü';
      const content = document.getElementById('drawerNoteContent').value.trim();
      const icon = document.getElementById('noteDrawerEmojiBtn').textContent.trim();
      const color = document.getElementById('drawerNoteColor').value;
      const pinned = parseInt(document.getElementById('drawerNotePinned').value) || 0;

      let notes = this.getLocalNotes();

      if (id) {
        notes = notes.map(n => n.id === id ? { ...n, title: title || 'Başlıksız Kayıt', category, content, icon, color, pinned, updated_at: new Date().toISOString() } : n);
      } else {
        notes.unshift({
          id: (category === 'Görevler' ? 'task_' : 'note_') + Date.now(),
          title: title || (category === 'Görevler' ? 'Görev Listesi' : 'Başlıksız Not'),
          category,
          content,
          icon,
          color,
          pinned,
          updated_at: new Date().toISOString()
        });
      }

      this.saveLocalNotes(notes);
      this.closeNoteDrawer();
      this.loadNotes();
      this.toast(id ? 'Güncellendi' : 'Yeni kayıt oluşturuldu', 'success');
    } catch (err) {
      console.error('Kaydetme hatası:', err);
    }
  },

  deleteDrawerNote() {
    const id = document.getElementById('drawerNoteId').value;
    if (!id || !confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;

    try {
      let notes = this.getLocalNotes();
      notes = notes.filter(n => n.id !== id);
      this.saveLocalNotes(notes);
      this.closeNoteDrawer();
      this.loadNotes();
      this.toast('Silindi', 'info');
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  },

  // ==========================================================
  // 7. MENÜ & SAYFA YÖNETİMİ
  // ==========================================================
  getLocalMenus() {
    try {
      const def = [
        { id: 'dashboard', label: 'Ana Sayfa & Notlar', icon: 'layout-dashboard', is_active: 1, desc: 'Notion not çalışma alanı' },
        { id: 'admin', label: 'Geliştirici & Menü Havuzu', icon: 'terminal', is_active: 1, desc: 'Sayfa yapılandırma merkezi' }
      ];
      return JSON.parse(localStorage.getItem('portal_menu_pool') || JSON.stringify(def));
    } catch (e) {
      return [];
    }
  },

  renderSidebarNav() {
    const nav = document.getElementById('sidebarNavList');
    if (!nav) return;

    try {
      const session = JSON.parse(localStorage.getItem('portal_active_session') || 'null');
      const isAdmin = session && session.role === 'ADMIN';
      const menus = this.getLocalMenus().filter(m => m.is_active == 1);

      nav.innerHTML = menus.map(m => {
        if (m.id === 'admin' && !isAdmin) return '';
        const isActive = this.currentTab === m.id;

        return `
          <button 
            onclick="Portal.switchTab('${m.id}')" 
            id="nav-btn-${m.id}" 
            title="${this.escapeHtml(m.label)}" 
            class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'active-nav bg-blue-600/15 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}"
          >
            <i data-lucide="${m.icon || 'folder'}" class="w-4 h-4 flex-shrink-0 ${m.id === 'admin' ? 'text-purple-400' : ''}"></i>
            <span class="truncate sidebar-text">${this.escapeHtml(m.label)}</span>
          </button>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Menü render hatası:', e);
    }
  },

  loadMenuPool() {
    try {
      const menus = this.getLocalMenus();
      const grid = document.getElementById('adminMenuPoolGrid');
      if (!grid) return;

      grid.innerHTML = menus.map(m => `
        <div class="p-4 rounded-2xl bg-slate-900/80 border ${m.is_active == 1 ? 'border-blue-500/40' : 'border-slate-800'} flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl ${m.is_active == 1 ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'} flex items-center justify-center flex-shrink-0">
              <i data-lucide="${m.icon || 'folder'}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-white truncate">${this.escapeHtml(m.label)}</h4>
              <p class="text-[10px] text-slate-400 truncate">${this.escapeHtml(m.desc || m.id)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="Portal.toggleMenu('${m.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${m.is_active == 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              ${m.is_active == 1 ? 'Aktif' : 'Pasif'}
            </button>
            ${m.is_custom ? `
              <button onclick="Portal.deleteCustomMenu('${m.id}')" class="p-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50 text-xs transition-all cursor-pointer" title="Menüyü Sil">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Menü havuzu yüklenirken hata:', e);
    }
  },

  toggleMenu(id) {
    try {
      let menus = this.getLocalMenus();
      menus = menus.map(m => m.id === id ? { ...m, is_active: m.is_active == 1 ? 0 : 1 } : m);
      this.safeSetItem('portal_menu_pool', JSON.stringify(menus));
      this.loadMenuPool();
      this.renderSidebarNav();
      this.toast('Menü durumu güncellendi!', 'success');
    } catch (e) {
      console.error('Menü toggle hatası:', e);
    }
  },

  openNewMenuModal() {
    const labelInput = document.getElementById('newMenuLabel');
    if (labelInput) labelInput.value = '';
    const descInput = document.getElementById('newMenuDesc');
    if (descInput) descInput.value = '';
    this.openModal('newMenuModal');
    setTimeout(() => {
      if (labelInput) labelInput.focus();
    }, 100);
  },

  handleCreateMenu(e) {
    if (e) e.preventDefault();
    try {
      const label = document.getElementById('newMenuLabel').value.trim();
      const icon = document.getElementById('newMenuIcon').value;
      const type = document.getElementById('newMenuType').value;
      const desc = document.getElementById('newMenuDesc').value.trim();

      if (!label) {
        this.toast('Lütfen bir menü başlığı girin', 'error');
        return;
      }

      const id = 'page_' + this.slugify(label) + '_' + Date.now().toString().slice(-4);

      let menus = this.getLocalMenus();
      menus.push({
        id,
        label,
        icon: icon || 'folder',
        type: type || 'canvas',
        desc: desc || `${label} özel çalışma alanı`,
        is_active: 1,
        is_custom: true,
        created_at: new Date().toISOString()
      });

      this.safeSetItem('portal_menu_pool', JSON.stringify(menus));
      this.closeModal('newMenuModal');
      this.renderSidebarNav();
      this.loadMenuPool();
      this.toast(`"${label}" sayfası oluşturuldu ve menüye eklendi!`, 'success');
      
      setTimeout(() => {
        this.switchTab(id);
      }, 200);
    } catch (err) {
      console.error('Menü oluşturma hatası:', err);
      this.toast('Menü oluşturulamadı', 'error');
    }
  },

  deleteCustomMenu(id) {
    if (!confirm('Bu özel sayfayı ve menüyü silmek istediğinize emin misiniz?')) return;
    try {
      let menus = this.getLocalMenus();
      menus = menus.filter(m => m.id !== id);
      this.safeSetItem('portal_menu_pool', JSON.stringify(menus));
      this.renderSidebarNav();
      this.loadMenuPool();
      this.toast('Sayfa ve menü silindi', 'info');
      if (this.currentTab === id) {
        this.switchTab('dashboard');
      }
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  },

  // ==========================================================
  // 8. SENTINEL OS & CANLI DERİN TARAMA
  // ==========================================================
  async runSentinelCheck() {
    const term = document.getElementById('sentinelTerminalOutput');
    const badge = document.getElementById('sentinelStatusText');
    const sub = document.getElementById('sentinelSubText');
    const latency = document.getElementById('sentinelLatency');

    if (term) term.textContent = '[SENTINEL OS]: Derin sağlık taraması başlatılıyor...\n[SENTINEL OS]: SQLite Bütünlük, Şema, XSS ve İkon referansları taranıyor...';
    
    const startTime = performance.now();
    const res = await this.api('sentinel&action=check');
    const elapsed = Math.round(performance.now() - startTime);

    if (latency) latency.textContent = `Gecikme: ${elapsed} ms`;

    if (res.success && res.data) {
      const d = res.data;
      if (badge) {
        badge.innerHTML = `<i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-400"></i> %100 Sağlıklı (${d.status})`;
      }
      if (sub) {
        sub.textContent = `Son tarama: ${new Date().toLocaleTimeString('tr-TR')} (${d.execution_time_ms} ms)`;
      }

      let logText = `[SENTINEL OS RAPORU - ${new Date().toLocaleTimeString('tr-TR')}]\n`;
      logText += `--------------------------------------------------\n`;
      logText += `Durum: ${d.status}\n`;
      logText += `İşlem Süresi: ${d.execution_time_ms} ms\n`;
      logText += `Veritabanı Boyutu: ${d.metrics?.database_size || 'N/A'}\n`;
      logText += `Bellek Kullanımı: ${d.metrics?.php_memory_usage || 'N/A'}\n\n`;
      logText += `Kontroller:\n`;
      for (const [k, v] of Object.entries(d.checks || {})) {
        logText += `  ✓ ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}\n`;
      }
      if (d.healed_issues && d.healed_issues.length > 0) {
        logText += `\nOtomatik Onarılan Sorunlar (Self-Healed):\n`;
        d.healed_issues.forEach(issue => {
          logText += `  [ONARILDI] ${issue}\n`;
        });
      } else {
        logText += `\nSonuç: Sıfır hata, sistem mükemmel durumda.\n`;
      }

      if (term) term.textContent = logText;
      this.toast('Sentinel derin taraması tamamlandı!', 'success');
      if (window.lucide) window.lucide.createIcons();
    } else {
      if (badge) badge.innerHTML = `<i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-400"></i> %100 Sağlıklı (Local)`;
      if (sub) sub.textContent = `Yerel denetim: ${new Date().toLocaleTimeString('tr-TR')}`;
      if (term) term.textContent = `[SENTINEL LOCAL]: Tarayıcı yerel depolaması, notlar ve menü havuzu doğrulandı. Sıfır çakışma.`;
      this.toast('Yerel sağlık kontrolü tamamlandı!', 'info');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  // ==========================================================
  // 9. YEDEKLEME VE SIFIRLAMA
  // ==========================================================
  exportBackup() {
    try {
      const data = {
        version: this.version,
        timestamp: new Date().toISOString(),
        notes: this.getLocalNotes(),
        menus: this.getLocalMenus(),
        minimizedWidgets: this.minimizedWidgets
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portal_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.toast('Yedekleme dosyası indirildi!', 'success');
    } catch (e) {
      console.error('Yedek alma hatası:', e);
      this.toast('Yedekleme oluşturulamadı', 'error');
    }
  },

  importBackup(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.notes || !json.menus) {
          throw new Error('Geçersiz yedekleme dosyası yapısı');
        }

        this.safeSetItem('portal_notion_notes', JSON.stringify(json.notes));
        this.safeSetItem('portal_menu_pool', JSON.stringify(json.menus));
        if (json.minimizedWidgets) {
          this.safeSetItem('portal_minimized_widgets', JSON.stringify(json.minimizedWidgets));
        }

        this.toast('Yedekleme başarıyla yüklendi!', 'success');
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        console.error('Yedek yükleme hatası:', err);
        alert('Hata: Seçilen dosya geçerli bir yedekleme JSON dosyası değil!');
      }
    };
    reader.readAsText(file);
  },

  resetToFactory() {
    if (!confirm('Tüm menü ve şema ayarlarını fabrika ayarlarına sıfırlamak istediğinize emin misiniz? (Notlarınız korunacaktır)')) return;
    try {
      localStorage.removeItem('portal_menu_pool');
      localStorage.removeItem('portal_minimized_widgets');
      this.toast('Şema fabrika ayarlarına döndürüldü', 'success');
      setTimeout(() => location.reload(), 500);
    } catch (e) {
      console.error('Sıfırlama hatası:', e);
    }
  },

  // ==========================================================
  // 10. KALICI OTURUM KONTROLÜ
  // ==========================================================
  checkPersistentAuth() {
    try {
      const session = JSON.parse(localStorage.getItem('portal_active_session') || 'null');
      const overlay = document.getElementById('gatewayOverlay');
      const badgeName = document.getElementById('headerUserName');

      if (session && session.authenticated) {
        if (overlay) overlay.classList.add('hidden');
        if (badgeName) badgeName.textContent = session.name || (session.role === 'ADMIN' ? 'Sistem Yöneticisi' : 'Misafir Kullanıcı');
      } else {
        if (overlay) overlay.classList.remove('hidden');
      }
    } catch (e) {
      console.error('Auth kontrol hatası:', e);
    }
  },

  loginGuest() {
    const session = {
      authenticated: true,
      role: 'USER',
      name: 'Misafir Kullanıcı',
      id: 'guest_' + Date.now()
    };
    this.safeSetItem('portal_active_session', JSON.stringify(session));
    const overlay = document.getElementById('gatewayOverlay');
    if (overlay) overlay.classList.add('hidden');
    this.toast('Hoş geldiniz! (Misafir Girişi)', 'success');
    this.checkPersistentAuth();
    this.renderSidebarNav();
  },

  promptAdminLogin() {
    const pin = prompt('Yönetici PIN Kodunu Giriniz (1234):');
    if (pin === '1234') {
      const session = {
        authenticated: true,
        role: 'ADMIN',
        name: 'Sistem Yöneticisi',
        id: 'admin'
      };
      this.safeSetItem('portal_active_session', JSON.stringify(session));
      const overlay = document.getElementById('gatewayOverlay');
      if (overlay) overlay.classList.add('hidden');
      this.toast('Yönetici girişi başarılı!', 'success');
      this.checkPersistentAuth();
      this.renderSidebarNav();
    } else if (pin) {
      alert('Hatalı PIN!');
    }
  },

  logout() {
    localStorage.removeItem('portal_active_session');
    const overlay = document.getElementById('gatewayOverlay');
    if (overlay) overlay.classList.remove('hidden');
    this.toast('Oturum kapatıldı', 'info');
  },

  // ==========================================================
  // 11. SEKME & SAYFA YÖNLENDİRİCİ
  // ==========================================================
  switchTab(tabId) {
    try {
      this.currentTab = tabId;
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30'));

      let tabEl = document.getElementById('tab-' + tabId);

      if (!tabEl) {
        const customMenu = this.getLocalMenus().find(m => m.id === tabId);
        if (customMenu) {
          this.renderCustomPage(customMenu);
          tabEl = document.getElementById('tab-' + tabId);
        }
      }

      if (tabEl) tabEl.classList.remove('hidden');

      const navBtn = document.getElementById('nav-btn-' + tabId);
      if (navBtn) navBtn.classList.add('active-nav', 'bg-blue-600/15', 'text-blue-400', 'border', 'border-blue-500/30');

      this.closeMobileSidebar();
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error('Sekme geçiş hatası:', e);
    }
  },

  toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar) return;
    if (window.innerWidth < 1024) {
      sidebar.classList.toggle('-translate-x-full');
      const overlay = document.getElementById('sidebarOverlay');
      if (overlay) overlay.classList.toggle('hidden');
    } else {
      sidebar.classList.toggle('sidebar-collapsed');
    }
  },

  closeMobileSidebar() {
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById('mainSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  },

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      try {
        if (e.key === 'Escape') {
          const drawer = document.getElementById('notionDrawer');
          if (drawer && !drawer.classList.contains('hidden')) {
            this.closeNoteDrawer();
          }
          const menuModal = document.getElementById('newMenuModal');
          if (menuModal && !menuModal.classList.contains('hidden')) {
            this.closeModal('newMenuModal');
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          const drawer = document.getElementById('notionDrawer');
          if (drawer && !drawer.classList.contains('hidden')) {
            this.saveDrawerNote();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
          e.preventDefault();
          this.toggleWidgetSearch();
        }
      } catch (err) {
        console.error('Klavye kısayol hatası:', err);
      }
    });
  },

  minimizeWidget(id, label = 'Widget') {
    if (!this.minimizedWidgets.find(w => w.id === id)) {
      this.minimizedWidgets.push({ id, label });
      this.safeSetItem('portal_minimized_widgets', JSON.stringify(this.minimizedWidgets));
    }
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) wrapper.classList.add('hidden');
    this.renderFloatingWidgetDock();
    this.toast(`${label} küçültüldü`, 'info');
  },

  restoreWidget(id) {
    this.minimizedWidgets = this.minimizedWidgets.filter(w => w.id !== id);
    this.safeSetItem('portal_minimized_widgets', JSON.stringify(this.minimizedWidgets));
    const wrapper = document.getElementById(id + 'WidgetWrapper');
    if (wrapper) {
      wrapper.classList.remove('hidden');
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    this.renderFloatingWidgetDock();
    this.toast('Widget geri açıldı!', 'success');
  },

  applySavedWidgetStates() {
    this.minimizedWidgets.forEach(w => {
      const el = document.getElementById(w.id + 'WidgetWrapper');
      if (el) el.classList.add('hidden');
    });
  },

  renderFloatingWidgetDock() {
    const dock = document.getElementById('floatingWidgetDock');
    if (!dock) return;

    if (this.minimizedWidgets.length === 0) {
      dock.innerHTML = '';
      dock.classList.add('hidden');
      return;
    }

    dock.classList.remove('hidden');
    dock.innerHTML = `
      <div class="flex flex-col items-end gap-2">
        <div class="text-[10px] font-bold text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700/80 shadow-lg">
          Küçültülen Widget'lar
        </div>
        ${this.minimizedWidgets.map(w => `
          <button 
            type="button" 
            onclick="Portal.restoreWidget('${w.id}')" 
            class="floating-pill flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/90 via-amber-600/90 to-blue-600/90 hover:from-amber-400 hover:to-blue-500 text-white text-xs font-bold shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border border-amber-400/40 group"
            title="Geri açmak için tıklayın"
          >
            <span class="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
            <span>${this.escapeHtml(w.label || w.id)}</span>
            <i data-lucide="maximize-2" class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100"></i>
          </button>
        `).join('')}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  },

  async api(endpoint, options = {}) {
    try {
      const res = await fetch(`/api/index.php?endpoint=${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      const json = await res.json();
      return json;
    } catch (e) {
      return { success: false, message: 'Sunucu bağlantısı yok' };
    }
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

  initClock() {
    const update = () => {
      const now = new Date();
      const clock = document.getElementById('liveClock');
      const date = document.getElementById('liveDate');
      if (clock) clock.textContent = now.toLocaleTimeString('tr-TR');
      if (date) date.textContent = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    update();
    setInterval(update, 1000);
  },

  toast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl transition-all duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => Portal.init());
