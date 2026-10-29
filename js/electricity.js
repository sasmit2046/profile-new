/* ============================================================
   electricity.js — NEA Electricity Bill Calculator
   Domestic single-phase tariff (FY 2082/83), progressive slabs:
     Energy = Σ (units in slab × slab rate)
     Service charge depends on total units + meter capacity
     VAT 5% applies when monthly units > 50
   ============================================================ */
(function () {
    'use strict';

    /* [upTo, rate] — rate in Rs per unit */
    var TARIFF = {
        '5': {
            rates: [[20, 0.00], [30, 6.50], [50, 8.00], [100, 9.50], [250, 9.50], [Infinity, 11.00]],
            service: [[20, 30], [30, 50], [50, 50], [100, 75], [250, 100], [Infinity, 150]]
        },
        '15': {
            rates: [[20, 4.00], [30, 6.50], [50, 8.00], [100, 9.50], [250, 9.50], [Infinity, 11.00]],
            service: [[20, 50], [30, 75], [50, 75], [100, 100], [250, 125], [Infinity, 175]]
        },
        '30': {
            rates: [[20, 5.00], [30, 6.50], [50, 8.00], [100, 9.50], [250, 9.50], [Infinity, 11.00]],
            service: [[20, 75], [30, 100], [50, 100], [100, 125], [250, 150], [Infinity, 200]]
        }
    };

    var mode = 'units';

    function $(id) { return document.getElementById(id); }

    function fmtRs(n) {
        var rounded = Math.round(n * 100) / 100;
        var hasCents = rounded % 1 !== 0;
        return 'Rs ' + rounded.toLocaleString('en-IN', {
            minimumFractionDigits: hasCents ? 2 : 0,
            maximumFractionDigits: 2
        });
    }

    function slabLabel(i) {
        if (i === 0) return '0 – 20';
        var lower = TARIFF[Object.keys(TARIFF)[0]].rates[i - 1][0];
        var upper = TARIFF[Object.keys(TARIFF)[0]].rates[i][0];
        return (lower + 1) + ' – ' + (upper === Infinity ? '+' : upper);
    }

    window.setElecMode = function (m) {
        mode = m;
        var bU = $('modeUnitsBtn');
        var bR = $('modeReadingBtn');
        if (m === 'units') {
            bU.className = 'px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm bg-amber-500 text-white';
            bR.className = 'px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:text-amber-500';
            $('elecUnitsWrap').classList.remove('hidden');
            $('elecReadingWrap').classList.add('hidden');
        } else {
            bR.className = 'px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm bg-amber-500 text-white';
            bU.className = 'px-4 py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-300 hover:text-amber-500';
            $('elecReadingWrap').classList.remove('hidden');
            $('elecUnitsWrap').classList.add('hidden');
        }
    };

    window.resetElectricity = function () {
        $('elecUnits').value = '';
        $('elecPrev').value = '';
        $('elecCurr').value = '';
        $('elecError').classList.add('hidden');
        $('elecResult').classList.add('hidden');
        setElecMode('units');
    };

    window.calculateElectricity = function () {
        var errEl = $('elecError');
        var units = -1;

        if (mode === 'units') {
            units = Number($('elecUnits').value);
            if (isNaN(units) || units < 0 || units > 5000 || $('elecUnits').value === '') {
                errEl.classList.remove('hidden');
                $('elecErrorMsg').innerText = window.sdT('elec.err.units');
                $('elecResult').classList.add('hidden');
                return;
            }
        } else {
            var prev = Number($('elecPrev').value);
            var curr = Number($('elecCurr').value);
            if ($('elecPrev').value === '' || $('elecCurr').value === '' ||
                isNaN(prev) || isNaN(curr) || prev < 0 || curr < prev) {
                errEl.classList.remove('hidden');
                $('elecErrorMsg').innerText = window.sdT('elec.err.reading');
                $('elecResult').classList.add('hidden');
                return;
            }
            units = curr - prev;
        }

        errEl.classList.add('hidden');

        var amp = $('elecMeter').value;
        var conf = TARIFF[amp];

        /* Progressive energy charge */
        var energy = 0;
        var rows = [];
        var prevUpper = 0;
        for (var i = 0; i < conf.rates.length; i++) {
            var upper = conf.rates[i][0];
            var rate = conf.rates[i][1];
            if (units <= prevUpper) break;
            var unitsInSlab = Math.min(units, upper) - prevUpper;
            var amount = unitsInSlab * rate;
            energy += amount;

            var label;
            if (i === 0) label = '0 – 20';
            else label = (prevUpper + 1) + ' – ' + (upper === Infinity ? '+' : upper);

            rows.push({
                label: label,
                units: unitsInSlab,
                rate: rate,
                amount: amount,
                free: (amp === '5' && i === 0)
            });
            prevUpper = upper;
        }

        /* Service charge by total units slab */
        var service = 0;
        for (var j = 0; j < conf.service.length; j++) {
            if (units <= conf.service[j][0]) { service = conf.service[j][1]; break; }
        }

        /* VAT 5% if units > 50 */
        var vat = units > 50 ? (energy + service) * 0.05 : 0;
        var total = energy + service + vat;

        /* Render */
        $('elecEnergy').innerText = fmtRs(energy);
        $('elecService').innerText = fmtRs(service);
        $('elecVat').innerText = units > 50 ? fmtRs(vat) : window.sdT('elec.vatFree');
        $('elecTotal').innerText = fmtRs(total);

        var tbody = $('elecSlabTable');
        tbody.innerHTML = '';
        rows.forEach(function (r) {
            var tr = document.createElement('tr');
            tr.className = 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
            tr.innerHTML =
                '<td class="px-4 py-2.5 font-bold">' + r.label + '</td>' +
                '<td class="px-4 py-2.5">' + r.units + '</td>' +
                '<td class="px-4 py-2.5">' + (r.free ? '<span class="text-emerald-600 dark:text-emerald-400 font-bold">0.00 (free)</span>' : r.rate.toFixed(2)) + '</td>' +
                '<td class="px-4 py-2.5 text-right font-mono font-bold">' + fmtRs(r.amount) + '</td>';
            tbody.appendChild(tr);
        });

        /* Totals row */
        var trTot = document.createElement('tr');
        trTot.className = 'bg-slate-50 dark:bg-slate-800/70 font-extrabold text-slate-900 dark:text-white';
        trTot.innerHTML =
            '<td class="px-4 py-2.5" colspan="2">' + window.sdT('elec.energy') + ' + ' + window.sdT('elec.service') + (units > 50 ? ' + ' + window.sdT('elec.vat') : '') + '</td>' +
            '<td class="px-4 py-2.5"></td>' +
            '<td class="px-4 py-2.5 text-right font-mono">' + fmtRs(total) + '</td>';
        tbody.appendChild(trTot);

        $('elecFreeNote').classList.toggle('hidden', !(amp === '5' && units > 0));
        $('elecResult').classList.remove('hidden');
    };

    /* Recalculate on language change so labels follow */
    document.addEventListener('sd:langchange', function () {
        if (!$('elecResult').classList.contains('hidden')) calculateElectricity();
    });
})();
