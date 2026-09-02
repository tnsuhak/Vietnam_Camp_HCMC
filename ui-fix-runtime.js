(function(){
  'use strict';

  function pricingDb(){
    try { return (typeof PRICING !== 'undefined') ? PRICING : null; }
    catch (_) { return null; }
  }

  function setPressed(group, selected){
    group.querySelectorAll('.chip').forEach(function(btn){
      btn.setAttribute('aria-pressed', String(btn === selected));
    });
  }

  function syncSchedule(key, weeks){
    var group = document.querySelector('[data-sched="' + key + '"]');
    if (!group) return;
    group.querySelectorAll('.chip[data-weeks]').forEach(function(btn){
      btn.setAttribute('aria-pressed', String(btn.dataset.weeks === weeks));
    });
    try {
      if (typeof renderDates === 'function') renderDates(key, weeks);
    } catch (_) {}
  }

  function initPrice(root){
    var db = pricingDb();
    var data = db && db[root.dataset.price];
    if (!data || !Array.isArray(data.families) || !data.families.length) return;

    var weeksGroup = root.querySelector('[data-role="weeks"]');
    var familyGroup = root.querySelector('[data-role="family"]');
    var out = root.querySelector('[data-role="out"]');
    if (!weeksGroup || !familyGroup || !out) return;

    var selectedWeeks = weeksGroup.querySelector('.chip[aria-pressed="true"][data-v]');
    var state = {
      weeks: selectedWeeks ? selectedWeeks.dataset.v : '4',
      family: data.families[0].id
    };

    familyGroup.innerHTML = data.families.map(function(f, i){
      return '<button type="button" class="chip" data-v="' + f.id + '" aria-pressed="' + (i === 0) + '">' + f.label + '</button>';
    }).join('');

    function draw(){
      var fam = data.families.find(function(f){ return f.id === state.family; }) || data.families[0];
      state.family = fam.id;

      out.innerHTML = fam.rooms.map(function(r){
        var roomName = r.room || '객실';
        var sub = r.sub || '';
        if (r.consult || !r.price || r.price[state.weeks] == null) {
          var refValue = r.ref && r.ref[state.weeks] != null ? r.ref[state.weeks] : null;
          var refText = refValue != null ? '참고가 $' + Number(refValue).toLocaleString() + ' · 확정 전' : '개별 상담';
          return '<div class="room">' +
            '<span class="room__name">' + roomName + '<small>' + sub + '</small></span>' +
            '<span class="room__won">상담 필요<sub>' + refText + ' / ' + state.weeks + '주</sub></span>' +
          '</div>';
        }
        return '<div class="room">' +
          '<span class="room__name">' + roomName + '<small>' + sub + '</small></span>' +
          '<span class="room__won">$' + Number(r.price[state.weeks]).toLocaleString() + '<sub>' + data.currency + ' / ' + state.weeks + '주</sub></span>' +
        '</div>';
      }).join('') +
      '<p class="note" style="margin:6px 0 0">' + fam.label + ' · ' + state.weeks + '주 기준' + (fam.rooms.length > 1 ? ' · 객실 타입에 따라 참가비가 달라집니다' : '') + '</p>';
    }

    weeksGroup.addEventListener('click', function(e){
      var btn = e.target.closest('.chip[data-v]');
      if (!btn || !weeksGroup.contains(btn)) return;
      e.stopPropagation();
      state.weeks = btn.dataset.v;
      setPressed(weeksGroup, btn);
      draw();
      syncSchedule(root.dataset.price, state.weeks);
    });

    familyGroup.addEventListener('click', function(e){
      var btn = e.target.closest('.chip[data-v]');
      if (!btn || !familyGroup.contains(btn)) return;
      e.stopPropagation();
      state.family = btn.dataset.v;
      setPressed(familyGroup, btn);
      draw();
    });

    root.__tnsSetWeeks = function(weeks){
      var btn = weeksGroup.querySelector('.chip[data-v="' + weeks + '"]');
      if (!btn) return;
      state.weeks = weeks;
      setPressed(weeksGroup, btn);
      draw();
    };

    draw();
    root.dataset.tnsPriceFixed = 'true';
  }

  function initScheduleSync(group){
    group.addEventListener('click', function(e){
      var btn = e.target.closest('.chip[data-weeks]');
      if (!btn || !group.contains(btn)) return;
      var key = group.dataset.sched;
      var weeks = btn.dataset.weeks;
      window.setTimeout(function(){
        var price = document.querySelector('[data-price="' + key + '"]');
        if (price && typeof price.__tnsSetWeeks === 'function') price.__tnsSetWeeks(weeks);
      }, 0);
    });
  }

  function boot(){
    document.querySelectorAll('[data-price]').forEach(initPrice);
    document.querySelectorAll('[data-sched]').forEach(initScheduleSync);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
