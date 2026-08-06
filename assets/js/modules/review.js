/* ============================================================
 * 板块：复盘查看
 *   A. 周复盘：把本周（周一~周日）各板块的数据汇总成一张成绩单
 *   B. 阅读复盘：书架分类分布 / 在读进度 / 读书笔记产出
 *   C. 本周小结：根据数据自动生成亮点 + 待改进 + 下周建议
 * 支持切换上一周 / 下一周，并可导出为文本文件。
 * ============================================================ */
var ModReview = (function () {
  var anchor = null;               // 当前查看的那一周里的任意一天（YYYY-MM-DD）
  var BOOK_CATS = ['商业', '文学', '心理学', '中医', '亲子教育', '其他'];
  var NOTE_CATS = ['商业', '文学', '中医', '亲子教育', '其他'];
  var TODO_CAT = { work: '工作', private: '老板私人', life: '生活', study: '学习' };

  function curAnchor() { return anchor || Util.today(); }
  function range() { return Util.weekRange(curAnchor()); }

  /* 日期字符串是否落在 [start, end] 内 */
  function inRange(dateStr, r) {
    if (!dateStr) return false;
    return dateStr >= r.start && dateStr <= r.end;
  }
  /* 时间戳是否落在这一周内 */
  function tsInRange(ts, r) {
    if (!ts) return false;
    return inRange(Util.dateKey(new Date(ts)), r);
  }
  function weekDays(r) {
    var out = [];
    for (var i = 0; i < 7; i++) out.push(Util.addDays(r.start, i));
    return out;
  }

  /* ---------------- 数据汇总 ---------------- */
  function collect() {
    var r = range();
    var todos = DB.all('todos');
    var langLogs = DB.all('langLogs');
    var expLogs = DB.all('expLogs');
    var books = DB.all('books');
    var notes = DB.all('notes');
    var beauty = DB.all('beautyItems');
    var favs = DB.all('favs');

    var todoDone = todos.filter(function (t) { return t.status === 'done' && tsInRange(t.doneAt, r); });
    var todoNew = todos.filter(function (t) { return tsInRange(t.createdAt, r); });
    var todoOpen = todos.filter(function (t) { return t.status !== 'done'; });
    var todoOverdue = todoOpen.filter(function (t) { return t.due && t.due < Util.today(); });

    var langDays = langLogs.filter(function (l) { return inRange(l.date, r) && l.en; });
    var langMin = langDays.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);
    var expDays = expLogs.filter(function (l) { return inRange(l.date, r) && l.done; });
    var expMin = expDays.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);

    var bookNew = books.filter(function (b) { return tsInRange(b.createdAt, r); });
    var bookDone = books.filter(function (b) { return b.status === 'done' && inRange(b.finishAt, r); });
    var bookReading = books.filter(function (b) { return b.status === 'reading'; });
    var noteNew = notes.filter(function (n) { return tsInRange(n.createdAt, r); });
    var beautyNew = beauty.filter(function (x) { return tsInRange(x.addedAt || x.createdAt, r); });
    var favNew = favs.filter(function (f) { return tsInRange(f.createdAt, r); });

    /* 活跃日：这一天有任意一种记录 */
    var days = weekDays(r).map(function (d) {
      var hit =
        todos.some(function (t) { return t.status === 'done' && t.doneAt && Util.dateKey(new Date(t.doneAt)) === d; }) ||
        langLogs.some(function (l) { return l.date === d && l.en; }) ||
        expLogs.some(function (l) { return l.date === d && l.done; }) ||
        notes.some(function (n) { return Util.dateKey(new Date(n.createdAt)) === d; }) ||
        books.some(function (b) { return b.finishAt === d || (b.createdAt && Util.dateKey(new Date(b.createdAt)) === d); });
      return { date: d, active: hit };
    });

    return {
      r: r, days: days,
      todos: todos, todoDone: todoDone, todoNew: todoNew, todoOpen: todoOpen, todoOverdue: todoOverdue,
      langDays: langDays, langMin: langMin, expDays: expDays, expMin: expMin,
      books: books, bookNew: bookNew, bookDone: bookDone, bookReading: bookReading,
      notes: notes, noteNew: noteNew, beautyNew: beautyNew, favNew: favNew
    };
  }

  /* ---------------- 渲染小组件 ---------------- */
  function statHTML(n, l, x) {
    return '<div class="stat"><div class="n">' + n + '</div><div class="l">' + l + '</div><div class="x">' + x + '</div></div>';
  }

  function barRow(label, val, max, extra) {
    var pct = max > 0 ? Math.round(val / max * 100) : 0;
    return '<div class="prow">' +
      '<div class="plabel">' + Util.esc(label) + '</div>' +
      '<div class="pbar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="pval">' + val + (extra || '') + '</div>' +
      '</div>';
  }

  function lineHTML(icon, title, body) {
    return '<div class="item">' +
      '<div class="item-title">' + icon + ' ' + Util.esc(title) + '</div>' +
      '<div class="item-note">' + body + '</div>' +
      '</div>';
  }

  /* ---------------- 周复盘 ---------------- */
  function renderWeek(d) {
    var r = d.r;
    var el = document.getElementById('rvWeekRange');
    var isThis = r.start === Util.weekRange(Util.today()).start;
    if (el) el.textContent = r.start + ' ~ ' + r.end + (isThis ? '（本周）' : '');

    var box = document.getElementById('rvWeekStats');
    if (box) box.innerHTML = [
      statHTML(d.todoDone.length, '完成待办', '本周结清'),
      statHTML(d.langDays.length + ' 天', '英语打卡', d.langMin + ' 分钟'),
      statHTML(d.expDays.length + ' 天', '表达练习', d.expMin + ' 分钟'),
      statHTML(d.noteNew.length, '读书笔记', '本周新增')
    ].join('');

    /* 一周活跃条 */
    var bar = document.getElementById('rvWeekBar');
    if (bar) {
      var active = d.days.filter(function (x) { return x.active; }).length;
      bar.innerHTML = '<div class="small muted" style="margin-bottom:6px">本周活跃 ' + active + ' / 7 天</div>' +
        '<div class="chips" style="margin-bottom:12px">' + d.days.map(function (x, i) {
          return '<span class="chip' + (x.active ? ' on' : '') + '" title="' + x.date + '">' +
            Util.CN_WEEK[(i + 1) % 7].replace('星期', '周') + (x.active ? ' ✓' : '') + '</span>';
        }).join('') + '</div>';
    }

    var detail = document.getElementById('rvWeekDetail');
    if (!detail) return;

    var todoCats = {};
    d.todoDone.forEach(function (t) { var k = TODO_CAT[t.cat] || t.cat || '其他'; todoCats[k] = (todoCats[k] || 0) + 1; });
    var todoCatTxt = Object.keys(todoCats).length
      ? Object.keys(todoCats).map(function (k) { return k + ' ' + todoCats[k] + ' 件'; }).join('、')
      : '暂无';

    var rows = [
      lineHTML('✅', '待办事项',
        '本周完成 <b>' + d.todoDone.length + '</b> 件（' + todoCatTxt + '）；新建 ' + d.todoNew.length +
        ' 件；未完成累计 ' + d.todoOpen.length + ' 件' +
        (d.todoOverdue.length ? '，其中 <b style="color:var(--danger,#d9534f)">' + d.todoOverdue.length + ' 件已逾期</b>' : '，无逾期 👍')),
      lineHTML('🗣️', '英语学习',
        '打卡 <b>' + d.langDays.length + '</b> 天 / 共 ' + d.langMin + ' 分钟' +
        (d.langDays.length ? '；最近主题：' + Util.esc((d.langDays[d.langDays.length - 1].enTheme || '—')) : '；本周还没开始，挑一天补上吧')),
      lineHTML('💬', '中文表达',
        '练习 <b>' + d.expDays.length + '</b> 天 / 共 ' + d.expMin + ' 分钟' +
        (d.expDays.length ? '；最近篇目：' + Util.esc((d.expDays[d.expDays.length - 1].title || '—')) : '；本周暂无记录')),
      lineHTML('📚', '图书馆',
        '新增书 <b>' + d.bookNew.length + '</b> 本；读完 <b>' + d.bookDone.length + '</b> 本；在读 ' + d.bookReading.length + ' 本' +
        (d.bookDone.length ? '（' + d.bookDone.map(function (b) { return '《' + Util.esc(b.title) + '》'; }).join('') + '）' : '')),
      lineHTML('📝', '读书笔记', '新增 <b>' + d.noteNew.length + '</b> 条；笔记库累计 ' + d.notes.length + ' 条'),
      lineHTML('💄', '美商提升', '新增收藏 <b>' + d.beautyNew.length + '</b> 条视频'),
      lineHTML('💰', '财商学习', '新增知识收藏 <b>' + d.favNew.length + '</b> 条')
    ];
    detail.innerHTML = rows.join('');
  }

  /* ---------------- 阅读复盘 ---------------- */
  function renderRead(d) {
    var el = document.getElementById('rvReadRange');
    if (el) el.textContent = '书架全量 · 本周区间 ' + d.r.start + ' ~ ' + d.r.end;

    var books = d.books;
    var todo = books.filter(function (b) { return b.status === 'todo'; }).length;
    var reading = d.bookReading.length;
    var done = books.filter(function (b) { return b.status === 'done'; }).length;

    var box = document.getElementById('rvReadStats');
    if (box) box.innerHTML = [
      statHTML(books.length, '书架藏书', '全部书目'),
      statHTML(reading, '在读', '进行中'),
      statHTML(done, '已读完', '累计完成'),
      statHTML(d.notes.length, '笔记总数', '本周 +' + d.noteNew.length)
    ].join('');

    var shelf = document.getElementById('rvShelfStat');
    if (!shelf) return;
    if (!books.length) {
      shelf.innerHTML = '<div class="empty">书架还空着～ 去「图书馆」把今日推荐的 5 本书加进来吧 📚</div>';
      return;
    }

    var catCount = {}, maxCat = 0;
    BOOK_CATS.forEach(function (c) { catCount[c] = 0; });
    books.forEach(function (b) {
      var c = BOOK_CATS.indexOf(b.cat) >= 0 ? b.cat : '其他';
      catCount[c]++; if (catCount[c] > maxCat) maxCat = catCount[c];
    });

    var noteCount = {}, maxNote = 0;
    NOTE_CATS.forEach(function (c) { noteCount[c] = 0; });
    d.notes.forEach(function (n) {
      var c = NOTE_CATS.indexOf(n.cat) >= 0 ? n.cat : '其他';
      noteCount[c]++; if (noteCount[c] > maxNote) maxNote = noteCount[c];
    });

    var readingList = d.bookReading.slice(0, 6).map(function (b) {
      var cnt = d.notes.filter(function (n) { return n.book === b.title; }).length;
      return '<div class="item"><div class="item-title">📖 《' + Util.esc(b.title) + '》</div>' +
        '<div class="item-meta"><span class="tag accent">' + Util.esc(b.cat || '其他') + '</span>' +
        '<span class="small muted">' + Util.esc(b.author || '佚名') + '</span>' +
        '<span class="small muted">笔记 ' + cnt + ' 条</span></div></div>';
    }).join('');

    /* 空白分类提醒 */
    var empty = BOOK_CATS.filter(function (c) { return c !== '其他' && catCount[c] === 0; });

    shelf.innerHTML =
      '<h4 class="sec-title">书架分类分布</h4>' +
      '<div class="plist">' + BOOK_CATS.map(function (c) { return barRow(c, catCount[c], maxCat, ' 本'); }).join('') + '</div>' +
      '<div class="divider"></div>' +
      '<h4 class="sec-title">笔记本分布</h4>' +
      '<div class="plist">' + NOTE_CATS.map(function (c) { return barRow(c, noteCount[c], maxNote, ' 条'); }).join('') + '</div>' +
      (empty.length ? '<p class="small muted" style="margin-top:8px">还没有涉猎的领域：' + empty.join('、') + '，可以在图书馆里挑一本试试。</p>' : '') +
      (reading ? '<div class="divider"></div><h4 class="sec-title">正在读的书</h4>' + readingList : '');
  }

  /* ---------------- 自动小结 ---------------- */
  function buildSummary(d) {
    var good = [], bad = [], next = [];
    var activeDays = d.days.filter(function (x) { return x.active; }).length;

    if (d.todoDone.length >= 5) good.push('本周结清了 ' + d.todoDone.length + ' 件待办，执行力在线');
    else if (d.todoDone.length === 0) bad.push('本周没有完成任何待办，任务可能拆得太大了');

    if (d.langDays.length >= 5) good.push('英语打卡 ' + d.langDays.length + ' 天，节奏很稳');
    else if (d.langDays.length === 0) { bad.push('英语学习本周空白'); next.push('下周先定一个「每天 10 分钟英语」的小目标'); }
    else next.push('英语再补 ' + (5 - d.langDays.length) + ' 天就能达成每周 5 天');

    if (d.expDays.length >= 3) good.push('中文表达练了 ' + d.expDays.length + ' 天');
    else if (d.expDays.length === 0) next.push('表达练习可以和英语放在同一时段，顺手做完');

    if (d.bookDone.length) good.push('读完了 ' + d.bookDone.length + ' 本书：' + d.bookDone.map(function (b) { return '《' + b.title + '》'; }).join(''));
    if (d.noteNew.length >= 3) good.push('沉淀了 ' + d.noteNew.length + ' 条读书笔记');
    else if (d.bookReading.length && d.noteNew.length === 0) { bad.push('在读 ' + d.bookReading.length + ' 本书但本周没有产出笔记'); next.push('读书时随手摘一段到「读书笔记」，一条也算数'); }

    if (d.todoOverdue.length) { bad.push('有 ' + d.todoOverdue.length + ' 件待办已逾期'); next.push('先处理逾期待办，或者重新设定截止日'); }
    if (activeDays <= 2) { bad.push('本周只有 ' + activeDays + ' 天有记录'); next.push('哪怕只完成一件小事，也先把当天记录点亮'); }
    if (!d.bookReading.length && !d.bookNew.length) next.push('去图书馆把今天推荐的 5 本书挑一本加入书架');
    if (!next.length) next.push('保持现在的节奏，把在读的书读完，并给每本书补 1 条笔记');

    return { good: good, bad: bad, next: next, activeDays: activeDays };
  }

  function renderSummary(d) {
    var box = document.getElementById('rvSummary');
    if (!box) return;
    var s = buildSummary(d);
    function block(title, arr, cls) {
      if (!arr.length) return '';
      return '<div class="item"><div class="item-title">' + title + '</div><ul class="rv-ul' + (cls ? ' ' + cls : '') + '">' +
        arr.map(function (t) { return '<li>' + Util.esc(t) + '</li>'; }).join('') + '</ul></div>';
    }
    box.innerHTML =
      '<p class="small muted">本周活跃 ' + s.activeDays + ' / 7 天。' + (s.activeDays >= 5 ? '状态不错，继续保持 🍠' : '还有提升空间，慢慢来。') + '</p>' +
      (block('🌟 做得好的', s.good) || '<div class="item"><div class="item-title">🌟 做得好的</div><div class="item-note">本周还没积累出亮点，先从一件小事开始。</div></div>') +
      block('⚠️ 可以改进', s.bad) +
      block('🎯 下周建议', s.next);
  }

  /* ---------------- 导出 ---------------- */
  function exportReview() {
    var d = collect();
    var s = buildSummary(d);
    var L = [];
    L.push('芋圆工作台 · 周复盘');
    L.push('周期：' + d.r.start + ' ~ ' + d.r.end);
    L.push('导出时间：' + Util.humanDate());
    L.push('');
    L.push('【本周数据】');
    L.push('- 活跃天数：' + s.activeDays + ' / 7');
    L.push('- 完成待办：' + d.todoDone.length + ' 件（新建 ' + d.todoNew.length + '，未完成 ' + d.todoOpen.length + '，逾期 ' + d.todoOverdue.length + '）');
    L.push('- 英语打卡：' + d.langDays.length + ' 天 / ' + d.langMin + ' 分钟');
    L.push('- 表达练习：' + d.expDays.length + ' 天 / ' + d.expMin + ' 分钟');
    L.push('- 图书馆：新增 ' + d.bookNew.length + ' 本，读完 ' + d.bookDone.length + ' 本，在读 ' + d.bookReading.length + ' 本');
    L.push('- 读书笔记：新增 ' + d.noteNew.length + ' 条，累计 ' + d.notes.length + ' 条');
    L.push('- 美商收藏：' + d.beautyNew.length + ' 条；财商收藏：' + d.favNew.length + ' 条');
    L.push('');
    if (d.bookReading.length) {
      L.push('【在读书目】');
      d.bookReading.forEach(function (b) { L.push('- 《' + b.title + '》' + (b.author ? ' / ' + b.author : '') + '（' + (b.cat || '其他') + '）'); });
      L.push('');
    }
    if (d.noteNew.length) {
      L.push('【本周新增笔记】');
      d.noteNew.forEach(function (n) {
        L.push('- [' + (n.cat || '其他') + ']《' + (n.book || '—') + '》');
        if (n.excerpt) L.push('  摘录：' + n.excerpt);
        if (n.note) L.push('  感想：' + n.note);
      });
      L.push('');
    }
    L.push('【小结】');
    if (s.good.length) { L.push('做得好的：'); s.good.forEach(function (t) { L.push('  · ' + t); }); }
    if (s.bad.length) { L.push('可以改进：'); s.bad.forEach(function (t) { L.push('  · ' + t); }); }
    if (s.next.length) { L.push('下周建议：'); s.next.forEach(function (t) { L.push('  · ' + t); }); }

    Util.download('周复盘_' + d.r.start + '_' + d.r.end + '.txt', L.join('\n'));
    Toast.show('复盘已导出', 'ok');
  }

  /* ---------------- 入口 ---------------- */
  function render() {
    var d = collect();
    renderWeek(d);
    renderRead(d);
    renderSummary(d);
  }

  function shift(n) {
    anchor = Util.addDays(curAnchor(), n * 7);
    render();
  }

  function init() {
    var p = document.getElementById('rvPrev');
    if (p) p.addEventListener('click', function () { shift(-1); });
    var n = document.getElementById('rvNext');
    if (n) n.addEventListener('click', function () {
      var r = range();
      if (r.start >= Util.weekRange(Util.today()).start) { Toast.show('已经是最新的一周啦', 'info'); return; }
      shift(1);
    });
    var t = document.getElementById('rvThis');
    if (t) t.addEventListener('click', function () { anchor = null; render(); });
    var e = document.getElementById('rvExport');
    if (e) e.addEventListener('click', exportReview);
  }

  return { init: init, render: render };
})();
