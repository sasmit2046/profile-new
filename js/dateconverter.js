/* ============================================================
   dateconverter.js — BS ↔ AD conversion UI
   Uses bs-data.js (BS_MONTH_DAYS, BS_MONTH_NAMES, BS_WEEKDAYS,
   bsToAd, adToBs, toNepaliDigits)
   ============================================================ */
(function () {
    'use strict';

    var direction = 'bsToAd';
    var lastResultText = '';

    var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    function $(id) { return document.getElementById(id); }

    function fmtAd(ad) {
        return MONTHS_EN[ad.getMonth()] + ' ' + ad.getDate() + ', ' + ad.getFullYear();
    }

    function fmtBs(b) {
        var lang = window.sdLang || 'en';
        var mName = lang === 'ne' ? BS_MONTH_NAMES[b.m - 1].ne : BS_MONTH_NAMES[b.m - 1].en;
        return mName + ' ' + b.d + ', ' + b.y;
    }

    function fmtBsNepali(b) {
        return BS_MONTH_NAMES[b.m - 1].ne + ' ' + toNepaliDigits(b.d) + ', ' + toNepaliDigits(b.y);
    }

    function weekdayName(ad) {
        var lang = window.sdLang || 'en';
        var wd = ad.getDay();
        return lang === 'ne' ? BS_WEEKDAYS[wd].ne : BS_WEEKDAYS[wd].en;
    }

    function showError(msgKey) {
        $('dcError').classList.remove('hidden');
        $('dcErrorMsg').innerText = window.sdT(msgKey);
        $('dcResult').classList.add('hidden');
    }

    function hideError() {
        $('dcError').classList.add('hidden');
    }

    /* ---------- Select population ---------- */
    function populateYears() {
        var sel = $('bsYear');
        if (!sel || sel.options.length) return;
        for (var y = 2000; y <= 2090; y++) {
            var opt = document.createElement('option');
            opt.value = y;
            opt.text = y;
            sel.appendChild(opt);
        }
    }

    function populateMonths() {
        var sel = $('bsMonth');
        if (!sel) return;
        var lang = window.sdLang || 'en';
        var current = sel.value ? Number(sel.value) : 1;
        sel.innerHTML = '';
        BS_MONTH_NAMES.forEach(function (m, idx) {
            var opt = document.createElement('option');
            opt.value = idx + 1;
            opt.text = lang === 'ne' ? m.ne : (m.en + ' / ' + m.ne);
            sel.appendChild(opt);
        });
        sel.value = current;
    }

    function updateDayOptions() {
        var y = Number($('bsYear').value);
        var m = Number($('bsMonth').value);
        var daySel = $('bsDay');
        if (!BS_MONTH_DAYS[y]) return;
        var maxDay = BS_MONTH_DAYS[y][m - 1];
        var prev = daySel.value ? Number(daySel.value) : 1;
        daySel.innerHTML = '';
        for (var d = 1; d <= maxDay; d++) {
            var opt = document.createElement('option');
            opt.value = d;
            opt.text = d;
            daySel.appendChild(opt);
        }
        daySel.value = Math.min(prev, maxDay);
    }

    /* ---------- Today helpers ---------- */
    function todayAdStr() {
        var now = new Date();
        return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    }

    window.setTodayBs = function () {
        var t = adToBs(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
        if (!t) { showError('dc.err.range'); return; }
        $('bsYear').value = t.y;
        $('bsMonth').value = t.m;
        updateDayOptions();
        $('bsDay').value = t.d;
        convertBsToAd();
    };

    window.setTodayAd = function () {
        $('adDate').value = todayAdStr();
        convertAdToBs();
    };

    /* ---------- Conversions ---------- */
    window.convertBsToAd = function () {
        hideError();
        var y = Number($('bsYear').value);
        var m = Number($('bsMonth').value);
        var d = Number($('bsDay').value);
        var ad = bsToAd(y, m, d);
        if (!ad) { showError('dc.err.invalid'); return; }
        renderResult('dc.resultAd', fmtAd(ad), weekdayName(ad),
            fmtBsNepali({ y: y, m: m, d: d }),
            'B.S. ' + fmtBs({ y: y, m: m, d: d }) + '  =  A.D. ' + fmtAd(ad));
        lastResultText = 'BS ' + fmtBs({ y: y, m: m, d: d }) + ' = AD ' + fmtAd(ad);
    };

    window.convertAdToBs = function () {
        hideError();
        var val = $('adDate').value;
        if (!val) { showError('dc.err.invalid'); return; }
        var parts = val.split('-');
        var b = adToBs(Number(parts[0]), Number(parts[1]), Number(parts[2]));
        if (!b) { showError('dc.err.range'); return; }
        var ad = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        renderResult('dc.resultBs', fmtBs(b), weekdayName(ad),
            fmtBsNepali(b),
            'A.D. ' + fmtAd(ad) + '  =  B.S. ' + fmtBs(b));
        lastResultText = 'AD ' + fmtAd(ad) + ' = BS ' + fmtBs(b);
    };

    function renderResult(labelKey, mainText, weekday, nepaliText, bothText) {
        $('dcResultLabel').innerText = window.sdT(labelKey);
        $('dcResultMain').innerText = mainText;
        $('dcResultWeekday').innerText = weekday;
        $('dcResultNepali').innerText = nepaliText;
        $('dcResultBoth').innerText = bothText;
        $('dcResult').classList.remove('hidden');
    }

    window.copyDcResult = function () {
        if (!lastResultText) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(lastResultText).then(function () {
                window.showToast('Copied: ' + lastResultText);
            });
        } else {
            var ta = document.createElement('textarea');
            ta.value = lastResultText;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            window.showToast('Copied: ' + lastResultText);
        }
    };

    /* ---------- Direction ---------- */
    window.setDirection = function (dir) {
        direction = dir;
        var btnBs = $('dirBsToAd');
        var btnAd = $('dirAdToBs');
        if (dir === 'bsToAd') {
            btnBs.className = 'px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm bg-rose-600 text-white';
            btnAd.className = 'px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:text-rose-600';
            $('panelBs').classList.remove('hidden');
            $('panelAd').classList.add('hidden');
        } else {
            btnAd.className = 'px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm bg-rose-600 text-white';
            btnBs.className = 'px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:text-rose-600';
            $('panelAd').classList.remove('hidden');
            $('panelBs').classList.add('hidden');
        }
        hideError();
    };

    /* ---------- Language change re-render ---------- */
    document.addEventListener('sd:langchange', function () {
        populateMonths();
        updateDayOptions();
        /* Re-run last conversion so result labels follow the language */
        if (!$('dcResult').classList.contains('hidden')) {
            if (direction === 'bsToAd') convertBsToAd();
            else convertAdToBs();
        }
    });

    /* ---------- Init ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        populateYears();
        populateMonths();

        /* Default to today's date */
        var t = adToBs(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
        if (t) {
            $('bsYear').value = t.y;
            $('bsMonth').value = t.m;
            updateDayOptions();
            $('bsDay').value = t.d;
        }
        $('adDate').value = todayAdStr();

        /* Auto-convert on selection change for convenience */
        $('bsYear').addEventListener('change', function () { if (direction === 'bsToAd') convertBsToAd(); });
        $('bsMonth').addEventListener('change', function () { if (direction === 'bsToAd') convertBsToAd(); });
        $('bsDay').addEventListener('change', function () { if (direction === 'bsToAd') convertBsToAd(); });
        $('adDate').addEventListener('change', function () { if (direction === 'adToBs') convertAdToBs(); });

        convertBsToAd();
    });
})();
