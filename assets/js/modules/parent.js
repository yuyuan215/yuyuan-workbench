/* ============================================================
 * 板块：科学育儿
 *   A. 每日热门视频：5 条 B站 + 5 条抖音（按日轮换，可收藏）
 *   B. 每周育儿书单：2 本育儿书籍（微信读书 / 番茄小说直读，可加入书架）
 *   C. 我的育儿收藏：可粘贴任意视频链接收藏（B站自动内嵌播放）
 * ============================================================ */
var ModParent = (function () {
  var recoOffset = 0;
  var bookOffset = 0;

  /* ---------------- 数据源 ---------------- */
  function biliList() { return (typeof CONTENT !== 'undefined' && CONTENT.parentVideos && CONTENT.parentVideos.bili) || []; }
  function douyinList() { return (typeof CONTENT !== 'undefined' && CONTENT.parentVideos && CONTENT.parentVideos.douyin) || []; }
  function bookList() { return (typeof CONTENT !== 'undefined' && CONTENT.parentBooks) || []; }

  function douyinUrl(t) { return 'https://www.douyin.com/search/' + encodeURIComponent(t); }
  function extractBvid(u) { var m = String(u || '').match(/BV[0-9A-Za-z]+/); return m ? m[0] : null; }

  /* ---------------- 每日 10 条视频 ---------------- */
  function dailyBili() { return Util.seededPick(biliList(), Util.dayIndex() * 13 + recoOffset * 7, 5); }
  function dailyDouyin() { return Util.seededPick(douyinList(), Util.dayIndex() * 17 + recoOffset * 11 + 3, 5); }

  function biliCard(v) {
    return '<div class="item parent-card">' +
      '<div class="item-title">📺 ' + Util.esc(v.title || '') + '</div>' +
      '<div class="item-meta"><span class="tag accent">B站</span><span class="small muted">' + Util.esc(v.up || '') + '</span><span class="small muted">' + Util.esc(v.dur || '') + '</span></div>' +
      '<div class="bili-wrap"><iframe class="bili-player" src="https://player.bilibili.com/player.html?bvid=' + Util.esc(v.bvid) + '&page=1&high_quality=1&danmaku=0" allowfullscreen="true" scrolling="no" border="0" frameborder="no" framespacing="0" allow="autoplay; fullscreen"></iframe></div>' +
      (v.note ? '<div class="item-note">' + Util.esc(v.note) + '</div>' : '') +
      '<div class="item-actions">' +
        '<a class="btn btn-sm btn-primary" href="' + Util.esc(v.url) + '" target="_blank" rel="noopener">▶ 在 B 站打开</a>' +
        '<button class="btn btn-sm" data-fav-bili="' + Util.esc(v.bvid) + '">☆ 收藏</button>' +
      '</div></div>';
  }

  function douyinCard(v) {
    var url = douyinUrl(v.title);
    return '<div class="item parent-card">' +
      '<div class="item-title">🎬 ' + Util.esc(v.title || '') + '</div>' +
      '<div class="item-meta"><span class="tag ok">抖音</span><span class="small muted">' + Util.esc(v.up || '') + '</span></div>' +
      (v.note ? '<div class="item-note">' + Util.esc(v.note) + '</div>' : '') +
      '<div class="item-actions">' +
        '<a class="btn btn-sm btn-primary" href="' + Util.esc(url) + '" target="_blank" rel="noopener">▶ 在抖音打开</a>' +
        '<button class="btn btn-sm" data-fav-douyin="' + Util.esc(v.title) + '">☆ 收藏</button>' +
      '</div></div>';
  }

  function renderDaily() {
    var b = dailyBili(), d = dailyDouyin();
    var html = '';
    html += '<div class="reco-group"><div class="reco-group-hd">📺 B站 · 今日 5 条</div>' + b.map(biliCard).join('') + '</div>';
    html += '<div class="reco-group" style="margin-top:14px"><div class="reco-group-hd">🎬 抖音 · 今日 5 条</div>' + d.map(douyinCard).join('') + '</div>';
    var box = document.getElementById('parentDaily');
    if (box) box.innerHTML = html;
    var dt = document.getElementById('prDate');
    if (dt) dt.textContent = Util.humanDate();
  }

  function favBili(bvid) {
    var v = biliList().filter(function (x) { return x.bvid === bvid; })[0];
    if (!v) return;
    if (items().some(function (x) { return x.bvid === bvid; })) { Toast.show('这条已经在收藏里啦', 'info'); return; }
    DB.insert('parentVideos', { type: 'bili', bvid: v.bvid, url: v.url, title: v.title, up: v.up, addedAt: Date.now() });
    Toast.show('已收藏到「我的育儿收藏」', 'ok'); render();
  }
  function favDouyin(title) {
    var v = douyinList().filter(function (x) { return x.title === title; })[0];
    if (!v) return;
    var url = douyinUrl(title);
    if (items().some(function (x) { return x.url === url; })) { Toast.show('这条已经在收藏里啦', 'info'); return; }
    DB.insert('parentVideos', { type: 'douyin', url: url, title: title, up: v.up, addedAt: Date.now() });
    Toast.show('已收藏到「我的育儿收藏」', 'ok'); render();
  }

  /* ---------------- 我的育儿收藏 ---------------- */
  function items() { return DB.all('parentVideos'); }

  function favCard(it) {
    if (it.type === 'bili') {
      return '<div class="item parent-card">' +
        '<div class="item-title">' + Util.esc(it.title || 'B站视频') + '</div>' +
        '<div class="item-meta"><span class="tag accent">B站</span><span class="small muted">' + Util.esc(it.up || '') + '</span></div>' +
        '<div class="bili-wrap"><iframe class="bili-player" src="https://player.bilibili.com/player.html?bvid=' + Util.esc(it.bvid) + '&page=1&high_quality=1&danmaku=0" allowfullscreen="true" scrolling="no" border="0" frameborder="no" framespacing="0" allow="autoplay; fullscreen"></iframe></div>' +
        '<div class="item-actions" style="margin-top:8px"><a class="btn btn-sm btn-primary" href="' + Util.esc(it.url) + '" target="_blank" rel="noopener">▶ 在 B 站打开</a>' +
        '<button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button></div></div>';
    }
    var isDy = it.type === 'douyin' || /douyin/.test(it.url || '');
    return '<div class="item parent-card">' +
      '<div class="item-title">' + Util.esc(it.title || (isDy ? '抖音视频' : '育儿视频')) + '</div>' +
      '<div class="item-meta"><span class="tag ok">' + (isDy ? '抖音' : '链接') + '</span></div>' +
      '<div class="readbox" style="margin-top:6px;word-break:break-all">' + Util.esc(it.url) + '</div>' +
      '<div class="item-actions" style="margin-top:8px"><a class="btn btn-sm btn-primary" href="' + Util.esc(it.url) + '" target="_blank" rel="noopener">▶ 打开视频</a>' +
      '<button class="btn btn-sm btn-danger" data-del="' + it.id + '">删除</button></div></div>';
  }

  function renderFavs() {
    var all = items();
    var box = document.getElementById('parentList');
    var cnt = document.getElementById('parentCount');
    if (cnt) cnt.textContent = '共 ' + all.length + ' 条';
    if (box) box.innerHTML = all.length
      ? all.map(favCard).join('')
      : '<div class="empty">还没有收藏的育儿视频～ 在上方每日视频点 ☆ 收藏，或粘贴链接添加吧 🍼</div>';
    var badge = document.getElementById('badgeParent');
    if (badge) badge.textContent = all.length;
  }

  function renderStats() {
    var all = items();
    var bili = all.filter(function (x) { return x.type === 'bili'; }).length;
    var dy = all.filter(function (x) { return x.type === 'douyin'; }).length;
    var link = all.filter(function (x) { return x.type === 'link'; }).length;
    document.getElementById('parentStats').innerHTML = [
      { n: all.length, l: '育儿收藏', x: '视频总数' },
      { n: bili, l: 'B站', x: '可内嵌播放' },
      { n: dy + link, l: '抖音/链接', x: '可打开' },
      { n: 2, l: '每周育儿书', x: '本周推荐' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');
  }

  function add() {
    var link = document.getElementById('prLink').value.trim();
    var title = document.getElementById('prTitle').value.trim();
    var plat = document.getElementById('prPlat').value;
    if (!link) { Toast.show('请粘贴视频链接', 'warn'); return; }
    if (items().some(function (x) { return x.url === link; })) { Toast.show('这条已经在收藏里啦', 'info'); return; }
    var bv = extractBvid(link);
    var type = bv ? 'bili' : (plat === 'douyin' ? 'douyin' : 'link');
    var rec = { type: type, url: link, title: title || (type === 'bili' ? 'B站视频' : (type === 'douyin' ? '抖音视频' : '育儿视频')), addedAt: Date.now() };
    if (bv) rec.bvid = bv;
    DB.insert('parentVideos', rec);
    Toast.show('已添加到「我的育儿收藏」', 'ok');
    document.getElementById('prLink').value = '';
    document.getElementById('prTitle').value = '';
    render();
  }

  function del(id) { DB.remove('parentVideos', id); Toast.show('已删除', 'info'); render(); }

  /* ---------------- 每周 2 本育儿书 ---------------- */
  function weekBooks() {
    var arr = bookList();
    var wi = Math.floor(Util.dayIndex() / 7);
    return Util.seededPick(arr, wi * 13 + bookOffset * 7, 2);
  }
  function wereadUrl(t) { return 'https://weread.qq.com/search?keyword=' + encodeURIComponent(t); }
  function tomatoUrl(t) { return 'https://fanqienovel.com/search?query=' + encodeURIComponent(t); }

  function bookCard(b) {
    return '<div class="lib-reco">' +
      '<div class="lib-reco-hd">' +
        '<span class="lib-rank">📚</span>' +
        '<div class="grow">' +
          '<div class="lib-reco-t">' + Util.esc(b.title) + '</div>' +
          '<div class="item-meta"><span class="tag info">育儿</span>' +
          (b.author ? '<span class="muted small">' + Util.esc(b.author) + '</span>' : '') + '</div>' +
          (b.why ? '<div class="small muted">荐：' + Util.esc(b.why) + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="lib-reco-books"><div class="lib-book"><div class="grow"></div>' +
        '<div class="row" style="gap:8px;flex-wrap:wrap">' +
          '<a class="btn btn-sm btn-primary" href="' + wereadUrl(b.title) + '" target="_blank" rel="noopener">📖 在微信读书打开</a>' +
          '<a class="btn btn-sm" href="' + tomatoUrl(b.title) + '" target="_blank" rel="noopener">🍅 在番茄小说打开</a>' +
          '<button class="btn btn-sm" data-pbook="1" data-title="' + Util.esc(b.title) + '" data-author="' + Util.esc(b.author || '') + '">加入书架</button>' +
        '</div></div></div></div>';
  }

  function renderBooks() {
    var books = weekBooks();
    var box = document.getElementById('parentBooks');
    if (box) box.innerHTML = books.map(bookCard).join('');
    var wr = document.getElementById('prWeekRange');
    if (wr) { var r = Util.weekRange(); wr.textContent = r.start + ' ~ ' + r.end; }
  }

  function addBook(title, author) {
    var exist = DB.all('books').some(function (b) { return b.title === title; });
    if (exist) { Toast.show('《' + title + '》已在书架中', 'warn'); return; }
    DB.insert('books', { title: title, author: author || '', cat: '亲子教育', status: 'todo', rate: 0, note: '', highlights: [], startAt: '', finishAt: '' });
    Toast.show('已加入书架并归档到「想读」', 'ok');
    if (window.ModLibrary && ModLibrary.render) ModLibrary.render();
    render();
  }

  /* ---------------- 渲染 & 事件 ---------------- */
  function render() { renderStats(); renderDaily(); renderBooks(); renderFavs(); }

  function init() {
    var rf = document.getElementById('prRefresh');
    if (rf) rf.addEventListener('click', function () { recoOffset = (recoOffset + 1) % 97; renderDaily(); Toast.show('已换一批今日视频', 'info'); });
    var bs = document.getElementById('prBookShuffle');
    if (bs) bs.addEventListener('click', function () { bookOffset = (bookOffset + 1) % 97; renderBooks(); Toast.show('已换一批书单', 'info'); });

    var daily = document.getElementById('parentDaily');
    if (daily) daily.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fav-bili]'); if (b) { favBili(b.dataset.favBili); return; }
      var d = e.target.closest('[data-fav-douyin]'); if (d) { favDouyin(d.dataset.favDouyin); return; }
    });

    var bk = document.getElementById('parentBooks');
    if (bk) bk.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-pbook]'); if (!btn) return;
      addBook(btn.dataset.title, btn.dataset.author);
    });

    document.getElementById('prAdd').addEventListener('click', add);
    document.getElementById('prLink').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });

    document.getElementById('parentList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-del]'); if (!b) return;
      del(b.dataset.del);
    });
  }

  return { init: init, render: render };
})();
