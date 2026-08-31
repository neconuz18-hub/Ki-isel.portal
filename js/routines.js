/**
 * Routines Module - Günlük Rutin ve Alışkanlık Takibi
 */

class RoutineManager {
  constructor() {
    this.routines = window.appStorage.get(STORAGE_KEYS.ROUTINES, []);
  }

  getRoutines() {
    return this.routines;
  }

  addRoutine(title) {
    const newRoutine = {
      id: 'rout_' + Date.now(),
      title: title.trim(),
      completed: false
    };
    this.routines.push(newRoutine);
    this.save();
    return newRoutine;
  }

  toggleRoutine(id) {
    const routine = this.routines.find(r => r.id === id);
    if (routine) {
      routine.completed = !routine.completed;
      this.save();
    }
  }

  deleteRoutine(id) {
    this.routines = this.routines.filter(r => r.id !== id);
    this.save();
  }

  save() {
    window.appStorage.save(STORAGE_KEYS.ROUTINES, this.routines);
  }

  renderRoutinesList(containerId = 'routineListContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.routines.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 text-slate-400 text-xs">
          Henüz tanımlı günlük rutin yok.
        </div>
      `;
      return;
    }

    const completedCount = this.routines.filter(r => r.completed).length;
    const totalCount = this.routines.length;

    container.innerHTML = `
      <div class="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>Günün İlerlemesi</span>
        <span class="font-semibold text-slate-200">${completedCount}/${totalCount} Rutin</span>
      </div>
      <div class="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-300" style="width: ${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%"></div>
      </div>
      <div class="space-y-2">
        ${this.routines.map(r => `
          <div class="flex items-center justify-between p-2.5 rounded-xl border ${r.completed ? 'bg-emerald-950/20 border-emerald-500/20 opacity-70' : 'bg-slate-800/40 border-slate-700/50'} transition-all group">
            <label class="flex items-center space-x-3 cursor-pointer flex-1 min-w-0 pr-2">
              <input type="checkbox" onchange="window.routineManager.handleToggle('${r.id}')" ${r.completed ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-700 border-slate-600">
              <span class="text-xs ${r.completed ? 'line-through text-slate-400' : 'text-slate-200'} font-medium truncate select-none">${escapeHtml(r.title)}</span>
            </label>
            <button onclick="window.routineManager.handleDelete('${r.id}')" title="Rutini Sil" class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  handleToggle(id) {
    this.toggleRoutine(id);
    this.renderRoutinesList();
    if (window.soundManager) window.soundManager.playClick();
  }

  handleDelete(id) {
    this.deleteRoutine(id);
    this.renderRoutinesList();
  }
}

window.routineManager = new RoutineManager();
