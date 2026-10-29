/* ============================================================
   calendar.js — Nepali Bikram Sambat Calendar + AD→BS widget
   ============================================================ */
(function () {
    'use strict';

    var bsMonthsData = [
        {
            year: 2083,
            monthName: "कार्तिक",
            daysCount: 30,
            startDayOfWeek: 0, // Sunday
            holidays: [
                { day: 1, name: "लक्ष्मी पूजा / तिहार" },
                { day: 2, name: "गोवर्धन पूजा" },
                { day: 3, name: "भाइटीका" },
                { day: 15, name: "छठ पर्व" }
            ]
        },
        {
            year: 2083,
            monthName: "मंसिर",
            daysCount: 29,
            startDayOfWeek: 2, // Tuesday
            holidays: [
                { day: 10, name: "उधौली पर्व / धान्य पूर्णिमा" }
            ]
        },
        {
            year: 2083,
            monthName: "पुष",
            daysCount: 30,
            startDayOfWeek: 4, // Thursday
            holidays: [
                { day: 15, name: "तमु ल्होसार" }
            ]
        }
    ];

    var currentBsMonthIdx = 0;
    var nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    var toNe = function (n) {
        return n.toString().split('').map(function (d) { return nepaliDigits[d] || d; }).join('');
    };

    function renderCalendar() {
        var month = bsMonthsData[currentBsMonthIdx];
        document.getElementById('calendarTitle').innerText = month.monthName + ' ' + toNe(month.year);

        var grid = document.getElementById('calendarDaysGrid');
        grid.innerHTML = '';

        /* Blank filler slots before 1st day of month */
        for (var i = 0; i < month.startDayOfWeek; i++) {
            grid.innerHTML += '<div class="p-3"></div>';
        }

        for (var day = 1; day <= month.daysCount; day++) {
            var holiday = month.holidays.find(function (h) { return h.day === day; });
            var isToday = (day === 12 && month.monthName === 'कार्तिक');

            var bgClass = "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white";
            if (isToday) {
                bgClass = "bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-500/30";
            } else if (holiday) {
                bgClass = "bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-300 font-bold";
            }

            grid.innerHTML += '' +
                '<div class="p-3 sm:p-4 rounded-2xl ' + bgClass + ' text-center transition flex flex-col items-center justify-center cursor-pointer min-h-[60px]">' +
                    '<span class="text-base sm:text-xl font-extrabold">' + toNe(day) + '</span>' +
                    (holiday ? '<span class="text-[9px] truncate max-w-full px-1 leading-tight">' + holiday.name + '</span>' : '') +
                '</div>';
        }

        /* Populate holiday sidebar list */
        var list = document.getElementById('holidayListContainer');
        list.innerHTML = '';
        if (month.holidays.length === 0) {
            list.innerHTML = '<li class="text-slate-400">No major holidays listed for this month.</li>';
        } else {
            month.holidays.forEach(function (h) {
                list.innerHTML += '' +
                    '<li class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">' +
                        '<span class="font-bold text-rose-600 dark:text-rose-400">' + month.monthName + ' ' + toNe(h.day) + ' गते:</span>' +
                        '<span class="font-semibold text-slate-800 dark:text-slate-200">' + h.name + '</span>' +
                    '</li>';
            });
        }
    }

    window.prevBsMonth = function () {
        if (currentBsMonthIdx > 0) {
            currentBsMonthIdx--;
            renderCalendar();
        } else {
            window.showToast('Reached start of calendar data');
        }
    };

    window.nextBsMonth = function () {
        if (currentBsMonthIdx < bsMonthsData.length - 1) {
            currentBsMonthIdx++;
            renderCalendar();
        } else {
            window.showToast('Reached end of calendar data');
        }
    };

    /* AD → BS widget (sample dataset: Kartik 12, 2083 = demo reference) */
    window.convertAdToBs = function () {
        var adVal = document.getElementById('adConverterInput').value;
        if (!adVal) return;
        var weekdays = ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
        var d = new Date(adVal + 'T00:00:00');
        var wd = isNaN(d.getTime()) ? '' : ' (' + weekdays[d.getDay()] + ')';
        document.getElementById('bsConvertedResult').innerText = '२०८३ कार्तिक १२ गते' + wd;
    };

    document.addEventListener('DOMContentLoaded', renderCalendar);
})();
