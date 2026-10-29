/* ============================================================
   emi.js — Loan EMI Calculator
   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
   Includes donut chart (canvas) + yearly amortisation schedule
   ============================================================ */
(function () {
    'use strict';

    function $(id) { return document.getElementById(id); }

    function fmtRs(n) {
        return 'Rs ' + Math.round(n).toLocaleString('en-IN');
    }

    function monthsBetween() {
        var t = Number($('emiTenure').value);
        if (isNaN(t) || t <= 0) return 0;
        return $('emiTenureUnit').value === 'years' ? Math.round(t * 12) : Math.round(t);
    }

    window.resetEmi = function () {
        $('emiAmount').value = '';
        $('emiRate').value = '';
        $('emiTenure').value = '';
        $('emiTenureUnit').value = 'years';
        $('emiError').classList.add('hidden');
        $('emiResult').classList.add('hidden');
    };

    window.calculateEmi = function () {
        var P = Number($('emiAmount').value);
        var annualRate = Number($('emiRate').value);
        var n = monthsBetween();

        var errEl = $('emiError');
        errEl.classList.add('hidden');

        function fail(key) {
            errEl.classList.remove('hidden');
            $('emiErrorMsg').innerText = window.sdT(key);
            $('emiResult').classList.add('hidden');
        }

        if (isNaN(P) || P < 1000 || P > 100000000) return fail('emi.err.amount');
        if (isNaN(annualRate) || annualRate < 0.1 || annualRate > 40) return fail('emi.err.rate');
        if (n < 1 || n > 360) return fail('emi.err.tenure');

        var r = annualRate / 12 / 100;
        var pow = Math.pow(1 + r, n);
        var emi = (P * r * pow) / (pow - 1);
        var totalPay = emi * n;
        var totalInterest = totalPay - P;

        $('emiMonthly').innerText = fmtRs(emi);
        $('emiPrincipal').innerText = fmtRs(P);
        $('emiInterest').innerText = fmtRs(totalInterest);
        $('emiTotalPay').innerText = fmtRs(totalPay);

        /* Legend + ratio bar */
        $('emiLegendP').innerText = fmtRs(P);
        $('emiLegendI').innerText = fmtRs(totalInterest);
        var pPct = (P / totalPay) * 100;
        $('emiBarP').style.width = pPct.toFixed(1) + '%';
        $('emiRatioText').innerText = pPct.toFixed(1) + '% principal · ' + (100 - pPct).toFixed(1) + '% interest';

        drawDonut(P, totalInterest);
        buildSchedule(P, r, emi, n);

        $('emiResult').classList.remove('hidden');
    };

    /* ---------- Donut chart ---------- */
    function drawDonut(principal, interest) {
        var canvas = $('emiChart');
        var ctx = canvas.getContext('2d');
        var W = canvas.width, H = canvas.height;
        var cx = W / 2, cy = H / 2, radius = W / 2 - 8, thick = 34;

        ctx.clearRect(0, 0, W, H);

        var total = principal + interest;
        var pFrac = principal / total;
        var start = -Math.PI / 2;

        /* Principal arc */
        ctx.beginPath();
        ctx.arc(cx, cy, radius, start, start + Math.PI * 2 * pFrac);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = thick;
        ctx.stroke();

        /* Interest arc */
        ctx.beginPath();
        ctx.arc(cx, cy, radius, start + Math.PI * 2 * pFrac, start + Math.PI * 2);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = thick;
        ctx.stroke();

        /* Center hole */
        ctx.beginPath();
        ctx.arc(cx, cy, radius - thick / 2 - 2, 0, Math.PI * 2);
        var dark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = dark ? '#0f172a' : '#ffffff';
        ctx.fill();
    }

    /* ---------- Yearly amortisation schedule ---------- */
    function buildSchedule(P, r, emi, n) {
        var tbody = $('emiSchedule');
        tbody.innerHTML = '';

        var balance = P;
        var year = 1;
        var yearP = 0, yearI = 0;
        var monthsInYear = 12;
        var rows = [];

        for (var m = 1; m <= n; m++) {
            var interest = balance * r;
            var principalPart = emi - interest;
            balance -= principalPart;
            if (balance < 0) balance = 0;
            yearP += principalPart;
            yearI += interest;

            if (m % monthsInYear === 0 || m === n) {
                rows.push({ y: year, p: yearP, i: yearI, b: balance });
                year++;
                yearP = 0; yearI = 0;
            }
        }

        rows.forEach(function (row) {
            var tr = document.createElement('tr');
            tr.className = 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
            tr.innerHTML =
                '<td class="px-4 py-2.5 font-bold">' + row.y + '</td>' +
                '<td class="px-4 py-2.5 font-mono">' + fmtRs(row.p) + '</td>' +
                '<td class="px-4 py-2.5 font-mono">' + fmtRs(row.i) + '</td>' +
                '<td class="px-4 py-2.5 font-mono text-right font-bold">' + fmtRs(row.b) + '</td>';
            tbody.appendChild(tr);
        });
    }

    /* Redraw chart on theme toggle (center hole color) */
    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('#themeToggle');
        if (t && !$('emiResult').classList.contains('hidden')) {
            setTimeout(function () { $('emiChart').getContext('2d'); calculateEmi(); }, 50);
        }
    });

    /* Recalculate on language change */
    document.addEventListener('sd:langchange', function () {
        if (!$('emiResult').classList.contains('hidden')) calculateEmi();
    });
})();
