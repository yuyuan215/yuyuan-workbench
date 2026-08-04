/* ============================================================
 * 板块5：个人图书馆
 * 书籍录入 / 待读·在读·已读完自动归档 / 读书笔记 / 重点标注 / 检索
 * ============================================================ */
var ModLibrary = (function () {
  var filter = 'all', kw = '';
  var recoOffset = 0;
  var GENERIC_BOOKS = [
    { book: '认知觉醒', author: '周岭', why: '通用成长类首选，适合任何想自我提升的热点' },
    { book: '纳瓦尔宝典', author: '埃里克·乔根森', why: '财富与幸福底层逻辑，万能补充书单' }
  ];
  var ST = { todo: { label: '想读', cls: '' }, reading: { label: '在读', cls: 'info' }, done: { label: '已读', cls: 'ok' } };

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
    Toast.show('已加入书库并自动归档到「' + ST[status].label + '」', 'ok');
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
    var msg = '已导入 ' + added + ' 本' + (skipped ? '，跳过重复 ' + skipped + ' 本' : '');
    var m = document.getElementById('bkBatchMsg');
    if (m) m.textContent = msg;
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
      '<span>笔记 ' + (b.note ? b.note.length : 0) + ' 字 · 重点 ' + hl.length + ' 条</span>' +
      '</div>' +

      '<div style="margin-top:12px"><b class="small">读书笔记</b>' +
      '<textarea class="b-note" placeholder="记录你的思考、结构梳理与行动计划…" style="margin-top:6px">' + Util.esc(b.note || '') + '</textarea>' +
      '<div class="row" style="margin-top:8px"><button class="btn btn-sm btn-primary" data-act="saveNote">保存笔记</button></div></div>' +

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
      { n: counts.all, l: '书库总量', x: '本' },
      { n: counts.todo, l: '待读', x: '等待开启' },
      { n: counts.reading, l: '在读', x: '进行中' },
      { n: counts.done, l: '已读完', x: '累计完成' },
      { n: noteWords, l: '累计笔记（字）', x: '阅读思考沉淀' },
      { n: hlCount, l: '重点标注（条）', x: '精华提取' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');

    document.getElementById('bkFilters').innerHTML = [['all', '全部'], ['todo', '待读'], ['reading', '在读'], ['done', '已读完']]
      .map(function (f) {
        return '<button class="chip' + (filter === f[0] ? ' on' : '') + '" data-v="' + f[0] + '">' + f[1] + ' ' + (counts[f[0]] || 0) + '</button>';
      }).join('');

    var list = books.filter(function (b) {
      if (filter !== 'all' && b.status !== filter) return false;
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
      : '<div class="empty">' + (kw ? '未检索到匹配的书籍或笔记' : '书库为空，先在上方录入第一本书') + '</div>';

    var badge = document.getElementById('badgeLib');
    if (badge) badge.textContent = counts.reading || counts.all;
    renderReco();
  }

  /* ---------------- 抖音热点荐书 ---------------- */
  function recoTopicHTML(tp, idx) {
    var books = (tp.books && tp.books.length) ? tp.books : GENERIC_BOOKS;
    return '<div class="lib-reco">' +
      '<div class="lib-reco-hd">' +
        '<span class="lib-rank">' + (idx + 1) + '</span>' +
        '<div class="grow">' +
          '<div class="lib-reco-t">' + Util.esc(tp.t) + '</div>' +
          '<div class="item-meta"><span class="tag info">' + Util.esc(tp.tag || '热点') + '</span>' +
          (tp.heat ? '<span>🔥 ' + Util.esc(tp.heat) + '</span>' : '') +
          (tp.desc ? '<span>' + Util.esc(tp.desc) + '</span>' : '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="lib-reco-books">' +
        books.map(function (b) {
          return '<div class="lib-book">' +
            '<div class="grow"><b>' + Util.esc(b.book) + '</b> <span class="muted small">' + Util.esc(b.author || '') + '</span>' +
            '<div class="small muted">荐：' + Util.esc(b.why || '') + '</div></div>' +
            '<button class="btn btn-sm btn-primary" data-reco="1" data-title="' + Util.esc(b.book) + '" data-author="' + Util.esc(b.author || '') + '" data-cat="' + Util.esc(tp.tag || '其他') + '" data-topic="' + Util.esc(tp.t) + '">加入书库</button>' +
          '</div>';
        }).join('') +
      '</div></div>';
  }

  var recoWired = false;
  function renderReco() {
    if (!window.CONTENT || !CONTENT.douyinHot) return;
    var topics = Util.seededPick(CONTENT.douyinHot, Util.dayIndex() * 13 + recoOffset * 7, 4);
    var box = document.getElementById('libReco');
    if (box) box.innerHTML = topics.map(recoTopicHTML).join('');
    var note = document.getElementById('libRecoNote');
    if (note) note.textContent = '根据抖音热点每日自动更新 · ' + Util.humanDate();

    if (recoWired) return;
    recoWired = true;
    var bShuffle = document.getElementById('libRecoShuffle');
    if (bShuffle) bShuffle.addEventListener('click', shuffleReco);
    var bLive = document.getElementById('libRecoLive');
    if (bLive) bLive.addEventListener('click', refreshLive);
    if (box) box.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-reco]'); if (!btn) return;
      addRecoBook(btn.dataset.title, btn.dataset.author, btn.dataset.cat, btn.dataset.topic);
    });
  }

  function addRecoBook(title, author, cat, topic) {
    var exist = DB.all('books').some(function (b) { return b.title === title; });
    if (exist) { Toast.show('《' + title + '》已在书库中', 'warn'); return; }
    DB.insert('books', {
      title: title, author: author || '', cat: cat || '其他', status: 'todo', rate: 0,
      note: '来自抖音热点荐书：' + (topic || ''), highlights: [], startAt: '', finishAt: ''
    });
    Toast.show('已加入书库并归档到「想读」', 'ok');
    render();
  }

  /* 联网获取实时抖音热点（失败自动回退内置榜单） */
  function remoteHot(cb) {
    var url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.vvhan.com/api/hotlist/douyin');
    var done = false, to = setTimeout(function () { if (!done) { done = true; cb(null); } }, 6000);
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (done) return; done = true; clearTimeout(to);
      var arr = (j && j.data) || (j && j.result) || (j && j.list) || null;
      var topics = [];
      if (Array.isArray(arr)) {
        arr.slice(0, 8).forEach(function (it) {
          var title = it.title || it.word || it.hotword || (it.query && it.query.title) || '';
          var heat = it.hot || it.num || it.heat || '';
          if (title) topics.push({ t: String(title).slice(0, 30), heat: heat ? String(heat) : '', tag: '实时', desc: '' });
        });
      }
      cb(topics.length ? topics : null);
    }).catch(function () { if (!done) { done = true; clearTimeout(to); cb(null); } });
  }

  function matchBooksForLive(tp) {
    var hit = [];
    var hay = tp.t.toLowerCase();
    CONTENT.douyinHot.forEach(function (cat) {
      if (hit.length >= 2) return;
      var key = (cat.t || '').toLowerCase();
      if (key && hay.indexOf(key.slice(0, Math.min(4, key.length))) >= 0) hit = cat.books.slice(0, 2);
    });
    return hit.length ? hit : GENERIC_BOOKS.slice(0, 2);
  }

  function refreshLive() {
    Toast.show('正在获取实时抖音热点…', 'info');
    remoteHot(function (live) {
      if (!live) { Toast.show('联网获取失败，已保持内置热点榜', 'warn'); return; }
      var box = document.getElementById('libReco');
      if (box) box.innerHTML = live.map(function (tp, i) {
        tp.books = matchBooksForLive(tp);
        return recoTopicHTML(tp, i);
      }).join('');
      var note = document.getElementById('libRecoNote');
      if (note) note.textContent = '已切换为实时热点榜 · 共 ' + live.length + ' 条';
      Toast.show('已拉取实时抖音热点并完成荐书', 'ok');
    });
  }

  function shuffleReco() {
    recoOffset = (recoOffset + 1) % 97;
    renderReco();
    Toast.show('已换一批热点', 'info');
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

    var wrap = document.getElementById('bkList');
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]'); if (!btn) return;
      var box = btn.closest('details[data-book]'); if (!box) return;
      var id = box.dataset.book, act = btn.dataset.act;
      var book = DB.find('books', id); if (!book) return;

      if (act === 'saveNote') {
        DB.update('books', id, { note: box.querySelector('.b-note').value });
        Toast.show('笔记已保存', 'ok'); render();
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


  return { init: init, render: render, renderReco: renderReco, shuffleReco: shuffleReco, refreshLive: refreshLive };
})();
