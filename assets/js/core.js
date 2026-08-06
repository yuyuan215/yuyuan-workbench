/* ============================================================
 * 私人AI综合工作台 · 核心层 core.js
 * 包含：工具函数 / 主题 / 轻提示 / 本地结构化存储 / 云端同步 / 登录鉴权
 * 纯原生 JS，无任何外部依赖，可静态托管
 * ============================================================ */

/* ---------------- 环境兼容兜底 ---------------- */
// 部分内嵌 WebView / 无头环境未实现 scrollTo，或实现为「调用即抛错」，
// 这里强制覆盖为安全空函数，避免任何环境下页面崩溃
if (typeof window !== 'undefined') {
  try {
    Object.defineProperty(window, 'scrollTo', {
      value: function () {}, configurable: true, writable: true
    });
  } catch (e) { try { window.scrollTo = function () {}; } catch (_) {} }
  if (window.Element) {
    try {
      Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
        value: function () {}, configurable: true, writable: true
      });
    } catch (e) {}
  }
}

/* ---------------- 工具函数 ---------------- */
var Util = (function () {
  var CN_WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function dateKey(d) {
    d = d ? new Date(d) : new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function today() { return dateKey(new Date()); }

  function humanDate(d) {
    d = d ? new Date(d) : new Date();
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + CN_WEEK[d.getDay()];
  }

  function shortTime(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    return dateKey(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  /** 距 1970 的天数，用作每日内容轮换种子 */
  function dayIndex(d) {
    d = d ? new Date(d) : new Date();
    return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
  }

  /** 基于日期种子的稳定伪随机（同一天结果一致） */
  function seededPick(arr, seed, count) {
    if (!arr || !arr.length) return [];
    count = Math.min(count || 1, arr.length);
    // 基于种子的 mulberry32 PRNG，对索引做 Fisher-Yates 洗牌后取前 count 个（保证不重复且按种子可复现）
    var s = (Math.abs(seed) || 1) >>> 0;
    function rng() {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var idx = arr.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp;
    }
    return idx.slice(0, count).map(function (k) { return arr[k]; });
  }

  function daysBetween(a, b) {
    var d1 = new Date(a + 'T00:00:00'), d2 = new Date(b + 'T00:00:00');
    return Math.round((d2 - d1) / 86400000);
  }

  function addDays(dateStr, n) {
    var d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  /** 本周一 ~ 本周日（ISO 周） */
  function weekRange(dateStr) {
    var d = new Date((dateStr || today()) + 'T00:00:00');
    var wd = (d.getDay() + 6) % 7; // 周一=0
    var start = new Date(d); start.setDate(d.getDate() - wd);
    var end = new Date(start); end.setDate(start.getDate() + 6);
    return { start: dateKey(start), end: dateKey(end) };
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var self = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait || 300);
    };
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }

  return {
    pad: pad, uid: uid, dateKey: dateKey, today: today, humanDate: humanDate,
    shortTime: shortTime, dayIndex: dayIndex, seededPick: seededPick,
    daysBetween: daysBetween, addDays: addDays, weekRange: weekRange,
    esc: esc, debounce: debounce, download: download, CN_WEEK: CN_WEEK
  };
})();

/* ---------------- 主题（浅色 / 深色） ---------------- */
var Theme = (function () {
  var KEY = 'paw.theme';
  function set(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#161a1f' : '#f6f7f9');
  }
  function get() {
    try { return localStorage.getItem(KEY) || 'light'; } catch (e) { return 'light'; }
  }
  function init() { set(get()); }
  function toggle() { set(get() === 'dark' ? 'light' : 'dark'); return get(); }
  return { init: init, set: set, get: get, toggle: toggle };
})();

/* ---------------- 轻提示（无弹窗打断） ---------------- */
var Toast = (function () {
  var box;
  function ensure() {
    if (!box) {
      box = document.createElement('div');
      box.className = 'toast-box';
      document.body.appendChild(box);
    }
  }
  function show(text, type) {
    ensure();
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    el.textContent = text;
    box.appendChild(el);
    setTimeout(function () { el.classList.add('out'); }, 2200);
    setTimeout(function () { el.remove(); }, 2600);
  }
  return { show: show };
})();

/* ---------------- 结构化本地存储 ---------------- */
var DB = (function () {
  var KEY = 'paw.data.v1';
  var COLLECTIONS = ['users', 'todos', 'favs', 'langLogs', 'sportLogs', 'sportFavs', 'books', 'quotes', 'expLogs', 'beautyItems', 'notes', 'parentVideos', 'notebooks'];
  var listeners = [];
  var state = null;

  function blank() {
    return {
      v: 1,
      deviceId: Util.uid('dev'),
      updatedAt: Date.now(),
      users: [],
      todos: [],
      favs: [],
      langLogs: [],
      sportLogs: [],
      sportFavs: [],
      books: [],
      quotes: [],
      expLogs: [],
      beautyItems: [],
      notes: [],
      notebooks: [],
      parentVideos: [],
      settings: {
        ownerName: '老板助理',
        autoClearDone: false,
        sync: { mode: 'off', url: '', token: '', binId: '', key: '', auto: true },
        lastSyncAt: 0,
        updatedAt: Date.now()
      }
    };
  }

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : blank();
    } catch (e) { state = blank(); }
    // 结构兜底
    var b = blank();
    for (var k in b) { if (!(k in state)) state[k] = b[k]; }
    COLLECTIONS.forEach(function (c) { if (!Array.isArray(state[c])) state[c] = []; });
    if (!state.settings) state.settings = b.settings;
    if (!state.settings.sync) state.settings.sync = b.settings.sync;
    return state;
  }

  function persist(silent) {
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { Toast.show('本地存储写入失败：' + e.message, 'err'); }
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
    if (!silent && window.Sync) Sync.schedule();
  }

  function onChange(fn) { listeners.push(fn); }

  /** 取集合（默认过滤软删除记录） */
  function all(coll, includeDeleted) {
    load();
    var arr = state[coll] || [];
    return includeDeleted ? arr.slice() : arr.filter(function (x) { return !x.deleted; });
  }

  function find(coll, id) {
    load();
    var arr = state[coll] || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }

  function insert(coll, obj) {
    load();
    obj.id = obj.id || Util.uid(coll.slice(0, 3));
    obj.createdAt = obj.createdAt || Date.now();
    obj.updatedAt = Date.now();
    obj.deleted = false;
    state[coll].push(obj);
    persist();
    return obj;
  }

  function update(coll, id, patch) {
    var item = find(coll, id);
    if (!item) return null;
    for (var k in patch) item[k] = patch[k];
    item.updatedAt = Date.now();
    persist();
    return item;
  }

  /** 软删除，保证多端同步时删除动作可传播 */
  function remove(coll, id) {
    var item = find(coll, id);
    if (!item) return false;
    item.deleted = true;
    item.updatedAt = Date.now();
    persist();
    return true;
  }

  function settings() { load(); return state.settings; }

  function saveSettings(patch) {
    load();
    for (var k in patch) state.settings[k] = patch[k];
    state.settings.updatedAt = Date.now();
    persist();
    return state.settings;
  }

  function exportJSON() { load(); return JSON.stringify(state, null, 2); }

  function importJSON(text, mode) {
    var incoming = JSON.parse(text);
    load();
    if (mode === 'replace') {
      state = incoming;
    } else {
      state = mergeState(state, incoming);
    }
    persist();
    return true;
  }

  /** 双端合并：按记录 updatedAt 取新，删除以墓碑传播 */
  function mergeState(local, remote) {
    if (!remote || typeof remote !== 'object') return local;
    var out = local;
    COLLECTIONS.forEach(function (coll) {
      var map = {};
      (local[coll] || []).forEach(function (x) { map[x.id] = x; });
      (remote[coll] || []).forEach(function (r) {
        var l = map[r.id];
        if (!l) { map[r.id] = r; }
        else if ((r.updatedAt || 0) > (l.updatedAt || 0)) { map[r.id] = r; }
      });
      out[coll] = Object.keys(map).map(function (k) { return map[k]; });
    });
    var rs = remote.settings, ls = local.settings;
    if (rs && (rs.updatedAt || 0) > (ls.updatedAt || 0)) {
      var keepSync = ls.sync; // 同步凭据以本机为准，避免互相覆盖
      out.settings = rs;
      out.settings.sync = keepSync;
    }
    return out;
  }

  function raw() { return load(); }
  function replaceState(s) { state = s; }

  return {
    KEY: KEY, COLLECTIONS: COLLECTIONS,
    load: load, persist: persist, onChange: onChange,
    all: all, find: find, insert: insert, update: update, remove: remove,
    settings: settings, saveSettings: saveSettings,
    exportJSON: exportJSON, importJSON: importJSON,
    mergeState: mergeState, raw: raw, replaceState: replaceState, blank: blank
  };
})();

