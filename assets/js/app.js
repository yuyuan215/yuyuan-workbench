/* ============================================================
 * 工作台主控 app.js
 * 导航路由 / 模块调度 / 每日自动刷新 / 同步状态 / 移动端适配
 * ============================================================ */
var App = (function () {
  var VIEWS = {
    todo: { title: '今日待办', sub: '工作项目 · 重要节点 · 老板私人事务统筹', mod: 'ModTodo' },
    invest: { title: '投资学习', sub: '每日财经资讯 · 市场观点 · 投资干货 · 书籍摘要', mod: 'ModInvest' },
    lang: { title: '每日语言训练', sub: '英语 10 分钟 + 中文 10 分钟 · 打卡与进度台账', mod: 'ModLang' },
    sport: { title: '每日运动打卡', sub: '30 分钟运动计划 · 打卡录入 · 周统计报表', mod: 'ModSport' },
    library: { title: '个人图书馆', sub: '书籍管理 · 读书笔记 · 重点标注 · 全库检索', mod: 'ModLibrary' },
    ideas: { title: '个人账号运营', sub: '心理学 / 教育育儿 / 职场 · 每日选题与长期储备', mod: 'ModIdeas' },
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
    ['ModTodo', 'ModInvest', 'ModLang', 'ModSport', 'ModLibrary', 'ModIdeas', 'ModSettings'].forEach(function (n) {
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
    ModTodo.init(); ModInvest.init(); ModLang.init();
    ModSport.init(); ModLibrary.init(); ModIdeas.init(); ModSettings.init();

    // 导航
    document.getElementById('nav').addEventListener('click', function (e) {
      var b = e.target.closest('.nav-item'); if (!b) return;
      go(b.dataset.view);
    });
    document.getElementById('menuBtn').addEventListener('click', openMenu);
    document.getElementById('backdrop').addEventListener('click', closeMenu);

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
      var keys = ['todo', 'invest', 'lang', 'sport', 'library', 'ideas'];
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 6) go(keys[n - 1]);
    });
  }

  return { init: init, go: go, refreshAll: refreshAll, updateSyncChip: updateSyncChip };
})();

document.addEventListener('DOMContentLoaded', App.init);
