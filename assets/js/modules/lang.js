/* ============================================================
 * 板块3：英语学习（影子跟读法）
 * 每日 30 分钟英文视频 · 核心词汇 · 视频金句提炼与收藏（归入自定义收藏夹）· 打卡
 * ============================================================ */
var ModLang = (function () {
  var zoomEn = false;

  function todayEn() { return Util.seededPick(CONTENT.tedTalks, Util.dayIndex() * 7 + 1, 1)[0]; }

  function logOf(date) {
    return DB.all('langLogs').filter(function (l) { return l.date === date; })[0] || null;
  }

  function check(kind) {
    var d = Util.today();
    var log = logOf(d);
    var en = todayEn();
    if (!log) {
      log = DB.insert('langLogs', { date: d, en: false, minutes: 0, enTheme: en.title });
    }
    if (log[kind]) { Toast.show('今日英语已打卡', 'info'); return; }
    var patch = {};
    patch[kind] = true;
    patch.minutes = (log.minutes || 0) + 30;
    patch.enTheme = en.title;
    DB.update('langLogs', log.id, patch);
    Toast.show('英语学习打卡成功，+30 分钟', 'ok');
    render();
  }

  function streak() {
    var logs = {}, n = 0;
    DB.all('langLogs').forEach(function (l) { if (l.en) logs[l.date] = true; });
    var d = Util.today();
    if (!logs[d]) d = Util.addDays(d, -1);
    while (logs[d]) { n++; d = Util.addDays(d, -1); }
    return n;
  }

  function renderStats() {
    var logs = DB.all('langLogs').filter(function (l) { return l.en; });
    var month = Util.today().slice(0, 7);
    var monthN = logs.filter(function (l) { return l.date.slice(0, 7) === month; }).length;
    var minutes = logs.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);
    document.getElementById('langStats').innerHTML = [
      { n: streak(), l: '连续打卡（天）', x: '中断后自动重算' },
      { n: logs.length, l: '累计打卡天数', x: '历史全部记录' },
      { n: monthN, l: '本月打卡天数', x: month },
      { n: minutes, l: '累计学习（分钟）', x: '每次打卡计 30 分钟' }
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
      week.push({ d: d, hit: log && log.en, today: i === 0 });
    }
    var log = logOf(today);
    var en = log && log.en;
    var dots = week.map(function (w) {
      return '<span class="dot' + (w.hit ? ' on' : '') + (w.today ? ' today' : '') + '" title="' + w.d + (w.hit ? ' 已打卡' : ' 未打卡') + '"></span>';
    }).join('');
    var box = document.getElementById('langStreak');
    if (box) box.innerHTML =
      '<div class="streak-left"><div class="fire">🔥</div><div><div class="big">' + s + '</div><div class="small muted">连续打卡天数</div></div></div>' +
      '<div class="streak-mid"><div class="wk">' + dots + '</div><div class="small muted">近 7 天打卡节奏</div></div>' +
      '<div class="streak-right"><span class="tag ' + (en ? 'ok' : '') + '">' + (en ? '✓' : '○') + ' 英语</span></div>';
  }

  /* 影子跟读法说明 */
  function renderShadowIntro() {
    document.getElementById('shadowIntro').innerHTML =
      '<ol class="steps">' +
        '<li><b>听读分离</b>：先完整听 1~2 遍，不跟读，只抓大意与情绪。</li>' +
        '<li><b>影子跟读</b>：播放同时小声跟，落后半句，模仿语调、重音与节奏。</li>' +
        '<li><b>难点循环</b>：挑 3 个金句单独循环 5 遍，直到脱口而出。</li>' +
        '<li><b>复述输出</b>：关掉字幕，用中文/英文复述核心观点，才算真正吸收。</li>' +
      '</ol>' +
      '<div class="small muted">建议每天 30 分钟：跟读 20 分钟 + 金句打磨 10 分钟。下方「每日英文课」即今日跟读与精学素材。</div>';
  }

  /* 每日英文演讲视频（来自 B 站，页面内可观看 / 可跳转 B 站） */
  function renderEnVideo() {
    var v = Util.seededPick(CONTENT.englishVideos, Util.dayIndex() * 7 + 3, 1)[0];
    var box = document.getElementById('enVideo');
    if (!box) return;
    var subsData = (CONTENT.videoSubs && CONTENT.videoSubs[v.bvid]) || [];
    var subs = subsData.map(function (s) {
      return '<div class="sub-line"><div class="sub-en">' + Util.esc(s.en) + '</div><div class="sub-cn">' + Util.esc(s.cn) + '</div></div>';
    }).join('');
    var subsPanel = subs ? '<details class="subtitles-panel"><summary>📝 视频中英文对照字幕（点击展开全文）</summary><div class="sub-body">' + subs + '</div></details>' : '';
    box.innerHTML =
      '<div class="video-card">' +
        '<div class="vc-top">' +
          '<span class="vc-platform">B 站 · 英文演讲</span>' +
          '<span class="tag info">影子跟读素材</span>' +
          '<span class="muted small">' + Util.esc(v.speaker) + '</span>' +
        '</div>' +
        '<div class="vc-title">' + Util.esc(v.title) + '</div>' +
        '<div class="bili-wrap"><iframe class="bili-player" title="B站视频：' + Util.esc(v.title) + '" src="https://player.bilibili.com/player.html?bvid=' + v.bvid + '&page=1&high_quality=1&danmaku=0&autoplay=0" scrolling="no" frameborder="no" allowfullscreen="true"></iframe></div>' +
        '<div class="vc-actions">' +
          '<a class="btn btn-sm btn-primary" href="https://www.bilibili.com/video/' + v.bvid + '/" target="_blank" rel="noopener">▶ 在 B 站打开</a>' +
          '<span class="muted small">' + Util.esc(v.note || '建议开启字幕，挑选 1 段循环影子跟读。') + '</span>' +
        '</div>' +
        subsPanel +
      '</div>';
  }

  /* 当日英文课：词汇 + 金句（可收藏）+ 短句 + 口语 */
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
      '<div class="item-meta"><span class="tag accent">' + Util.esc(e.speaker) + '</span><span class="tag info">' + Util.esc(e.theme) + '</span><span>每日 TED 演讲 · 英文素材</span></div>' +
      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:12px">' + Util.esc(e.intro) + '</div>' +

      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:14px"><b>一、核心词汇（3 分钟）</b>' +
        '<div class="grid g3" style="margin:8px 0 4px">' +
        e.words.map(function (w) { return '<div class="item" style="margin:0;padding:9px 11px"><b>' + Util.esc(w.w) + '</b> <span class="muted small">' + Util.esc(w.ph || '') + '</span><div class="small">' + Util.esc(w.cn) + '</div></div>'; }).join('') + '</div></div>' +

      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:14px"><b>二、视频金句提炼（可收藏）</b>' +
        '<div class="quote" style="margin-top:6px">' + Util.esc(e.quote) + '</div>' +
        '<div class="small muted">' + Util.esc(e.quote ? '' : '') + '英文金句，建议加入收藏夹反复打磨。</div>' +
        '<div class="item-actions" style="margin-top:6px"><button class="btn btn-sm" id="enCollectQuote">☆ 存为读书笔记</button></div></div>' +

      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:14px"><b>三、实用短句（4 分钟 · 跟读三遍）</b>' +
        '<div style="margin:8px 0 4px">' + e.sentences.map(function (s) { return '<div class="item" style="margin-bottom:8px;padding:9px 11px"><div>' + Util.esc(s.en) + '</div><div class="small muted">' + Util.esc(s.cn) + '</div></div>'; }).join('') + '</div></div>' +

      '<div class="readbox' + (zoomEn ? ' zoom' : '') + '" style="margin-top:14px"><b>四、口语练习（3 分钟 · 出声作答）</b>' +
        '<div class="item" style="padding:9px 11px;margin-top:6px"><div><b>Q:</b> ' + Util.esc(e.oral.q) + '</div><div class="small muted"><b>参考:</b> ' + Util.esc(e.oral.a) + '</div></div>' +
        '<div class="quote"><b>今日任务：</b>' + Util.esc(e.task) + '</div></div>' +
      '</div>';
  }

  function collectQuote() {
    var e = todayEn();
    ModNotes.add({
      book: '—',
      excerpt: e.quote,
      note: (e.oral ? '口语练习：' + e.oral.q : ''),
      cat: '文学',
      source: '英语学习 · ' + e.speaker
    });
  }

  function renderCalendar() {
    var logs = {};
    DB.all('langLogs').forEach(function (l) { if (l.en) logs[l.date] = l; });
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
    var head = '<thead><tr><th>日期</th><th>英语</th><th>时长</th><th>今日主题</th></tr></thead>';
    var body = logs.length ? logs.map(function (l) {
      return '<tr><td>' + l.date + '</td>' +
        '<td>' + (l.en ? '<span class="tag ok">已完成</span>' : '<span class="tag">未完成</span>') + '</td>' +
        '<td>' + (l.minutes || 0) + ' 分钟</td>' +
        '<td class="small muted">' + Util.esc(l.enTheme || '') + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="muted">暂无学习记录</td></tr>';
    document.getElementById('langTable').innerHTML = head + '<tbody>' + body + '</tbody>';
  }

  function render() {
    renderStats(); renderStreakBar(); renderShadowIntro(); renderEnVideo(); renderEn(); renderCalendar(); renderTable();
    var log = logOf(Util.today());
    var badge = document.getElementById('badgeLang');
    if (badge) badge.textContent = log && log.en ? '1/1' : '0/1';
  }

  function init() {
    document.getElementById('enCheck').addEventListener('click', function () { check('en'); });
    document.getElementById('enZoom').addEventListener('click', function () {
      zoomEn = !zoomEn; this.textContent = zoomEn ? '退出快速阅读' : '快速阅读模式'; renderEn();
    });
    document.getElementById('enBody').addEventListener('click', function (e) {
      if (e.target.closest('#enCollectQuote')) collectQuote();
    });
    document.getElementById('langExport').addEventListener('click', function () {
      var logs = DB.all('langLogs').sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!logs.length) { Toast.show('暂无记录可导出', 'warn'); return; }
      var csv = '日期,英语,学习分钟,今日主题\n' + logs.map(function (l) {
        return [l.date, l.en ? '已完成' : '未完成', l.minutes || 0, '"' + (l.enTheme || '') + '"'].join(',');
      }).join('\n');
      Util.download('英语学习台账_' + Util.today() + '.csv', '﻿' + csv);
      Toast.show('已导出学习台账', 'ok');
    });
  }

  return { init: init, render: render };
})();
