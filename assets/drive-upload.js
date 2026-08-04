(function () {
  var DRIVE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzfRtnw45EDegTcNcWn7KdNhTYXDerric2X_kZJL1YfyIIpI70ubPPXKRHw31h96z8/exec';
  var WHATSAPP_NUMBER = '972543083373';

  function uploadToDrive(payload) {
    if (!DRIVE_ENDPOINT) {
      return Promise.resolve({ ok: false, reason: 'no-endpoint' });
    }
    // text/plain avoids a CORS preflight (which Apps Script doesn't handle),
    // while still letting us read the real success/failure response back.
    return fetch(DRIVE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) { return { ok: !!json.ok, url: json.url, error: json.error }; })
      .catch(function (err) { return { ok: false, error: String(err) }; });
  }

  window.__uploadSignedPdf = function (payload) {
    return uploadToDrive(payload);
  };

  window.__whatsappFallbackUrl = function (data) {
    var text = 'שלום, מצרף/ת מסמך חתום - ' + data.fullName + ', ' + data.plan +
      '. (יש לצרף את קובץ ה-PDF שירד למכשיר)';
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  };
})();
