/* 야록 편집국 보관함 — 이 컴퓨터 브라우저 안(IndexedDB)에만 보관. 서버로 보내지 않음.
   본지(index.html)와 편집국(newsroom.html)이 같이 씀. */
(function (W) {
  'use strict';
  var DB = 'yk-newsroom', ST = 'articles';
  function open() {
    return new Promise(function (res, rej) {
      if (!W.indexedDB) return rej(new Error('이 브라우저는 보관함을 쓸 수 없습니다.'));
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(ST, { keyPath: 'id' }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function run(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(ST, mode), req = fn(t.objectStore(ST));
        t.oncomplete = function () { res(req ? req.result : undefined); db.close(); };
        t.onerror = function () { rej(t.error); db.close(); };
      });
    });
  }
  W.NR = {
    all: function () { return run('readonly', function (s) { return s.getAll(); }).then(function (a) { return (a || []).sort(function (x, y) { return (y.createdAt || '').localeCompare(x.createdAt || ''); }); }); },
    get: function (id) { return run('readonly', function (s) { return s.get(id); }); },
    put: function (a) { return run('readwrite', function (s) { return s.put(a); }).then(function () { return a; }); },
    del: function (id) { return run('readwrite', function (s) { return s.delete(id); }); }
  };
})(window);
