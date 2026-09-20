/**
 * Case popup (full case). Requires: window.CASES, window.CASES_FULL_HTML, optional CASES_EN / CASES_FULL_HTML_EN
 */
(function () {
    var overlay = document.getElementById('casePopupOverlay');
    var closeBtn = document.getElementById('casePopupClose');
    var popupImage = document.getElementById('casePopupImage');
    var popupTitle = document.getElementById('casePopupTitle');
    var popupText = document.getElementById('casePopupText');
    var prevBtn = document.getElementById('casePopupPrev');
    var nextBtn = document.getElementById('casePopupNext');
    var casesList = document.getElementById('casesList');
    var popupBody = document.querySelector('.case-popup-body');
    var popupScroll = document.querySelector('.case-popup');

    if (!overlay || !casesList || !window.CASES || !window.CASES_FULL_HTML) return;

    function getLang() {
        return document.documentElement.lang === 'en' ? 'en' : 'ru';
    }
    function getCases() {
        return getLang() === 'en' && window.CASES_EN ? window.CASES_EN : window.CASES;
    }
    function getFullHtml() {
        var cases = getCases();
        if (getLang() === 'en' && window.CASES_FULL_HTML_EN && window.CASES_FULL_HTML_EN.length === cases.length) {
            return window.CASES_FULL_HTML_EN;
        }
        return window.CASES_FULL_HTML;
    }

    var scrollbarTimeout = null;
    var currentCardIndex = 0;

    function getCards() {
        return casesList.querySelectorAll('.cases-article-card');
    }

    function openCasePopup(index) {
        var cases = getCases();
        var fullHtml = getFullHtml();
        if (index < 0 || index >= cases.length) return;
        var item = cases[index];
        var html = fullHtml[index] || '';
        currentCardIndex = index;

        if (popupImage) {
            popupImage.src = item.image || '';
            popupImage.alt = item.imageAlt || item.title || '';
        }
        if (popupTitle) popupTitle.textContent = item.title || '';
        if (popupText) popupText.innerHTML = html;

        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= cases.length - 1;

        if (popupScroll) popupScroll.scrollTop = 0;
        if (popupBody) popupBody.classList.remove('is-scrolling');

        document.documentElement.classList.add('popup-open');
        document.body.style.overflow = 'hidden';
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
    }

    if (popupBody && popupScroll) {
        popupScroll.addEventListener('scroll', function () {
            popupBody.classList.add('is-scrolling');
            clearTimeout(scrollbarTimeout);
            scrollbarTimeout = setTimeout(function () {
                popupBody.classList.remove('is-scrolling');
            }, 800);
        });
    }

    function closePopup() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('popup-open');
        document.body.style.overflow = '';
        var adhdToggle = document.getElementById('casePopupAdhdToggle');
        var adhdVideo = document.getElementById('casePopupAdhdVideo');
        var adhdVideoEl = document.getElementById('casePopupAdhdVideoEl');
        if (adhdToggle) adhdToggle.checked = false;
        if (adhdVideo) adhdVideo.classList.remove('is-visible');
        if (adhdVideoEl) adhdVideoEl.pause();
    }

    var adhdToggle = document.getElementById('casePopupAdhdToggle');
    var adhdVideo = document.getElementById('casePopupAdhdVideo');
    var adhdVideoEl = document.getElementById('casePopupAdhdVideoEl');
    if (adhdToggle && adhdVideo && adhdVideoEl) {
        adhdToggle.addEventListener('change', function () {
            if (adhdToggle.checked) {
                var n = 1 + Math.floor(Math.random() * 7);
                adhdVideoEl.src = 'video/sdvg' + n + '.mp4';
                adhdVideo.classList.add('is-visible');
                adhdVideoEl.play().catch(function () {});
            } else {
                adhdVideo.classList.remove('is-visible');
                adhdVideoEl.pause();
            }
        });
    }

    casesList.addEventListener('click', function (e) {
        var card = e.target.closest('.cases-article-card');
        if (!card) return;
        e.preventDefault();
        var cards = getCards();
        var index = Array.prototype.indexOf.call(cards, card);
        if (index === -1) return;
        openCasePopup(index);
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentCardIndex > 0) openCasePopup(currentCardIndex - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var cases = getCases();
            if (currentCardIndex < cases.length - 1) openCasePopup(currentCardIndex + 1);
        });
    }
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
    });
    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    var imageLightboxOverlay = document.getElementById('imageLightboxOverlay');
    var imageLightboxImage = document.getElementById('imageLightboxImage');

    function openImageLightbox(src, fromCase1C) {
        if (!imageLightboxImage || !imageLightboxOverlay) return;
        imageLightboxOverlay.classList.remove('is-tall', 'is-fit-screen', 'is-zoomable');
        if (imageLightboxImage) {
            imageLightboxImage.style.width = '';
            imageLightboxImage.style.height = '';
            imageLightboxImage.style.transform = '';
        }
        if (fromCase1C) imageLightboxOverlay.classList.add('is-zoomable');
        imageLightboxImage.src = src;
        imageLightboxOverlay.classList.add('is-open');
        document.documentElement.classList.add('popup-open');
        document.body.style.overflow = 'hidden';
    }

    function closeImageLightbox() {
        if (!imageLightboxOverlay) return;
        imageLightboxOverlay.classList.remove('is-open', 'is-tall', 'is-fit-screen', 'is-zoomable');
        if (imageLightboxImage) {
            imageLightboxImage.style.width = '';
            imageLightboxImage.style.height = '';
            imageLightboxImage.style.transform = '';
        }
        if (!overlay.classList.contains('is-open')) {
            document.documentElement.classList.remove('popup-open');
            document.body.style.overflow = '';
        }
    }

    if (popupBody) {
        popupBody.addEventListener('click', function (e) {
            var img = e.target.closest('.case-popup-body img');
            if (!img) return;
            e.preventDefault();
            e.stopPropagation();
            var c = getCases()[currentCardIndex];
            var t = (c && c.title) ? c.title : '';
            var fromCase1C = t.indexOf('1С') === 0 || t.indexOf('1C') === 0;
            openImageLightbox(img.src, fromCase1C);
        });
    }

    if (imageLightboxOverlay) {
        imageLightboxOverlay.addEventListener('click', function (e) {
            if (e.target === imageLightboxOverlay) closeImageLightbox();
        });
    }
    var imageLightboxCloseBtn = document.getElementById('imageLightboxClose');
    if (imageLightboxCloseBtn) {
        imageLightboxCloseBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeImageLightbox();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (imageLightboxOverlay && imageLightboxOverlay.classList.contains('is-open')) {
            closeImageLightbox();
        } else if (overlay.classList.contains('is-open')) {
            closePopup();
        }
    });

    window.addEventListener('site-lang-change', function () {
        var cases = getCases();
        var fullHtml = getFullHtml();
        if (overlay.classList.contains('is-open')) {
            openCasePopup(Math.min(currentCardIndex, Math.max(0, cases.length - 1)));
        }
    });
})();
