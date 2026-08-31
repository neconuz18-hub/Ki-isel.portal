/**
 * Tasks Module - Görev Yönetimi ve İş Takibi
 * 3 Kademeli Durum Yönetimi: Bekliyor -> Devam Ediyor (Zaman/Saat Simgeli Oval) -> Tamamlandı
 */

class TaskManager {
  constructor() {
    this.tasks = window.appStorage.get(STORAGE_KEYS.TASKS, []);
    this.currentFilter = 'all'; // all, pending, in_progress, completed, urgent
    this.searchQuery = '';
  }

  getTasks() {
    return this.tasks;
  }

  addTask(taskData) {
    const newTask = {
      id: 'task_' + Date.now(),
      title: taskData.title.trim(),
      category: taskData.category || 'Genel',
      priority: taskData.priority || 'normal', // urgent, high, normal, low
      status: 'pending', // 'pending', 'in_progress', 'completed'
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      dueTime: taskData.dueTime || '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.save();
    return newTask;
  }

  toggleStatus(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    // 3'lü akıllı döngü: Bekliyor (pending) -> Başlandı/Devam Ediyor (in_progress) -> Tamamlandı (completed) -> Bekliyor
    if (!task.status) {
      task.status = task.completed ? 'completed' : 'pending';
    }

    if (task.status === 'pending') {
      task.status = 'in_progress';
      task.completed = false;
      if (window.app) window.app.showToast(`⏳ "${task.title}" görevine başlandı (Devam Ediyor)`, 'info');
    } else if (task.status === 'in_progress') {
      task.status = 'completed';
      task.completed = true;
      if (window.app) window.app.showToast(`✔ "${task.title}" görevi tamamlandı`, 'success');
    } else {
      task.status = 'pending';
      task.completed = false;
      if (window.app) window.app.showToast(`"${task.title}" beklemede olarak güncellendi`, 'info');
    }

    this.save();
    return task;
  }

  handleCancel(id, event) {
    if (event) event.preventDefault();
    const task = this.tasks.find(t => t.id === id);
    if (!task) return false;

    if (task.status === 'in_progress') {
      task.status = 'pending';
      task.completed = false;
      if (window.app) window.app.showToast(`🚫 Görev iptal edildi, tekrar beklemeye alındı`, 'info');
      this.save();
    }
    return false;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  updateTask(id, updatedFields) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedFields };
      if (updatedFields.status) {
        this.tasks[taskIndex].completed = updatedFields.status === 'completed';
      }
      this.save();
      return this.tasks[taskIndex];
    }
    return null;
  }

  save() {
    window.appStorage.save(STORAGE_KEYS.TASKS, this.tasks);
    this.render();
    if (window.app) {
      window.app.updateDashboardStats();
    }
  }

  getFilteredTasks() {
    let filtered = [...this.tasks];

    // Status filter
    if (this.currentFilter === 'pending') {
      filtered = filtered.filter(t => (t.status === 'pending' || (!t.status && !t.completed)));
    } else if (this.currentFilter === 'in_progress') {
      filtered = filtered.filter(t => t.status === 'in_progress');
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(t => t.completed || t.status === 'completed');
    } else if (this.currentFilter === 'urgent') {
      filtered = filtered.filter(t => t.priority === 'urgent' && !t.completed);
    }

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      );
    }

    // Sort: in_progress -> pending -> completed, then priority
    const priorityWeights = { urgent: 4, high: 3, normal: 2, low: 1 };
    filtered.sort((a, b) => {
      const aDone = a.completed || a.status === 'completed';
      const bDone = b.completed || b.status === 'completed';
      if (aDone !== bDone) return aDone ? 1 : -1;

      const aInProg = a.status === 'in_progress';
      const bInProg = b.status === 'in_progress';
      if (aInProg !== bInProg) return aInProg ? -1 : 1;

      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return weightB - weightA;
    });

    return filtered;
  }

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed || t.status === 'completed').length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const pending = total - completed;
    const urgent = this.tasks.filter(t => (!t.completed && t.status !== 'completed') && (t.priority === 'urgent' || t.priority === 'high')).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, pending, urgent, rate };
  }

  render() {
    this.renderTasksList('dashboardTaskList');
    this.renderTasksList('mainTaskList');
  }

  renderTasksList(containerId = 'dashboardTaskList') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = this.getFilteredTasks();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-10 px-4">
          <div class="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-2 text-slate-400 border border-slate-700/60">
            <i data-lucide="check-circle-2" class="w-6 h-6"></i>
          </div>
          <p class="text-slate-300 font-medium text-sm">Bu görünümde henüz bir görev yok</p>
          <p class="text-slate-500 text-xs mt-0.5">Yeni bir görev ekleyerek işlerinizi takip edebilirsiniz.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const priorityBadge = (priority) => {
      switch (priority) {
        case 'urgent':
          return '<span class="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>Acil</span>';
        case 'high':
          return '<span class="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Yüksek</span>';
        case 'normal':
          return '<span class="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Normal</span>';
        default:
          return '<span class="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/40 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>Düşük</span>';
      }
    };

    const categoryColor = (cat) => {
      const colors = {
        'Toplantı': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        'E-posta': 'bg-sky-500/10 text-sky-300 border-sky-500/20',
        'Takip': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        'Operasyon': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        'Kişisel': 'bg-rose-500/10 text-rose-300 border-rose-500/20',
        'Genel': 'bg-slate-500/10 text-slate-300 border-slate-500/20'
      };
      return colors[cat] || colors['Genel'];
    };

    container.innerHTML = filtered.map(task => {
      const isCompleted = task.completed || task.status === 'completed';
      const isInProgress = task.status === 'in_progress';

      return `
        <div class="task-row ${isCompleted ? 'opacity-60' : ''} ${isInProgress ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-700/30 hover:border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/30 backdrop-blur-sm'} group flex items-center justify-between p-3 rounded-2xl border transition-all mb-2.5">
          <div class="flex items-center space-x-3 flex-1 min-w-0 pr-3">
            
            <!-- OVAL / 3 DURUMLU BUTON (Bekliyor -> Başlandı/Zaman -> Tamamlandı) -->
            <button 
              onclick="window.taskManager.handleToggle('${task.id}')" 
              oncontextmenu="return window.taskManager.handleCancel('${task.id}', event)"
              title="${isInProgress ? 'Devam Ediyor (Sağ tık ile iptal edebilirsiniz)' : (isCompleted ? 'Tamamlandı (Beklemeye almak için tıkla)' : 'Başlamak için tıkla')}"
              class="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                isCompleted 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : (isInProgress 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-2 ring-amber-500/30' 
                      : 'border-slate-600 hover:border-amber-400 bg-slate-800/80 text-transparent hover:text-slate-500')
              }"
            >
              ${isCompleted 
                ? '<i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>' 
                : (isInProgress 
                    ? '<i data-lucide="clock" class="w-3.5 h-3.5 animate-spin-slow"></i>' 
                    : '<i data-lucide="play" class="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 ml-0.5"></i>')}
            </button>
            
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="text-xs font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-white'} truncate">
                  ${escapeHtml(task.title)}
                </p>
                ${isInProgress ? `
                  <span class="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                    <i data-lucide="timer" class="w-3 h-3 text-amber-400"></i>
                    <span>Devam Ediyor</span>
                  </span>
                ` : ''}
              </div>

              <div class="flex items-center flex-wrap gap-1.5 mt-1">
                ${priorityBadge(task.priority)}
                <span class="px-2 py-0.5 text-[11px] rounded-md border ${categoryColor(task.category)}">${task.category}</span>
                ${task.dueDate ? `
                  <span class="text-[11px] text-slate-400 flex items-center gap-1 ml-0.5">
                    <i data-lucide="calendar" class="w-3 h-3 text-slate-500"></i>
                    ${task.dueDate} ${task.dueTime ? '· ' + task.dueTime : ''}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-1">
            <button 
              onclick="window.taskManager.handleDelete('${task.id}')" 
              title="Görevi Sil" 
              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  handleToggle(id) {
    this.toggleStatus(id);
    this.render();
    if (window.soundManager) window.soundManager.playClick();
  }

  handleDelete(id) {
    this.deleteTask(id);
    this.render();
    if (window.app) window.app.showToast('Görev başarıyla silindi', 'info');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.taskManager = new TaskManager();