/* ---------------- 云端同步引擎 ---------------- */
var Sync = (function () {
  var timer = null, running = false;
  var statusListeners = [];

  function onStatus(fn) { statusListeners.push(fn); }
  function emit(state, text) {
    statusListeners.forEach(function (fn) { try { fn(state, text); } catch (e) {} });
  }

  function cfg() { return DB.settings().sync || { mode: 'off' }; }
  function enabled() { return cfg().mode && cfg().mode !== 'off'; }

  function endpoints() {
    var c = cfg();
    if (c.mode === 'jsonbin') {
      return {
        get: { url: 'https://api.jsonbin.io/v3/b/' + c.binId + '/latest', headers: { 'X-Master-Key': c.key, 'X-Bin-Meta': 'false' } },
        put: { url: 'https://api.jsonbin.io/v3/b/' + c.binId, headers: { 'Content-Type': 'application/json', 'X-Master-Key': c.key } }
      };
    }
    // 自定义 REST：GET 返回 JSON，PUT 覆盖写入
    var h = { 'Content-Type': 'application/json' };
    if (c.token) h['Authorization'] = 'Bearer ' + c.token;
    return { get: { url: c.url, headers: h }, put: { url: c.url, headers: h } };
  }

  function pull() {
    var e = endpoints();
    return fetch(e.get.url, { method: 'GET', headers: e.get.headers, cache: 'no-store' })
      .then(function (r) {
        if (r.status === 404) return null;
        if (!r.ok) throw new Error('拉取失败 HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data) return null;
        if (data.record) data = data.record;   // jsonbin 包装
        if (data.data && data.data.v) data = data.data; // 自定义包装兼容
        return data && data.v ? data : null;
      });
  }

  function push(payload) {
    var e = endpoints();
    return fetch(e.put.url, { method: 'PUT', headers: e.put.headers, body: JSON.stringify(payload) })
      .then(function (r) {
        if (!r.ok) throw new Error('上传失败 HTTP ' + r.status);
        return true;
      });
  }

  function now(manual) {
    if (!enabled()) {
      if (manual) Toast.show('尚未配置云端同步，数据仅保存在本机', 'warn');
      return Promise.resolve(false);
    }
    if (running) return Promise.resolve(false);
    if (!navigator.onLine) { emit('offline', '离线'); return Promise.resolve(false); }
    running = true; emit('syncing', '同步中');
    return pull()
      .then(function (remote) {
        var local = DB.raw();
        if (remote) DB.replaceState(DB.mergeState(local, remote));
        var merged = DB.raw();
        merged.updatedAt = Date.now();
        return push(merged);
      })
      .then(function () {
        DB.settings().lastSyncAt = Date.now();
        DB.persist(true);
        running = false;
        emit('ok', '已同步 ' + Util.shortTime(Date.now()));
        if (manual) Toast.show('云端同步完成', 'ok');
        if (window.App && App.refreshAll) App.refreshAll();
        return true;
      })
      .catch(function (err) {
        running = false;
        emit('err', '同步失败');
        Toast.show('云端同步失败：' + err.message, 'err');
        return false;
      });
  }

  /** 数据变更后延迟自动同步，避免频繁请求 */
  function schedule() {
    if (!enabled() || cfg().auto === false) return;
    clearTimeout(timer);
    emit('pending', '待同步');
    timer = setTimeout(function () { now(false); }, 4000);
  }

  function test() {
    return pull().then(function (d) {
      Toast.show(d ? '连接成功，云端已有数据' : '连接成功，云端暂无数据（首次同步将创建）', 'ok');
      return true;
    }).catch(function (e) {
      Toast.show('连接失败：' + e.message, 'err');
      return false;
    });
  }

  function init() {
    window.addEventListener('online', function () { emit('pending', '待同步'); now(false); });
    window.addEventListener('offline', function () { emit('offline', '离线'); });
    if (enabled()) setTimeout(function () { now(false); }, 1200);
    setInterval(function () { if (enabled() && cfg().auto !== false) now(false); }, 10 * 60 * 1000);
  }

  return { now: now, schedule: schedule, test: test, init: init, onStatus: onStatus, enabled: enabled };
})();

/* ---------------- 登录鉴权 ---------------- */
var Auth = (function () {
  var SESSION_KEY = 'paw.session';
  var DEFAULT_USER = 'admin', DEFAULT_PWD = 'admin888';

  function fallbackHash(str) {
    // 无 crypto.subtle（如内网 http）时的降级哈希：多轮混合，非明文存储
    var h1 = 0x811c9dc5, h2 = 0x1000193;
    for (var round = 0; round < 512; round++) {
      for (var i = 0; i < str.length; i++) {
        h1 ^= str.charCodeAt(i) + round;
        h1 = (h1 * 16777619) >>> 0;
        h2 = (h2 ^ (h1 + i)) >>> 0;
        h2 = ((h2 << 5) - h2 + str.charCodeAt(i)) >>> 0;
      }
    }
    return ('00000000' + h1.toString(16)).slice(-8) + ('00000000' + h2.toString(16)).slice(-8);
  }

  function hash(pwd, salt) {
    var text = salt + '::' + pwd + '::paw';
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
        .then(function (buf) {
          var arr = Array.prototype.slice.call(new Uint8Array(buf));
          return { algo: 'sha256', hex: arr.map(function (b) { return ('0' + b.toString(16)).slice(-2); }).join('') };
        })
        .catch(function () { return { algo: 'fb', hex: fallbackHash(text) }; });
    }
    return Promise.resolve({ algo: 'fb', hex: fallbackHash(text) });
  }

  function users() { return DB.all('users'); }

  function ensureDefault() {
    if (users().length) return Promise.resolve();
    var salt = Util.uid('s');
    return hash(DEFAULT_PWD, salt).then(function (h) {
      DB.insert('users', { u: DEFAULT_USER, salt: salt, algo: h.algo, hex: h.hex, role: 'owner', note: '默认管理员' });
    });
  }

  function login(u, p, remember) {
    return ensureDefault().then(function () {
      var list = users().filter(function (x) { return x.u.toLowerCase() === u.toLowerCase(); });
      if (!list.length) return { ok: false, msg: '账号不存在' };
      var user = list[0];
      return hash(p, user.salt).then(function (h) {
        if (h.algo !== user.algo) {
          // 环境切换导致算法不一致时的兼容校验
          var alt = user.algo === 'fb' ? { algo: 'fb', hex: fallbackHash(user.salt + '::' + p + '::paw') } : null;
          if (alt && alt.hex === user.hex) { return grant(user, remember); }
          return { ok: false, msg: '当前环境不支持原加密方式，请使用 HTTPS 访问或重置账号' };
        }
        if (h.hex !== user.hex) return { ok: false, msg: '密码错误' };
        return grant(user, remember);
      });
    });
  }

  function grant(user, remember) {
    var exp = Date.now() + (remember ? 7 * 86400000 : 12 * 3600000);
    var sess = { u: user.u, role: user.role || 'user', exp: exp };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      if (!remember) sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}
    return { ok: true };
  }

  function session() {
    try {
      var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (!s) return null;
      if (Date.now() > s.exp) { localStorage.removeItem(SESSION_KEY); return null; }
      return s;
    } catch (e) { return null; }
  }

  function isLogged() { return !!session(); }

  function logout() {
    try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function guard() {
    if (!isLogged()) { location.replace('./index.html'); return false; }
    return true;
  }

  function addUser(u, p, note) {
    if (!u || !p) return Promise.resolve({ ok: false, msg: '账号与密码不能为空' });
    if (users().some(function (x) { return x.u.toLowerCase() === u.toLowerCase(); })) {
      return Promise.resolve({ ok: false, msg: '账号已存在' });
    }
    var salt = Util.uid('s');
    return hash(p, salt).then(function (h) {
      DB.insert('users', { u: u, salt: salt, algo: h.algo, hex: h.hex, role: 'user', note: note || '' });
      return { ok: true };
    });
  }

  function changePwd(u, oldP, newP) {
    var list = users().filter(function (x) { return x.u === u; });
    if (!list.length) return Promise.resolve({ ok: false, msg: '账号不存在' });
    var user = list[0];
    return hash(oldP, user.salt).then(function (h) {
      if (h.hex !== user.hex) return { ok: false, msg: '原密码错误' };
      var salt = Util.uid('s');
      return hash(newP, salt).then(function (nh) {
        DB.update('users', user.id, { salt: salt, algo: nh.algo, hex: nh.hex });
        return { ok: true };
      });
    });
  }

  function removeUser(id) {
    if (users().length <= 1) return { ok: false, msg: '至少保留一个账号' };
    DB.remove('users', id);
    return { ok: true };
  }

  return {
    login: login, logout: logout, session: session, isLogged: isLogged, guard: guard,
    users: users, addUser: addUser, changePwd: changePwd, removeUser: removeUser,
    ensureDefault: ensureDefault
  };
})();

