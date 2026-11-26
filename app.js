// Rivani Fine Art — Main Application Logic
(function () {
  'use strict';

  var CONFIG = {
    whatsappNumber: '919820009498',
    acquisitionEndpoint:
      'https://script.google.com/macros/s/AKfycbzug_SlaVDnXd-pi6uC7LCzgih8sCLhxCcII3UNM9Z0VVGoKLRIHDRK7Phb7fWMmTKi/exec',
    chimeSrc: 'final.mp3',
    advisoryIntervalMs: 4000
  };

  var CATEGORIES = [
    'All',
    'Abstract',
    'Figurative',
    'Landscape',
    'Sacred & Traditional',
    'Still Life',
    'Works on Paper'
  ];

  var HERO_CHAIN_IMAGES = [
    'assets/images/image_24.jpg',
    'assets/images/image_27.jpg',
    'assets/images/image_29.jpg',
    'assets/images/image_25.jpg',
    'assets/images/image_28.jpg',
    'assets/images/image_26.jpg',
    'assets/images/image_1.jpg',
    'assets/images/image_2.jpg',
    'assets/images/image_22.jpg',
    'assets/images/image_31.jpg',
    'assets/images/image_33.jpg',
    'assets/images/image_30.jpg'
  ];

  var ADVISORY_IMAGES = [
    'assets/images/image_29.jpg',
    'assets/images/image_24.jpg',
    'assets/images/image_28.jpg',
    'assets/images/image_26.jpg',
    'assets/images/image_25.jpg',
    'assets/images/image_33.jpg'
  ];

  // Safe Storage Wrapper
  var memoryStorage = {};
  var storage = {
    get: function (key, def) {
      try {
        var item = localStorage.getItem(key);
        return item ? JSON.parse(item) : def;
      } catch (e) {
        return memoryStorage[key] || def;
      }
    },
    set: function (key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        memoryStorage[key] = val;
      }
    }
  };

  var rawArtworks = Array.isArray(window.RIVANI_ARTWORKS) ? window.RIVANI_ARTWORKS : [];
  var artworks = rawArtworks.filter(function (a) {
    return a && a.status !== 'draft' && a.status !== 'hidden';
  });
  var muse = Array.isArray(window.RIVANI_MUSE) ? window.RIVANI_MUSE : [];
  window.RIVANI_ARTWORKS = artworks;
  window.RIVANI_MUSE = muse;

  // Live Supabase Sync: Fetch live published artworks from Supabase if connected
  if (window.sbClient && typeof window.sbClient.from === 'function') {
    window.sbClient
      .from('artworks')
      .select('*')
      .order('id', { ascending: true })
      .then(function (res) {
        if (res.data && res.data.length > 0) {
          var liveArts = res.data.filter(function (a) {
            return a && a.status !== 'draft' && a.status !== 'hidden';
          });
          if (liveArts.length > 0) {
            artworks = liveArts;
            window.RIVANI_ARTWORKS = liveArts;
            renderCollection();
            renderFeaturedHero();
          }
        }
      })
      .catch(function (e) {
        console.warn('Supabase storefront sync fallback to static dataset:', e);
      });
  }

  var filter = 'All';
  var query = '';
  var shortlist = storage.get('rivaniShortlist', []);
  var currentInquiryWorks = [];
  var audioChime = null;

  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  function escapeHtml(val) {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function matchCategoryFilter(cat, selectedFilter) {
    if (!cat) return false;
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Abstract') return cat.indexOf('Abstract') !== -1;
    if (selectedFilter === 'Figurative') return cat.indexOf('Figurative') !== -1 || cat.indexOf('Figure') !== -1;
    if (selectedFilter === 'Landscape') return cat.indexOf('Landscape') !== -1 || cat.indexOf('Seascape') !== -1;
    if (selectedFilter === 'Sacred & Traditional') return /Traditional|Devotional|Sacred|Pichwai|Folk/i.test(cat);
    if (selectedFilter === 'Still Life') return cat.indexOf('Still Life') !== -1;
    if (selectedFilter === 'Works on Paper') return cat.indexOf('Works on Paper') !== -1;
    return false;
  }

  function getShortlistWorks() {
    return artworks.filter(function (a) { return shortlist.indexOf(a.id) !== -1; });
  }

  function saveShortlist() {
    storage.set('rivaniShortlist', shortlist);
    renderCount();
  }

  function playChime() {
    try {
      if (!audioChime) {
        audioChime = new Audio(CONFIG.chimeSrc);
      }
      audioChime.currentTime = 0;
      var promise = audioChime.play();
      if (promise !== undefined) {
        promise.catch(function () { /* Ignore browser autoplay restrictions */ });
      }
    } catch (e) {}
  }

  function renderCount() {
    var el = $('#shortlistCount');
    if (el) el.textContent = shortlist.length;
  }

  function toggleShortlist(id) {
    var wasIn = shortlist.indexOf(id) !== -1;
    if (wasIn) {
      shortlist = shortlist.filter(function (x) { return x !== id; });
    } else {
      shortlist = shortlist.concat([id]);
      playChime();
    }
    saveShortlist();
    renderArt();
    renderShortlist();
  }

  function syncBodyLock() {
    if (!$('#modal.open') && !$('#shortlistDrawer.open') && !$('#inquiryModal.open')) {
      document.body.classList.remove('lock');
    }
  }

  function openWhatsAppInquiry(text) {
    var url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  // Hero Background Scrolling Chain of Images
  function initHeroSlideshow() {
    var track = $('.hero-marquee-track');
    if (!track) return;

    var fullChain = HERO_CHAIN_IMAGES.concat(HERO_CHAIN_IMAGES);
    track.innerHTML = fullChain
      .map(function (src) {
        return '<div class="hero-marquee-card" style="background-image: url(\'' + escapeHtml(src) + '\');"></div>';
      })
      .join('');
  }

  // Advisory Section Slideshow
  function initAdvisorySlideshow() {
    var slider = $('.advisory-slider');
    if (!slider) return;

    slider.innerHTML = ADVISORY_IMAGES
      .map(function (src, idx) {
        return '<div class="advisory-slide ' + (idx === 0 ? 'active' : '') + '" style="background-image: url(\'' + escapeHtml(src) + '\');"></div>';
      })
      .join('');

    var currentSlide = 0;
    var slides = $$('.advisory-slide');
    if (slides.length > 1) {
      setInterval(function () {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, CONFIG.advisoryIntervalMs);
    }
  }

  function renderFilters() {
    var container = $('#filters');
    if (!container) return;
    container.innerHTML = CATEGORIES
      .map(function (c) {
        return '<button class="filter-btn ' + (filter === c ? 'active' : '') + '" data-filter="' + escapeHtml(c) + '">' + escapeHtml(c.toUpperCase()) + '</button>';
      })
      .join('');

    $$('[data-filter]').forEach(function (b) {
      b.onclick = function () {
        filter = b.getAttribute('data-filter');
        renderFilters();
        renderArt();
      };
    });
  }

  function visible() {
    var q = query.toLowerCase().trim();
    return artworks.filter(function (a) {
      if (!matchCategoryFilter(a.category, filter)) return false;
      if (!q) return true;
      var haystack = [
        a.title,
        a.canonical_title,
        a.source_title,
        a.artist,
        a.category,
        a.medium,
        a.support,
        a.framed_description,
        a.dimensions,
        a.price,
        a.description,
        a.notes
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function renderArt() {
    var list = visible();
    var countEl = $('#shownCount');
    if (countEl) countEl.textContent = list.length + ' OF ' + artworks.length + ' WORKS';

    var grid = $('#artGrid');
    if (!grid) return;

    if (!list.length) {
      grid.innerHTML = '<div style="grid-column: 1/-1; padding: 40px 0; text-align: center; color: var(--ink-soft); font-family: \'Playfair Display\', serif; font-size: 20px;">No artworks matched your query.</div>';
      return;
    }

    grid.innerHTML = list
      .map(function (a) {
        var isSaved = shortlist.indexOf(a.id) !== -1;
        var frameSnippet = a.framed_description || a.frame_type || 'Custom Archival Frame';
        var title = escapeHtml(a.title);
        return [
          '<article class="art-card">',
          '  <div class="image-wrap" data-open="' + a.id + '">',
          '    <img loading="lazy" src="' + escapeHtml(a.image) + '" alt="' + title + ' by ' + escapeHtml(a.artist) + '">',
          '    <button class="save-btn ' + (isSaved ? 'saved' : '') + '" data-save="' + a.id + '" aria-label="Shortlist ' + title + '">',
          '      ' + (isSaved ? '♥' : '♡'),
          '    </button>',
          '  </div>',
          '  <div class="card-meta">',
          '    <div class="artist-cat">',
          '      <span>' + escapeHtml(a.category) + '</span>',
          '      <span class="card-size">' + escapeHtml(a.dimensions || '') + '</span>',
          '    </div>',
          '    <h3>' + title + '</h3>',
          '    <div class="specs">' + escapeHtml(a.medium) + ' · ' + escapeHtml(frameSnippet) + '</div>',
          '    <div class="price-row">',
          '      <div class="price">' + escapeHtml(a.price) + '</div>',
          '      <button class="view-link" data-open="' + a.id + '">VIEW DETAILS →</button>',
          '    </div>',
          '  </div>',
          '</article>'
        ].join('\n');
      })
      .join('');

    $$('[data-save]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        toggleShortlist(+b.getAttribute('data-save'));
      };
    });

    $$('#artGrid [data-open]').forEach(function (el) {
      el.onclick = function (e) {
        if (e.target.closest('[data-save]')) return;
        openProduct(+el.getAttribute('data-open'));
      };
    });
  }

  function openProduct(id) {
    var a = artworks.find(function (x) { return x.id === id; });
    if (!a) return;

    var whatsappMsg = encodeURIComponent(
      "Hello Rivani Fine Art, I would like to inquire about acquiring '" + a.title + "' (" + a.price + ", Dimensions: " + a.dimensions + ", Frame: " + (a.framed_description || 'Archival Frame') + "). Is this piece available for private viewing or pan-India delivery?"
    );

    var views = (a.views && a.views.length) ? a.views : [a.image];
    var title = escapeHtml(a.title);
    var mainImageHtml = '<div class="gallery-main-wrap"><img id="modalMainImg" src="' + escapeHtml(views[0]) + '" alt="' + title + '" loading="eager" /></div>';

    var thumbnailsHtml = '';
    if (views.length > 1) {
      var thumbs = views.map(function (src, idx) {
        return '<div class="gallery-thumb ' + (idx === 0 ? 'active' : '') + '" data-thumb-src="' + escapeHtml(src) + '" role="button" aria-label="Perspective ' + (idx + 1) + '"><img src="' + escapeHtml(src) + '" alt="' + title + ' view ' + (idx + 1) + '"></div>';
      }).join('');
      thumbnailsHtml = '<p class="gallery-views-label">ARCHITECTURAL PERSPECTIVES & VIEWS (' + views.length + ')</p><div class="gallery-thumbnails">' + thumbs + '</div>';
    }

    var isSaved = shortlist.indexOf(a.id) !== -1;
    var priceDisplay = a.price === 'Price on Request' ? 'Price on Request' : a.price + ' (Bespoke Frame Included)';
    var panelRow = (a.panel_count && a.panel_count > 1) ? '<div><span>PANEL COUNT</span><b>' + a.panel_count + ' Panels</b></div>' : '';
    var framedDimRow = a.framed_dimensions ? '<div><span>FRAMED DIMENSIONS</span><b>' + escapeHtml(a.framed_dimensions) + '</b></div>' : '';

    $('#modalContent').innerHTML = [
      '<div class="product-modal">',
      '  <div class="product-gallery">',
      mainImageHtml,
      thumbnailsHtml,
      '  </div>',
      '  <div class="product-info">',
      '    <p class="eyebrow">' + escapeHtml(a.category) + ' · ' + escapeHtml(a.artist) + '</p>',
      '    <h2>' + title + '</h2>',
      '    <p class="lead">' + escapeHtml(a.description) + '</p>',
      '    <div class="details">',
      '      <div><span>MEDIUM & SUPPORT</span><b>' + escapeHtml(a.medium) + '</b></div>',
      (a.dimensions ? '<div><span>ARTWORK DIMENSIONS</span><b>' + escapeHtml(a.dimensions) + '</b></div>' : ''),
      '      <div><span>ORIENTATION</span><b>' + escapeHtml(a.orientation || 'Standard') + '</b></div>',
      panelRow,
      '      <div><span>FRAMING</span><b>' + escapeHtml(a.framed_description || a.frame_type || 'Custom Museum Frame') + '</b></div>',
      framedDimRow,
      '      <div><span>PRICE</span><b>' + escapeHtml(priceDisplay) + '</b></div>',
      '      <div><span>AVAILABILITY</span><b>' + (a.status === 'sold' ? 'Acquired / Private Collection' : 'Available for Immediate Acquisition') + '</b></div>',
      '      <div><span>AUTHENTICITY</span><b>Registered Provenance & Certificate</b></div>',
      '    </div>',
      '    <div class="modal-actions">',
      '      <a href="https://wa.me/' + CONFIG.whatsappNumber + '?text=' + whatsappMsg + '" target="_blank" rel="noopener" class="button whatsapp-btn full">💬 INQUIRE ON WHATSAPP (+91 9820009498)</a>',
      '      <button class="button dark full" id="modalInquireEmail">✉️ INQUIRE VIA EMAIL</button>',
      '      <button class="button light-outline full" id="modalSave">' + (isSaved ? '♥ REMOVE FROM SHORTLIST' : '♡ ADD TO SHORTLIST') + '</button>',
      '      <button class="text-btn" id="modalInquireForm" style="margin-top: 10px; text-align: center; width: 100%;">Or Fill Direct Inquiry Form ↓</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    $$('.gallery-thumb').forEach(function (thumb) {
      thumb.onclick = function () {
        var src = thumb.getAttribute('data-thumb-src');
        var mainImg = $('#modalMainImg');
        if (mainImg && src) {
          mainImg.src = src;
          $$('.gallery-thumb').forEach(function (t) { t.classList.remove('active'); });
          thumb.classList.add('active');
        }
      };
    });

    $('#modal').classList.add('open');
    $('#modal').setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');

    var openInquiryFromProduct = function () {
      closeModal();
      openInquiryModal([a]);
    };

    var emailInquireBtn = $('#modalInquireEmail');
    if (emailInquireBtn) emailInquireBtn.onclick = openInquiryFromProduct;

    var formBtn = $('#modalInquireForm');
    if (formBtn) formBtn.onclick = openInquiryFromProduct;

    var saveBtn = $('#modalSave');
    if (saveBtn) {
      saveBtn.onclick = function () {
        toggleShortlist(a.id);
        var nowSaved = shortlist.indexOf(a.id) !== -1;
        saveBtn.textContent = nowSaved ? '♥ REMOVE FROM SHORTLIST' : '♡ ADD TO SHORTLIST';
      };
    }
  }

  function closeModal() {
    var modal = $('#modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    syncBodyLock();
  }

  function renderMuse() {
    var museGrid = $('#museGrid');
    if (!museGrid) return;

    var items = muse.length ? muse : artworks.map(function (a) {
      return { artworkId: a.id, image: a.image, title: a.title };
    });

    museGrid.innerHTML = items
      .map(function (item) {
        var art = artworks.find(function (a) { return a.id === item.artworkId; }) || artworks[0];
        if (!art) return '';
        var title = escapeHtml(art.title);
        var dims = art.dimensions ? escapeHtml(art.dimensions) : '';
        return [
          '<div class="muse-item" data-open="' + art.id + '">',
          '  <img loading="lazy" src="' + escapeHtml(item.image) + '" alt="' + title + ' installed in interior">',
          '  <div class="muse-label">',
          '    ' + title,
          '    <span>' + dims + ' · ' + escapeHtml(art.price) + ' · VIEW ARTWORK →</span>',
          '  </div>',
          '</div>'
        ].join('\n');
      })
      .join('');

    $$('#museGrid [data-open]').forEach(function (el) {
      el.onclick = function () {
        openProduct(+el.getAttribute('data-open'));
      };
    });
  }

  function openDrawer() {
    renderShortlist();
    var drawer = $('#shortlistDrawer');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lock');
  }

  function closeDrawer() {
    var drawer = $('#shortlistDrawer');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    syncBodyLock();
  }

  function renderShortlist() {
    var chosen = getShortlistWorks();
    var container = $('#shortlistItems');
    var drawerActions = $('#drawerActions') || $('.drawer-actions');
    var copyStatus = $('#copyStatus');
    if (!container) return;

    if (!chosen.length) {
      container.innerHTML = '<p class="empty">Your shortlist is currently empty.<br><span style="font-size: 13px; font-family: sans-serif; color: var(--ink-soft); display: block; margin-top: 8px;">Browse available works and tap the heart icon to curate your collection.</span></p>';
      if (copyStatus) copyStatus.textContent = '';
      if (drawerActions) {
        drawerActions.innerHTML = [
          '<a href="#available" id="drawerExploreBtn" class="button dark full">VIEW THE COLLECTION</a>',
          '<a href="#contact" id="drawerContactBtn" class="button light-outline full">CONTACT US</a>',
          '<a href="https://wa.me/' + CONFIG.whatsappNumber + '?text=Hello%20Rivani%20Fine%20Art%2C%20I%20would%20like%20to%20inquire%20about%20your%20art%20collection." target="_blank" rel="noopener" class="button whatsapp-btn full">💬 INQUIRE ON WHATSAPP</a>'
        ].join('\n');

        var deb = $('#drawerExploreBtn');
        if (deb) deb.onclick = closeDrawer;
        var dcb = $('#drawerContactBtn');
        if (dcb) dcb.onclick = closeDrawer;
      }
      return;
    }

    container.innerHTML = chosen
      .map(function (a) {
        var title = escapeHtml(a.title);
        return [
          '<div class="short-item">',
          '  <img src="' + escapeHtml(a.image) + '" alt="' + title + '">',
          '  <div>',
          '    <h4>' + title + '</h4>',
          '    <p>' + escapeHtml(a.category) + ' · ' + escapeHtml(a.dimensions) + '</p>',
          '    <p><strong>' + escapeHtml(a.price) + '</strong></p>',
          '  </div>',
          '  <button class="remove" data-remove="' + a.id + '" aria-label="Remove ' + title + '">×</button>',
          '</div>'
        ].join('\n');
      })
      .join('');

    if (drawerActions) {
      drawerActions.innerHTML = [
        '<button id="sendShortlistWhatsApp" class="button whatsapp-btn full">💬 INQUIRE ON WHATSAPP</button>',
        '<button id="sendShortlistEmail" class="button dark full">✉️ EMAIL SHORTLIST TO RIVANI</button>',
        '<button id="copyEnquiry" class="button light-outline full">COPY ENQUIRY LIST</button>'
      ].join('\n');

      var ssw = $('#sendShortlistWhatsApp');
      if (ssw) ssw.onclick = sendShortlistWhatsApp;
      var sse = $('#sendShortlistEmail');
      if (sse) sse.onclick = sendShortlistEmail;
      var ce = $('#copyEnquiry');
      if (ce) ce.onclick = copyEnquiry;
    }

    $$('[data-remove]').forEach(function (b) {
      b.onclick = function () {
        toggleShortlist(+b.getAttribute('data-remove'));
      };
    });
  }

  function getShortlistText() {
    var chosen = getShortlistWorks();
    if (!chosen.length) return '';
    var lines = [
      'RIVANI FINE ART — COLLECTOR SHORTLIST',
      '===================================='
    ];
    chosen.forEach(function (a, i) {
      lines.push((i + 1) + '. ' + a.title);
      lines.push('   Category: ' + a.category);
      lines.push('   Dimensions: ' + a.dimensions);
      lines.push('   Frame: ' + (a.framed_description || 'Archival Frame'));
      lines.push('   Price: ' + a.price);
    });
    lines.push('====================================');
    lines.push('Contact: inquiry@rivaniart.com | WhatsApp: +91 9820009498');
    lines.push('Please confirm availability, custom framing options, and private viewing schedules.');
    return lines.join('\n');
  }

  function sendShortlistWhatsApp() {
    var chosen = getShortlistWorks();
    if (!chosen.length) {
      alert('Please add at least one artwork to your shortlist first.');
      return;
    }
    openWhatsAppInquiry(getShortlistText());
  }

  function sendShortlistEmail() {
    var chosen = getShortlistWorks();
    closeDrawer();
    openInquiryModal(chosen);
  }

  function showCopyConfirmation() {
    var st = $('#copyStatus');
    if (st) {
      st.textContent = '✓ Shortlist copied to clipboard.';
      setTimeout(function () { st.textContent = ''; }, 4000);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopyConfirmation();
    } catch (err) {
      var st = $('#copyStatus');
      if (st) st.textContent = 'Select and copy your shortlist items manually.';
    }
    document.body.removeChild(ta);
  }

  function copyEnquiry() {
    if (!shortlist.length) {
      var st = $('#copyStatus');
      if (st) st.textContent = 'Add at least one work to your shortlist first.';
      return;
    }
    var text = getShortlistText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopyConfirmation).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function openInquiryModal(targetWorks) {
    playChime();
    currentInquiryWorks = (targetWorks && targetWorks.length) ? targetWorks : [];
    if (!currentInquiryWorks.length && shortlist.length) {
      currentInquiryWorks = getShortlistWorks();
    }

    var formView = $('#inquiryFormView');
    var successView = $('#inquirySuccessView');
    var worksWrap = $('#popSelectedWorksWrap');
    var worksList = $('#popSelectedList');
    var worksTitle = $('#popSelectedTitle');

    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (worksWrap && worksList) {
      if (currentInquiryWorks.length) {
        worksWrap.style.display = 'block';
        if (worksTitle) {
          worksTitle.textContent = 'Acquisition Artwork' + (currentInquiryWorks.length > 1 ? 's (' + currentInquiryWorks.length + ')' : '');
        }
        worksList.innerHTML = currentInquiryWorks.map(function (w) {
          var title = escapeHtml(w.title);
          return [
            '<div class="inquiry-work-card">',
            '  <img src="' + escapeHtml(w.image) + '" alt="' + title + '" />',
            '  <div class="inquiry-work-card-info">',
            '    <h4>' + title + '</h4>',
            '    <p>' + escapeHtml(w.category || '') + (w.dimensions ? ' · ' + escapeHtml(w.dimensions) : '') + '</p>',
            '  </div>',
            '  <div class="inquiry-work-price">' + escapeHtml(w.price || '') + '</div>',
            '</div>'
          ].join('');
        }).join('');
      } else {
        worksWrap.style.display = 'none';
        worksList.innerHTML = '';
      }
    }

    var modal = $('#inquiryModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lock');
  }

  function showInquirySuccess(works, name, phone) {
    var formView = $('#inquiryFormView');
    var successView = $('#inquirySuccessView');
    var successWorksText = $('#successWorksText');
    var successCollectorText = $('#successCollectorText');

    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'block';

    var wList = (works && works.length) ? works : currentInquiryWorks;
    var countText = (wList && wList.length)
      ? (wList.length === 1 ? wList[0].title : wList.length + ' Artworks')
      : 'Acquisition Request';

    if (successWorksText) successWorksText.textContent = countText;
    if (successCollectorText) successCollectorText.textContent = (name || 'Collector') + (phone ? ' (' + phone + ')' : '');

    var modal = $('#inquiryModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lock');
  }

  function closeInquiryModal() {
    var modal = $('#inquiryModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    syncBodyLock();
  }

  function submitAcquisitionRequest(opts) {
    var name = opts.name;
    var phone = opts.phone;
    var email = opts.email;
    var message = opts.message;
    var works = opts.works || [];
    var buttonEl = opts.buttonEl;
    var statusEl = opts.statusEl;
    var formEl = opts.formEl;

    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.textContent = '⏳ SUBMITTING REQUEST...';
    }
    if (statusEl) {
      statusEl.style.color = 'var(--ink-soft)';
      statusEl.textContent = 'Submitting your request to Rivani Fine Art desk...';
    }

    var jsonPayload = {
      name: name,
      phone: phone,
      email: email || '',
      city: opts.city || '',
      message: message,
      works: works.map(function (w) {
        return { id: w.id, title: w.title, price: w.price || '' };
      })
    };

    var finishSuccess = function () {
      if (statusEl) {
        statusEl.style.color = '#195237';
        statusEl.innerHTML = '✓ <strong>Thank you!</strong> Your acquisition request has been submitted. Our curatorial team will review your inquiry and connect with you shortly.';
      }
      showInquirySuccess(works, name, phone);
      if (formEl) formEl.reset();
    };

    var fallbackGoogleScript = function () {
      var payload = new URLSearchParams();
      payload.append('name', name);
      payload.append('phone', phone);
      payload.append('email', email || 'N/A');
      payload.append('message', message);

      return fetch(CONFIG.acquisitionEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });
    };

    var submitPromise = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
      ? fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonPayload)
        }).then(function (res) {
          if (!res.ok) throw new Error('Local API unavailable');
          return res.json();
        }).catch(fallbackGoogleScript)
      : fallbackGoogleScript();

    submitPromise
      .then(finishSuccess)
      .catch(function (err) {
        console.error('Submission error:', err);
        finishSuccess();
      })
      .finally(function () {
        if (buttonEl) {
          buttonEl.disabled = false;
          buttonEl.textContent = '✉️ SUBMIT ACQUISITION REQUEST';
        }
      });
  }

  function readInputVal(selector) {
    var el = $(selector);
    return el ? el.value.trim() : '';
  }

  function initApp() {
    initHeroSlideshow();
    initAdvisorySlideshow();
    renderFilters();
    renderArt();
    renderMuse();
    renderCount();
    renderShortlist();

    var searchInput = $('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        query = e.target.value;
        renderArt();
      });
    }

    var searchBtn = $('#searchBtn');
    if (searchBtn) {
      searchBtn.onclick = function () {
        var avail = $('#available');
        if (avail) {
          avail.scrollIntoView({ behavior: 'smooth' });
          var input = $('#searchInput');
          if (input) setTimeout(function () { input.focus(); }, 350);
        }
      };
    }

    var sb = $('#shortlistBtn');
    if (sb) sb.onclick = openDrawer;

    var os = $('#openShortlist');
    if (os) os.onclick = openDrawer;

    var directEmailBtn = $('#directEmailBtn');
    if (directEmailBtn) {
      directEmailBtn.onclick = function (e) {
        e.preventDefault();
        openInquiryModal();
      };
    }

    var popWaBtn = $('#popWhatsAppBtn');
    if (popWaBtn) {
      popWaBtn.onclick = function () {
        var name = readInputVal('#popName') || 'Collector';
        var phone = readInputVal('#popPhone');
        var city = readInputVal('#popCity');
        var msg = readInputVal('#popMessage');
        var worksSummary = currentInquiryWorks
          .map(function (w, i) { return (i + 1) + '. ' + w.title + ' (' + (w.price || '') + ')'; })
          .join('\n');

        var text = [
          'RIVANI FINE ART — ACQUISITION INQUIRY',
          'Name: ' + name,
          (phone ? 'Phone: ' + phone : ''),
          (city ? 'City / Location: ' + city : ''),
          (worksSummary ? 'Artworks:\n' + worksSummary : ''),
          (msg ? 'Notes: ' + msg : ''),
          '-----------------------------------',
          'Sent to Rivani Fine Art desk.'
        ].filter(Boolean).join('\n');

        openWhatsAppInquiry(text);
      };
    }

    var popForm = $('#popInquiryForm');
    if (popForm) {
      popForm.onsubmit = function (e) {
        e.preventDefault();
        playChime();
        var name = readInputVal('#popName');
        var phone = readInputVal('#popPhone');
        var email = readInputVal('#popEmail');
        var city = readInputVal('#popCity');
        var message = readInputVal('#popMessage');

        if (!name || !phone) {
          alert('Please enter your Name and Phone / WhatsApp number.');
          return;
        }

        var worksSummary = currentInquiryWorks.map(function (w, i) {
          return (i + 1) + '. ' + w.title + ' (' + (w.price || '') + (w.dimensions ? ', ' + w.dimensions : '') + ')';
        }).join('\n');

        var fullMsg = [
          (worksSummary ? 'Works of Interest:\n' + worksSummary : 'General acquisition inquiry from website.'),
          (city ? 'Location: ' + city : ''),
          (message ? 'Collector Notes: ' + message : '')
        ].filter(Boolean).join('\n\n');

        submitAcquisitionRequest({
          name: name,
          phone: phone,
          email: email,
          city: city,
          message: fullMsg,
          works: currentInquiryWorks,
          buttonEl: $('#popSubmitBtn'),
          formEl: popForm
        });
      };
    }

    $$('[data-close]').forEach(function (x) { x.onclick = closeModal; });
    $$('[data-drawer-close]').forEach(function (x) { x.onclick = closeDrawer; });
    $$('[data-inquiry-close]').forEach(function (x) { x.onclick = closeInquiryModal; });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        closeDrawer();
        closeInquiryModal();
      }
    });

    var contactForm = $('#contactForm');
    if (contactForm) {
      var getFormData = function () {
        return {
          name: readInputVal('#formName'),
          phone: readInputVal('#formPhone'),
          email: readInputVal('#formEmail'),
          city: readInputVal('#formCity'),
          message: readInputVal('#formMessage')
        };
      };

      var submitWa = $('#submitWhatsApp');
      if (submitWa) {
        submitWa.onclick = function () {
          var data = getFormData();
          if (!data.name || !data.phone) {
            alert('Please provide your Name and Phone / WhatsApp number.');
            return;
          }
          var text = [
            'RIVANI FINE ART — ACQUISITION INQUIRY',
            'Name: ' + data.name,
            'Phone / WhatsApp: ' + data.phone,
            (data.email ? 'Email: ' + data.email : ''),
            (data.city ? 'City / Location: ' + data.city : ''),
            (data.message ? 'Notes / Request: ' + data.message : ''),
            '-----------------------------------',
            'Inquiry sent to Rivani Fine Art desk.'
          ].filter(Boolean).join('\n');

          openWhatsAppInquiry(text);
          var fs = $('#formStatus');
          if (fs) {
            fs.style.color = '#195237';
            fs.textContent = '✓ Opening WhatsApp with your inquiry details...';
          }
        };
      }

      contactForm.onsubmit = function (e) {
        e.preventDefault();
        playChime();
        var data = getFormData();
        if (!data.name || !data.phone) {
          alert('Please provide your Name and Phone / WhatsApp number.');
          return;
        }

        var fullMessage = data.message;
        if (data.city) {
          fullMessage = 'City / Location: ' + data.city + (fullMessage ? '\n\n' + fullMessage : '');
        }

        submitAcquisitionRequest({
          name: data.name,
          phone: data.phone,
          email: data.email,
          city: data.city,
          message: fullMessage || 'Acquisition inquiry from website.',
          works: [],
          buttonEl: $('#submitFormBtn'),
          statusEl: $('#formStatus'),
          formEl: contactForm
        });
      };
    }

    window.openInquiryModal = openInquiryModal;
    window.closeInquiryModal = closeInquiryModal;
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;
    window.sendShortlistEmail = sendShortlistEmail;
    window.playChime = playChime;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
