// Rivani Fine Art - Supabase Client Configuration
(function () {
  'use strict';

  var SUPABASE_URL = 'https://snhegkedgnrtifilpfhv.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_swhOIv9aw70abC3pC4SSbA_sCeScTy4';

  window.RIVANI_CONFIG = window.RIVANI_CONFIG || {};
  window.RIVANI_CONFIG.supabaseUrl = SUPABASE_URL;
  window.RIVANI_CONFIG.supabaseKey = SUPABASE_ANON_KEY;

  // Initialize supabase client if library is loaded
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
})();