/* ---------------- PWA 安装支持 ---------------- */
/* 注册 Service Worker：让用户能把工作台「安装为 App」并离线使用。
   仅在支持且为 https/localhost 时生效，失败静默不影响功能。 */
(function () {
  if (!('serviceWorker' in navigator)) return;
  function reg() { navigator.serviceWorker.register('./sw.js').catch(function () {}); }
  if (document.readyState === 'complete') reg();
  else window.addEventListener('load', reg);
})();

/* ---------------- B站视频「点击播放」懒加载 ----------------
 * 所有板块默认不加载 B站播放器（避免打开工作台即自动播放/缓冲），
 * 仅显示封面占位；用户点击封面后才注入 iframe 并播放。
 */
(function () {
  // 生成封面占位 HTML（不加载任何播放器）
  Util.biliCover = function (bvid) {
    return '<div class="bili-cover" data-bvid="' + Util.esc(bvid) + '" role="button" tabindex="0" aria-label="点击播放 B站视频">' +
      '<div class="bili-cover-inner"><span class="play-btn">▶</span></div></div>';
  };
  function loadBili(cover) {
    var bvid = cover.getAttribute('data-bvid');
    if (!bvid) return;
    var iframe = document.createElement('iframe');
    iframe.className = 'bili-player';
    iframe.setAttribute('src', 'https://player.bilibili.com/player.html?bvid=' + encodeURIComponent(bvid) + '&page=1&high_quality=1&danmaku=0&autoplay=1');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('border', '0');
    iframe.setAttribute('frameborder', 'no');
    iframe.setAttribute('framespacing', '0');
    iframe.setAttribute('allow', 'fullscreen; autoplay; encrypted-media');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    if (cover.parentNode) cover.parentNode.replaceChild(iframe, cover);
  }
  function activate(e) {
    if (!e || !e.target || !e.target.closest) return;
    var cover = e.target.closest('.bili-cover');
    if (cover) { e.preventDefault(); loadBili(cover); }
  }
  document.addEventListener('click', activate, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!e.target || !e.target.closest) return;
    var cover = e.target.closest('.bili-cover');
    if (cover) { e.preventDefault(); loadBili(cover); }
  });
})();
