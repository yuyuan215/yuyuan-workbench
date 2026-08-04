/* ============================================================
 * 板块2：投资学习（老板助理专属场景）
 * 每日财经资讯 / 市场观点 / 投资干货 / 书籍摘要 / 收藏知识库
 * ============================================================ */
var ModInvest = (function () {
  var offsetKey = 'paw.inv.offset';
  var offset = 0;
  var zoom = false;
  var favFilter = 'all';
  var favKw = '';
  var remoteNews = null;

  function getOffset() {
    try { offset = parseInt(sessionStorage.getItem(offsetKey) || '0', 10) || 0; } catch (e) { offset = 0; }
    return offset;
  }
  function bumpOffset() {
    offset = getOffset() + 1;
    try { sessionStorage.setItem(offsetKey, offset); } catch (e) {}
  }

  function seed(extra) { return Util.dayIndex() * 13 + getOffset() * 7 + (extra || 0); }

  function isFav(key) {
    return DB.all('favs').some(function (f) { return f.key === key; });
  }

  function toggleFav(payload) {
    var exist = DB.all('favs').filter(function (f) { return f.key === payload.key; })[0];
    if (exist) { DB.remove('favs', exist.id); Toast.show('已取消收藏', 'info'); }
    else { DB.insert('favs', payload); Toast.show('已收藏至个人投资知识库', 'ok'); }
    render();
  }

  /* ---------- 今日内容渲染 ---------- */
  function renderNews() {
    var list = remoteNews && remoteNews.length ? remoteNews : Util.seededPick(CONTENT.news, seed(1), 6);
    document.getElementById('invDate').textContent = Util.humanDate() + (remoteNews ? ' · 联网实时' : ' · 每日自动更新');
    document.getElementById('invNews').innerHTML = list.map(function (n, i) {
      var key = 'news::' + n.t;
      return '<div class="item">' +
        '<div class="item-title">' + Util.esc(n.t) + '</div>' +
        '<div class="item-meta"><span class="tag info">' + Util.esc(n.tag || '资讯') + '</span><span>' + Util.esc(n.s || '') + '</span></div>' +
        '<div class="readbox' + (zoom ? ' zoom' : '') + '" style="margin-top:8px">' + Util.esc(n.d || '') + '</div>' +
        (n.url ? '<div class="item-meta"><a href="' + Util.esc(n.url) + '" target="_blank" rel="noopener">查看原文 →</a></div>' : '') +
        '<div class="item-actions">' +
        '<button class="btn btn-sm" data-fav="news" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button>' +
        '</div></div>';
    }).join('');
    document.getElementById('invNews')._data = list;
  }

  function renderViews() {
    var list = Util.seededPick(CONTENT.views, seed(2), 2);
    document.getElementById('invViews').innerHTML = list.map(function (v, i) {
      var key = 'view::' + v.t;
      return '<div class="item">' +
        '<div class="item-title">' + Util.esc(v.t) + '</div>' +
        '<div class="item-meta"><span class="tag accent">' + Util.esc(v.who) + '</span></div>' +
        '<div class="readbox' + (zoom ? ' zoom' : '') + '" style="margin-top:8px">' + Util.esc(v.d) + '</div>' +
        '<div class="item-actions"><button class="btn btn-sm" data-fav="view" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button></div>' +
        '</div>';
    }).join('');
    document.getElementById('invViews')._data = list;
  }

  function renderTips() {
    var list = Util.seededPick(CONTENT.tips, seed(3), 2);
    document.getElementById('invTips').innerHTML = list.map(function (v, i) {
      var key = 'tip::' + v.t;
      return '<div class="item">' +
        '<div class="item-title">' + Util.esc(v.t) + '</div>' +
        '<div class="readbox' + (zoom ? ' zoom' : '') + '" style="margin-top:8px">' + Util.esc(v.d) + '</div>' +
        '<div class="item-actions"><button class="btn btn-sm" data-fav="tip" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button></div>' +
        '</div>';
    }).join('');
    document.getElementById('invTips')._data = list;
  }

  function renderBook() {
    var b = Util.seededPick(CONTENT.bookNotes, seed(4), 1)[0];
    var key = 'book::' + b.book;
    document.getElementById('invBook').innerHTML =
      '<div class="item">' +
      '<div class="item-title">' + Util.esc(b.book) + '　<span class="muted small">' + Util.esc(b.author) + '</span></div>' +
      '<div class="quote" style="margin-top:10px">' + Util.esc(b.core) + '</div>' +
      '<div class="readbox' + (zoom ? ' zoom' : '') + '" style="margin-top:10px"><b>核心要点</b><ul style="margin:6px 0 0;padding-left:20px">' +
      b.points.map(function (p) { return '<li>' + Util.esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="item-note"><b>今日行动：</b>' + Util.esc(b.action) + '</div>' +
      '<div class="item-actions">' +
      '<button class="btn btn-sm" data-fav="book" data-i="0">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button>' +
      '<button class="btn btn-sm" id="bookToLib">加入个人图书馆</button>' +
      '</div></div>';
    document.getElementById('invBook')._data = [b];
    var btn = document.getElementById('bookToLib');
    if (btn) btn.addEventListener('click', function () {
      var exists = DB.all('books').some(function (x) { return x.title === b.book; });
      if (exists) { Toast.show('该书已在图书馆中', 'info'); return; }
      DB.insert('books', {
        title: b.book, author: b.author, cat: '投资理财', status: 'todo', rate: 0,
        note: b.core + '\n\n核心要点：\n- ' + b.points.join('\n- '), highlights: []
      });
      Toast.show('已加入个人图书馆（待读）', 'ok');
      if (window.ModLibrary) ModLibrary.render();
    });
  }

  /* ---------- 每日 5 大投资关键词 ---------- */
  function renderTerms() {
    var list = Util.seededPick(CONTENT.investTerms, seed(5), 5);
    document.getElementById('invTerms').innerHTML = list.map(function (x, i) {
      var key = 'term::' + x.t;
      return '<div class="item term-card">' +
        '<div class="item-title">' + Util.esc(x.t) + ' <span class="tag info">' + Util.esc(x.cat) + '</span></div>' +
        '<div class="readbox' + (zoom ? ' zoom' : '') + '" style="margin-top:8px">' + Util.esc(x.intro) + '</div>' +
        '<div class="item-note"><b>举例：</b>' + Util.esc(x.example) + '</div>' +
        '<div class="item-actions"><button class="btn btn-sm" data-fav="term" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button></div>' +
        '</div>';
    }).join('');
    document.getElementById('invTerms')._data = list;
  }

  /* ---------- 每日 15 条投资知识 + 创业案例 ---------- */
  function renderCases() {
    var list = Util.seededPick(CONTENT.investCases, seed(6), 15);
    document.getElementById('invCases').innerHTML = list.map(function (x, i) {
      var key = 'case::' + x.t;
      var isCase = x.type === '案例';
      return '<div class="item case-card">' +
        '<div class="item-title">' + Util.esc(x.t) + '</div>' +
        '<div class="item-meta"><span class="tag ' + (isCase ? 'accent' : 'ok') + '">' + Util.esc(x.type) + '</span><span class="tag">' + Util.esc(x.tag) + '</span></div>' +
        '<div class="readbox' + (zoom ? ' zoom' : '') + '" style="margin-top:8px">' + Util.esc(x.d) + '</div>' +
        '<div class="item-actions"><button class="btn btn-sm" data-fav="case" data-i="' + i + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button></div>' +
        '</div>';
    }).join('');
    document.getElementById('invCases')._data = list;
  }

  /* ---------- 收藏知识库 ---------- */
  function renderFavs() {
    var favs = DB.all('favs').sort(function (a, b) { return b.createdAt - a.createdAt; });
    var types = [['all', '全部'], ['news', '财经资讯'], ['view', '市场观点'], ['tip', '投资干货'], ['term', '投资关键词'], ['case', '知识案例'], ['book', '书籍摘要'], ['article', '中文美文']];
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
        ' <span class="tag ' + (f.type === 'book' ? 'accent' : 'info') + '" style="margin-left:auto">' + typeName(f.type) + '</span></summary>' +
        '<div class="body"><div class="readbox' + (zoom ? ' zoom' : '') + '">' + Util.esc(f.body || '') + '</div>' +
        '<div class="item-meta"><span>收藏于 ' + Util.shortTime(f.createdAt) + '</span>' + (f.source ? '<span>· ' + Util.esc(f.source) + '</span>' : '') + '</div>' +
        '<div class="item-actions"><button class="btn btn-sm btn-danger" data-del="' + f.id + '">移出知识库</button></div>' +
        '</div></details>';
    }).join('') : '<div class="empty">知识库还是空的，在上方内容中点击「收藏」即可归档</div>';

    var badge = document.getElementById('badgeInvest');
    if (badge) badge.textContent = favs.length;
  }

  function typeName(t) {
    return { news: '财经资讯', view: '市场观点', tip: '投资干货', term: '投资关键词', case: '知识案例', book: '书籍摘要', article: '中文美文' }[t] || '资料';
  }

  /* ---------- 联网抓取（可选增强） ---------- */
  function fetchRemote() {
    var btn = document.getElementById('invFetch');
    btn.disabled = true; btn.textContent = '抓取中…';
    var target = encodeURIComponent('https://feed.mix.sina.com.cn/api/roll/get?pageid=155&lid=1686&num=12&page=1');
    var proxies = [
      'https://api.allorigins.win/raw?url=' + target,
      'https://corsproxy.io/?' + target
    ];
    var i = 0;
    function attempt() {
      if (i >= proxies.length) {
        btn.disabled = false; btn.textContent = '联网抓取';
        Toast.show('实时抓取失败（网络或跨域限制），已保留内置每日精选内容', 'warn');
        return;
      }
      fetch(proxies[i++], { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) {
          var arr = (j && j.result && j.result.data) || [];
          if (!arr.length) throw new Error('empty');
          remoteNews = arr.slice(0, 8).map(function (x) {
            return {
              t: x.title, s: x.media_name || '新浪财经', tag: '实时',
              d: (x.intro || x.summary || x.wapsummary || '点击查看原文了解详情。').replace(/<[^>]+>/g, ''),
              url: x.url
            };
          });
          btn.disabled = false; btn.textContent = '联网抓取';
          Toast.show('已加载 ' + remoteNews.length + ' 条实时财经资讯', 'ok');
          renderNews();
        })
        .catch(function () { attempt(); });
    }
    attempt();
  }

  function exportFavs() {
    var favs = DB.all('favs');
    if (!favs.length) { Toast.show('知识库为空', 'warn'); return; }
    var text = favs.map(function (f) {
      return '【' + typeName(f.type) + '】' + f.title + '\n' + (f.body || '') + '\n收藏时间：' + Util.shortTime(f.createdAt) + '\n';
    }).join('\n----------------------------------------\n');
    Util.download('投资知识库_' + Util.today() + '.txt', text);
    Toast.show('已导出 ' + favs.length + ' 条收藏', 'ok');
  }

  function renderProgress() {
    var total = 31;
    var favs = DB.all('favs').length;
    var pct = Math.min(100, Math.round(favs / total * 100));
    var bar = document.getElementById('invProgBar');
    if (bar) bar.style.width = pct + '%';
    var p = document.getElementById('invProgPct'); if (p) p.textContent = pct + '%';
    var t = document.getElementById('invProgText'); if (t) t.textContent = '个人知识库已收藏 ' + favs + ' 条 · 今日推荐 ' + total + ' 条，挑感兴趣的收藏起来吧';
  }

  function render() {
    renderNews(); renderViews(); renderTips(); renderBook(); renderTerms(); renderCases(); renderFavs(); renderProgress();
  }

  function bindFavClicks(containerId, type) {
    document.getElementById(containerId).addEventListener('click', function (e) {
      var b = e.target.closest('button[data-fav]'); if (!b) return;
      var data = this._data || [];
      var d = data[parseInt(b.dataset.i, 10)];
      if (!d) return;
      if (type === 'news') toggleFav({ key: 'news::' + d.t, type: 'news', title: d.t, source: d.s, body: d.d, url: d.url || '' });
      if (type === 'view') toggleFav({ key: 'view::' + d.t, type: 'view', title: d.t, source: d.who, body: d.d });
      if (type === 'tip') toggleFav({ key: 'tip::' + d.t, type: 'tip', title: d.t, source: '投资干货', body: d.d });
      if (type === 'book') toggleFav({
        key: 'book::' + d.book, type: 'book', title: d.book + '（' + d.author + '）', source: '书籍摘要',
        body: d.core + '\n\n核心要点：\n- ' + d.points.join('\n- ') + '\n\n今日行动：' + d.action
      });
      if (type === 'term') { var td = data[parseInt(b.dataset.i, 10)]; if (td) toggleFav({ key: 'term::' + td.t, type: 'term', title: td.t, source: td.cat, body: td.intro + '\n\n举例：' + td.example }); }
      if (type === 'case') { var cd = data[parseInt(b.dataset.i, 10)]; if (cd) toggleFav({ key: 'case::' + cd.t, type: 'case', title: cd.t, source: cd.type + ' · ' + cd.tag, body: cd.d }); }
    });
  }

  function init() {
    getOffset();
    bindFavClicks('invNews', 'news');
    bindFavClicks('invViews', 'view');
    bindFavClicks('invTips', 'tip');
    bindFavClicks('invBook', 'book');
    bindFavClicks('invTerms', 'term');
    bindFavClicks('invCases', 'case');

    document.getElementById('invRefresh').addEventListener('click', function () {
      bumpOffset(); remoteNews = null; render(); Toast.show('已切换到另一批精选内容', 'info');
    });
    document.getElementById('invFetch').addEventListener('click', fetchRemote);
    document.getElementById('invReadMode').addEventListener('click', function () {
      zoom = !zoom; this.textContent = zoom ? '退出快速阅读' : '快速阅读模式'; render();
    });
    document.getElementById('favSearch').addEventListener('input', Util.debounce(function (e) {
      favKw = e.target.value.trim(); renderFavs();
    }, 200));
    document.getElementById('favFilters').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      favFilter = b.dataset.v; renderFavs();
    });
    document.getElementById('favList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-del]'); if (!b) return;
      DB.remove('favs', b.dataset.del); Toast.show('已移出知识库', 'info'); renderFavs();
    });
    document.getElementById('favExport').addEventListener('click', exportFavs);
  }

  return { init: init, render: render, renderFavs: renderFavs };
})();
