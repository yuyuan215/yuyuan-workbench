/* ============================================================
 * 板块3：每日语言训练
 * 英语 10 分钟 + 中文 10 分钟 / 打卡 / 连续天数 / 学习台账
 * ============================================================ */
var ModLang = (function () {
  var zoomEn = false, zoomCn = false;

  function todayEn() { return Util.seededPick(CONTENT.tedTalks, Util.dayIndex() * 7 + 1, 1)[0]; }
  function todayCn() { return Util.seededPick(CONTENT.classics, Util.dayIndex() * 5 + 3, 1)[0]; }

  function logOf(date) {
    return DB.all('langLogs').filter(function (l) { return l.date === date; })[0] || null;
  }

  function check(kind) {
    var d = Util.today();
    var log = logOf(d);
    var en = todayEn(), cn = todayCn();
    if (!log) {
      log = DB.insert('langLogs', {
        date: d, en: false, cn: false, minutes: 0,
        enTheme: en.theme, cnTitle: cn.title
      });
    }
    if (log[kind]) { Toast.show('今日' + (kind === 'en' ? '英语' : '中文') + '已打卡', 'info'); return; }
    var patch = {};
    patch[kind] = true;
    patch.minutes = (log.minutes || 0) + 10;
    patch.enTheme = en.title; patch.cnTitle = cn.title;
    DB.update('langLogs', log.id, patch);
    Toast.show((kind === 'en' ? '英语' : '中文') + '学习打卡成功，+10 分钟', 'ok');
    render();
  }

  function streak() {
    var logs = {}, n = 0;
    DB.all('langLogs').forEach(function (l) { if (l.en || l.cn) logs[l.date] = true; });
    var d = Util.today();
    if (!logs[d]) d = Util.addDays(d, -1); // 今天未打卡时，从昨天开始计算连续
    while (logs[d]) { n++; d = Util.addDays(d, -1); }
    return n;
  }

  function renderStats() {
    var logs = DB.all('langLogs').filter(function (l) { return l.en || l.cn; });
    var month = Util.today().slice(0, 7);
    var monthN = logs.filter(function (l) { return l.date.slice(0, 7) === month; }).length;
    var minutes = logs.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);
    document.getElementById('langStats').innerHTML = [
      { n: streak(), l: '连续打卡（天）', x: '中断后自动重算' },
      { n: logs.length, l: '累计打卡天数', x: '历史全部记录' },
      { n: monthN, l: '本月打卡天数', x: month },
      { n: minutes, l: '累计学习（分钟）', x: '每次打卡计 10 分钟' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');
  }

  function renderEn() {
    var e = todayEn();
    var log = logOf(Util.today());
    document.getElementById('enTheme').textContent = e.title + ' · ' + e.speaker + (log && log.en ? ' · 今日已打卡' : '');
    var btn = document.getElementById('enCheck');
    btn.textContent = (log && log.en) ? '✓ 英语已打卡' : '英语打卡';
    btn.className = 'btn btn-sm ' + ((log && log.en) ? '' : 'btn-primary');

    document.getElementById('enBody').innerHTML =
      '<div class="item" style="background:transparent;border:none;padding:0">' +
      '<div class="item-title" style="font-size:16px">' + Util.esc(e.title) + '</div>' +
      '<div class="item-meta"><span class="tag accent">' + Util.esc(e.speaker) + '</span><span class="tag info">' + Util.esc(e.theme) + '</span><span>每日 TED 演讲 · 英文 10 分钟</span></div>' +
      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:12px">' + Util.esc(e.intro) + '</div>' +
      '<div class="quote" style="margin-top:12px"><b>核心观点</b><ul style="margin:6px 0 0;padding-left:20px">' +
        e.points.map(function (p) { return '<li>' + Util.esc(p) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="quote" style="margin-top:10px"><b>金句：</b>' + Util.esc(e.quote) + '</div>' +
      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:14px"><b>一、核心词汇（3 分钟）</b>' +
        '<div class="grid g3" style="margin:8px 0 14px">' +
        e.words.map(function (w) { return '<div class="item" style="margin:0;padding:9px 11px"><b>' + Util.esc(w.w) + '</b> <span class="muted small">' + Util.esc(w.ph || '') + '</span><div class="small">' + Util.esc(w.cn) + '</div></div>'; }).join('') + '</div>' +
      '<b>二、实用短句（4 分钟 · 跟读三遍）</b>' +
        '<div style="margin:8px 0 14px">' + e.sentences.map(function (s) { return '<div class="item" style="margin-bottom:8px;padding:9px 11px"><div>' + Util.esc(s.en) + '</div><div class="small muted">' + Util.esc(s.cn) + '</div></div>'; }).join('') + '</div>' +
      '<b>三、口语练习（3 分钟 · 出声作答）</b>' +
        '<div style="margin:8px 0 14px"><div class="item" style="padding:9px 11px"><div><b>Q:</b> ' + Util.esc(e.oral.q) + '</div><div class="small muted"><b>参考:</b> ' + Util.esc(e.oral.a) + '</div></div></div>' +
      '<div class="quote"><b>今日任务：</b>' + Util.esc(e.task) + '</div>' +
      '</div>';
  }

  function renderCn() {
    var c = todayCn();
    var log = logOf(Util.today());
    document.getElementById('cnTitle').textContent = c.source + (log && log.cn ? ' · 今日已打卡' : '');
    var btn = document.getElementById('cnCheck');
    btn.textContent = (log && log.cn) ? '✓ 中文已打卡' : '中文打卡';
    btn.className = 'btn btn-sm ' + ((log && log.cn) ? '' : 'btn-primary');

    document.getElementById('cnBody').innerHTML =
      '<div class="item" style="background:transparent;border:none;padding:0">' +
      '<div class="item-title" style="font-size:16px">' + Util.esc(c.title) + '</div>' +
      '<div class="item-meta"><span class="tag">' + Util.esc(c.author) + '</span><span class="tag info">' + Util.esc(c.source) + '</span><span>约 10 分钟阅读</span></div>' +
      '<div class="readbox' + (zoomCn ? ' zoom' : '') + '" style="margin-top:12px">' + Util.esc(c.text) + '</div>' +
      '<div class="quote" style="margin-top:12px"><b>金句：</b>' + Util.esc(c.quote) + '</div>' +
      '<div class="item-note"><b>阅读要点：</b>' + Util.esc(c.insight) + '</div>' +
      '</div>';
  }

  function renderCalendar() {
    var logs = {};
    DB.all('langLogs').forEach(function (l) { if (l.en || l.cn) logs[l.date] = l; });
    var html = '';
    for (var i = 27; i >= 0; i--) {
      var d = Util.addDays(Util.today(), -i);
      var hit = logs[d];
      html += '<div class="cal-cell' + (hit ? ' hit' : '') + (i === 0 ? ' today' : '') + '" title="' + d + (hit ? ' 已打卡' : ' 未打卡') + '">' + parseInt(d.slice(8), 10) + '</div>';
    }
    document.getElementById('langCal').innerHTML = html;
  }

  function renderTable() {
    var logs = DB.all('langLogs').sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 30);
    var head = '<thead><tr><th>日期</th><th>英语</th><th>中文</th><th>时长</th><th>素材主题</th></tr></thead>';
    var body = logs.length ? logs.map(function (l) {
      return '<tr><td>' + l.date + '</td>' +
        '<td>' + (l.en ? '<span class="tag ok">已完成</span>' : '<span class="tag">未完成</span>') + '</td>' +
        '<td>' + (l.cn ? '<span class="tag ok">已完成</span>' : '<span class="tag">未完成</span>') + '</td>' +
        '<td>' + (l.minutes || 0) + ' 分钟</td>' +
        '<td class="small muted">' + Util.esc((l.enTheme || '') + (l.cnTitle ? ' / ' + l.cnTitle : '')) + '</td></tr>';
    }).join('') : '<tr><td colspan="5" class="muted">暂无学习记录</td></tr>';
    document.getElementById('langTable').innerHTML = head + '<tbody>' + body + '</tbody>';
  }

  function renderStreak() {
    var s = streak();
    var today = Util.today();
    var week = [];
    for (var i = 6; i >= 0; i--) {
      var d = Util.addDays(today, -i);
      var log = logOf(d);
      week.push({ d: d, hit: log && (log.en || log.cn), today: i === 0 });
    }
    var log = logOf(today);
    var en = log && log.en, cn = log && log.cn;
    var dots = week.map(function (w) {
      return '<span class="dot' + (w.hit ? ' on' : '') + (w.today ? ' today' : '') + '" title="' + w.d + (w.hit ? ' 已打卡' : ' 未打卡') + '"></span>';
    }).join('');
    var box = document.getElementById('langStreak');
    if (box) box.innerHTML =
      '<div class="streak-left"><div class="fire">🔥</div><div><div class="big">' + s + '</div><div class="small muted">连续打卡天数</div></div></div>' +
      '<div class="streak-mid"><div class="wk">' + dots + '</div><div class="small muted">近 7 天打卡节奏</div></div>' +
      '<div class="streak-right"><span class="tag ' + (en ? 'ok' : '') + '">' + (en ? '✓' : '○') + ' 英语</span><span class="tag ' + (cn ? 'ok' : '') + '">' + (cn ? '✓' : '○') + ' 中文</span></div>';
  }

  function render() {
    renderStats(); renderStreak(); renderEn(); renderCn(); renderCalendar(); renderTable();
    var log = logOf(Util.today());
    var badge = document.getElementById('badgeLang');
    if (badge) badge.textContent = log ? ((log.en ? 1 : 0) + (log.cn ? 1 : 0)) + '/2' : '0/2';
  }

  function init() {
    document.getElementById('enCheck').addEventListener('click', function () { check('en'); });
    document.getElementById('cnCheck').addEventListener('click', function () { check('cn'); });
    document.getElementById('enZoom').addEventListener('click', function () {
      zoomEn = !zoomEn; this.textContent = zoomEn ? '退出快速阅读' : '快速阅读模式'; renderEn();
    });
    document.getElementById('cnZoom').addEventListener('click', function () {
      zoomCn = !zoomCn; this.textContent = zoomCn ? '退出快速阅读' : '快速阅读模式'; renderCn();
    });
    document.getElementById('cnFav').addEventListener('click', function () {
      var c = todayCn();
      var key = 'article::' + c.title;
      if (DB.all('favs').some(function (f) { return f.key === key; })) { Toast.show('该文章已在知识库中', 'info'); return; }
      DB.insert('favs', { key: key, type: 'article', title: c.title, source: c.author + ' · ' + c.source, body: c.text + '\n\n金句：' + c.quote });
      Toast.show('已收藏至个人知识库', 'ok');
      if (window.ModInvest) ModInvest.renderFavs();
    });
    document.getElementById('langExport').addEventListener('click', function () {
      var logs = DB.all('langLogs').sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!logs.length) { Toast.show('暂无记录可导出', 'warn'); return; }
      var csv = '日期,英语,中文,学习分钟,素材主题\n' + logs.map(function (l) {
        return [l.date, l.en ? '已完成' : '未完成', l.cn ? '已完成' : '未完成', l.minutes || 0, '"' + ((l.enTheme || '') + ' / ' + (l.cnTitle || '')) + '"'].join(',');
      }).join('\n');
      Util.download('语言学习台账_' + Util.today() + '.csv', '\ufeff' + csv);
      Toast.show('已导出学习台账', 'ok');
    });
  }

  return { init: init, render: render };
})();
