/* ============================================================
 * 板块5：图书馆
 * 书籍录入 / 书架分类(商业·文学·心理学·中医·亲子教育) / 想读·在读·已读归档
 * 每日热门书单（B站/抖音热点向，可链微信读书/番茄小说）/ 读书笔记入口
 * ============================================================ */
var ModLibrary = (function () {
  var filter = 'all', catFilter = 'all', kw = '';
  var recoOffset = 0;
  var CATS = ['商业', '文学', '心理学', '中医', '亲子教育', '其他'];
  var ST = { todo: { label: '想读', cls: '' }, reading: { label: '在读', cls: 'info' }, done: { label: '已读', cls: 'ok' } };

  function wereadUrl(t) { return 'https://weread.qq.com/search?keyword=' + encodeURIComponent(t); }
  function tomatoUrl(t) { return 'https://fanqienovel.com/search?query=' + encodeURIComponent(t); }

  function add() {
    var title = document.getElementById('bkTitle').value.trim();
    if (!title) { Toast.show('请填写书名', 'warn'); return; }
    var status = document.getElementById('bkStatus').value;
    DB.insert('books', {
      title: title,
      author: document.getElementById('bkAuthor').value.trim(),
      cat: document.getElementById('bkCat').value,
      status: status,
      rate: parseInt(document.getElementById('bkRate').value, 10) || 0,
      note: '',
      highlights: [],
      startAt: status === 'reading' ? Util.today() : '',
      finishAt: status === 'done' ? Util.today() : ''
    });
    document.getElementById('bkTitle').value = '';
    document.getElementById('bkAuthor').value = '';
    Toast.show('已加入书架并归档到「' + ST[status].label + '」', 'ok');
    render();
  }

  /* ---------------- 批量导入书单 ---------------- */
  function parseLine(line) {
    var title = '', author = '';
    var parts = line.split(/\s*[-–—/|,:]\s*/);
    if (parts.length > 1) {
      title = parts[0].trim();
      author = parts.slice(1).join(' ').trim();
    } else {
      var sp = line.split(/\s+/);
      if (sp.length > 1) { title = sp[0]; author = sp.slice(1).join(' '); }
      else title = line;
    }
    return { title: (title || '').trim(), author: (author || '').trim() };
  }

  function batchAdd() {
    var raw = (document.getElementById('bkBatchText').value || '').trim();
    if (!raw) { Toast.show('请先粘贴书单内容', 'warn'); return; }
    var status = document.getElementById('bkBatchStatus').value;
    var lines = raw.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    var existing = DB.all('books').map(function (b) { return (b.title || '').trim(); });
    var added = 0, skipped = 0;
    lines.forEach(function (line) {
      var p = parseLine(line);
      if (!p.title) return;
      if (existing.indexOf(p.title) >= 0) { skipped++; return; }
      existing.push(p.title);
      DB.insert('books', {
        title: p.title, author: p.author, cat: '其他', status: status, rate: 0,
        note: '来自批量导入', highlights: [],
        startAt: status === 'reading' ? Util.today() : '',
        finishAt: status === 'done' ? Util.today() : ''
      });
      added++;
    });
    var m = document.getElementById('bkBatchMsg');
    if (m) m.textContent = '已导入 ' + added + ' 本' + (skipped ? '，跳过重复 ' + skipped + ' 本' : '');
    Toast.show('批量导入完成：新增 ' + added + ' 本', 'ok');
    render();
  }

  function setStatus(id, st) {
    var patch = { status: st };
    if (st === 'reading') patch.startAt = Util.today();
    if (st === 'done') patch.finishAt = Util.today();
    DB.update('books', id, patch);
    Toast.show('已归档到「' + ST[st].label + '」', 'ok');
    render();
  }

  function stars(n) {
    n = n || 0;
    return n ? '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n) : '未评分';
  }

  function bookHTML(b) {
    var hl = b.highlights || [];
    return '<details class="acc" data-book="' + b.id + '">' +
      '<summary>' + Util.esc(b.title) +
      ' <span class="muted small">' + Util.esc(b.author || '') + '</span>' +
      '<span class="tag ' + ST[b.status].cls + '" style="margin-left:auto">' + ST[b.status].label + '</span></summary>' +
      '<div class="body">' +
      '<div class="item-meta">' +
      '<span class="tag accent">' + Util.esc(b.cat || '其他') + '</span>' +
      '<span class="tag">' + stars(b.rate) + '</span>' +
      (b.startAt ? '<span>开始 ' + b.startAt + '</span>' : '') +
      (b.finishAt ? '<span>读完 ' + b.finishAt + '</span>' : '') +
      (b.note ? '<span>笔记 ' + b.note.length + ' 字</span>' : '<span>笔记 0 字</span>') +
      '<span>重点 ' + hl.length + ' 条</span>' +
      '</div>' +

      '<div style="margin-top:12px"><b class="small">读书笔记</b>' +
      '<textarea class="b-note" placeholder="记录你的思考、结构梳理与行动计划…" style="margin-top:6px">' + Util.esc(b.note || '') + '</textarea>' +
      '<div class="row" style="margin-top:8px"><button class="btn btn-sm btn-primary" data-act="saveNote">保存笔记</button>' +
      '<button class="btn btn-sm" data-act="note">➕ 添加精选读书笔记</button></div></div>' +

      '<div style="margin-top:14px"><b class="small">重点内容标注</b>' +
      '<div class="row" style="margin-top:6px"><input class="b-hl grow" type="text" placeholder="输入一句重点原文或摘要，回车添加" />' +
      '<button class="btn btn-sm" data-act="addHl">添加重点</button></div>' +
      (hl.length ? '<div style="margin-top:10px">' + hl.map(function (h, i) {
        return '<div class="quote" style="margin-bottom:6px;display:flex;gap:8px;align-items:flex-start">' +
          '<span class="grow">' + Util.esc(h.text) + '<span class="small muted"> · ' + Util.dateKey(h.at) + '</span></span>' +
          '<button class="btn btn-sm btn-ghost" data-act="delHl" data-i="' + i + '">×</button></div>';
      }).join('') + '</div>' : '<div class="small muted" style="margin-top:8px">暂无重点标注</div>') +
      '</div>' +

      '<div class="item-actions" style="margin-top:14px">' +
      '<button class="btn btn-sm" data-act="st" data-st="todo">标为待读</button>' +
      '<button class="btn btn-sm" data-act="st" data-st="reading">标为在读</button>' +
      '<button class="btn btn-sm" data-act="st" data-st="done">标为已读完</button>' +
      '<select class="b-rate btn btn-sm" style="width:110px">' +
      [0, 5, 4, 3, 2, 1].map(function (r) { return '<option value="' + r + '"' + (b.rate === r ? ' selected' : '') + '>' + (r ? stars(r) : '未评分') + '</option>'; }).join('') +
      '</select>' +
      '<button class="btn btn-sm btn-danger" data-act="del">删除书籍</button>' +
      '</div></div></details>';
  }

  function render() {
    var books = DB.all('books');
    var counts = { all: books.length, todo: 0, reading: 0, done: 0 };
    books.forEach(function (b) { counts[b.status] = (counts[b.status] || 0) + 1; });

    var noteWords = books.reduce(function (s, b) { return s + (b.note ? b.note.length : 0); }, 0);
    var hlCount = books.reduce(function (s, b) { return s + (b.highlights ? b.highlights.length : 0); }, 0);
    document.getElementById('libStats').innerHTML = [
      { n: counts.all, l: '书架总量', x: '本' },
      { n: counts.todo, l: '想读', x: '等待开启' },
      { n: counts.reading, l: '在读', x: '进行中' },
      { n: counts.done, l: '已读完', x: '累计完成' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');

    document.getElementById('bkFilters').innerHTML = [['all', '全部'], ['todo', '待读'], ['reading', '在读'], ['done', '已读完']]
      .map(function (f) {
        return '<button class="chip' + (filter === f[0] ? ' on' : '') + '" data-v="' + f[0] + '">' + f[1] + ' ' + (counts[f[0]] || 0) + '</button>';
      }).join('');

    document.getElementById('bkCats').innerHTML = [['all', '全部']].concat(CATS.map(function (c) { return [c, c]; }))
      .map(function (f) {
        return '<button class="chip' + (catFilter === f[0] ? ' on' : '') + '" data-cat="' + f[0] + '">' + f[1] + '</button>';
      }).join('');

    var list = books.filter(function (b) {
      if (filter !== 'all' && b.status !== filter) return false;
      if (catFilter !== 'all' && (b.cat || '其他') !== catFilter) return false;
      if (kw) {
        var hay = (b.title + ' ' + (b.author || '') + ' ' + (b.cat || '') + ' ' + (b.note || '') + ' ' +
          (b.highlights || []).map(function (h) { return h.text; }).join(' ')).toLowerCase();
        if (hay.indexOf(kw.toLowerCase()) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      var w = { reading: 0, todo: 1, done: 2 };
      if (w[a.status] !== w[b.status]) return w[a.status] - w[b.status];
      return b.updatedAt - a.updatedAt;
    });

    document.getElementById('bkCount').textContent = '当前显示 ' + list.length + ' 本';
    document.getElementById('bkList').innerHTML = list.length ? list.map(bookHTML).join('')
      : '<div class="empty">' + (kw ? '未检索到匹配的书籍或笔记' : '书架为空，先在上方录入第一本书，或下方从每日书单加入') + '</div>';

    var badge = document.getElementById('badgeLib');
    if (badge) badge.textContent = counts.reading || counts.all;
    renderReco();
  }

  /* ---------------- 每日热门书单 ---------------- */
  function recoBookHTML(b, idx) {
    return '<div class="lib-reco">' +
      '<div class="lib-reco-hd">' +
        '<span class="lib-rank">' + (idx + 1) + '</span>' +
        '<div class="grow">' +
          '<div class="lib-reco-t">' + Util.esc(b.title) + '</div>' +
          '<div class="item-meta"><span class="tag info">' + Util.esc(b.cat || '其他') + '</span>' +
          (b.author ? '<span class="muted small">' + Util.esc(b.author) + '</span>' : '') + '</div>' +
          (b.why ? '<div class="small muted">荐：' + Util.esc(b.why) + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="lib-reco-books">' +
        '<div class="lib-book">' +
          '<div class="grow"></div>' +
          '<div class="row" style="gap:8px;flex-wrap:wrap">' +
            '<a class="btn btn-sm btn-primary" href="' + wereadUrl(b.title) + '" target="_blank" rel="noopener">📖 在微信读书打开</a>' +
            '<a class="btn btn-sm" href="' + tomatoUrl(b.title) + '" target="_blank" rel="noopener">🍅 在番茄小说打开</a>' +
            '<button class="btn btn-sm" data-reco="1" data-title="' + Util.esc(b.title) + '" data-author="' + Util.esc(b.author || '') + '" data-cat="' + Util.esc(b.cat || '其他') + '">加入书架</button>' +
          '</div>' +
        '</div>' +
      '</div></div>';
  }

  var recoWired = false;
  function renderReco() {
    if (!window.CONTENT || !CONTENT.hotBooks) return;
    var books = Util.seededPick(CONTENT.hotBooks, Util.dayIndex() * 13 + recoOffset * 7, 5);
    var box = document.getElementById('libReco');
    if (box) box.innerHTML = books.map(recoBookHTML).join('');
    var note = document.getElementById('libRecoNote');
    if (note) note.textContent = '每日根据热点推荐 · ' + Util.humanDate();

    if (recoWired) return;
    recoWired = true;
    var bShuffle = document.getElementById('libRecoShuffle');
    if (bShuffle) bShuffle.addEventListener('click', function () { recoOffset = (recoOffset + 1) % 97; renderReco(); Toast.show('已换一批书单', 'info'); });
    if (box) box.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-reco]'); if (!btn) return;
      addRecoBook(btn.dataset.title, btn.dataset.author, btn.dataset.cat);
    });
  }

  function addRecoBook(title, author, cat) {
    var exist = DB.all('books').some(function (b) { return b.title === title; });
    if (exist) { Toast.show('《' + title + '》已在书架中', 'warn'); return; }
    DB.insert('books', {
      title: title, author: author || '', cat: cat || '其他', status: 'todo', rate: 0,
      note: '', highlights: [], startAt: '', finishAt: ''
    });
    Toast.show('已加入书架并归档到「想读」', 'ok');
    render();
  }

  function init() {
    var bToggle = document.getElementById('bkBatchToggle');
    if (bToggle) bToggle.addEventListener('click', function () {
      var box = document.getElementById('bkBatchBox');
      var show = box.style.display === 'none';
      box.style.display = show ? 'block' : 'none';
      bToggle.textContent = show ? '收起' : '展开';
    });
    var bBatch = document.getElementById('bkBatchAdd');
    if (bBatch) bBatch.addEventListener('click', batchAdd);

    document.getElementById('bkAdd').addEventListener('click', add);
    document.getElementById('bkTitle').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
    document.getElementById('bkSearch').addEventListener('input', Util.debounce(function (e) { kw = e.target.value.trim(); render(); }, 200));
    document.getElementById('bkFilters').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      filter = b.dataset.v; render();
    });
    document.getElementById('bkCats').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      catFilter = b.dataset.cat; render();
    });

    var wrap = document.getElementById('bkList');
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]'); if (!btn) return;
      var box = btn.closest('details[data-book]'); if (!box) return;
      var id = box.dataset.book, act = btn.dataset.act;
      var book = DB.find('books', id); if (!book) return;

      if (act === 'saveNote') {
        DB.update('books', id, { note: box.querySelector('.b-note').value });
        Toast.show('笔记已保存', 'ok'); render();
      } else if (act === 'note') {
        if (window.ModNotes && ModNotes.addForBook) ModNotes.addForBook(book);
      } else if (act === 'addHl') {
        var input = box.querySelector('.b-hl');
        var v = input.value.trim();
        if (!v) { Toast.show('请输入重点内容', 'warn'); return; }
        var hl = (book.highlights || []).slice();
        hl.push({ text: v, at: Date.now() });
        DB.update('books', id, { highlights: hl });
        Toast.show('已添加重点标注', 'ok'); render();
      } else if (act === 'delHl') {
        var arr = (book.highlights || []).slice();
        arr.splice(parseInt(btn.dataset.i, 10), 1);
        DB.update('books', id, { highlights: arr }); render();
      } else if (act === 'st') {
        setStatus(id, btn.dataset.st);
      } else if (act === 'del') {
        DB.remove('books', id); Toast.show('已删除书籍', 'info'); render();
      }
    });

    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || !e.target.classList.contains('b-hl')) return;
      var box = e.target.closest('details[data-book]');
      box.querySelector('[data-act="addHl"]').click();
    });

    wrap.addEventListener('change', function (e) {
      if (!e.target.classList.contains('b-rate')) return;
      var box = e.target.closest('details[data-book]');
      DB.update('books', box.dataset.book, { rate: parseInt(e.target.value, 10) });
      Toast.show('评分已更新', 'ok'); render();
    });
  }

  return { init: init, render: render, renderReco: renderReco, shuffleReco: function () { recoOffset = (recoOffset + 1) % 97; renderReco(); } };
})();
