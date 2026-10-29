/* ============================================================
   contact.js — Contact form handling
   ============================================================ */
(function () {
    'use strict';

    window.handleContactSubmit = function (e) {
        e.preventDefault();
        window.showToast('Thank you! Your message has been sent to Sasmit Dhungana.');
        e.target.reset();
    };
})();
