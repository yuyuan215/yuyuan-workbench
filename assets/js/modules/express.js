/* ============================================================
 * 板块：表达练习（中文影子跟读法）
 * 央视新闻 / 百家讲坛 每日中文素材 · 跟读句 + 词语 + 好句收藏 · 打卡
 * 复用英语学习骨架，但素材与语言为中文
 * ============================================================ */
var ModExpress = (function () {
  var zoomExp = false;

  function todayPiece() { return Util.seededPick(CONTENT.expressionVideos, Util.dayIndex() * 5 + 2, 1)[0]; }

  function logOf(date) {
    return DB.all('expLogs').filter(function (l) { return l.date === date; })[0] || null;
  }

  function check() {
    var d = Util.today();
    var log = logOf(d);
    var p = todayPiece();
    if (!log) log = DB.insert('expLogs', { date: d, done: false, minutes: 0, title: p.title });
    if (log.done) { Toast.show('今日表达练习已打卡', 'info'); return; }
    DB.update('expLogs', log.id, { done: true, minutes: (log.minutes || 0) + 30, title: p.title });
    Toast.show('表达练习打卡成功，+30 分钟', 'ok');
    render();
  }

  function streak() {
    var logs = {}, n = 0;
    DB.all('expLogs').forEach(function (l) { if (l.done) logs[l.date] = true; });
    var d = Util.today();
    if (!logs[d]) d = Util.addDays(d, -1);
    while (logs[d]) { n++; d = Util.addDays(d, -1); }
    return n;
  }

  function renderStats() {
    var logs = DB.all('expLogs').filter(function (l) { return l.done; });
    var month = Util.today().slice(0, 7);
    var monthN = logs.filter(function (l) { return l.date.slice(0, 7) === month; }).length;
    var minutes = logs.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);
    document.getElementById('expStats').innerHTML = [
      { n: streak(), l: '连续打卡（天）', x: '中断后自动重算' },
      { n: logs.length, l: '累计打卡天数', x: '历史全部记录' },
      { n: monthN, l: '本月打卡天数', x: month },
      { n: minutes, l: '累计练习（分钟）', x: '每次打卡计 30 分钟' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');
  }

  function renderStreakBar() {
    var s = streak();
    var today = Util.today();
    var week = [];
    for (var i = 6; i >= 0; i--) {
      var d = Util.addDays(today, -i);
      var log = logOf(d);
      week.push({ d: d, hit: log && log.done, today: i === 0 });
    }
    var log = logOf(today);
    var done = log && log.done;
    var dots = week.map(function (w) {
      return '<span class="dot' + (w.hit ? ' on' : '') + (w.today ? ' today' : '') + '" title="' + w.d + (w.hit ? ' 已打卡' : ' 未打卡') + '"></span>';
    }).join('');
    var box = document.getElementById('expStreak');
    if (box) box.innerHTML =
      '<div class="streak-left"><div class="fire">🔥</div><div><div class="big">' + s + '</div><div class="small muted">连续打卡天数</div></div></div>' +
      '<div class="streak-mid"><div class="wk">' + dots + '</div><div class="small muted">近 7 天打卡节奏</div></div>' +
      '<div class="streak-right"><span class="tag ' + (done ? 'ok' : '') + '">' + (done ? '✓' : '○') + ' 表达</span></div>';
  }

  /* 影子跟读法说明（中文版） */
  function renderShadowIntro() {
    document.getElementById('expShadow').innerHTML =
      '<ol class="steps">' +
        '<li><b>听读分离</b>：先完整听 1~2 遍，不跟读，只抓大意与情绪、停顿。</li>' +
        '<li><b>影子跟读</b>：播放同时小声跟，落后半句，模仿语速、重音与节奏。</li>' +
        '<li><b>难点循环</b>：挑 3 个好句单独循环 5 遍，直到脱口而出。</li>' +
        '<li><b>复述输出</b>：关掉字幕/原声，用自己的话复述核心观点，才算真正吸收。</li>' +
      '</ol>' +
      '<div class="small muted">建议每天 30 分钟：跟读 20 分钟 + 好句打磨 10 分钟。下方「每日素材」即今日跟读内容。</div>';
  }

  /* 每日中文素材（央视新闻 / 百家讲坛） */
  function renderVideo() {
    var v = todayPiece();
    document.getElementById('expVideoDate').textContent = Util.humanDate();
    document.getElementById('expVideo').innerHTML =
      '<div class="video-card">' +
        '<div class="vc-top">' +
          '<span class="vc-platform">' + Util.esc(v.source) + '</span>' +
          '<span class="tag info">影子跟读</span>' +
          '<span class="muted small">' + Util.esc(v.duration || '—') + '</span>' +
        '</div>' +
        '<div class="vc-title">' + Util.esc(v.title) + '</div>' +
        '<div class="vc-person">' + Util.esc(v.speaker || '') + ' · ' + Util.esc(v.platform || '') + '</div>' +
        '<div class="vc-desc">' + Util.esc(v.desc || '') + '</div>' +
        '<div class="vc-shadow"><b>跟读提示</b><ul>' + (v.shadow || []).map(function (s) { return '<li>' + Util.esc(s) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="vc-actions"><a class="btn btn-sm btn-primary" href="' + Util.esc(v.url) + '" target="_blank" rel="noopener">▶ 观看并跟读</a></div>' +
      '</div>';
  }

  /* 当日课：词语 + 好句（可收藏）+ 跟读句 + 复述 */
  function renderLesson() {
    var e = todayPiece();
    var log = logOf(Util.today());
    document.getElementById('expTheme').textContent = e.title + (log && log.done ? ' · 今日已打卡' : '');
    var btn = document.getElementById('expCheck');
    btn.textContent = (log && log.done) ? '✓ 表达已打卡' : '表达打卡';
    btn.className = 'btn btn-sm ' + ((log && log.done) ? '' : 'btn-primary');

    document.getElementById('expBody').innerHTML =
      '<div class="item" style="background:transparent;border:none;padding:0">' +
      '<div class="item-title" style="font-size:16px">' + Util.esc(e.title) + '</div>' +
      '<div class="item-meta"><span class="tag accent">' + Util.esc(e.source) + '</span><span class="tag info">' + Util.esc(e.speaker || '') + '</span><span>每日中文素材 · 影子跟读</span></div>' +
      '<div class="readbox' + (zoomExp ? ' zoom' : '') + '" style="margin-top:12px">' + Util.esc(e.desc || '') + '</div>' +

      '<div class="readbox' + (zoomExp ? ' zoom' : '') + '" style="margin-top:14px"><b>一、重点词语（3 分钟）</b>' +
        '<div class="grid g3" style="margin:8px 0 4px">' +
        e.vocab.map(function (w) { return '<div class="item" style="margin:0;padding:9px 11px"><b>' + Util.esc(w.w) + '</b><div class="small">' + Util.esc(w.m) + '</div></div>'; }).join('') + '</div></div>' +

      '<div class="readbox' + (zoomExp ? ' zoom' : '') + '" style="margin-top:14px"><b>二、好句提炼（可收藏）</b>' +
        '<div class="quote" style="margin-top:6px">' + Util.esc(e.goodLine) + '</div>' +
        '<div class="small muted">' + Util.esc(e.goodLineCn || '') + '</div>' +
        '<div class="item-actions" style="margin-top:6px"><button class="btn btn-sm" id="expCollectGood">☆ 收藏这条好句到收藏夹</button></div></div>' +

      '<div class="readbox' + (zoomExp ? ' zoom' : '') + '" style="margin-top:14px"><b>三、跟读句（4 分钟 · 跟读三遍）</b>' +
        '<div style="margin:8px 0 4px">' + (e.shadow || []).map(function (s) { return '<div class="item" style="margin-bottom:8px;padding:9px 11px"><div>' + Util.esc(s) + '</div></div>'; }).join('') + '</div></div>' +

      '<div class="readbox' + (zoomExp ? ' zoom' : '') + '" style="margin-top:14px"><b>四、复述输出（3 分钟 · 出声作答）</b>' +
        '<div class="item" style="padding:9px 11px;margin-top:6px"><div>' + Util.esc(e.goodLine) + '</div>' +
        '<div class="small muted">今日任务：用自己的话，把上面这句话的意思和你的理解讲给“想象中的听众”听一遍。</div></div>' +
        '<div class="quote"><b>今日任务：</b>跟读 20 分钟 + 好句打磨 10 分钟，完成后点击上方「表达打卡」。</div></div>' +
      '</div>';
  }

  function collectGood() {
    var e = todayPiece();
    var text = e.goodLine;
    window.App.pickFolder('文学', function (coll) {
      ModQuotes.add({
        key: 'expgood::' + e.title,
        from: '表达练习',
        title: text,
        body: '出自《' + e.title + '》· ' + e.source + ' ' + (e.speaker || '') + '。\n' + (e.goodLineCn || ''),
        source: e.source + ' · ' + (e.speaker || ''),
        coll: coll
      });
    });
  }

  function renderCalendar() {
    var logs = {};
    DB.all('expLogs').forEach(function (l) { if (l.done) logs[l.date] = l; });
    var html = '';
    for (var i = 27; i >= 0; i--) {
      var d = Util.addDays(Util.today(), -i);
      var hit = logs[d];
      html += '<div class="cal-cell' + (hit ? ' hit' : '') + (i === 0 ? ' today' : '') + '" title="' + d + (hit ? ' 已打卡' : ' 未打卡') + '">' + parseInt(d.slice(8), 10) + '</div>';
    }
    document.getElementById('expCal').innerHTML = html;
  }

  function renderTable() {
    var logs = DB.all('expLogs').sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 30);
    var head = '<thead><tr><th>日期</th><th>表达练习</th><th>时长</th><th>素材</th></tr></thead>';
    var body = logs.length ? logs.map(function (l) {
      return '<tr><td>' + l.date + '</td>' +
        '<td>' + (l.done ? '<span class="tag ok">已完成</span>' : '<span class="tag">未完成</span>') + '</td>' +
        '<td>' + (l.minutes || 0) + ' 分钟</td>' +
        '<td class="small muted">' + Util.esc(l.title || '') + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted">暂无练习记录</td></tr>';
    document.getElementById('expTable').innerHTML = head + '<tbody>' + body + '</tbody>';
  }

  function render() {
    renderStats(); renderStreakBar(); renderShadowIntro(); renderVideo(); renderLesson(); renderCalendar(); renderTable();
    var log = logOf(Util.today());
    var badge = document.getElementById('badgeExp');
    if (badge) badge.textContent = log && log.done ? '1/1' : '0/1';
  }

  function init() {
    document.getElementById('expCheck').addEventListener('click', check);
    document.getElementById('expZoom').addEventListener('click', function () {
      zoomExp = !zoomExp; this.textContent = zoomExp ? '退出快速阅读' : '快速阅读模式'; renderLesson();
    });
    document.getElementById('expBody').addEventListener('click', function (e) {
      if (e.target.closest('#expCollectGood')) collectGood();
    });
    document.getElementById('expExport').addEventListener('click', function () {
      var logs = DB.all('expLogs').sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!logs.length) { Toast.show('暂无记录可导出', 'warn'); return; }
      var csv = '日期,表达练习,练习分钟,素材\n' + logs.map(function (l) {
        return [l.date, l.done ? '已完成' : '未完成', l.minutes || 0, '"' + (l.title || '') + '"'].join(',');
      }).join('\n');
      Util.download('表达练习台账_' + Util.today() + '.csv', '﻿' + csv);
      Toast.show('已导出练习台账', 'ok');
    });
  }

  return { init: init, render: render };
})();
