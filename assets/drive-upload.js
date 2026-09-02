(function () {
  var DRIVE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzfRtnw45EDegTcNcWn7KdNhTYXDerric2X_kZJL1YfyIIpI70ubPPXKRHw31h96z8/exec';
  var WHATSAPP_NUMBER = '972543083373';
  // the PROGRAM GENERATOR site's Drive endpoint (a different project/folder
  // than this form's own DRIVE_ENDPOINT above) - a new lead is mirrored
  // there too, so it shows up ready to pick from in the generator without
  // Roi retyping the trainee's name
  var GENERATOR_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzMPub17KYUYxeL3NN1tijAkVZHtQHQJMyDbb5ppVOB06bY7fV6VdGAnSRCCB56Sqekig/exec';

  function delay(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

  function uploadToDrive(payload, attempt) {
    attempt = attempt || 1;
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
      .catch(function (err) {
        // Apps Script keeps running server-side once triggered, independent
        // of whether the client is still connected - a slow/cold response or
        // a flaky mobile connection can make an upload that actually
        // SUCCEEDED look like a failure here. One silent retry (safe: same
        // filename just replaces the same file again, never duplicates)
        // catches that before ever bothering the trainee with the manual
        // WhatsApp fallback for something that already worked
        if (attempt < 2) return delay(1500).then(function () { return uploadToDrive(payload, attempt + 1); });
        return { ok: false, error: String(err) };
      });
  }

  window.__uploadSignedPdf = function (payload) {
    return uploadToDrive(payload);
  };

  window.__whatsappFallbackUrl = function (data) {
    var text = 'שלום, מצרף/ת מסמך חתום - ' + data.fullName + ', ' + data.plan +
      '. (יש לצרף את קובץ ה-PDF שירד למכשיר)';
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  };

  // fire-and-forget - a failure here must never block or fail the actual
  // signup (which is the important part). Roi can always still see the
  // trainee's full answers in the signed PDF regardless
  window.__sendLeadToGenerator = function (data) {
    if (!GENERATOR_ENDPOINT) return;
    var lead = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      fullName: data.fullName,
      goals: data.goals,
      repsPullup: data.repsPullup,
      repsDips: data.repsDips,
      repsPushup: data.repsPushup,
      trainingBackground: data.trainingBackground,
      submittedAt: Date.now()
    };
    fetch(GENERATOR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'lead', lead: lead })
    }).catch(function () { /* best-effort only */ });
  };
})();
