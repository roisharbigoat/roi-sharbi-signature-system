(function () {
  // מלא כאן את כתובת ה-Web App שתקבל מ-Google Apps Script (Deploy > New deployment > Web app)
  var DRIVE_ENDPOINT = '';
  var WHATSAPP_NUMBER = '972543083373';

  function uploadToDrive(payload) {
    return new Promise(function (resolve) {
      if (!DRIVE_ENDPOINT) {
        resolve({ ok: false, reason: 'no-endpoint' });
        return;
      }
      var iframeName = 'driveSink_' + Date.now();
      var iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      var form = document.createElement('form');
      form.method = 'POST';
      form.action = DRIVE_ENDPOINT;
      form.target = iframeName;
      form.style.display = 'none';

      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'payload';
      input.value = JSON.stringify(payload);
      form.appendChild(input);
      document.body.appendChild(form);

      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        form.remove();
        setTimeout(function () { iframe.remove(); }, 2000);
        resolve({ ok: ok });
      }
      iframe.onload = function () { finish(true); };
      setTimeout(function () { finish(true); }, 8000);
      form.submit();
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
})();
