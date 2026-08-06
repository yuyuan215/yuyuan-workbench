/* ============================================================
 * 板块：每日运动跟练（B站每日视频 · 面部瑜伽 / 金刚功 / 瑜伽）
 *   A. 每日跟练：每天各推荐 1 个 B站视频，页面内嵌播放器 + 在 B 站打开兜底（纯跟练，无打卡）
 *   B. 我的运动收藏：粘贴视频链接收藏，或从手机 / 电脑上传本地视频（存 IndexedDB，页面内可播放）
 * ============================================================ */
var ModSport = (function () {
  var OFF_KEY = 'paw.sp.offset';
  var CATS = [
    { key: 'faceYoga', label: '面部瑜伽', emoji: '🧘‍♀️' },
    { key: 'jinGong', label: '金刚功', emoji: '☯️' },
    { key: 'yoga', label: '瑜伽', emoji: '🧎' }
  ];
  var objUrls = {};      // blobKey -> objectURL（渲染上传视频时创建，重渲前回收）
  var filePending = null; // 待上传的视频文件

  function offset() { try { return parseInt(sessionStorage.getItem(OFF_KEY) || '0', 10) || 0; } catch (e) { return 0; } }
  function bump() { try { sessionStorage.setItem(OFF_KEY, offset() + 1); } catch (e) {} }

  function todayVideo(cat) {
    var arr = (CONTENT.sportVideos && CONTENT.sportVideos[cat.key]) || [];
    return Util.seededPick(arr, Util.dayIndex() * 7 + cat.key.length + offset() * 3, 1)[0];
  }

  function cardHTML(cat) {
    var v = todayVideo(cat);
    if (!v) return '<div class="empty">今日 ' + cat.label + ' 视频暂缺，稍后再来～</div>';
    return '<div class="item beauty-card">' +
      '<div class="item-title">' + cat.emoji + ' ' + Util.esc(cat.label) + ' · 今日跟练</div>' +
      '<div class="item-meta"><span class="tag accent">' + Util.esc(v.up || '') + '</span><span class="small muted">' + Util.esc(v.dur || '') + '</span></div>' +
      '<div class="bili-wrap"><iframe class="bili-player" src="https://player.bilibili.com/player.html?bvid=' + v.bvid + '&page=1&high_quality=1&danmaku=0&autoplay=0" allowfullscreen="true" scrolling="no" border="0" frameborder="no" framespacing="0" allow="fullscreen"></iframe></div>' +
      (v.note ? '<div class="item-note">' + Util.esc(v.note) + '</div>' : '') +
      '<div class="item-actions"><a class="btn btn-sm btn-primary" href="' + v.url + '" target="_blank" rel="noopener">▶ 在 B 站打开</a></div>' +
      '</div>';
  }

  /* ---------------- 我的运动收藏 ---------------- */
  function items() { return DB.all('sportFavs'); }

  function parseBili(url) {
    if (!url) return null;
    var m = url.match(/[?&/](BV[0-9A-Za-z]+)/i);
    return m ? m[1] : null;
  }

  /* ---------------- IndexedDB（仅存上传的视频 blob） ---------------- */
  var IDB = 'yuyuanSport', STORE = 'videos';
  function openIDB() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(IDB, 1);
      r.onupgradeneeded = function (e) { e.target.result.createObjectStore(STORE); };
      r.onsuccess = function (e) { res(e.target.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function putBlob(key, blob) {
    return openIDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(blob, key);
        tx.oncomplete = function () { db.close(); res(); };
        tx.onerror = function () { db.close(); rej(tx.error); };
      });
    });
  }
  function getBlob(key) {
    return openIDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(STORE, 'readonly');
        var rq = tx.objectStore(STORE).get(key);
        rq.onsuccess = function () { db.close(); res(rq.result); };
        rq.onerror = function () { db.close(); rej(rq.error); };
      });
    });
  }
  function delBlob(key) {
    return openIDB().then(function (db) {
      return new Promise(function (res) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(key);
        tx.oncomplete = function () { db.close(); res(); };
        tx.onerror = function () { db.close(); res(); };
      });
    });
  }

  function guessTitle(link) {
    var bv = parseBili(link);
    return bv ? ('B站视频 · ' + bv) : '收藏的运动视频';
  }

  function favCard(it) {
    if (it.type === 'link') {
      var bv = parseBili(it.url);
      if (bv) {
        return '<div class="item beauty-card">' +
          '<div class="item-title">📌 ' + Util.esc(it.title || '收藏的运动视频') + '</div>' +
          '<div class="item-meta"><span class="tag accent">B站视频</span></div>' +
          '<div class="bili-wrap"><iframe class="bili-player" src="https://player.bilibili.com/player.html?bvid=' + bv + '&page=1&high_quality=1&danmaku=0&autoplay=0" allowfullscreen="true" scrolling="no" border="0" frameborder="no" framespacing="0" allow="fullscreen"></iframe></div>' +
          '<div class="item-actions" style="margin-top:8px">' +
            '<a class="btn btn-sm btn-primary" href="' + Util.esc(it.url) + '" target="_blank" rel="noopener">▶ 在 B 站打开</a>' +
            '<button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button>' +
          '</div></div>';
      }
      return '<div class="item beauty-card">' +
        '<div class="item-title">📌 ' + Util.esc(it.title || '收藏的视频') + '</div>' +
        '<div class="item-meta"><span class="tag">视频链接</span></div>' +
        '<div class="readbox" style="margin-top:8px;word-break:break-all">' + Util.esc(it.url) + '</div>' +
        '<div class="item-actions" style="margin-top:8px">' +
          '<a class="btn btn-sm btn-primary" href="' + Util.esc(it.url) + '" target="_blank" rel="noopener">▶ 打开视频</a>' +
          '<button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button>' +
        '</div></div>';
    }
    // 本地上传视频
    return '<div class="item beauty-card">' +
      '<div class="item-title">📁 ' + Util.esc(it.title || '本地视频') + '</div>' +
      '<div class="item-meta"><span class="tag ok">本地视频 · 可离线播放</span></div>' +
      '<video class="bvideo" controls preload="metadata" data-bkey="' + Util.esc(it.blobKey) + '"></video>' +
      '<div class="item-actions" style="margin-top:8px"><button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button></div>' +
      '</div>';
  }

  function renderFavs() {
    // 回收上一次渲染创建的 object URL，避免内存泄漏
    Object.keys(objUrls).forEach(function (k) { try { URL.revokeObjectURL(objUrls[k]); } catch (e) {} });
    objUrls = {};
    var list = items().sort(function (a, b) { return b.addedAt - a.addedAt; });
    var box = document.getElementById('spFavList');
    if (!box) return;
    var cnt = document.getElementById('spFavCount');
    if (cnt) cnt.textContent = '共 ' + list.length + ' 条';
    box.innerHTML = list.length
      ? list.map(favCard).join('')
      : '<div class="empty">还没有收藏～ 粘贴喜欢的视频链接，或从手机上传自己的跟练视频吧 🏃‍♀️</div>';
    // 异步填充已上传视频的播放地址
    list.filter(function (x) { return x.type === 'upload'; }).forEach(function (it) {
      getBlob(it.blobKey).then(function (blob) {
        if (!blob) return;
        var u = URL.createObjectURL(blob);
        objUrls[it.blobKey] = u;
        var el = box.querySelector('video[data-bkey="' + cssEsc(it.blobKey) + '"]');
        if (el) el.src = u;
      }).catch(function () {});
    });
    var badge = document.getElementById('badgeSport');
    if (badge) badge.textContent = list.length;
  }

  function cssEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }

  function add() {
    var title = (document.getElementById('spTitle').value || '').trim();
    var link = (document.getElementById('spLink').value || '').trim();
    if (!link && !filePending) { Toast.show('请粘贴视频链接，或选择要上传的视频', 'warn'); return; }
    if (link) {
      DB.insert('sportFavs', { type: 'link', url: link, title: title || guessTitle(link), addedAt: Date.now() });
      Toast.show('已收藏视频', 'ok');
      finishAdd();
    } else if (filePending) {
      var f = filePending;
      var rec = DB.insert('sportFavs', { type: 'upload', title: title || f.name, name: f.name, blobKey: 'sv_' + Util.uid('v'), addedAt: Date.now() });
      var p = (typeof putBlob === 'function') ? putBlob(rec.blobKey, f) : Promise.resolve();
      p.then(function () {
        Toast.show('已上传并保存视频', 'ok');
        finishAdd();
      }).catch(function () {
        DB.remove('sportFavs', rec.id);
        Toast.show('视频保存失败（当前浏览器可能不支持本地存储）', 'err');
      });
    }
  }

  function finishAdd() {
    document.getElementById('spLink').value = '';
    document.getElementById('spTitle').value = '';
    document.getElementById('spFileName').textContent = '';
    filePending = null;
    renderFavs();
  }

  function del(id) {
    var it = DB.find('sportFavs', id);
    if (!it) return;
    DB.remove('sportFavs', id);
    if (it.type === 'upload' && it.blobKey) delBlob(it.blobKey);
    Toast.show('已删除', 'info');
    renderFavs();
  }

  function render() {
    var box = document.getElementById('spVideos');
    if (box) box.innerHTML = CATS.map(cardHTML).join('');
    var d = document.getElementById('spDate');
    if (d) d.textContent = Util.humanDate();
    renderFavs();
  }

  function init() {
    var b = document.getElementById('spRefresh');
    if (b) b.addEventListener('click', function () { bump(); render(); Toast.show('已换一批今日跟练', 'info'); });
    var spf = document.getElementById('spFile');
    if (spf) spf.addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) {
        filePending = f;
        var size = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : (f.size / 1024).toFixed(0) + ' KB';
        document.getElementById('spFileName').textContent = '已选择：' + f.name + '（' + size + '）';
      }
    });
    var addb = document.getElementById('spAdd');
    if (addb) addb.addEventListener('click', add);
    var lb = document.getElementById('spFavList');
    if (lb) lb.addEventListener('click', function (e) {
      var b2 = e.target.closest('button[data-del]'); if (!b2) return;
      del(b2.dataset.del);
    });
  }

  return { init: init, render: render };
})();
