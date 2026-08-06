/* ============================================================
 * 板块：读书笔记
 * 以「笔记本」为主轴：每个笔记本对应一本书（书名 + 作者 + 分类），
 * 里面可存放多条笔记（摘录 + 思考 + 页码）。
 * 既可以从「图书馆」的书一键添加，也可以手动「新建笔记本」自由记录
 * （不限于图书馆的书，任何书 / 资料都能建笔记本）。
 *
 * 交互说明（易用优先）：
 *  - 点「+ 新建笔记本」→ 填 书名* + 作者 + 分类 → 创建后该笔记本**自动展开**，
 *    卡片下方直接出现一个写字区，马上就能记第一条笔记（无需再弹窗）。
 *  - 任意笔记本卡片点「查看」展开后，底部都有常驻的「添加笔记」编辑区，
 *    写完点「保存笔记」即追加到该笔记本；也可点「收起」合上。
 *  - 旧版扁平笔记会在首次打开时按书名自动归并到笔记本，数据不丢失。
 * 数据：DB('notebooks') 主轴；DB('notes') 笔记条目（含 notebookId）。全部随 JSONBin 同步多端。
 * ============================================================ */
var ModNotes = (function () {
  var filter = { cat: 'all', kw: '', open: {} };
  var CATS = ['商业', '文学', '中医', '亲子教育', '其他'];

  function nbs() { return DB.all('notebooks'); }
  function notes() { return DB.all('notes'); }
  function nbNotes(id) { return notes().filter(function (n) { return n.notebookId === id; }); }
  function lastNote(id) {
    var arr = nbNotes(id).slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    return arr[0] || null;
  }

  /* 兼容旧数据：把没有 notebookId 的旧笔记按书名归并到自动创建的笔记本 */
  function migrate() {
    var orphan = notes().filter(function (n) { return !n.notebookId; });
    if (!orphan.length) return;
    var map = {};
    orphan.forEach(function (n) {
      var name = n.book || '—';
      if (!map[name]) {
        var nb = DB.insert('notebooks', {
          name: name, author: n.author || '',
          cat: n.cat || '其他', createdAt: n.createdAt || Date.now()
        });
        map[name] = nb.id;
      }
      DB.update('notes', n.id, { notebookId: map[name] });
    });
  }

  /* 按书名定位或新建笔记本 */
  function findOrCreateNotebook(name, opts) {
    name = (name || '').trim() || '未命名笔记本';
    var hit = nbs().filter(function (x) { return x.name === name; })[0];
    if (hit) return hit;
    return DB.insert('notebooks', {
      name: name,
      author: (opts && opts.author) || '',
      cat: (opts && opts.cat) || '其他'
    });
  }

  function touch(id) { var nb = DB.find('notebooks', id); if (nb) DB.update('notebooks', id, {}); }

  /* 兼容接口：英语 / 中文好句一键存（p: {book, excerpt, note, cat, source, key}） */
  function add(p) {
    p = p || {};
    var key = p.key || ('note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7));
    if (notes().some(function (n) { return n.key === key; })) { Toast.show('这条已在笔记中', 'info'); return false; }
    var nb = findOrCreateNotebook(p.book || '—', { cat: p.cat || '其他' });
    DB.insert('notes', {
      key: key, notebookId: nb.id, book: p.book || nb.name,
      excerpt: p.excerpt || '', note: p.note || '',
      cat: p.cat || nb.cat || '其他', source: p.source || '',
      page: p.page || '', createdAt: Date.now()
    });
    touch(nb.id);
    Toast.show('已存入读书笔记', 'ok');
    render();
    return true;
  }

  /* 兼容接口：从图书馆某本书添加（弹窗：摘录 + 思考 + 分类） */
  function addForBook(book) {
    if (!book) return;
    var opts = CATS.map(function (c) {
      return '<option' + (book.cat === c ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
    var html =
      '<p class="small muted">为《' + Util.esc(book.title) + '》添加一条读书笔记。把书里打动你的片段粘贴到「摘录」，再写下你的思考。</p>' +
      '<div class="full" style="margin-top:8px"><textarea id="ntExcerpt" rows="4" placeholder="粘贴/摘抄书中精华片段…" style="width:100%"></textarea></div>' +
      '<div class="full" style="margin-top:8px"><textarea id="ntNote" rows="3" placeholder="你的思考、联想、行动计划…" style="width:100%"></textarea></div>' +
      '<div class="row" style="margin-top:8px"><label class="field" style="margin:0"><span>归入分类</span><select id="ntCat">' + opts + '</select></label>' +
      '<label class="field" style="margin:0"><span>页码（选填）</span><input id="ntPage" style="width:90px" placeholder="如 P88" /></label></div>';
    if (window.App && App.openModal) {
      App.openModal('添加读书笔记', html, [
        { label: '取消', onClick: function () { App.closeModal(); } },
        { label: '保存笔记', primary: true, onClick: function () {
          var ex = document.getElementById('ntExcerpt').value.trim();
          var no = document.getElementById('ntNote').value.trim();
          if (!ex && !no) { Toast.show('摘录和感想至少填一项', 'warn'); return; }
          var nb = findOrCreateNotebook(book.title, { cat: document.getElementById('ntCat').value });
          DB.insert('notes', {
            key: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            notebookId: nb.id, book: book.title, excerpt: ex, note: no,
            cat: nb.cat, source: '', page: document.getElementById('ntPage').value.trim(),
            createdAt: Date.now()
          });
          touch(nb.id);
          App.closeModal();
          Toast.show('已保存读书笔记', 'ok');
          render();
        } }
      ]);
    }
  }

  /* 新建笔记本：只创建笔记本，创建后自动展开，卡片下方即可直接记录 */
  function newNotebook() {
    var opts = CATS.map(function (c) { return '<option' + (c === '其他' ? ' selected' : '') + '>' + c + '</option>'; }).join('');
    var html =
      '<p class="small muted">新建一个笔记本——可以是你正在读的任何书，也可以是某个主题的资料夹。建好后直接在卡片下方写笔记。</p>' +
      '<div class="full" style="margin-top:8px"><label class="field" style="margin:0"><span>书名 / 主题 *</span><input id="nbName" placeholder="如：《被讨厌的勇气》" /></label></div>' +
      '<div class="full" style="margin-top:8px"><label class="field" style="margin:0"><span>作者（选填）</span><input id="nbAuthor" placeholder="如：岸见一郎 / 古贺史健" /></label></div>' +
      '<div class="row" style="margin-top:8px"><label class="field" style="margin:0"><span>分类</span><select id="nbCat">' + opts + '</select></label></div>';
    if (window.App && App.openModal) {
      App.openModal('新建笔记本', html, [
        { label: '取消', onClick: function () { App.closeModal(); } },
        { label: '创建笔记本', primary: true, onClick: function () {
          var name = document.getElementById('nbName');
          if (!name || !name.value.trim()) { Toast.show('请填写书名 / 主题', 'warn'); return; }
          var nb = DB.insert('notebooks', {
            name: name.value.trim(), author: (document.getElementById('nbAuthor') || {}).value || '',
            cat: (document.getElementById('nbCat') || {}).value || '其他', createdAt: Date.now()
          });
          App.closeModal();
          filter.open[nb.id] = 1;            // 自动展开，立即可记录
          render();
          Toast.show('笔记本已创建，在下方写下你的第一条笔记吧', 'ok');
        } }
      ]);
    }
  }

  /* 内联「添加笔记」编辑区（每个展开中的笔记本卡片底部） */
  function addFormHTML(id) {
    return '<div class="nb-add">' +
      '<div class="nb-add-hd">＋ 添加一条笔记</div>' +
      '<textarea id="nbEx_' + id + '" rows="3" placeholder="摘录 / 原文关键句…（选填）"></textarea>' +
      '<textarea id="nbNo_' + id + '" rows="2" placeholder="你的思考、联想、行动计划…（选填）"></textarea>' +
      '<div class="row">' +
        '<input id="nbPg_' + id + '" style="width:90px" placeholder="页码(选填)" />' +
        '<button class="btn btn-sm btn-primary" data-save-note="' + id + '">保存笔记</button>' +
        '<button class="btn btn-sm" data-cancel-add="' + id + '">收起</button>' +
      '</div></div>';
  }

  /* 保存内联笔记 */
  function saveInline(id) {
    var exEl = document.getElementById('nbEx_' + id);
    var noEl = document.getElementById('nbNo_' + id);
    var ex = exEl ? exEl.value.trim() : '';
    var no = noEl ? noEl.value.trim() : '';
    if (!ex && !no) { Toast.show('摘录和感想至少填一项', 'warn'); return; }
    var nb = DB.find('notebooks', id);
    var pgEl = document.getElementById('nbPg_' + id);
    DB.insert('notes', {
      key: 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      notebookId: id, book: nb ? nb.name : '',
      excerpt: ex, note: no, cat: nb ? nb.cat : '其他',
      source: '', page: pgEl ? pgEl.value.trim() : '',
      createdAt: Date.now()
    });
    touch(id);
    Toast.show('已保存笔记', 'ok');
    render();
  }

  function delNote(id) {
    var n = DB.find('notes', id);
    DB.remove('notes', id);
    if (n && n.notebookId) touch(n.notebookId);
    Toast.show('已删除该条笔记', 'info');
    render();
  }

  function delNotebook(id) {
    nbNotes(id).forEach(function (n) { DB.remove('notes', n.id); });
    DB.remove('notebooks', id);
    delete filter.open[id];
    Toast.show('笔记本及其笔记已删除', 'info');
    render();
  }

  function collections() {
    var got = {};
    nbs().forEach(function (n) { if (n.cat) got[n.cat] = 1; });
    return CATS.concat(Object.keys(got).filter(function (c) { return CATS.indexOf(c) < 0; }));
  }

  function escapePreview(s, len) {
    s = (s || '').replace(/\s+/g, ' ').trim();
    if (s.length > len) s = s.slice(0, len) + '…';
    return Util.esc(s);
  }

  function noteItemHTML(n) {
    return '<div class="note-item">' +
      (n.excerpt ? '<div class="note-excerpt">“' + escapePreview(n.excerpt, 140) + '”</div>' : '') +
      (n.note ? '<div class="note-thought">' + escapePreview(n.note, 140) + '</div>' : '') +
      '<div class="note-meta"><span class="small muted">' + Util.dateKey(n.createdAt) + (n.page ? ' · ' + Util.esc(n.page) : '') + '</span>' +
      '<button class="btn btn-sm btn-danger" data-del-note="' + n.id + '">删除</button></div></div>';
  }

  function cardHTML(nb) {
    var ns = nbNotes(nb.id);
    var last = lastNote(nb.id);
    var isOpen = !!filter.open[nb.id];
    var meta = '<span class="tag accent">' + Util.esc(nb.cat || '其他') + '</span>' +
      (nb.author ? '<span class="small muted">作者：' + Util.esc(nb.author) + '</span>' : '') +
      '<span class="small muted">' + ns.length + ' 条笔记</span>' +
      '<span class="small muted">' + (nb.updatedAt ? Util.dateKey(nb.updatedAt) : (nb.createdAt ? Util.dateKey(nb.createdAt) : '刚刚')) + ' 更新</span>';
    var preview = last
      ? '<div class="nb-preview">' + (last.excerpt ? '“' + escapePreview(last.excerpt, 80) + '”' : escapePreview(last.note, 80)) + '</div>'
      : '<div class="nb-preview muted">还没有笔记，点「+ 笔记」或直接展开，在下方写下第一条</div>';
    var detail = isOpen
      ? '<div class="nb-detail">' +
          (ns.length ? ns.slice().sort(function (a, b) { return b.createdAt - a.createdAt; }).map(noteItemHTML).join('') : '<div class="empty small">还没有笔记</div>') +
          addFormHTML(nb.id) +
        '</div>'
      : '';
    return '<div class="item nb-card" data-nb="' + nb.id + '">' +
      '<div class="nb-head">' +
        '<div class="nb-info"><div class="nb-title">📒 ' + Util.esc(nb.name) + '</div>' + meta + '</div>' +
        '<div class="nb-actions">' +
          '<button class="btn btn-sm" data-toggle="' + nb.id + '">' + (isOpen ? '收起' : '查看') + '</button>' +
          '<button class="btn btn-sm btn-primary" data-add="' + nb.id + '">+ 笔记</button>' +
          '<button class="btn btn-sm btn-danger" data-del-nb="' + nb.id + '">删除</button>' +
        '</div>' +
      '</div>' +
      preview + detail +
      '</div>';
  }

  function render() {
    migrate();
    var allN = nbs();
    var cols = collections();
    var chips = [['all', '全部']].concat(cols.map(function (c) { return [c, c]; })).map(function (c) {
      return '<button class="chip' + (filter.cat === c[0] ? ' on' : '') + '" data-cat="' + c[0] + '">' + c[1] + '</button>';
    }).join('');
    var filtersEl = document.getElementById('ntFilters');
    if (filtersEl) filtersEl.innerHTML = chips;

    var kw = (filter.kw || '').toLowerCase();
    var list = allN.filter(function (nb) {
      if (filter.cat !== 'all' && nb.cat !== filter.cat) return false;
      if (kw) {
        var hay = (nb.name + ' ' + (nb.author || '') + ' ' + nbNotes(nb.id).map(function (n) { return n.excerpt + ' ' + n.note; }).join(' ')).toLowerCase();
        if (hay.indexOf(kw) < 0) return false;
      }
      return true;
    }).sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });

    var countEl = document.getElementById('ntCount');
    if (countEl) countEl.textContent = '共 ' + allN.length + ' 本笔记本 / ' + notes().length + ' 条笔记';

    var listEl = document.getElementById('ntList');
    if (listEl) listEl.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<div class="empty">还没有笔记本。点右上角「+ 新建笔记本」，把任何一本书或主题的资料夹建进来；也可以从「图书馆」打开书 →「➕ 添加精选读书笔记」，英语 / 中文练习里的好句也能一键存进来。</div>';

    var badge = document.getElementById('badgeNotes');
    if (badge) badge.textContent = notes().length;
  }

  function exportNotes() {
    var rows = nbs().map(function (nb) {
      var ns = nbNotes(nb.id).sort(function (a, b) { return a.createdAt - b.createdAt; });
      var head = '【笔记本】' + nb.name + (nb.author ? '（' + nb.author + '）' : '') + ' · ' + (nb.cat || '其他') + ' · ' + ns.length + ' 条';
      var body = ns.map(function (n) {
        return (n.excerpt ? '摘录：' + n.excerpt + '\n' : '') + (n.note ? '感想：' + n.note + '\n' : '') + (n.page ? '页码：' + n.page + '\n' : '') + '时间：' + Util.shortTime(n.createdAt) + '\n';
      }).join('\n');
      return head + '\n' + body;
    }).join('\n\n');
    Util.download('芋圆读书笔记.txt', rows || '（暂无笔记）');
  }

  function init() {
    migrate();
    var nbBtn = document.getElementById('ntNewBook');
    if (nbBtn) nbBtn.addEventListener('click', newNotebook);
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
      l.addEventListener('click', function (e) {
        var t = e.target;
        var sv = t.closest('[data-save-note]');
        if (sv) { saveInline(sv.dataset.saveNote); return; }
        var cx = t.closest('[data-cancel-add]');
        if (cx) { delete filter.open[cx.dataset.cancelAdd]; render(); return; }
        var tg = t.closest('[data-toggle]');
        if (tg) { var id = tg.dataset.toggle; if (filter.open[id]) delete filter.open[id]; else filter.open[id] = 1; render(); return; }
        var ad = t.closest('[data-add]');
        if (ad) { filter.open[ad.dataset.add] = 1; render(); return; }
        var dnb = t.closest('[data-del-nb]');
        if (dnb) { if (window.confirm('删除该笔记本及其全部笔记？')) delNotebook(dnb.dataset.delNb); return; }
        var dn = t.closest('[data-del-note]');
        if (dn) { delNote(dn.dataset.delNote); return; }
      });
    }
  }

  return { init: init, render: render, add: add, addForBook: addForBook };
})();
