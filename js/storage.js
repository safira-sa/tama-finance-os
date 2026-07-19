(function (global) {
  'use strict';

  function storageAvailable(storage) {
    return !!storage && typeof storage.getItem === 'function';
  }

  function readJSON(storage, key) {
    if (!storageAvailable(storage)) {
      return {
        key,
        available: false,
        value: null,
        error: 'LocalStorage is not available in this browser context.',
      };
    }

    let raw;
    try {
      raw = storage.getItem(key);
    } catch (error) {
      return {
        key,
        available: false,
        value: null,
        error: `Unable to read ${key}: ${error.message}`,
      };
    }
    if (!raw) {
      return { key, available: false, value: null, error: null };
    }

    try {
      return { key, available: true, value: JSON.parse(raw), error: null };
    } catch (error) {
      return {
        key,
        available: true,
        value: null,
        error: `Unable to parse ${key}: ${error.message}`,
      };
    }
  }

  global.TamaStorage = Object.freeze({
    readJSON,
  });
})(window);
