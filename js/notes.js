/**
 * Notes Module - Hızlı Notlar ve Toplantı Karalamaları
 */

class NoteManager {
  constructor() {
    this.notes = window.appStorage.get(STORAGE_KEYS.NOTES, []);
  }

  getNotes() {
    return this.notes;
  }

  addNote(title, content, color = 'blue') {
    const newNote = {
      id: 'note_' + Date.now(),
      title: title.trim() || 'Başlıksız Not',
      content: content.trim(),
      color: color,
      pinned: false,
      updatedAt: new Date().toISOString()
    };

    this.notes.unshift(newNote);
    this.save();
    return newNote;
  }

  updateNote(id, title, content, color) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      if (title !== undefined) note.title = title.trim() || 'Başlıksız Not';
      if (content !== undefined) note.content = content.trim();
      if (color !== undefined) note.color = color;
      note.updatedAt = new Date().toISOString();
      this.save();
    }
  }

  togglePin(id) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.pinned = !note.pinned;
      this.save();
    }
  }

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.save();
  }

  save() {
    window.appStorage.save(STORAGE_KEYS.NOTES, this.notes);
  }

  getColorClasses(color) {
    switch (color) {
      case 'purple':
        return {
          card: 'bg-[#1c1724] border-[#432d54]/70 hover:border-[#6b4787] text-purple-100',
          badge: 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
        };
      case 'amber':
      case 'yellow':
        return {
          card: 'bg-[#221c14] border-[#4d3b1e]/70 hover:border-[#7c5f31] text-amber-100',
          badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
        };
      case 'emerald':
      case 'green':
        return {
          card: 'bg-[#141e17] border-[#21432c]/70 hover:border-[#366c47] text-emerald-100',
          badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
        };
      case 'pink':
        return {
          card: 'bg-[#22161c] border-[#4e2636]/70 hover:border-[#7c3d56] text-rose-100',
          badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
        };
      default:
        return {
          card: 'bg-[#161a22] border-[#29364b]/70 hover:border-[#425777] text-slate-100',
          badge: 'bg-slate-500/15 text-slate-300 border border-slate-500/25'
        };
    }
  }

  renderNotesList(containerId = null) {
    const targets = containerId 
      ? [containerId] 
      : ['notesListContainer', 'notesListFullContainer'];

    targets.forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;

      // Pinned first, then by updatedAt
      const sorted = [...this.notes].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      if (sorted.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-12 px-4">
            <div class="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-700/60">
              <i data-lucide="file-text" class="w-7 h-7"></i>
            </div>
            <p class="text-slate-300 font-medium text-base">Henüz kayıtlı bir not yok</p>
            <p class="text-slate-400 text-sm mt-1">Hızlı toplantı karalamaları veya fikirlerinizi buraya ekleyin.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = sorted.map(note => {
        const colors = this.getColorClasses(note.color);
        const formattedDate = new Date(note.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

        return `
          <div class="item-enter bg-slate-800/60 rounded-xl p-4 flex flex-col justify-between ${colors.card} transition-all relative group">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <h4 class="font-bold text-slate-100 text-base leading-snug break-words flex-1">${escapeHtml(note.title)}</h4>
                <div class="flex items-center space-x-1 flex-shrink-0">
                  <button onclick="window.noteManager.handlePin('${note.id}')" title="${note.pinned ? 'Sabitlemeyi Kaldır' : 'Başa Sabitle'}" class="p-1 rounded-lg ${note.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'} transition-colors">
                    <i data-lucide="pin" class="w-4 h-4 ${note.pinned ? 'fill-amber-400/30' : ''}"></i>
                  </button>
                  <button onclick="window.noteManager.handleCopy('${note.id}')" title="Metni Kopyala" class="p-1 rounded-lg text-slate-500 hover:text-blue-400 transition-colors">
                    <i data-lucide="copy" class="w-4 h-4"></i>
                  </button>
                  <button onclick="window.noteManager.handleDelete('${note.id}')" title="Notu Sil" class="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <p class="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed break-words font-normal mb-4">${escapeHtml(note.content)}</p>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 mt-auto">
              <span>${formattedDate}</span>
              <span class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider ${colors.badge}">Not</span>
            </div>
          </div>
        `;
      }).join('');
    });

    if (window.lucide) window.lucide.createIcons();
  }

  handlePin(id) {
    this.togglePin(id);
    this.renderNotesList();
  }

  handleDelete(id) {
    this.deleteNote(id);
    this.renderNotesList();
    if (window.app) window.app.showToast('Not silindi', 'info');
  }

  handleCopy(id) {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      navigator.clipboard.writeText(`${note.title}\n\n${note.content}`).then(() => {
        if (window.app) window.app.showToast('Not panoya kopyalandı!', 'success');
      });
    }
  }
}

window.noteManager = new NoteManager();
