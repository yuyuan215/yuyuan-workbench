/* ============================================================
 * 板块：美商提升（抖音美妆 / 穿搭 / 护肤 / 发型教程收藏）
 * 每日按日轮换 curated 教程（卡片 + 跳链搜索）· 分类筛选 · 收藏 · 手动新增
 * ============================================================ */
var ModBeauty = (function () {
  var cat = 'all';
  var CATS = [['all', '全部'], ['妆容', '妆容'], ['穿搭', '穿搭'], ['护肤', '护肤'], ['发型', '发型']];
  var CATCLS = { '妆容': 'accent', '穿搭': 'ok', '护肤': 'info', '发型': '' };

  function seed() { return Util.dayIndex() * 7; }

  function isFav(key) { return DB.all('beautyFavs').some(function (f) { return f.key === key; }); }
  function toggleFav(tip) {
    var exist = DB.all('beautyFavs').filter(function (f) { return f.key === tip.key; })[0];
    if (exist) { DB.remove('beautyFavs', exist.id); Toast.show('已取消收藏', 'info'); }
    else {
      DB.insert('beautyFavs', { key: tip.key, title: tip.title, cat: tip.cat, creator: tip.creator || '', url: tip.url, desc: tip.desc || '', tags: tip.tags || [], source: tip.creator || '抖音' });
      Toast.show('已收藏到「我的美商收藏」', 'ok');
    }
    renderFavs();
  }

  function tipCard(t, opts) {
    opts = opts || {};
    var key = 'btip::' + t.title;
    var cls = CATCLS[t.cat] || '';
    return '<div class="item beauty-card">' +
      '<div class="item-title">' + Util.esc(t.title) + '</div>' +
      '<div class="item-meta"><span class="tag ' + cls + '">' + Util.esc(t.cat) + '</span>' +
        (t.creator ? '<span class="tag">' + Util.esc(t.creator) + '</span>' : '') +
        (t.duration ? '<span class="muted small">约 ' + Util.esc(t.duration) + '</span>' : '') + '</div>' +
      (t.desc ? '<div class="readbox" style="margin-top:8px">' + Util.esc(t.desc) + '</div>' : '') +
      (t.tags && t.tags.length ? '<div class="item-meta" style="margin-top:6px">' + t.tags.map(function (x) { return '<span class="small muted"># ' + Util.esc(x) + '</span>'; }).join(' ') + '</div>' : '') +
      '<div class="item-actions" style="margin-top:8px">' +
        '<a class="btn btn-sm btn-primary" href="' + Util.esc(t.url) + '" target="_blank" rel="noopener">▶ 去抖音看教程</a>' +
        '<button class="btn btn-sm" data-fav="' + (opts.from || 'daily') + '" data-title="' + Util.esc(t.title) + '" data-cat="' + Util.esc(t.cat) + '" data-creator="' + Util.esc(t.creator || '') + '" data-url="' + Util.esc(t.url) + '" data-desc="' + Util.esc(t.desc || '') + '">' + (isFav(key) ? '★ 已收藏' : '☆ 收藏') + '</button>' +
      '</div></div>';
  }

  function renderDaily() {
    document.getElementById('beautyDate').textContent = Util.humanDate() + ' · 每日轮换';
    var list = Util.seededPick(CONTENT.beautyTips, seed(), 6);
    if (cat !== 'all') list = list.filter(function (t) { return t.cat === cat; });
    document.getElementById('beautyCats').innerHTML = CATS.map(function (c) {
      return '<button class="chip' + (cat === c[0] ? ' on' : '') + '" data-v="' + c[0] + '">' + c[1] + '</button>';
    }).join('');
    document.getElementById('beautyList').innerHTML = list.length ? list.map(function (t) { return tipCard(t); }).join('')
      : '<div class="empty">该分类今日暂无轮换内容，换个分类或点「换一批」</div>';
  }

  function renderFavs() {
    var favs = DB.all('beautyFavs').sort(function (a, b) { return b.createdAt - a.createdAt; });
    document.getElementById('beautyFavCount').textContent = '共 ' + favs.length + ' 条';
    document.getElementById('beautyFavList').innerHTML = favs.length ? favs.map(function (f) {
      return '<div class="item beauty-card">' +
        '<div class="item-title">' + Util.esc(f.title) + '</div>' +
        '<div class="item-meta"><span class="tag ' + (CATCLS[f.cat] || '') + '">' + Util.esc(f.cat) + '</span>' + (f.creator ? '<span class="tag">' + Util.esc(f.creator) + '</span>' : '') + '</div>' +
        (f.desc ? '<div class="readbox" style="margin-top:8px">' + Util.esc(f.desc) + '</div>' : '') +
        '<div class="item-actions" style="margin-top:8px">' +
          (f.url ? '<a class="btn btn-sm btn-primary" href="' + Util.esc(f.url) + '" target="_blank" rel="noopener">▶ 去看教程</a>' : '') +
          '<button class="btn btn-sm btn-danger" data-delfav="' + f.id + '">移出收藏</button>' +
        '</div></div>';
    }).join('') : '<div class="empty">还没有收藏，去上方「今日美商补给」点 ☆ 收藏，或手动添加你的私藏教程</div>';

    var badge = document.getElementById('badgeBeauty');
    if (badge) badge.textContent = favs.length;
    renderStats(favs);
  }

  function renderStats(favs) {
    var byCat = { '妆容': 0, '穿搭': 0, '护肤': 0, '发型': 0 };
    favs.forEach(function (f) { if (byCat[f.cat] != null) byCat[f.cat]++; });
    document.getElementById('beautyStats').innerHTML = [
      { n: favs.length, l: '收藏总数', x: '美商素材库' },
      { n: byCat['妆容'], l: '妆容', x: '已收藏' },
      { n: byCat['穿搭'], l: '穿搭', x: '已收藏' },
      { n: byCat['护肤'] + byCat['发型'], l: '护肤 + 发型', x: '已收藏' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');
  }

  function render() { renderDaily(); renderFavs(); }

  function addManual() {
    var title = document.getElementById('bTitle').value.trim();
    if (!title) { Toast.show('请填写教程标题', 'warn'); return; }
    var catv = document.getElementById('bCat').value;
    var creator = document.getElementById('bCreator').value.trim();
    var url = document.getElementById('bUrl').value.trim() || ('https://www.douyin.com/search/' + encodeURIComponent(title));
    var key = 'btip::' + title;
    if (DB.all('beautyFavs').some(function (f) { return f.key === key; })) { Toast.show('该教程已在收藏中', 'warn'); return; }
    DB.insert('beautyFavs', { key: key, title: title, cat: catv, creator: creator, url: url, desc: '手动添加', tags: [], source: creator || '抖音' });
    document.getElementById('bTitle').value = '';
    document.getElementById('bCreator').value = '';
    document.getElementById('bUrl').value = '';
    Toast.show('已加入「我的美商收藏」', 'ok');
    renderFavs();
  }

  function init() {
    document.getElementById('beautyRefresh').addEventListener('click', function () { renderDaily(); Toast.show('已切换到另一批美商补给', 'info'); });
    document.getElementById('beautyCats').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return; cat = b.dataset.v; renderDaily();
    });
    document.getElementById('beautyList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-fav="daily"]'); if (!b) return;
      toggleFav({ key: 'btip::' + b.dataset.title, title: b.dataset.title, cat: b.dataset.cat, creator: b.dataset.creator, url: b.dataset.url, desc: b.dataset.desc });
    });
    document.getElementById('beautyFavList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-delfav]'); if (!b) return;
      DB.remove('beautyFavs', b.dataset.delfav); Toast.show('已移出收藏', 'info'); renderFavs();
    });
    document.getElementById('bAdd').addEventListener('click', addManual);
    document.getElementById('bTitle').addEventListener('keydown', function (e) { if (e.key === 'Enter') addManual(); });
  }

  return { init: init, render: render, renderFavs: renderFavs };
})();
