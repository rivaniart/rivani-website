(function () {
  'use strict';

  var FILTER_BUCKETS = [
    'Abstract',
    'Figurative',
    'Landscape',
    'Sacred & Traditional',
    'Still Life',
    'Works on Paper'
  ];

  var SELECT_FIELDS = [
    {
      id: 'fArtist',
      customId: 'fArtistCustom',
      metaKey: 'artists',
      artKey: 'artist',
      defaultValue: 'Rivani Atelier',
      allowEmpty: false,
      presets: ['Rivani Atelier', 'Rivani Curated']
    },
    {
      id: 'fCategory',
      customId: 'fCategoryCustom',
      metaKey: 'categories',
      artKey: 'category',
      defaultValue: 'Abstract',
      allowEmpty: false,
      presets: [
        'Abstract', 'Abstract / Landscape', 'Abstract / Pattern',
        'Figurative', 'Figurative / Decorative', 'Figurative / Folk',
        'Figurative / Modern Indian', 'Figurative / Old Master', 'Folk / Figurative',
        'Landscape', 'Seascape', 'Still Life',
        'Traditional / Folk', 'Traditional / Pichwai', 'Traditional / Figurative',
        'Devotional / Traditional', 'Works on Paper'
      ]
    },
    {
      id: 'fOrientation',
      customId: 'fOrientationCustom',
      metaKey: 'orientations',
      artKey: 'orientation',
      defaultValue: 'Portrait',
      allowEmpty: false,
      presets: [
        'Portrait', 'Landscape', 'Square', 'Near-square',
        'Circular', 'Panoramic', '3-piece vertical set', '4-piece set'
      ]
    },
    {
      id: 'fMedium',
      customId: 'fMediumCustom',
      metaKey: 'mediums',
      artKey: 'medium',
      defaultValue: 'Oil on canvas',
      allowEmpty: false,
      presets: [
        'Oil on canvas', 'Oil and pigment on fine Belgian linen', 'Oil and acrylic on canvas',
        'Acrylic on canvas', 'Acrylic and texture on canvas', 'Acrylic and mixed media on canvas',
        'Mixed media on canvas', 'Mixed media and metallic pigment on canvas',
        'Gouache and mineral pigment on cloth', 'Watercolour on paper', 'Ink and watercolour on paper'
      ]
    },
    {
      id: 'fSupport',
      customId: 'fSupportCustom',
      metaKey: 'supports',
      artKey: 'support',
      defaultValue: 'canvas',
      allowEmpty: true,
      presets: [
        'canvas', 'fine Belgian linen', 'paper', 'archival paper',
        'cloth', 'board', 'circular wood panel'
      ]
    },
    {
      id: 'fFrameType',
      customId: 'fFrameTypeCustom',
      metaKey: 'frameTypes',
      artKey: 'frame_type',
      defaultValue: '',
      allowEmpty: true,
      presets: [
        'Slim shadow-gap frame', 'Slim float frame', 'Minimal float frame', 'Shadow-gap frame',
        'Simple gallery frame', 'Classic gallery frame', 'Slim gallery frame', 'Slim gallery frames',
        'Matted gallery frame', 'Box frame', 'Deep box frame', 'Classic frame', 'Classic moulded frame',
        'Classic ornate frame', 'Ornate moulded frame', 'Ornate carved frame', 'Ornate portrait frame',
        'Museum-profile ornate frame', 'Layered classic frame', 'Layered portrait frame',
        'Carved classic frame', 'Broad classic frame', 'Slim metal / gallery frame',
        'Frameless / concealed shadow gap', 'Unframed circular panel'
      ]
    },
    {
      id: 'fFrameMaterial',
      customId: 'fFrameMaterialCustom',
      metaKey: 'frameMaterials',
      artKey: 'frame_material',
      defaultValue: '',
      allowEmpty: true,
      presets: [
        'Wood', 'Teak', 'Teak / hardwood', 'Walnut wood',
        'Carved wood', 'Light wood', 'Metal', 'Wood panel', 'None'
      ]
    },
    {
      id: 'fFrameColour',
      customId: 'fFrameColourCustom',
      metaKey: 'frameColours',
      artKey: 'frame_colour',
      defaultValue: '',
      allowEmpty: true,
      presets: [
        'Black', 'Charcoal black', 'Gold', 'Antique gold', 'Champagne gold',
        'Dark brown', 'Medium brown', 'Espresso / black', 'Black + gold',
        'Dark brown + gold', 'Dark brown + warm gold', 'Dark brown / bronze',
        'Dark brown / charcoal', 'Dark carved walnut', 'Gold + deep blue',
        'Gold + dark inner slip', 'Light wood / champagne', 'Pale gold / warm wood',
        'None', 'No decorative frame'
      ]
    },
    {
      id: 'fFrameFinish',
      customId: 'fFrameFinishCustom',
      metaKey: 'frameFinishes',
      artKey: 'frame_finish',
      defaultValue: '',
      allowEmpty: true,
      presets: [
        'Matte', 'Matte / ebonized', 'Matte / satin', 'Satin', 'Satin wood',
        'Soft satin', 'Natural teak', 'Walnut', 'Walnut / espresso',
        'Walnut / gilt inner slip', 'Antiqued', 'Antiqued gilt', 'Rich antiqued gilt',
        'Antiqued / carved', 'Aged / carved', 'Carved / antiqued',
        'Carved walnut / teak', 'Ebonized / gilt inner slip', 'Painted edge',
        'Pale oak / satin', 'Unframed / concealed shadow gap'
      ]
    },
    {
      id: 'fMountLiner',
      customId: 'fMountLinerCustom',
      metaKey: 'mountLiners',
      artKey: 'mount_liner',
      defaultValue: 'None',
      allowEmpty: false,
      presets: [
        'None', 'Cream liner', 'Warm ivory liner', 'Ivory mounts',
        'Wide ivory mounts', 'Wide off-white mounts', 'Wide warm-ivory mount'
      ]
    }
  ];

  var state = {
    artworks: [],
    muse: [],
    inquiries: [],
    meta: {},
    editingId: null,
    views: [],
    dragIndex: null
  };

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

  function showToast(msg, isError) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.className = 'toast';
    }, 3200);
  }

  function api(url, opts) {
    opts = opts || {};
    var method = (opts.method || 'GET').toUpperCase();

    // Check if Supabase provider is active
    if (window.RivaniBackend && window.RivaniBackend.isSupabase()) {
      var sb = window.RivaniBackend.getClient();

      // Artworks endpoints
      if (url === '/api/artworks' && method === 'GET') {
        return sb.from('artworks').select('*').order('id', { ascending: true }).then(function (res) {
          if (res.error) throw res.error;
          return { artworks: res.data || [] };
        });
      }
      if (url === '/api/artworks' && method === 'POST') {
        var body = JSON.parse(opts.body || '{}');
        delete body.id; // allow DB serial
        body.updated_at = new Date().toISOString();
        return sb.from('artworks').insert([body]).select().then(function (res) {
          if (res.error) throw res.error;
          return sb.from('artworks').select('*').order('id', { ascending: true }).then(function (all) {
            return { artwork: res.data[0], artworks: all.data || [] };
          });
        });
      }
      if (url.indexOf('/api/artworks/') === 0 && (method === 'PUT' || method === 'PATCH')) {
        var id = url.split('/').pop();
        var body = JSON.parse(opts.body || '{}');
        body.updated_at = new Date().toISOString();
        return sb.from('artworks').update(body).eq('id', id).select().then(function (res) {
          if (res.error) throw res.error;
          return sb.from('artworks').select('*').order('id', { ascending: true }).then(function (all) {
            return { artwork: res.data ? res.data[0] : body, artworks: all.data || [] };
          });
        });
      }
      if (url.indexOf('/api/artworks/') === 0 && method === 'DELETE') {
        var id = url.split('/').pop();
        return sb.from('artworks').delete().eq('id', id).then(function (res) {
          if (res.error) throw res.error;
          return sb.from('artworks').select('*').order('id', { ascending: true }).then(function (all) {
            return { artworks: all.data || [] };
          });
        });
      }

      // Meta dropdown endpoint
      if (url === '/api/meta' && method === 'GET') {
        return sb.from('artworks').select('*').then(function (res) {
          var arts = res.data || [];
          var meta = { artists: [], categories: [], mediums: [], frameTypes: [], frameColours: [], frameFinishes: [], orientations: [] };
          arts.forEach(function (a) {
            if (a.artist) meta.artists.push(a.artist);
            if (a.category) meta.categories.push(a.category);
            if (a.medium) meta.mediums.push(a.medium);
            if (a.frame_type) meta.frameTypes.push(a.frame_type);
            if (a.frame_colour) meta.frameColours.push(a.frame_colour);
            if (a.frame_finish) meta.frameFinishes.push(a.frame_finish);
            if (a.orientation) meta.orientations.push(a.orientation);
          });
          return meta;
        });
      }

      // Fallback for muse & inquiries in Supabase mode
      if (url === '/api/muse' && method === 'GET') {
        return Promise.resolve({ muse: window.RIVANI_MUSE || [] });
      }
      if (url === '/api/inquiries' && method === 'GET') {
        return Promise.resolve({ inquiries: [] });
      }
    }

    // Default: local server WEBrick API
    return fetch(url, opts).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error(data.error || 'Request failed');
        }
        return data;
      });
    });
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

  function switchTab(tabName) {
    $$('.nav-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    $$('.tab-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tab-' + tabName);
    });
  }

  function updateNavBadges() {
    $('#navCountArtworks').textContent = state.artworks.length;
    $('#navCountMuse').textContent = state.muse.length;
    $('#navCountInquiries').textContent = state.inquiries.length;
  }

  function formatImgUrl(path) {
    if (!path) return '/assets/images/image_1.jpg';
    if (path.indexOf('http') === 0 || path.indexOf('data:') === 0 || path.indexOf('/') === 0) return path;
    return '/' + path;
  }

  // ---------- DROPDOWN HELPERS ----------
  function mergeUniqueValues(presets, liveList) {
    var seen = {};
    var out = [];
    (presets || []).concat(liveList || []).forEach(function (v) {
      var s = (v === null || v === undefined) ? '' : String(v).trim();
      if (!s || seen[s]) return;
      seen[s] = true;
      out.push(s);
    });
    return out;
  }

  function populateAllDropdowns() {
    SELECT_FIELDS.forEach(function (cfg) {
      var sel = $('#' + cfg.id);
      if (!sel) return;
      var currentVal = getSelectFieldValue(cfg);
      var liveVals = (state.meta && state.meta[cfg.metaKey]) || [];
      var items = mergeUniqueValues(cfg.presets, liveVals);

      var html = [];
      if (cfg.allowEmpty) {
        html.push('<option value="">— Select / None —</option>');
      }
      items.forEach(function (val) {
        html.push('<option value="' + escapeHtml(val) + '">' + escapeHtml(val) + '</option>');
      });
      html.push('<option value="__custom__">Other / Custom...</option>');
      sel.innerHTML = html.join('');

      setSelectFieldValue(cfg, currentVal || cfg.defaultValue);
    });
  }

  function syncCustomVisibility(selectEl, customEl) {
    if (!selectEl || !customEl) return;
    var isCustom = selectEl.value === '__custom__';
    customEl.style.display = isCustom ? 'block' : 'none';
  }

  function setSelectFieldValue(cfg, value) {
    var sel = $('#' + cfg.id);
    var custom = $('#' + cfg.customId);
    if (!sel) return;

    var val = (value === null || value === undefined) ? '' : String(value).trim();
    if (!val && cfg.defaultValue && !cfg.allowEmpty) {
      val = cfg.defaultValue;
    }

    var hasOpt = Array.prototype.some.call(sel.options, function (opt) {
      return opt.value === val;
    });

    if (!val && cfg.allowEmpty) {
      sel.value = '';
      if (custom) custom.value = '';
    } else if (hasOpt) {
      sel.value = val;
      if (custom) custom.value = '';
    } else {
      sel.value = '__custom__';
      if (custom) custom.value = val;
    }
    syncCustomVisibility(sel, custom);
  }

  function getSelectFieldValue(cfg) {
    var sel = $('#' + cfg.id);
    var custom = $('#' + cfg.customId);
    if (!sel) return '';
    if (sel.value === '__custom__') {
      return custom ? custom.value.trim() : '';
    }
    return sel.value.trim();
  }

  function setPanelCountValue(count) {
    var sel = $('#fPanelCount');
    var custom = $('#fPanelCountCustom');
    var val = String(count || 1);
    var hasOpt = Array.prototype.some.call(sel.options, function (o) { return o.value === val; });
    if (hasOpt) {
      sel.value = val;
      custom.value = '';
    } else {
      sel.value = '__custom__';
      custom.value = val;
    }
    syncCustomVisibility(sel, custom);
  }

  function getPanelCountValue() {
    var sel = $('#fPanelCount');
    var custom = $('#fPanelCountCustom');
    if (sel.value === '__custom__') {
      return parseInt(custom.value, 10) || 1;
    }
    return parseInt(sel.value, 10) || 1;
  }

  function getFieldConfig(id) {
    return SELECT_FIELDS.find(function (c) { return c.id === id; });
  }

  // ---------- DATA LOADING ----------
  function loadAll() {
    return Promise.all([
      api('/api/artworks'),
      api('/api/muse'),
      api('/api/inquiries'),
      api('/api/meta')
    ]).then(function (results) {
      state.artworks = results[0].artworks || [];
      state.muse = results[1].muse || [];
      state.inquiries = results[2].inquiries || [];
      state.meta = results[3] || {};
      populateAllDropdowns();
      updateNavBadges();
      renderCollection();
      renderMuseAdmin();
      renderCategories();
      renderInquiries();
      renderRecentList();
      populateMuseArtworkSelect();
    }).catch(function (err) {
      showToast('Failed to load studio data: ' + err.message, true);
    });
  }

  // ---------- COLLECTION TAB ----------
  function renderCollection() {
    var q = ($('#colSearch').value || '').toLowerCase().trim();
    var catFilter = $('#colCategoryFilter').value;
    var statusFilter = $('#colStatusFilter').value;

    var list = state.artworks.filter(function (a) {
      var st = (a.status || 'published').toLowerCase();
      if (statusFilter !== 'all' && st !== statusFilter) return false;
      if (catFilter !== 'All' && !matchCategoryFilter(a.category, catFilter) && a.category !== catFilter) return false;
      if (!q) return true;
      var hay = [a.id, a.title, a.artist, a.category, a.medium, a.dimensions, a.price].filter(Boolean).join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    $('#collectionSummary').textContent = 'Showing ' + list.length + ' of ' + state.artworks.length + ' artworks';

    var grid = $('#collectionGrid');
    if (!list.length) {
      grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;">No matching artworks found.</div>';
      return;
    }

    grid.innerHTML = list.map(function (a) {
      var st = (a.status || 'published').toLowerCase();
      return [
        '<article class="col-card">',
        '  <div class="col-card-img" data-edit-id="' + a.id + '">',
        '    <img loading="lazy" src="' + escapeHtml(formatImgUrl(a.image)) + '" alt="' + escapeHtml(a.title) + '" />',
        '    <span class="status-pill ' + escapeHtml(st) + '">' + escapeHtml(st) + '</span>',
        '    <span class="id-pill">#' + a.id + '</span>',
        '  </div>',
        '  <div class="col-card-body">',
        '    <div class="col-card-cat">' + escapeHtml(a.category) + '</div>',
        '    <h3 class="col-card-title">' + escapeHtml(a.title) + '</h3>',
        '    <div class="col-card-sub">' + escapeHtml(a.dimensions || '') + ' · <strong>' + escapeHtml(a.price || '') + '</strong></div>',
        '    <div class="col-card-actions">',
        '      <button type="button" class="btn btn-dark btn-sm" data-edit-id="' + a.id + '">Edit Posting</button>',
        '      <button type="button" class="btn btn-danger btn-sm" data-delete-id="' + a.id + '">Delete</button>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('\n');
    }).join('');

    $$('[data-edit-id]').forEach(function (el) {
      el.onclick = function () {
        openEditor(+el.getAttribute('data-edit-id'));
      };
    });

    $$('[data-delete-id]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        deleteArtwork(+btn.getAttribute('data-delete-id'));
      };
    });
  }

  // ---------- EDITOR TAB ----------
  function resetEditor() {
    state.editingId = null;
    state.views = [];
    $('#editorEyebrow').textContent = 'NEW POSTING';
    $('#editorHeading').textContent = 'Upload & Edit Artwork Posting';
    $('#editorDeleteBtn').style.display = 'none';
    $('#artworkForm').reset();

    SELECT_FIELDS.forEach(function (cfg) {
      setSelectFieldValue(cfg, cfg.defaultValue);
    });
    setPanelCountValue(1);
    $('#fStatus').value = 'published';
    $('#fMuseEnabled').checked = false;
    $('#museImageSelectWrap').style.display = 'none';

    renderViews();
    refreshMuseImageOptions();
    updatePreview();
  }

  function openEditor(id) {
    var a = state.artworks.find(function (x) { return x.id === id; });
    if (!a) return;

    state.editingId = a.id;
    state.views = Array.isArray(a.views) && a.views.length ? a.views.slice() : (a.image ? [a.image] : []);

    $('#editorEyebrow').textContent = 'EDITING POSTING #' + a.id;
    $('#editorHeading').textContent = a.title;
    $('#editorDeleteBtn').style.display = 'inline-flex';

    $('#fTitle').value = a.title || '';
    SELECT_FIELDS.forEach(function (cfg) {
      setSelectFieldValue(cfg, a[cfg.artKey]);
    });
    setPanelCountValue(a.panel_count || 1);

    $('#fStatus').value = a.status || 'published';
    $('#fPrice').value = a.price || '';
    $('#fHeightCm').value = a.height_cm || '';
    $('#fWidthCm').value = a.width_cm || '';
    $('#fDimensions').value = a.dimensions || '';
    $('#fFramedDimensions').value = a.framed_dimensions || '';
    $('#fFramedDescription').value = a.framed_description || '';
    $('#fDescription').value = a.description || '';
    $('#fNotes').value = a.notes || '';

    var museMatch = state.muse.find(function (m) { return Number(m.artworkId) === Number(a.id); });
    $('#fMuseEnabled').checked = !!museMatch;
    $('#museImageSelectWrap').style.display = museMatch ? 'block' : 'none';

    renderViews();
    refreshMuseImageOptions(museMatch ? museMatch.image : null);
    updatePreview();
    switchTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function moveViewTo(fromIdx, toIdx) {
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= state.views.length || toIdx >= state.views.length) {
      return;
    }
    var item = state.views.splice(fromIdx, 1)[0];
    state.views.splice(toIdx, 0, item);
    renderViews();
    refreshMuseImageOptions();
    updatePreview();
  }

  function renderViews() {
    var container = $('#viewsList');
    if (!state.views.length) {
      container.innerHTML = '<div class="hint" style="grid-column:1/-1;">No photos added yet. Click the box above or drag multiple images here.</div>';
      return;
    }

    container.innerHTML = state.views.map(function (src, idx) {
      var orderOptions = state.views.map(function (_s, posIdx) {
        var label = posIdx === 0 ? '#1 (Primary)' : '#' + (posIdx + 1);
        return '<option value="' + posIdx + '" ' + (posIdx === idx ? 'selected' : '') + '>Order: ' + label + '</option>';
      }).join('');

      return [
        '<div class="view-tile ' + (idx === 0 ? 'primary' : '') + '" draggable="true" data-tile-idx="' + idx + '">',
        '  <div class="view-thumb">',
        '    <img src="' + escapeHtml(formatImgUrl(src)) + '" alt="View ' + (idx + 1) + '" />',
        '    <span class="view-badge">' + (idx === 0 ? '#1 · Primary' : '#' + (idx + 1)) + '</span>',
        '  </div>',
        '  <div class="view-controls">',
        '    <select class="view-order-select" data-order-select="' + idx + '" aria-label="Image order">' + orderOptions + '</select>',
        '    <div class="view-btn-row">',
        (idx > 0 ? '<button type="button" data-make-primary="' + idx + '" title="Move to #1 (Primary)">★ #1</button>' : ''),
        (idx > 0 ? '<button type="button" data-move-view="' + idx + ':-1" title="Move left">←</button>' : ''),
        (idx < state.views.length - 1 ? '<button type="button" data-move-view="' + idx + ':1" title="Move right">→</button>' : ''),
        '      <button type="button" data-remove-view="' + idx + '" title="Remove photo">×</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('');

    $$('[data-order-select]').forEach(function (sel) {
      sel.onchange = function () {
        var fromIdx = +sel.getAttribute('data-order-select');
        var toIdx = +sel.value;
        moveViewTo(fromIdx, toIdx);
      };
    });

    $$('[data-make-primary]').forEach(function (btn) {
      btn.onclick = function () {
        moveViewTo(+btn.getAttribute('data-make-primary'), 0);
      };
    });

    $$('[data-move-view]').forEach(function (btn) {
      btn.onclick = function () {
        var parts = btn.getAttribute('data-move-view').split(':');
        var idx = +parts[0];
        var delta = +parts[1];
        moveViewTo(idx, idx + delta);
      };
    });

    $$('[data-remove-view]').forEach(function (btn) {
      btn.onclick = function () {
        var idx = +btn.getAttribute('data-remove-view');
        state.views.splice(idx, 1);
        renderViews();
        refreshMuseImageOptions();
        updatePreview();
      };
    });

    // Drag-and-drop reordering across view tiles
    $$('[data-tile-idx]').forEach(function (tile) {
      tile.addEventListener('dragstart', function (e) {
        state.dragIndex = +tile.getAttribute('data-tile-idx');
        tile.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(state.dragIndex));
        }
      });

      tile.addEventListener('dragover', function (e) {
        if (state.dragIndex === null) return;
        e.preventDefault();
        tile.classList.add('drag-target');
      });

      tile.addEventListener('dragleave', function () {
        tile.classList.remove('drag-target');
      });

      tile.addEventListener('drop', function (e) {
        if (state.dragIndex === null) return;
        e.preventDefault();
        e.stopPropagation();
        tile.classList.remove('drag-target');
        var toIdx = +tile.getAttribute('data-tile-idx');
        var fromIdx = state.dragIndex;
        state.dragIndex = null;
        moveViewTo(fromIdx, toIdx);
      });

      tile.addEventListener('dragend', function () {
        state.dragIndex = null;
        $$('[data-tile-idx]').forEach(function (t) {
          t.classList.remove('dragging', 'drag-target');
        });
      });
    });
  }

  function refreshMuseImageOptions(preferred) {
    var sel = $('#fMuseImage');
    var prev = preferred || sel.value;
    var options = state.views.slice();
    if (prev && options.indexOf(prev) === -1) options.unshift(prev);
    if (!options.length) {
      sel.innerHTML = '<option value="">Upload a photo above first</option>';
      return;
    }
    sel.innerHTML = options.map(function (src, i) {
      var label = (i === 0 ? '#1 Primary: ' : '#' + (i + 1) + ': ') + src.split('/').pop();
      return '<option value="' + escapeHtml(src) + '">' + escapeHtml(label) + '</option>';
    }).join('');
    if (prev) sel.value = prev;
  }

  function uploadFile(file) {
    if (window.RivaniBackend && window.RivaniBackend.isSupabase()) {
      return window.RivaniBackend.uploadImage(file);
    }
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        api('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            dataUrl: reader.result
          })
        }).then(resolve).catch(reject);
      };
      reader.onerror = function () { reject(new Error('Could not read file ' + file.name)); };
      reader.readAsDataURL(file);
    });
  }

  function handleUploadFiles(fileList, onEachUploaded) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;

    var prog = $('#uploadProgress');
    if (prog) {
      prog.style.display = 'block';
      prog.textContent = 'Uploading 0 of ' + files.length + ' image(s)...';
    }

    var completed = 0;
    // Upload sequentially in selected order so multi-file order stays deterministic
    var chain = Promise.resolve();
    files.forEach(function (file) {
      chain = chain.then(function () {
        return uploadFile(file).then(function (res) {
          completed += 1;
          if (prog) {
            prog.textContent = 'Uploaded ' + completed + ' of ' + files.length + ': ' + file.name;
          }
          onEachUploaded(res.path);
        });
      });
    });

    chain
      .then(function () {
        showToast('Uploaded ' + files.length + ' image(s) in order.');
      })
      .catch(function (err) {
        showToast(err.message, true);
      })
      .finally(function () {
        if (prog) {
          setTimeout(function () { prog.style.display = 'none'; }, 1600);
        }
      });
  }

  function computeDimensionsString() {
    var h = parseInt($('#fHeightCm').value, 10);
    var w = parseInt($('#fWidthCm').value, 10);
    if (h > 0 && w > 0) {
      var hIn = Math.round(h / 2.54);
      var wIn = Math.round(w / 2.54);
      return h + ' × ' + w + ' cm (' + hIn + ' × ' + wIn + ' in)';
    }
    return '';
  }

  function buildFramedSummary() {
    var explicit = $('#fFramedDescription').value.trim();
    if (explicit) return explicit;
    var parts = [
      getSelectFieldValue(getFieldConfig('fFrameColour')),
      getSelectFieldValue(getFieldConfig('fFrameMaterial')),
      getSelectFieldValue(getFieldConfig('fFrameType'))
    ].filter(function (v) { return v && v !== 'None' && v !== 'No decorative frame'; });
    return parts.join(' ');
  }

  function formatDisplayPrice(raw) {
    var val = (raw || '').trim();
    if (!val) return 'Price on Request';
    if (/^\d[\d,]*$/.test(val)) {
      var num = parseInt(val.replace(/,/g, ''), 10);
      if (num > 0) return '₹' + num.toLocaleString('en-IN');
    }
    return val;
  }

  function updatePreview() {
    var img = state.views[0];
    var prevImg = $('#prevImg');
    var prevPlaceholder = $('#prevPlaceholder');
    if (img) {
      prevImg.src = formatImgUrl(img);
      prevImg.style.display = 'block';
      if (prevPlaceholder) prevPlaceholder.style.display = 'none';
    } else {
      prevImg.removeAttribute('src');
      prevImg.style.display = 'none';
      if (prevPlaceholder) prevPlaceholder.style.display = 'flex';
    }

    var cat = getSelectFieldValue(getFieldConfig('fCategory')) || 'CATEGORY';
    var medium = getSelectFieldValue(getFieldConfig('fMedium')) || 'Oil on canvas';
    var framing = buildFramedSummary() || 'Custom Archival Frame';

    $('#prevCat').textContent = cat.toUpperCase();
    $('#prevDims').textContent = $('#fDimensions').value.trim() || computeDimensionsString() || '';
    $('#prevTitle').textContent = $('#fTitle').value.trim() || 'Untitled Artwork';
    $('#prevSpecs').textContent = medium + ' · ' + framing;
    $('#prevPrice').textContent = formatDisplayPrice($('#fPrice').value);
  }

  function saveArtwork(overrideStatus) {
    var title = $('#fTitle').value.trim();
    if (!title) {
      showToast('Please enter an Artwork Title.', true);
      $('#fTitle').focus();
      return;
    }
    var category = getSelectFieldValue(getFieldConfig('fCategory'));
    if (!category) {
      showToast('Please choose or enter a Category.', true);
      return;
    }
    if (!state.views.length) {
      showToast('Please upload at least one artwork photo.', true);
      return;
    }

    var status = overrideStatus || $('#fStatus').value;
    var payload = {
      title: title,
      artist: getSelectFieldValue(getFieldConfig('fArtist')) || 'Rivani Atelier',
      category: category,
      orientation: getSelectFieldValue(getFieldConfig('fOrientation')) || 'Portrait',
      status: status,
      medium: getSelectFieldValue(getFieldConfig('fMedium')) || 'Oil on canvas',
      support: getSelectFieldValue(getFieldConfig('fSupport')),
      price: $('#fPrice').value.trim() || 'Price on Request',
      height_cm: $('#fHeightCm').value.trim(),
      width_cm: $('#fWidthCm').value.trim(),
      panel_count: getPanelCountValue(),
      dimensions: $('#fDimensions').value.trim() || computeDimensionsString(),
      frame_type: getSelectFieldValue(getFieldConfig('fFrameType')),
      frame_material: getSelectFieldValue(getFieldConfig('fFrameMaterial')),
      frame_colour: getSelectFieldValue(getFieldConfig('fFrameColour')),
      frame_finish: getSelectFieldValue(getFieldConfig('fFrameFinish')),
      mount_liner: getSelectFieldValue(getFieldConfig('fMountLiner')) || 'None',
      framed_dimensions: $('#fFramedDimensions').value.trim(),
      framed_description: buildFramedSummary(),
      description: $('#fDescription').value.trim(),
      notes: $('#fNotes').value.trim(),
      image: state.views[0],
      primary_image: state.views[0],
      views: state.views,
      muse: {
        enabled: $('#fMuseEnabled').checked,
        image: $('#fMuseImage').value || state.views[0]
      }
    };

    var isEdit = state.editingId !== null;
    var url = isEdit ? '/api/artworks/' + state.editingId : '/api/artworks';
    var method = isEdit ? 'PUT' : 'POST';

    $('#savePublishBtn').disabled = true;
    $('#saveDraftBtn').disabled = true;

    api(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (data) {
      state.artworks = data.artworks || state.artworks;
      state.muse = data.muse || state.muse;
      return api('/api/meta').then(function (meta) {
        state.meta = meta || state.meta;
        populateAllDropdowns();
        updateNavBadges();
        renderCollection();
        renderMuseAdmin();
        renderCategories();
        renderRecentList();
        populateMuseArtworkSelect();
        if (!isEdit && data.artwork) {
          openEditor(data.artwork.id);
        } else if (data.artwork) {
          openEditor(data.artwork.id);
        }
        showToast(isEdit ? 'Artwork posting updated.' : 'New artwork posted to catalogue.');
      });
    }).catch(function (err) {
      showToast(err.message, true);
    }).finally(function () {
      $('#savePublishBtn').disabled = false;
      $('#saveDraftBtn').disabled = false;
    });
  }

  function deleteArtwork(id) {
    var art = state.artworks.find(function (a) { return a.id === id; });
    if (!art) return;
    if (!window.confirm('Delete "' + art.title + '" (#' + id + ') from the catalogue?')) return;

    api('/api/artworks/' + id, { method: 'DELETE' })
      .then(function (data) {
        state.artworks = data.artworks || [];
        state.muse = data.muse || [];
        updateNavBadges();
        renderCollection();
        renderMuseAdmin();
        renderCategories();
        renderRecentList();
        populateMuseArtworkSelect();
        if (state.editingId === id) {
          resetEditor();
          switchTab('collection');
        }
        showToast('Deleted "' + art.title + '".');
      })
      .catch(function (err) {
        showToast(err.message, true);
      });
  }

  function renderRecentList() {
    var container = $('#recentList');
    var recent = state.artworks.slice(0, 6);
    container.innerHTML = recent.map(function (a) {
      return [
        '<div class="recent-item" data-recent-id="' + a.id + '">',
        '  <img src="' + escapeHtml(formatImgUrl(a.image)) + '" alt="" />',
        '  <div class="recent-item-info">',
        '    <strong>' + escapeHtml(a.title) + '</strong>',
        '    <span>#' + a.id + ' · ' + escapeHtml(a.price || '') + '</span>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');

    $$('[data-recent-id]').forEach(function (el) {
      el.onclick = function () {
        openEditor(+el.getAttribute('data-recent-id'));
      };
    });
  }

  // ---------- MUSE HOMES TAB ----------
  function populateMuseArtworkSelect() {
    var sel = $('#museLinkArtwork');
    if (!sel) return;
    sel.innerHTML = state.artworks.map(function (a) {
      return '<option value="' + a.id + '">#' + a.id + ' — ' + escapeHtml(a.title) + '</option>';
    }).join('');
  }

  function renderMuseAdmin() {
    var grid = $('#museAdminGrid');
    if (!state.muse.length) {
      grid.innerHTML = '<div class="card">No Muse entries yet.</div>';
      return;
    }

    grid.innerHTML = state.muse.map(function (item, idx) {
      var artOptions = state.artworks.map(function (a) {
        return '<option value="' + a.id + '" ' + (Number(a.id) === Number(item.artworkId) ? 'selected' : '') + '>#' + a.id + ' — ' + escapeHtml(a.title) + '</option>';
      }).join('');

      return [
        '<div class="muse-admin-card">',
        '  <img loading="lazy" src="' + escapeHtml(formatImgUrl(item.image)) + '" alt="' + escapeHtml(item.title) + '" />',
        '  <div class="muse-admin-body">',
        '    <select class="input" data-muse-link="' + idx + '">' + artOptions + '</select>',
        '    <div class="view-btn-row">',
        (idx > 0 ? '<button type="button" data-muse-move="' + idx + ':-1">← Move</button>' : ''),
        (idx < state.muse.length - 1 ? '<button type="button" data-muse-move="' + idx + ':1">Move →</button>' : ''),
        '      <button type="button" data-muse-remove="' + idx + '">Remove</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('');

    $$('[data-muse-link]').forEach(function (sel) {
      sel.onchange = function () {
        var idx = +sel.getAttribute('data-muse-link');
        var aid = +sel.value;
        var art = state.artworks.find(function (a) { return a.id === aid; });
        if (art) {
          state.muse[idx].artworkId = art.id;
          state.muse[idx].title = art.title;
        }
      };
    });

    $$('[data-muse-move]').forEach(function (btn) {
      btn.onclick = function () {
        var parts = btn.getAttribute('data-muse-move').split(':');
        var idx = +parts[0];
        var next = idx + (+parts[1]);
        if (next < 0 || next >= state.muse.length) return;
        var tmp = state.muse[idx];
        state.muse[idx] = state.muse[next];
        state.muse[next] = tmp;
        renderMuseAdmin();
      };
    });

    $$('[data-muse-remove]').forEach(function (btn) {
      btn.onclick = function () {
        var idx = +btn.getAttribute('data-muse-remove');
        state.muse.splice(idx, 1);
        updateNavBadges();
        renderMuseAdmin();
      };
    });
  }

  function saveMuseOrder() {
    api('/api/muse', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muse: state.muse })
    }).then(function (data) {
      state.muse = data.muse || [];
      updateNavBadges();
      renderMuseAdmin();
      showToast('Muse gallery saved.');
    }).catch(function (err) {
      showToast(err.message, true);
    });
  }

  // ---------- CATEGORIES TAB ----------
  function renderCategories() {
    var container = $('#categoriesView');
    container.innerHTML = FILTER_BUCKETS.map(function (bucket) {
      var matching = state.artworks.filter(function (a) { return matchCategoryFilter(a.category, bucket); });
      var tags = {};
      matching.forEach(function (a) {
        tags[a.category] = (tags[a.category] || 0) + 1;
      });
      var tagHtml = Object.keys(tags).map(function (tag) {
        return '<button type="button" class="cat-tag" data-jump-cat="' + escapeHtml(tag) + '">' + escapeHtml(tag) + ' (' + tags[tag] + ')</button>';
      }).join('');

      return [
        '<div class="cat-bucket-card">',
        '  <p class="eyebrow">FILTER TAB</p>',
        '  <h3>' + escapeHtml(bucket) + ' (' + matching.length + ')</h3>',
        '  <div class="cat-tag-list">' + (tagHtml || '<span class="hint">No works yet</span>') + '</div>',
        '</div>'
      ].join('\n');
    }).join('');

    $$('[data-jump-cat]').forEach(function (btn) {
      btn.onclick = function () {
        var cat = btn.getAttribute('data-jump-cat');
        $('#colCategoryFilter').value = 'All';
        $('#colSearch').value = cat;
        renderCollection();
        switchTab('collection');
      };
    });
  }

  // ---------- INQUIRIES TAB ----------
  function renderInquiries() {
    var list = $('#inquiriesList');
    if (!state.inquiries.length) {
      list.innerHTML = '<div class="card">No acquisition inquiries recorded locally yet. Submissions from the website forms will appear here automatically.</div>';
      return;
    }

    list.innerHTML = state.inquiries.map(function (inq) {
      var works = (inq.works || []).map(function (w) { return w.title; }).join(', ');
      var statuses = ['New', 'Contacted', 'Viewing Scheduled', 'Acquired'];
      var opts = statuses.map(function (s) {
        return '<option value="' + s + '" ' + (inq.status === s ? 'selected' : '') + '>' + s + '</option>';
      }).join('');

      return [
        '<div class="inquiry-row-card">',
        '  <div>',
        '    <h3>' + escapeHtml(inq.name) + '</h3>',
        '    <div class="inquiry-meta">' + escapeHtml(inq.phone) + (inq.email ? ' · ' + escapeHtml(inq.email) : '') + (inq.city ? ' · ' + escapeHtml(inq.city) : '') + ' · ' + escapeHtml(inq.created_at || '') + '</div>',
        (works ? '<div class="inquiry-meta"><strong>Works:</strong> ' + escapeHtml(works) + '</div>' : ''),
        '    <p class="inquiry-msg">' + escapeHtml(inq.message) + '</p>',
        '  </div>',
        '  <div>',
        '    <select class="input" data-inq-status="' + escapeHtml(inq.id) + '">' + opts + '</select>',
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('');

    $$('[data-inq-status]').forEach(function (sel) {
      sel.onchange = function () {
        var id = sel.getAttribute('data-inq-status');
        api('/api/inquiries/' + encodeURIComponent(id), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: sel.value })
        }).then(function () {
          showToast('Inquiry status updated.');
        }).catch(function (err) {
          showToast(err.message, true);
        });
      };
    });
  }

  // ---------- WIRING ----------
  function init() {
    $$('.nav-item').forEach(function (btn) {
      btn.onclick = function () {
        var tab = btn.getAttribute('data-tab');
        if (tab === 'editor' && btn.id === 'navNewArtwork') {
          resetEditor();
        }
        switchTab(tab);
      };
    });

    $('#topAddBtn').onclick = function () {
      resetEditor();
      switchTab('editor');
    };
    $('#editorBackBtn').onclick = function () { switchTab('collection'); };
    $('#resetEditorBtn').onclick = resetEditor;
    $('#editorDeleteBtn').onclick = function () {
      if (state.editingId !== null) deleteArtwork(state.editingId);
    };

    $('#colSearch').addEventListener('input', renderCollection);
    $('#colCategoryFilter').addEventListener('change', renderCollection);
    $('#colStatusFilter').addEventListener('change', renderCollection);

    // Wire all Select + Custom fields uniformly
    SELECT_FIELDS.forEach(function (cfg) {
      var sel = $('#' + cfg.id);
      var custom = $('#' + cfg.customId);
      if (sel) {
        sel.addEventListener('change', function () {
          syncCustomVisibility(sel, custom);
          if (sel.value === '__custom__' && custom) custom.focus();
          updatePreview();
        });
      }
      if (custom) {
        custom.addEventListener('input', updatePreview);
      }
    });

    var panelSel = $('#fPanelCount');
    var panelCustom = $('#fPanelCountCustom');
    if (panelSel) {
      panelSel.addEventListener('change', function () {
        syncCustomVisibility(panelSel, panelCustom);
        if (panelSel.value === '__custom__' && panelCustom) panelCustom.focus();
      });
    }

    // Multiple image uploads (file picker + clickable/droppable dropzone)
    $('#imageFileInput').addEventListener('change', function (e) {
      handleUploadFiles(e.target.files, function (path) {
        state.views.push(path);
        renderViews();
        refreshMuseImageOptions();
        updatePreview();
      });
      e.target.value = '';
    });

    var dz = $('#dropZone');
    dz.addEventListener('click', function () {
      $('#imageFileInput').click();
    });
    dz.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $('#imageFileInput').click();
      }
    });
    dz.addEventListener('dragover', function (e) {
      if (state.dragIndex !== null) return;
      e.preventDefault();
      dz.classList.add('dragover');
    });
    dz.addEventListener('dragleave', function () { dz.classList.remove('dragover'); });
    dz.addEventListener('drop', function (e) {
      if (state.dragIndex !== null) return;
      e.preventDefault();
      dz.classList.remove('dragover');
      handleUploadFiles(e.dataTransfer.files, function (path) {
        state.views.push(path);
        renderViews();
        refreshMuseImageOptions();
        updatePreview();
      });
    });

    $('#fMuseEnabled').addEventListener('change', function (e) {
      $('#museImageSelectWrap').style.display = e.target.checked ? 'block' : 'none';
      refreshMuseImageOptions();
    });

    $('#museFileInput').addEventListener('change', function (e) {
      handleUploadFiles(e.target.files, function (path) {
        if (state.views.indexOf(path) === -1) state.views.push(path);
        renderViews();
        refreshMuseImageOptions(path);
        updatePreview();
      });
      e.target.value = '';
    });

    $('#porToggleBtn').onclick = function () {
      $('#fPrice').value = 'Price on Request';
      updatePreview();
    };

    $('#autoDescBtn').onclick = function () {
      var title = $('#fTitle').value.trim() || 'This artwork';
      var cat = (getSelectFieldValue(getFieldConfig('fCategory')) || 'fine art').toLowerCase();
      var med = (getSelectFieldValue(getFieldConfig('fMedium')) || 'mixed media on canvas').toLowerCase();
      var frame = buildFramedSummary();
      var sentence = title + ' is an original ' + cat + ' work executed in ' + med + '.' +
        (frame ? ' Presented in a ' + frame.toLowerCase() + '.' : '');
      $('#fDescription').value = sentence;
    };

    ['#fHeightCm', '#fWidthCm'].forEach(function (sel) {
      $(sel).addEventListener('input', function () {
        var computed = computeDimensionsString();
        if (computed) $('#fDimensions').value = computed;
        updatePreview();
      });
    });

    ['#fTitle', '#fPrice', '#fDimensions', '#fFramedDescription'].forEach(function (sel) {
      $(sel).addEventListener('input', updatePreview);
    });

    $('#artworkForm').addEventListener('submit', function (e) {
      e.preventDefault();
      saveArtwork(null);
    });
    $('#saveDraftBtn').onclick = function () { saveArtwork('draft'); };

    $('#museStandaloneFile').addEventListener('change', function (e) {
      handleUploadFiles(e.target.files, function (path) {
        $('#museNewImage').value = path;
      });
      e.target.value = '';
    });

    $('#addMuseEntryBtn').onclick = function () {
      var aid = +$('#museLinkArtwork').value;
      var img = $('#museNewImage').value.trim();
      if (!aid || !img) {
        showToast('Select an artwork and upload/enter an interior image.', true);
        return;
      }
      api('/api/muse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: aid, image: img })
      }).then(function (data) {
        state.muse = data.muse || [];
        $('#museNewImage').value = '';
        updateNavBadges();
        renderMuseAdmin();
        showToast('Added to Muse Series.');
      }).catch(function (err) {
        showToast(err.message, true);
      });
    };

    $('#saveMuseOrderBtn').onclick = saveMuseOrder;

    // Check Supabase authentication & setup status
    setupAuthAndBackend();
  }

  function setupAuthAndBackend() {
    var isCloud = window.RivaniBackend && window.RivaniBackend.isSupabase();
    var statusPill = $('#backendStatusPill');
    var statusText = $('#backendStatusText');
    var userPill = $('#adminUserPill');
    var userEmail = $('#adminUserEmail');
    var authModal = $('#authModal');
    var authForm = $('#authForm');
    var authError = $('#authError');
    var authBypassBtn = $('#authBypassLocalBtn');
    var logoutBtn = $('#adminLogoutBtn');

    if (!isCloud) {
      if (statusPill) statusPill.className = 'backend-indicator local';
      if (statusText) statusText.textContent = 'LOCAL DEV MODE (NO LOGIN)';
      loadAll();
      return;
    }

    if (statusPill) statusPill.className = 'backend-indicator cloud';
    if (statusText) statusText.textContent = 'SUPABASE CLOUD';

    // Check if user is already logged in
    window.RivaniBackend.getSession().then(function (session) {
      if (session && session.user) {
        if (authModal) authModal.style.display = 'none';
        if (userPill) userPill.style.display = 'inline-flex';
        if (userEmail) userEmail.textContent = session.user.email;
        loadAll();
      } else {
        // Show login modal
        if (authModal) authModal.style.display = 'flex';
        if (authBypassBtn) {
          authBypassBtn.style.display = 'block';
          authBypassBtn.onclick = function () {
            window.localStorage.removeItem('rivani_force_supabase');
            location.href = location.pathname; // reload in local mode
          };
        }
      }
    });

    if (authForm) {
      authForm.onsubmit = function (e) {
        e.preventDefault();
        var email = $('#authEmail').value.trim();
        var pass = $('#authPassword').value;
        var btn = $('#authSubmitBtn');
        btn.disabled = true;
        btn.textContent = 'Signing in...';
        if (authError) authError.style.display = 'none';

        window.RivaniBackend.signIn(email, pass).then(function (res) {
          if (res.error) throw res.error;
          if (authModal) authModal.style.display = 'none';
          if (userPill) userPill.style.display = 'inline-flex';
          if (userEmail) userEmail.textContent = email;
          showToast('Welcome back, ' + email);
          loadAll();
        }).catch(function (err) {
          if (authError) {
            authError.textContent = err.message || 'Login failed. Please check credentials.';
            authError.style.display = 'block';
          }
        }).finally(function () {
          btn.disabled = false;
          btn.textContent = 'Sign In to Studio';
        });
      };
    }

    if (logoutBtn) {
      logoutBtn.onclick = function () {
        window.RivaniBackend.signOut().then(function () {
          location.reload();
        });
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
