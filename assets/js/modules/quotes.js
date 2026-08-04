/* ============================================================
 * 金句收藏夹（跨板块）
 * 英语学习 / 亮灯自习室 等板块一键收藏金句，可归入自定义收藏夹
 * 数据存 DB('quotes')，随 JSONBin 同步多端
 * ============================================================ */
var ModQuotes = (function () {
  var filter = { coll: 'all', kw: '' };
  var PRESETS = ['文学', '心理学', '教育', '财经'];

  function all() { return DB.all('quotes'); }
  function has(key) { return all().some(function (q) { return q.key === key; }); }

  function add(p) {
    if (has(p.key)) { Toast.show('这条已在收藏夹', 'info'); return false; }
    DB.insert('quotes', {
      key: p.key,
      from: p.from || 'manual',
      title: p.title || '',
      body: p.body || '',
      source: p.source || '',
      coll: p.coll || '未分类',
      createdAt: Date.now()
    });
    Toast.show('已收藏金句', 'ok');
    render();
    return true;
  }

  function setColl(id, coll) { DB.update('quotes', id, { coll: coll }); render(); }
  function del(id) { DB.remove('quotes', id); Toast.show('已移除', 'info'); render(); }

  function collections() {
    var got = {};
    all().forEach(function (q) { if (q.coll) got[q.coll] = 1; });
    return PRESETS.concat(Object.keys(got).filter(function (c) { return PRESETS.indexOf(c) < 0; }));
  }

  function itemHTML(q) {
    var opts = collections().map(function (c) {
      return '<option' + (q.coll === c ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
    return '<div class="item">' +
      '<div class="item-title">' + Util.esc(q.title) + '</div>' +
      (q.body ? '<div class="item-note">' + Util.esc(q.body) + '</div>' : '') +
      (q.source ? '<div class="small muted">来源：' + Util.esc(q.source) + '</div>' : '') +
      '<div class="item-actions">' +
      '<label class="field" style="margin:0"><span>收藏夹</span><select class="q-coll" data-id="' + q.id + '">' + opts + '</select></label>' +
      '<button class="btn btn-sm btn-danger" data-act="del" data-id="' + q.id + '">移除</button>' +
      '</div></div>';
  }

  function render() {
    var allQ = all();
    var cols = collections();
    var chips = [['all', '全部']].concat(cols.map(function (c) { return [c, c]; })).map(function (c) {
      return '<button class="chip' + (filter.coll === c[0] ? ' on' : '') + '" data-coll="' + c[0] + '">' + c[1] + '</button>';
    }).join('');
    document.getElementById('qtFilters').innerHTML = chips;
    document.getElementById('qtCount').textContent = '共 ' + allQ.length + ' 条';

    var kw = (filter.kw || '').toLowerCase();
    var list = allQ.filter(function (q) {
      if (filter.coll !== 'all' && q.coll !== filter.coll) return false;
      if (kw && (q.title + ' ' + q.body + ' ' + q.source).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    }).sort(function (a, b) { return b.createdAt - a.createdAt; });

    document.getElementById('qtList').innerHTML = list.length
      ? list.map(itemHTML).join('')
      : '<div class="empty">还没有收藏任何金句，去「英语学习」「亮灯自习室」等板块一键收藏吧</div>';

    var badge = document.getElementById('badgeQuotes');
    if (badge) badge.textContent = allQ.length;
  }

  function exportQuotes() {
    var rows = all().map(function (q) {
      return '【' + (q.coll || '未分类') + '】' + q.title + '\n' + (q.body || '') + (q.source ? '\n— 来源：' + q.source : '') + '\n';
    }).join('\n');
    Util.download('芋圆金句收藏.txt', rows || '（暂无收藏）');
  }

  function init() {
    var ex = document.getElementById('qtExport');
    if (ex) ex.addEventListener('click', exportQuotes);
    var f = document.getElementById('qtSearch');
    if (f) f.addEventListener('input', Util.debounce(function (e) { filter.kw = e.target.value.trim(); render(); }, 200));
    var fl = document.getElementById('qtFilters');
    if (fl) fl.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      filter.coll = b.dataset.coll; render();
    });
    var l = document.getElementById('qtList');
    if (l) {
      l.addEventListener('change', function (e) { var s = e.target.closest('.q-coll'); if (s) setColl(s.dataset.id, s.value); });
      l.addEventListener('click', function (e) { var b = e.target.closest('button[data-act="del"]'); if (b) del(b.dataset.id); });
    }
  }

  return { init: init, render: render, add: add, has: has };
})();
