/* ============================================================
 * 工作台主控 app.js
 * 导航路由 / 模块调度 / 每日自动刷新 / 同步状态 / 移动端适配
 * ============================================================ */
var App = (function () {
  var VIEWS = {
    todo: { title: '今日待办', sub: '工作项目 · 重要节点 · 老板私人事务统筹', mod: 'ModTodo' },
    invest: { title: '建立财商', sub: '每日商业人物视频 · 投资名词深度 · 创业案例长文', mod: 'ModInvest' },
    lang: { title: '英语学习', sub: '影子跟读法 · 每日英文视频 · 关键词与金句收藏', mod: 'ModLang' },
    express: { title: '表达练习', sub: '中文影子跟读 · 央视新闻 / 百家讲坛 · 好句收藏', mod: 'ModExpress' },
    sport: { title: '每日运动打卡', sub: '30 分钟运动计划 · 打卡录入 · 周统计报表', mod: 'ModSport' },
    library: { title: '亮灯自习室', sub: '热点荐书 · 读书笔记 · 重点标注 · 全库检索', mod: 'ModLibrary' },
    beauty: { title: '美商提升', sub: '抖音妆容 / 穿搭 / 护肤 / 发型教程收藏', mod: 'ModBeauty' },
    ideas: { title: '账号运营', sub: '职场成长 / 副业变现 / 个人提升 · 每日选题与长期储备', mod: 'ModIdeas' },
    quotes: { title: '金句收藏夹', sub: '跨板块金句沉淀 · 自定义收藏夹整理', mod: 'ModQuotes' },
    settings: { title: '设置中心', sub: '账号权限 · 云端同步 · 数据备份 · 外观偏好', mod: 'ModSettings' }
  };
  var current = 'todo';
  var lastDay = Util.today();

  function mod(name) { return window[name]; }

  function go(view) {
    if (!VIEWS[view]) view = 'todo';
    current = view;
    document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
    document.getElementById('view-' + view).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.toggle('active', b.dataset.view === view); });
    document.getElementById('pageTitle').textContent = VIEWS[view].title;
    document.getElementById('pageSub').textContent = VIEWS[view].sub;
    try { sessionStorage.setItem('paw.view', view); } catch (e) {}
    var m = mod(VIEWS[view].mod);
    if (m && m.render) m.render();
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function refreshAll() {
    ['ModTodo', 'ModInvest', 'ModLang', 'ModExpress', 'ModSport', 'ModLibrary', 'ModBeauty', 'ModIdeas', 'ModQuotes', 'ModSettings'].forEach(function (n) {
      var m = mod(n);
      if (m && m.render) { try { m.render(); } catch (e) {} }
    });
  }

  function openMenu() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('backdrop').classList.add('show');
  }
  function closeMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('backdrop').classList.remove('show');
  }

  function updateSyncChip(state, text) {
    var dot = document.getElementById('syncDot'), t = document.getElementById('syncText');
    if (!dot) return;
    if (!state) {
      if (Sync.enabled()) {
        var last = DB.settings().lastSyncAt;
        state = last ? 'ok' : 'pending';
        text = last ? '已同步 ' + Util.shortTime(last) : '待首次同步';
      } else { state = ''; text = '本地存储模式'; }
    }
    dot.className = 'dot ' + (state || '');
    t.textContent = text || '';
  }

  /** 跨零点自动刷新每日板块内容 */
  function watchDayChange() {
    setInterval(function () {
      var d = Util.today();
      if (d !== lastDay) {
        lastDay = d;
        try { sessionStorage.removeItem('paw.inv.offset'); sessionStorage.removeItem('paw.sp.offset'); sessionStorage.removeItem('paw.idea.offset'); } catch (e) {}
        document.getElementById('sideDate').textContent = Util.humanDate();
        refreshAll();
        Toast.show('已自动刷新为 ' + d + ' 的每日内容', 'info');
      }
    }, 30000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && Util.today() !== lastDay) {
        lastDay = Util.today();
        document.getElementById('sideDate').textContent = Util.humanDate();
        refreshAll();
      }
    });
  }

  function init() {
    Theme.init();
    if (!Auth.guard()) return;
    DB.load();
    Auth.ensureDefault();

    document.getElementById('sideDate').textContent = Util.humanDate();
    var sess = Auth.session();
    document.getElementById('userChip').textContent = sess ? sess.u : '—';

    // 模块初始化
    ModTodo.init(); ModInvest.init(); ModLang.init(); ModExpress.init();
    ModSport.init(); ModLibrary.init(); ModBeauty.init(); ModIdeas.init(); ModQuotes.init(); ModSettings.init();

    // 导航
    document.getElementById('nav').addEventListener('click', function (e) {
      var b = e.target.closest('.nav-item'); if (!b) return;
      go(b.dataset.view);
    });
    document.getElementById('menuBtn').addEventListener('click', openMenu);
    document.getElementById('backdrop').addEventListener('click', closeMenu);

    var modalX = document.getElementById('modalX');
    if (modalX) modalX.addEventListener('click', closeModal);
    var appModal = document.getElementById('appModal');
    if (appModal) appModal.addEventListener('click', function (e) { if (e.target === this) closeModal(); });

    document.getElementById('btnTheme').addEventListener('click', function () {
      var m = Theme.toggle();
      Toast.show('已切换为' + (m === 'dark' ? '深色' : '浅色') + '模式', 'info');
      var sel = document.getElementById('stTheme'); if (sel) sel.value = m;
    });

    document.getElementById('btnLogout').addEventListener('click', function () {
      Auth.logout();
      location.replace('./index.html');
    });
    document.getElementById('btnSyncNow').addEventListener('click', function () { Sync.now(true); });

    Sync.onStatus(updateSyncChip);
    Sync.init();
    updateSyncChip();

    // 首屏渲染全部模块（保证角标与统计正确）
    refreshAll();

    var saved = 'todo';
    try { saved = sessionStorage.getItem('paw.view') || 'todo'; } catch (e) {}
    go(saved);

    watchDayChange();

    // 键盘快捷键：1~6 快速切板块
    document.addEventListener('keydown', function (e) {
      if (e.target.matches('input, textarea, select')) return;
      var keys = ['todo', 'invest', 'lang', 'express', 'library', 'beauty', 'sport', 'ideas'];
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 8) go(keys[n - 1]);
    });
  }

  /* 通用弹窗：文章详情、收藏夹选择等 */
  function openModal(title, bodyHtml, actions) {
    var mask = document.getElementById('appModal');
    if (!mask) return;
    mask.querySelector('.modal-title').textContent = title || '';
    mask.querySelector('.modal-body').innerHTML = bodyHtml || '';
    var foot = mask.querySelector('.modal-foot');
    foot.innerHTML = '';
    (actions || []).forEach(function (a) {
      var b = document.createElement('button');
      b.className = 'btn btn-sm ' + (a.primary ? 'btn-primary' : '');
      b.textContent = a.label;
      b.addEventListener('click', function () { if (a.onClick) a.onClick(); });
      foot.appendChild(b);
    });
    mask.classList.add('show');
  }
  function closeModal() { var m = document.getElementById('appModal'); if (m) m.classList.remove('show'); }

  /* 选择金句归入哪个收藏夹 */
  function pickFolder(def, cb) {
    var cols = ['文学', '心理学', '教育', '财经'];
    var html = '<p class="small muted">选择这条金句归入哪个收藏夹：</p>' +
      '<div class="chips" style="margin-top:8px">' +
      cols.map(function (c) { return '<button class="chip folder-pick" data-c="' + c + '">' + c + '</button>'; }).join('') + '</div>' +
      '<div class="row" style="margin-top:10px"><input class="grow" id="folderCustom" placeholder="或输入自定义收藏夹名" /></div>';
    openModal('归入收藏夹', html, [{ label: '取消', onClick: closeModal }]);
    var box = document.getElementById('appModal');
    box.querySelectorAll('.folder-pick').forEach(function (b) {
      b.addEventListener('click', function () { closeModal(); cb(b.dataset.c); });
    });
    var inp = box.querySelector('#folderCustom');
    if (inp) inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) { closeModal(); cb(this.value.trim()); }
    });
  }

  return { init: init, go: go, refreshAll: refreshAll, updateSyncChip: updateSyncChip, openModal: openModal, closeModal: closeModal, pickFolder: pickFolder };
})();

document.addEventListener('DOMContentLoaded', App.init);
