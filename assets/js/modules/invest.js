/* ============================================================
 * 板块2：建立财商
 * 每日商业人物/投资者视频 · 10 个深度投资名词 · 10 个创业知识/案例长文 · 个人知识库
 * ============================================================ */
var ModInvest = (function () {
  var offsetKey = 'paw.inv.offset';
  var offset = 0;
  var favFilter = 'all';
  var favKw = '';

  function getOffset() {
    try { offset = parseInt(sessionStorage.getItem(offsetKey) || '0', 10) || 0; } catch (e) { offset = 0; }
    return offset;
  }
  function bumpOffset() {
    offset = getOffset() + 1;
    try { sessionStorage.setItem(offsetKey, offset); } catch (e) {}
  }
  function seed(extra) { return Util.dayIndex() * 13 + getOffset() * 7 + (extra || 0); }

  function isFav(key) { return DB.all('favs').some(function (f) { return f.key === key; }); }
  function toggleFav(payload) {
    var exist = DB.all('favs').filter(function (f) { return f.key === payload.key; })[0];
    if (exist) { DB.remove('favs', exist.id); Toast.show('已取消收藏', 'info'); }
    else { DB.insert('favs', payload); Toast.show('已收藏至个人财商知识库', 'ok'); }
    renderFavs();
  }

  /* ---------- 每日视频 ---------- */
  function renderVideo() {
    var v = Util.seededPick(CONTENT.financeVideos, seed(1), 1)[0];
    document.getElementById('invVideoDate').textContent = Util.humanDate();
    var key = 'fvideo::' + v.title;
    document.getElementById('invVideo').innerHTML =
      '<div class="video-card">' +
        '<div class="vc-top">' +
          '<span class="vc-platform">' + Util.esc(v.platform) + '</span>' +
          '<span class="tag info">' + Util.esc(v.tag || '商业') + '</span>' +
          '<span class="muted small">约 ' + Util.esc(v.duration || '—') + '</span>' +
        '</div>' +
        '<div class="vc-title">' + Util.esc(v.title) + '</div>' +
        '<div class="vc-person">' + Util.esc(v.person || '') + ' · ' + Util.esc(v.role || '') + '</div>' +
        '<div class="vc-desc">' + Util.esc(v.desc || '') + '</div>' +
        '<div class="vc-actions">' +
          '<a class="btn btn-sm btn-primary" href="' + Util.esc(v.url) + '" target="_blank" rel="noopener">▶ 观看视频</a>' +
          '<button class="btn btn-sm" data-fav="video" data-title="' + Util.esc(v.title) + '" data-person="' + Util.esc(v.person || '') + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button>' +
        '</div>' +
      '</div>';
  }

  /* ---------- 每日 10 个深度名词 ---------- */
  function renderTerms() {
    var list = Util.seededPick(CONTENT.deepTerms, seed(2), 10);
    document.getElementById('invTerms').innerHTML = list.map(function (x, i) {
      var key = 'dterm::' + x.t;
      return '<div class="item term-card">' +
        '<div class="item-title">' + Util.esc(x.t) + ' <span class="tag info">' + Util.esc(x.cat) + '</span></div>' +
        '<div class="readbox zoomable" style="margin-top:8px"><b>定义</b><div style="margin-top:4px">' + Util.esc(x.def) + '</div>' +
          '<b>为什么重要</b><div style="margin-top:4px">' + Util.esc(x.why) + '</div>' +
          '<b>举例</b><div style="margin-top:4px">' + Util.esc(x.example) + '</div>' +
          '<b>常见误区</b><div style="margin-top:4px">' + Util.esc(x.mistake) + '</div></div>' +
        '<div class="item-actions"><button class="btn btn-sm" data-fav="dterm" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button></div>' +
      '</div>';
    }).join('');
    document.getElementById('invTerms')._data = list;
  }

  /* ---------- 每日 10 个创业知识 / 案例（可点开长文） ---------- */
  function renderCases() {
    var list = Util.seededPick(CONTENT.deepCases, seed(3), 10);
    document.getElementById('invCases').innerHTML = list.map(function (x, i) {
      var key = 'dcase::' + x.t;
      var isCase = x.type === '案例';
      return '<div class="item case-card clickable" data-open="' + i + '">' +
        '<div class="item-title">' + Util.esc(x.t) + '</div>' +
        '<div class="item-meta"><span class="tag ' + (isCase ? 'accent' : 'ok') + '">' + Util.esc(x.type) + '</span><span class="tag">' + Util.esc(x.tag) + '</span></div>' +
        '<div class="readbox" style="margin-top:8px">' + Util.esc(x.summary) + '</div>' +
        '<div class="item-actions">' +
          '<button class="btn btn-sm" data-open="' + i + '">📖 阅读深度长文</button>' +
          '<button class="btn btn-sm" data-fav="dcase" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button>' +
        '</div></div>';
    }).join('');
    document.getElementById('invCases')._data = list;
  }

  function openCase(d) {
    var body = '<div class="item-meta"><span class="tag ' + (d.type === '案例' ? 'accent' : 'ok') + '">' + Util.esc(d.type) + '</span><span class="tag">' + Util.esc(d.tag) + '</span></div>' +
      '<div class="quote" style="margin-top:12px">' + Util.esc(d.summary) + '</div>' +
      '<div class="readbox" style="margin-top:12px">' + (d.deep || []).map(function (p) { return '<p style="margin:0 0 12px">' + Util.esc(p) + '</p>'; }).join('') + '</div>' +
      '<div class="item-actions"><button class="btn btn-sm" data-fav="dcase-live" data-title="' + Util.esc(d.t) + '" data-type="' + Util.esc(d.type) + '" data-tag="' + Util.esc(d.tag) + '" data-sum="' + Util.esc(d.summary) + '">☆ 收藏此文</button></div>';
    window.App.openModal(d.t, body, [{ label: '关闭', primary: true, onClick: window.App.closeModal }]);
  }

  /* ---------- 收藏知识库 ---------- */
  function renderFavs() {
    var favs = DB.all('favs').sort(function (a, b) { return b.createdAt - a.createdAt; });
    var types = [['all', '全部'], ['video', '视频'], ['dterm', '投资名词'], ['dcase', '知识案例'], ['news', '财经资讯'], ['view', '市场观点'], ['tip', '投资干货'], ['book', '书籍摘要']];
    document.getElementById('favFilters').innerHTML = types.map(function (t) {
      var n = t[0] === 'all' ? favs.length : favs.filter(function (f) { return f.type === t[0]; }).length;
      return '<button class="chip' + (favFilter === t[0] ? ' on' : '') + '" data-v="' + t[0] + '">' + t[1] + ' ' + n + '</button>';
    }).join('');

    var list = favs.filter(function (f) {
      if (favFilter !== 'all' && f.type !== favFilter) return false;
      if (favKw && (f.title + ' ' + (f.body || '')).toLowerCase().indexOf(favKw.toLowerCase()) < 0) return false;
      return true;
    });

    document.getElementById('favCount').textContent = '共 ' + favs.length + ' 条';
    document.getElementById('favList').innerHTML = list.length ? list.map(function (f) {
      return '<details class="acc"><summary>' + Util.esc(f.title) +
        ' <span class="tag info" style="margin-left:auto">' + typeName(f.type) + '</span></summary>' +
        '<div class="body"><div class="readbox">' + Util.esc(f.body || '') + '</div>' +
        '<div class="item-meta"><span>收藏于 ' + Util.shortTime(f.createdAt) + '</span>' + (f.source ? '<span>· ' + Util.esc(f.source) + '</span>' : '') + '</div>' +
        '<div class="item-actions"><button class="btn btn-sm btn-danger" data-del="' + f.id + '">移出知识库</button></div>' +
        '</div></details>';
    }).join('') : '<div class="empty">知识库还是空的，在上方内容中点击「收藏」即可归档</div>';

    var badge = document.getElementById('badgeInvest');
    if (badge) badge.textContent = favs.length;
  }
  function typeName(t) {
    return { video: '视频', dterm: '投资名词', dcase: '知识案例', news: '财经资讯', view: '市场观点', tip: '投资干货', book: '书籍摘要', article: '中文美文' }[t] || '资料';
  }

  function exportFavs() {
    var favs = DB.all('favs');
    if (!favs.length) { Toast.show('知识库为空', 'warn'); return; }
    var text = favs.map(function (f) { return '【' + typeName(f.type) + '】' + f.title + '\n' + (f.body || '') + '\n收藏时间：' + Util.shortTime(f.createdAt) + '\n'; }).join('\n----------------------------------------\n');
    Util.download('财商知识库_' + Util.today() + '.txt', text);
    Toast.show('已导出 ' + favs.length + ' 条收藏', 'ok');
  }

  function renderProgress() {
    var total = 21;
    var favs = DB.all('favs').length;
    var pct = Math.min(100, Math.round(favs / total * 100));
    var bar = document.getElementById('invProgBar');
    if (bar) bar.style.width = pct + '%';
    var p = document.getElementById('invProgPct'); if (p) p.textContent = pct + '%';
    var t = document.getElementById('invProgText'); if (t) t.textContent = '个人知识库已收藏 ' + favs + ' 条 · 今日推荐 ' + total + ' 条（1 视频 + 10 名词 + 10 案例），挑感兴趣的收藏起来吧';
  }

  function render() {
    renderVideo(); renderTerms(); renderCases(); renderFavs(); renderProgress();
  }

  function bindFavClicks() {
    // 视频收藏
    document.getElementById('invVideo').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-fav="video"]'); if (!b) return;
      var key = 'fvideo::' + b.dataset.title;
      toggleFav({ key: key, type: 'video', title: b.dataset.title, source: b.dataset.person || '商业视频', body: '每日财商视频：' + b.dataset.title });
    });
    // 名词收藏
    document.getElementById('invTerms').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-fav="dterm"]'); if (!b) return;
      var d = (this._data || [])[parseInt(b.dataset.i, 10)]; if (!d) return;
      toggleFav({ key: 'dterm::' + d.t, type: 'dterm', title: d.t, source: d.cat, body: d.def + '\n\n为什么重要：' + d.why + '\n\n举例：' + d.example + '\n\n常见误区：' + d.mistake });
    });
    // 案例收藏
    document.getElementById('invCases').addEventListener('click', function (e) {
      var bf = e.target.closest('button[data-fav="dcase"]');
      if (bf) {
        var d = (this._data || [])[parseInt(bf.dataset.i, 10)]; if (!d) return;
        toggleFav({ key: 'dcase::' + d.t, type: 'dcase', title: d.t, source: d.type + ' · ' + d.tag, body: d.summary + '\n\n' + (d.deep || []).join('\n') });
        return;
      }
      var bo = e.target.closest('[data-open]');
      if (bo) { var dd = (this._data || [])[parseInt(bo.dataset.open, 10)]; if (dd) openCase(dd); }
    });
  }

  function init() {
    getOffset();
    bindFavClicks();
    var rf = document.getElementById('invRefresh');
    if (rf) rf.addEventListener('click', function () { bumpOffset(); render(); Toast.show('已切换到另一批精选内容', 'info'); });
    document.getElementById('favSearch').addEventListener('input', Util.debounce(function (e) { favKw = e.target.value.trim(); renderFavs(); }, 200));
    document.getElementById('favFilters').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return; favFilter = b.dataset.v; renderFavs();
    });
    document.getElementById('favList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-del]'); if (!b) return; DB.remove('favs', b.dataset.del); Toast.show('已移出知识库', 'info'); renderFavs();
    });
    // 弹窗内收藏（长文）
    document.getElementById('favList'); // noop guard
    document.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-fav="dcase-live"]'); if (!b) return;
      toggleFav({ key: 'dcase::' + b.dataset.title, type: 'dcase', title: b.dataset.title, source: b.dataset.type + ' · ' + b.dataset.tag, body: b.dataset.sum });
      window.App.closeModal();
    });
    document.getElementById('favExport').addEventListener('click', exportFavs);
  }

  return { init: init, render: render, renderFavs: renderFavs };
})();
