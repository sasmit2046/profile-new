/* ============================================================
   downloads.js — Resource hub: render, search, filter, modal
   ============================================================ */
(function () {
    'use strict';

    var resourcesData = [
        {
            id: 1,
            title: "BBS 1st Year Principles of Management Notes",
            category: "bbs",
            type: "PDF Document",
            size: "4.2 MB",
            desc: "Complete unit-wise lecture notes, key theoretical definitions, and exam practice questions.",
            icon: "fa-book-bookmark",
            color: "text-blue-500"
        },
        {
            id: 2,
            title: "Financial Accounting Solutions & Numerical Guide",
            category: "bbs",
            type: "PDF Document",
            size: "6.8 MB",
            desc: "Step-by-step solved ledger entries, balance sheet formats, and cash flow statement guides.",
            icon: "fa-calculator",
            color: "text-indigo-500"
        },
        {
            id: 3,
            title: "Microeconomics BBS 1st Year Quick Revision",
            category: "bbs",
            type: "PDF Document",
            size: "3.1 MB",
            desc: "Elasticity formulas, consumer behavior diagrams, and market structure summary notes.",
            icon: "fa-chart-line",
            color: "text-purple-500"
        },
        {
            id: 4,
            title: "MS Excel Master Shortcut Keys Cheat Sheet",
            category: "excel",
            type: "Cheatsheet (PDF)",
            size: "1.5 MB",
            desc: "Over 80 essential Excel shortcuts for fast data entry, VLOOKUP, pivot tables, and formatting.",
            icon: "fa-file-excel",
            color: "text-emerald-500"
        },
        {
            id: 5,
            title: "Basic Computer Skills & Word Tips Booklet",
            category: "excel",
            type: "PDF E-Book",
            size: "5.0 MB",
            desc: "Beginner to intermediate computer literacy tips, Devanagari typing guide, and file management.",
            icon: "fa-laptop-code",
            color: "text-amber-500"
        },
        {
            id: 6,
            title: "Clean Personal Portfolio HTML/Tailwind Template",
            category: "web",
            type: "ZIP Archive",
            size: "1.2 MB",
            desc: "Ready-to-use responsive portfolio website template with dark mode toggle.",
            icon: "fa-code",
            color: "text-sky-500"
        },
        {
            id: 7,
            title: "Typeshala — Nepali Typing Tutor (Classic Setup)",
            category: "software",
            type: "EXE Installer",
            size: "1.8 MB",
            desc: "The classic Nepali typing tutor for Windows: Devanagari lessons, typing games and speed tests. Password required.",
            icon: "fa-keyboard",
            color: "text-cyan-500"
        }
    ];

    var selectedModalResource = null;
    var activeCategory = 'all';

    function renderResources(list) {
        var container = document.getElementById('resourceGrid');
        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center text-slate-400 py-12">No resources match your query.</div>';
            return;
        }

        list.forEach(function (res) {
            container.innerHTML += '' +
                '<div class="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">' +
                    '<div class="space-y-3">' +
                        '<div class="flex items-center justify-between">' +
                            '<div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 ' + res.color + ' flex items-center justify-center text-lg">' +
                                '<i class="fa-solid ' + res.icon + '"></i>' +
                            '</div>' +
                            '<span class="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">' + res.type + '</span>' +
                        '</div>' +
                        '<h3 class="font-bold text-slate-900 dark:text-white text-base">' + res.title + '</h3>' +
                        '<p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">' + res.desc + '</p>' +
                    '</div>' +
                    '<div class="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">' +
                        '<span class="text-xs text-slate-400 font-mono">' + res.size + '</span>' +
                        '<button onclick="openResourceModal(' + res.id + ')" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow">' +
                            '<i class="fa-solid fa-download"></i> Download' +
                        '</button>' +
                    '</div>' +
                '</div>';
        });
    }

    function currentList() {
        var query = (document.getElementById('resourceSearchInput').value || '').toLowerCase();
        return resourcesData.filter(function (r) {
            var matchCat = activeCategory === 'all' || r.category === activeCategory;
            var matchQuery = r.title.toLowerCase().includes(query) || r.desc.toLowerCase().includes(query);
            return matchCat && matchQuery;
        });
    }

    window.filterCategory = function (cat) {
        activeCategory = cat;
        document.querySelectorAll('.cat-pill').forEach(function (btn) {
            btn.className = "cat-pill px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition";
        });
        document.getElementById('cat-' + cat).className = "cat-pill px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white transition";
        renderResources(currentList());
    };

    window.filterResources = function () {
        renderResources(currentList());
    };

    window.openResourceModal = function (id) {
        selectedModalResource = resourcesData.find(function (r) { return r.id === id; });
        if (!selectedModalResource) return;

        document.getElementById('modalTitle').innerText = selectedModalResource.title;
        document.getElementById('modalDesc').innerText = selectedModalResource.desc + " (" + selectedModalResource.size + ")";
        document.getElementById('downloadProgressContainer').classList.add('hidden');
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressPercent').innerText = '0%';
        document.getElementById('startDownloadBtn').disabled = false;

        /* Reset password gate state */
        var pwGate = document.getElementById('passwordGate');
        var pwInput = document.getElementById('downloadPasswordInput');
        var pwError = document.getElementById('passwordError');
        if (pwGate) pwGate.classList.remove('hidden');
        if (pwInput) { pwInput.value = ''; pwInput.classList.remove('border-rose-500'); }
        if (pwError) { pwError.classList.add('hidden'); pwError.innerText = ''; }

        document.getElementById('resourceModal').classList.remove('hidden');
    };

    /* Password check first, then start the download */
    window.attemptDownload = function () {
        if (!window.checkDownloadPassword('downloadPasswordInput', 'passwordError')) return;
        document.getElementById('passwordGate').classList.add('hidden');
        window.startSimulatedDownload();
    };

    window.closeModal = function () {
        document.getElementById('resourceModal').classList.add('hidden');
    };

    window.startSimulatedDownload = function () {
        var progressContainer = document.getElementById('downloadProgressContainer');
        var progressBar = document.getElementById('progressBar');
        var progressPercent = document.getElementById('progressPercent');
        var btn = document.getElementById('startDownloadBtn');

        progressContainer.classList.remove('hidden');
        btn.disabled = true;

        var progress = 0;
        var interval = setInterval(function () {
            progress += 20;
            progressBar.style.width = progress + '%';
            progressPercent.innerText = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(function () {
                    window.closeModal();
                    window.showToast('Downloaded "' + selectedModalResource.title + '"!');
                }, 500);
            }
        }, 250);
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderResources(resourcesData);
    });
})();
