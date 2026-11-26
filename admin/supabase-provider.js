// Rivani Studio - Supabase Backend Provider Adapter
(function () {
  'use strict';

  var SUPABASE_URL = 'https://snhegkedgnrtifilpfhv.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_swhOIv9aw70abC3pC4SSbA_sCeScTy4';

  var sb = null;
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    window.sbClient = sb;
  }

  window.RivaniBackend = {
    isSupabase: function () {
      // If we are hosted anywhere on the web (e.g. GitHub Pages or custom domain)
      // or if explicitly connected to Supabase
      return !!sb && (
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1' ||
        window.localStorage.getItem('rivani_force_supabase') === 'true' ||
        window.location.search.indexOf('provider=supabase') !== -1
      );
    },
    getClient: function () {
      return sb;
    },
    getSession: function () {
      if (!sb) return Promise.resolve(null);
      return sb.auth.getSession().then(function (res) {
        return res.data ? res.data.session : null;
      });
    },
    signIn: function (email, password) {
      if (!sb) return Promise.reject(new Error('Supabase client not initialized'));
      return sb.auth.signInWithPassword({ email: email, password: password });
    },
    signOut: function () {
      if (!sb) return Promise.resolve();
      return sb.auth.signOut();
    },
    // Upload image directly to Supabase storage bucket
    uploadImage: function (file) {
      if (!sb) return Promise.reject(new Error('Supabase client unavailable'));
      var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      var cleanName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      var path = 'artworks/' + Date.now() + '_' + cleanName;
      return sb.storage.from('artwork-images').upload(path, file, {
        cacheControl: '3600',
        upsert: true
      }).then(function (res) {
        if (res.error) throw res.error;
        var publicData = sb.storage.from('artwork-images').getPublicUrl(path);
        return {
          path: publicData.data.publicUrl,
          filename: cleanName
        };
      });
    }
  };
})();
