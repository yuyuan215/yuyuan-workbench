/* ============================================================
 * 板块：美商提升（抖音链接收藏 + 本地视频上传 · 化妆 / 穿搭）
 * 新增能力：
 *   - 粘贴抖音视频链接即可直接添加（链接类）
 *   - 从手机 / 电脑上传视频文件（本地类，存 IndexedDB，页面内可播放）
 *   - 按「化妆 / 穿搭」两个分类管理
 * 注：已移除原先的抖音每日推荐卡片（不再从网上抓取推荐）
 * ============================================================ */
var ModBeauty = (function () {
  var cat = 'all';
  var CATS = [['all', '全部'], ['makeup', '化妆'], ['outfit', '穿搭']];
  var CATNAME = { makeup: '化妆', outfit: '穿搭' };
  var CATCLS = { makeup: 'accent', outfit: 'ok' };
  var objUrls = {};      // blobKey -> objectURL（渲染上传视频时创建，重渲前回收）
  var filePending = null; // 待上传的视频文件

  function items() { return DB.all('beautyItems'); }
  function byCat() {
    var arr = items();
    if (cat !== 'all') arr = arr.filter(function (x) { return x.cat === cat; });
    return arr.sort(function (a, b) { return b.addedAt - a.addedAt; });
  }

  /* ---------------- IndexedDB（仅存上传的视频 blob） ---------------- */
  var IDB = 'yuyuanBeauty', STORE = 'videos';
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

  /* ---------------- 渲染 ---------------- */
  function renderStats() {
    var all = items();
    var m = all.filter(function (x) { return x.cat === 'makeup'; }).length;
    var o = all.filter(function (x) { return x.cat === 'outfit'; }).length;
    var up = all.filter(function (x) { return x.type === 'upload'; }).length;
    document.getElementById('beautyStats').innerHTML = [
      { n: all.length, l: '视频总数', x: '我的美商库' },
      { n: m, l: '化妆', x: '已添加' },
      { n: o, l: '穿搭', x: '已添加' },
      { n: up, l: '本地上传', x: '可离线播放' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');
  }

  function renderCats() {
    document.getElementById('beautyCats').innerHTML = CATS.map(function (c) {
      return '<button class="chip' + (cat === c[0] ? ' on' : '') + '" data-v="' + c[0] + '">' + c[1] + '</button>';
    }).join('');
  }

  function card(it) {
    var cls = CATCLS[it.cat] || '';
    var typeLabel = it.type === 'upload' ? '本地视频' : '抖音链接';
    var meta = '<span class="tag ' + cls + '">' + (CATNAME[it.cat] || it.cat) + '</span><span class="small muted">' + typeLabel + '</span>';
    if (it.type === 'link') {
      return '<div class="item beauty-card">' +
        '<div class="item-title">' + Util.esc(it.title || '抖音视频') + '</div>' +
        '<div class="item-meta">' + meta + '</div>' +
        '<div class="readbox" style="margin-top:8px;word-break:break-all">' + Util.esc(it.url) + '</div>' +
        '<div class="item-actions" style="margin-top:8px">' +
          '<a class="btn btn-sm btn-primary" href="' + Util.esc(it.url) + '" target="_blank" rel="noopener">▶ 在抖音打开</a>' +
          '<button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button>' +
        '</div></div>';
    }
    // 本地上传视频
    return '<div class="item beauty-card">' +
      '<div class="item-title">' + Util.esc(it.title || '本地视频') + '</div>' +
      '<div class="item-meta">' + meta + '</div>' +
      '<video class="bvideo" controls preload="metadata" data-bkey="' + Util.esc(it.blobKey) + '"></video>' +
      '<div class="item-actions" style="margin-top:8px"><button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button></div>' +
      '</div>';
  }

  function render() {
    renderStats(); renderCats();
    // 回收上一次渲染创建的 object URL，避免内存泄漏
    Object.keys(objUrls).forEach(function (k) { try { URL.revokeObjectURL(objUrls[k]); } catch (e) {} });
    objUrls = {};
    var list = byCat();
    var box = document.getElementById('beautyList');
    var total = items().length;
    document.getElementById('beautyCount').textContent = '共 ' + total + ' 条'
      + (cat !== 'all' ? ' · 当前「' + (CATNAME[cat] || '') + '」' + list.length + ' 条' : '');
    box.innerHTML = list.length
      ? list.map(card).join('')
      : '<div class="empty">这里还没有美商视频～ 在上面粘贴抖音链接，或从手机上传一个吧 🍠</div>';
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
    var badge = document.getElementById('badgeBeauty');
    if (badge) badge.textContent = total;
  }

  function cssEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }

  /* ---------------- 添加 ---------------- */
  function add() {
    var catv = document.getElementById('bvCat').value;
    var title = document.getElementById('bvTitle').value.trim();
    var link = document.getElementById('bvLink').value.trim();
    if (!link && !filePending) { Toast.show('请粘贴抖音链接，或选择要上传的视频', 'warn'); return; }
    if (link) {
      DB.insert('beautyItems', { type: 'link', cat: catv, url: link, title: title || '抖音视频', addedAt: Date.now() });
      Toast.show('已添加抖音视频', 'ok');
      finishAdd();
    } else if (filePending) {
      var f = filePending;
      var rec = DB.insert('beautyItems', { type: 'upload', cat: catv, title: title || f.name, name: f.name, blobKey: 'bv_' + Util.uid('b'), addedAt: Date.now() });
      putBlob(rec.blobKey, f).then(function () {
        Toast.show('已上传并保存视频', 'ok');
        finishAdd();
      }).catch(function () {
        DB.remove('beautyItems', rec.id);
        Toast.show('视频保存失败（当前浏览器可能不支持本地存储）', 'err');
      });
    }
  }

  function finishAdd() {
    document.getElementById('bvLink').value = '';
    document.getElementById('bvTitle').value = '';
    document.getElementById('bvFileName').textContent = '';
    filePending = null;
    render();
  }

  function del(id) {
    var it = DB.find('beautyItems', id);
    if (!it) return;
    DB.remove('beautyItems', id);
    if (it.type === 'upload' && it.blobKey) delBlob(it.blobKey);
    Toast.show('已删除', 'info');
    render();
  }

  function init() {
    document.getElementById('beautyCats').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      cat = b.dataset.v; renderCats(); render();
    });
    document.getElementById('bvFile').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) {
        filePending = f;
        var size = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : (f.size / 1024).toFixed(0) + ' KB';
        document.getElementById('bvFileName').textContent = '已选择：' + f.name + '（' + size + '）';
      }
    });
    document.getElementById('bvAdd').addEventListener('click', add);
    document.getElementById('beautyList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-del]'); if (!b) return;
      del(b.dataset.del);
    });
  }

  return { init: init, render: render };
})();
