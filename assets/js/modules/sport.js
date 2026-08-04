/* ============================================================
 * 板块4：每日运动打卡
 * 每日 30 分钟计划 / 打卡录入 / 周统计报表 / 永久历史记录
 * ============================================================ */
var ModSport = (function () {
  var OFF_KEY = 'paw.sp.offset';
  var kw = '';

  function offset() { try { return parseInt(sessionStorage.getItem(OFF_KEY) || '0', 10) || 0; } catch (e) { return 0; } }
  function bump() { try { sessionStorage.setItem(OFF_KEY, offset() + 1); } catch (e) {} }

  function todayPlan() {
    return Util.seededPick(CONTENT.workouts, Util.dayIndex() * 11 + offset() * 3, 1)[0];
  }

  function logsOf(date) { return DB.all('sportLogs').filter(function (l) { return l.date === date; }); }

  function renderPlan() {
    var p = todayPlan();
    document.getElementById('spPlanName').textContent = p.focus + ' · ' + p.level;
    function block(title, arr, min) {
      return '<div style="margin-bottom:12px"><b>' + title + '（约 ' + min + ' 分钟）</b>' +
        '<ul style="margin:6px 0 0;padding-left:20px">' + arr.map(function (x) { return '<li>' + Util.esc(x) + '</li>'; }).join('') + '</ul></div>';
    }
    document.getElementById('spPlan').innerHTML =
      '<div class="item" style="background:transparent;border:none;padding:0">' +
      '<div class="item-title" style="font-size:16px">' + Util.esc(p.name) + '</div>' +
      '<div class="item-meta"><span class="tag accent">' + Util.esc(p.focus) + '</span><span class="tag info">' + Util.esc(p.level) + '</span><span class="tag">总时长 30 分钟</span></div>' +
      '<div class="grid g3" style="margin-top:14px">' +
      '<div class="item" style="margin:0">' + block('热身', p.warmup, 5) + '</div>' +
      '<div class="item" style="margin:0">' + block('主体训练', p.main, 20) + '</div>' +
      '<div class="item" style="margin:0">' + block('放松拉伸', p.cooldown, 5) + '</div>' +
      '</div>' +
      '<div class="item-note"><b>训练提示：</b>' + Util.esc(p.tips) + '</div>' +
      '<div class="item-actions"><button class="btn btn-sm btn-primary" id="spQuick">按计划完成打卡（30 分钟）</button></div>' +
      '</div>';
    var q = document.getElementById('spQuick');
    if (q) q.addEventListener('click', function () {
      addLog(Util.today(), planType(p), 30, '适中', '按今日计划完成：' + p.name);
    });
  }

  function planType(p) {
    if (/HIIT|间歇|燃脂/.test(p.name + p.focus)) return 'HIIT 间歇';
    if (/瑜伽|拉伸|柔韧|放松|恢复/.test(p.name + p.focus)) return '瑜伽拉伸';
    if (/走|有氧|心肺/.test(p.name + p.focus)) return '有氧快走';
    return '力量训练';
  }

  function addLog(date, type, min, level, note) {
    if (!date) { Toast.show('请选择日期', 'warn'); return; }
    if (!min || min <= 0) { Toast.show('请填写有效时长', 'warn'); return; }
    DB.insert('sportLogs', { date: date, type: type, minutes: min, level: level, note: note || '' });
    Toast.show('运动打卡成功：' + type + ' ' + min + ' 分钟', 'ok');
    render();
  }

  function renderStats() {
    var all = DB.all('sportLogs');
    var wr = Util.weekRange();
    var week = all.filter(function (l) { return l.date >= wr.start && l.date <= wr.end; });
    var weekDays = {}; week.forEach(function (l) { weekDays[l.date] = 1; });
    var totalMin = all.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);
    var todayLogs = logsOf(Util.today());

    document.getElementById('sportStats').innerHTML = [
      { n: todayLogs.length ? '已打卡' : '未打卡', l: '今日状态', x: todayLogs.length ? todayLogs.reduce(function (s, l) { return s + l.minutes; }, 0) + ' 分钟' : '完成后点击下方打卡' },
      { n: Object.keys(weekDays).length, l: '本周出勤（天）', x: wr.start.slice(5) + ' ~ ' + wr.end.slice(5) },
      { n: week.reduce(function (s, l) { return s + (l.minutes || 0); }, 0), l: '本周总时长（分钟）', x: '目标 150 分钟/周' },
      { n: totalMin, l: '累计总时长（分钟）', x: '共 ' + all.length + ' 次记录' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');

    document.getElementById('spTodayState').textContent = todayLogs.length ? '今日已记录 ' + todayLogs.length + ' 条' : '今日尚未打卡';
    var badge = document.getElementById('badgeSport');
    if (badge) badge.textContent = Object.keys(weekDays).length + '/7';
  }

  function renderWeek() {
    var wr = Util.weekRange();
    document.getElementById('spWeekRange').textContent = wr.start + ' 至 ' + wr.end;
    var all = DB.all('sportLogs');
    var byDay = {}, types = {};
    for (var i = 0; i < 7; i++) byDay[Util.addDays(wr.start, i)] = 0;
    all.forEach(function (l) {
      if (l.date >= wr.start && l.date <= wr.end) {
        byDay[l.date] = (byDay[l.date] || 0) + (l.minutes || 0);
        types[l.type] = (types[l.type] || 0) + (l.minutes || 0);
      }
    });
    var days = Object.keys(byDay);
    var total = days.reduce(function (s, d) { return s + byDay[d]; }, 0);
    var attend = days.filter(function (d) { return byDay[d] > 0; }).length;
    var mainType = Object.keys(types).sort(function (a, b) { return types[b] - types[a]; })[0] || '—';

    document.getElementById('spWeekStats').innerHTML = [
      { n: attend, l: '出勤天数', x: '满勤 7 天' },
      { n: total, l: '总时长（分钟）', x: '完成率 ' + Math.min(100, Math.round(total / 150 * 100)) + '%' },
      { n: attend ? Math.round(total / attend) : 0, l: '场均时长（分钟）', x: '建议 ≥30 分钟' },
      { n: mainType, l: '主要运动类型', x: '本周占比最高' }
    ].map(function (s) {
      return '<div class="stat"><div class="n" style="font-size:' + (String(s.n).length > 4 ? '16px' : '24px') + '">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');

    var max = Math.max(60, Math.max.apply(null, days.map(function (d) { return byDay[d]; })));
    document.getElementById('spChart').innerHTML = days.map(function (d, i) {
      var h = Math.round(byDay[d] / max * 100);
      return '<div class="bar-col">' +
        '<div class="bar' + (byDay[d] > 0 ? ' filled' : '') + '" style="height:' + Math.max(3, h) + '%" title="' + d + '：' + byDay[d] + ' 分钟"></div>' +
        '<div class="bar-lb">' + ['一', '二', '三', '四', '五', '六', '日'][i] + '</div>' +
        '<div class="bar-lb">' + byDay[d] + '</div>' +
        '</div>';
    }).join('');
  }

  function renderTable() {
    var all = DB.all('sportLogs').filter(function (l) {
      if (!kw) return true;
      return (l.type + ' ' + (l.note || '') + ' ' + l.date).toLowerCase().indexOf(kw.toLowerCase()) >= 0;
    }).sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : b.createdAt - a.createdAt); });

    var head = '<thead><tr><th>日期</th><th>类型</th><th>时长</th><th>强度</th><th>备注</th><th></th></tr></thead>';
    var body = all.length ? all.slice(0, 200).map(function (l) {
      return '<tr><td>' + l.date + '</td><td>' + Util.esc(l.type) + '</td><td>' + l.minutes + ' 分钟</td>' +
        '<td><span class="tag">' + Util.esc(l.level || '适中') + '</span></td>' +
        '<td class="small muted">' + Util.esc(l.note || '') + '</td>' +
        '<td><button class="btn btn-sm btn-danger" data-del="' + l.id + '">删除</button></td></tr>';
    }).join('') : '<tr><td colspan="6" class="muted">暂无运动记录</td></tr>';
    document.getElementById('spTable').innerHTML = head + '<tbody>' + body + '</tbody>';
  }

  function renderMonth() {
    var today = Util.today();
    var ym = today.slice(0, 7);
    var year = parseInt(today.slice(0, 4), 10), month = parseInt(today.slice(5, 7), 10);
    var days = new Date(year, month, 0).getDate();
    var logs = DB.all('sportLogs').filter(function (l) { return l.date.slice(0, 7) === ym; });
    var byDay = {};
    logs.forEach(function (l) { byDay[l.date] = (byDay[l.date] || 0) + (l.minutes || 0); });
    var attend = Object.keys(byDay).length;
    var total = logs.reduce(function (s, l) { return s + (l.minutes || 0); }, 0);
    var html = '<div class="cal-grid">';
    for (var d = 1; d <= days; d++) {
      var ds = ym + '-' + (d < 10 ? '0' : '') + d;
      var m = byDay[ds] || 0;
      var isToday = ds === today;
      html += '<div class="cal-day' + (m > 0 ? ' hit' : '') + (isToday ? ' today' : '') + '" title="' + ds + (m > 0 ? ' · ' + m + ' 分钟' : ' · 未打卡') + '">' +
        '<span class="cd-num">' + d + '</span><span class="cd-min">' + (m > 0 ? m : '') + '</span></div>';
    }
    html += '</div>';
    var box = document.getElementById('spMonth');
    if (box) box.innerHTML = html;
    var info = document.getElementById('spMonthInfo');
    if (info) info.textContent = '出勤 ' + attend + ' 天 · 累计 ' + total + ' 分钟';
  }

  function render() { renderPlan(); renderStats(); renderWeek(); renderMonth(); renderTable(); }

  function init() {
    document.getElementById('spDate').value = Util.today();
    document.getElementById('spRefresh').addEventListener('click', function () {
      bump(); renderPlan(); Toast.show('已切换今日运动方案', 'info');
    });
    document.getElementById('spAdd').addEventListener('click', function () {
      addLog(
        document.getElementById('spDate').value,
        document.getElementById('spType').value,
        parseInt(document.getElementById('spMin').value, 10),
        document.getElementById('spLevel').value,
        document.getElementById('spNote').value.trim()
      );
      document.getElementById('spNote').value = '';
    });
    document.getElementById('spSearch').addEventListener('input', Util.debounce(function (e) {
      kw = e.target.value.trim(); renderTable();
    }, 200));
    document.getElementById('spTable').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-del]'); if (!b) return;
      DB.remove('sportLogs', b.dataset.del); Toast.show('已删除记录', 'info'); render();
    });
    document.getElementById('spExport').addEventListener('click', function () {
      var all = DB.all('sportLogs').sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!all.length) { Toast.show('暂无记录可导出', 'warn'); return; }
      var csv = '日期,运动类型,时长(分钟),强度,备注\n' + all.map(function (l) {
        return [l.date, l.type, l.minutes, l.level || '', '"' + (l.note || '') + '"'].join(',');
      }).join('\n');
      Util.download('运动记录_' + Util.today() + '.csv', '\ufeff' + csv);
      Toast.show('已导出运动记录', 'ok');
    });
  }

  return { init: init, render: render };
})();
