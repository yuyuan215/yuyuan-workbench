/* ============================================================
 * 板块：读书笔记（原金句收藏夹改造）
 * 从图书馆摘录书中精华片段 + 写思考，归入商业/文学/中医/亲子教育等笔记本
 * 英语学习、表达练习里的好句也可一键存为笔记
 * 数据存 DB('notes')，随 JSONBin 同步多端
 * ============================================================ */
var ModNotes = (function () {
  var filter = { cat: 'all', kw: '' };
  var CATS = ['商业', '文学', '中医', '亲子教育', '其他'];

  function all() { return DB.all('notes'); }
  function has(key) { return all().some(function (n) { return n.key === key; }); }

  /* 直接添加一条笔记（英语/中文好句一键存） */
  function add(p) {
    p = p || {};
    var key = p.key || ('note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7));
    if (has(key)) { Toast.show('这条已在笔记中', 'info'); return false; }
    DB.insert('notes', {
      key: key,
      book: p.book || '—',
      excerpt: p.excerpt || '',
      note: p.note || '',
      cat: p.cat || '其他',
      source: p.source || '',
      createdAt: Date.now()
    });
    Toast.show('已存入读书笔记', 'ok');
    render();
    return true;
  }

  /* 从图书馆某本书添加：弹窗填写摘录 + 感想 */
  function addForBook(book) {
    if (!book) return;
    var opts = CATS.map(function (c) {
      return '<option' + (book.cat === c ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
    var html =
      '<p class="small muted">为《' + Util.esc(book.title) + '》添加一条读书笔记。把书里打动你的片段粘贴到「摘录」，再写下你的思考。</p>' +
      '<div class="full" style="margin-top:8px"><textarea id="ntExcerpt" rows="4" placeholder="粘贴/摘抄书中精华片段…" style="width:100%"></textarea></div>' +
      '<div class="full" style="margin-top:8px"><textarea id="ntNote" rows="3" placeholder="你的思考、联想、行动计划…" style="width:100%"></textarea></div>' +
      '<div class="row" style="margin-top:8px"><label class="field" style="margin:0"><span>归入笔记本</span><select id="ntCat">' + opts + '</select></label></div>';
    if (window.App && App.openModal) {
      App.openModal('添加读书笔记', html, [
        { label: '取消', onClick: function () { App.closeModal(); } },
        { label: '保存笔记', primary: true, onClick: function () {
          var ex = document.getElementById('ntExcerpt').value.trim();
          var no = document.getElementById('ntNote').value.trim();
          if (!ex && !no) { Toast.show('摘录和感想至少填一项', 'warn'); return; }
          DB.insert('notes', {
            key: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            book: book.title, excerpt: ex, note: no,
            cat: document.getElementById('ntCat').value, source: '', createdAt: Date.now()
          });
          App.closeModal();
          Toast.show('已保存读书笔记', 'ok');
          render();
        } }
      ]);
    }
  }

  function del(id) { DB.remove('notes', id); Toast.show('已移除', 'info'); render(); }

  function collections() {
    var got = {};
    all().forEach(function (n) { if (n.cat) got[n.cat] = 1; });
    return CATS.concat(Object.keys(got).filter(function (c) { return CATS.indexOf(c) < 0; }));
  }

  function itemHTML(n) {
    var opts = collections().map(function (c) {
      return '<option' + (n.cat === c ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
    return '<div class="item">' +
      '<div class="item-meta"><span class="tag accent">' + Util.esc(n.book || '—') + '</span>' +
      '<span class="small muted">' + Util.dateKey(n.createdAt) + '</span></div>' +
      (n.excerpt ? '<div class="item-note" style="border-left:3px solid var(--accent);padding-left:10px;margin:6px 0">' + Util.esc(n.excerpt) + '</div>' : '') +
      (n.note ? '<div style="margin-top:4px">' + Util.esc(n.note) + '</div>' : '') +
      '<div class="item-actions">' +
      '<label class="field" style="margin:0"><span>笔记本</span><select class="n-cat" data-id="' + n.id + '">' + opts + '</select></label>' +
      '<button class="btn btn-sm btn-danger" data-act="del" data-id="' + n.id + '">删除</button>' +
      '</div></div>';
  }

  function render() {
    var allN = all();
    var cols = collections();
    var chips = [['all', '全部']].concat(cols.map(function (c) { return [c, c]; })).map(function (c) {
      return '<button class="chip' + (filter.cat === c[0] ? ' on' : '') + '" data-cat="' + c[0] + '">' + c[1] + '</button>';
    }).join('');
    document.getElementById('ntFilters').innerHTML = chips;
    document.getElementById('ntCount').textContent = '共 ' + allN.length + ' 条';

    var kw = (filter.kw || '').toLowerCase();
    var list = allN.filter(function (n) {
      if (filter.cat !== 'all' && n.cat !== filter.cat) return false;
      if (kw && (n.book + ' ' + n.excerpt + ' ' + n.note).toLowerCase().indexOf(kw) < 0) return false;
      return true;
    }).sort(function (a, b) { return b.createdAt - a.createdAt; });

    document.getElementById('ntList').innerHTML = list.length
      ? list.map(itemHTML).join('')
      : '<div class="empty">还没有读书笔记。去「图书馆」打开一本书 →「➕ 添加精选读书笔记」，或在英语/中文练习里把金句一键存进来。</div>';

    var badge = document.getElementById('badgeNotes');
    if (badge) badge.textContent = allN.length;
  }

  function exportNotes() {
    var rows = all().map(function (n) {
      return '【' + (n.cat || '其他') + '】' + n.book + '\n' + (n.excerpt ? '摘录：' + n.excerpt + '\n' : '') + (n.note ? '感想：' + n.note + '\n' : '') + '时间：' + Util.shortTime(n.createdAt) + '\n';
    }).join('\n');
    Util.download('芋圆读书笔记.txt', rows || '（暂无笔记）');
  }

  function init() {
    var ex = document.getElementById('ntExport');
    if (ex) ex.addEventListener('click', exportNotes);
    var f = document.getElementById('ntSearch');
    if (f) f.addEventListener('input', Util.debounce(function (e) { filter.kw = e.target.value.trim(); render(); }, 200));
    var fl = document.getElementById('ntFilters');
    if (fl) fl.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      filter.cat = b.dataset.cat; render();
    });
    var l = document.getElementById('ntList');
    if (l) {
      l.addEventListener('change', function (e) { var s = e.target.closest('.n-cat'); if (s) { DB.update('notes', s.dataset.id, { cat: s.value }); Toast.show('已归入「' + s.value + '」笔记本', 'ok'); render(); } });
      l.addEventListener('click', function (e) { var b = e.target.closest('button[data-act="del"]'); if (b) del(b.dataset.id); });
    }
  }

  return { init: init, render: render, add: add, addForBook: addForBook };
})();
