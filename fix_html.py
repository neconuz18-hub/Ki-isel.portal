import re
with open('index.html', 'r', encoding='utf8') as f:
    html = f.read()

broken_section = r'<h3 class="text-base font-bold text-white flex items-center gap-2">\s*<i data-lucide="layout-grid" class="w-5 h-5 text-blue-400"></i> Sol Menü & Navigasyon Yönetimi\s*</h3>\s*<p class="text-xs text-slate-400 mt-0\.5">\s*<!-- Dynamic Menu Manager Container -->\s*<div id="menuManagerContainer" class="pt-2"></div>'

fixed_section = '''<h3 class="text-base font-bold text-white flex items-center gap-2">
                <i data-lucide="layout-grid" class="w-5 h-5 text-blue-400"></i> Sol Menü & Navigasyon Yönetimi
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Sol menüdeki sekmeleri yeniden adlandırın, ikonlarını değiştirin, sıralayın, gizleyin veya yeni menü ekleyin.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="window.app.openModal('newMenuModal')" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Yeni Menü Ekle</span>
              </button>
            </div>
          </div>

          <!-- Dynamic Menu Manager Container -->
          <div id="menuManagerContainer" class="pt-2"></div>'''

html = re.sub(broken_section, fixed_section, html)
with open('index.html', 'w', encoding='utf8') as f:
    f.write(html)
print("Sabitlendi.")
