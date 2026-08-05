(function () {
  var BUSINESS_SIGNATURE_URL = 'assets/business-signature.png';
  var LOGO_URL = 'assets/logo.png';
  var RENDER_SCALE = 2;

  function nbsp(str) {
    return String(str || '').replace(/ /g, ' ');
  }

  function buildCoverHtml(data, businessSigDataUrl) {
    var healthRows = data.healthAnswers.map(function (h) {
      return '<div class="hq-row"><span class="hq-q">' + h.question + '</span>' +
        '<span class="hq-a">' + nbsp(h.answer) + '</span></div>';
    }).join('');

    var minorBlock = '';
    if (data.isMinor) {
      minorBlock =
        '<div class="row"><span class="label">שם ההורה/אפוטרופוס</span><span class="value">' + nbsp(data.parentName) + '</span></div>' +
        '<div class="row"><span class="label">ת"ז ההורה/אפוטרופוס</span><span class="value">' + nbsp(data.parentId) + '</span></div>' +
        '<div class="row"><span class="label">טלפון ההורה/אפוטרופוס</span><span class="value">' + nbsp(data.parentPhone) + '</span></div>';
    }

    var healthDetailsBlock = data.healthDetails
      ? '<div class="section-title">פירוט לשאלון הבריאות</div><p>' + data.healthDetails + '</p>'
      : '';

    var fitnessBlock = '';
    if (data.repsPullup || data.repsDips || data.repsPushup) {
      fitnessBlock =
        '<div class="section-title">כושר נוכחי</div>' +
        (data.repsPullup ? '<div class="row"><span class="label">חזרות מתח</span><span class="value">' + nbsp(data.repsPullup) + '</span></div>' : '') +
        (data.repsDips ? '<div class="row"><span class="label">חזרות מקבילים</span><span class="value">' + nbsp(data.repsDips) + '</span></div>' : '') +
        (data.repsPushup ? '<div class="row"><span class="label">חזרות שכיבות סמיכה</span><span class="value">' + nbsp(data.repsPushup) + '</span></div>' : '');
    }

    var aboutBlock = '';
    if (data.trainingBackground || data.goals) {
      aboutBlock =
        '<div class="section-title">קצת על המתאמן/ת</div>' +
        (data.trainingBackground ? '<p><b>עבר באימונים:</b> ' + data.trainingBackground + '</p>' : '') +
        (data.goals ? '<p><b>מטרות:</b> ' + data.goals + '</p>' : '');
    }

    return (
      '<div class="cover">' +
      '  <div class="header">' +
      '    <div class="logo"><img src="assets/logo.png" alt="לוגו"></div>' +
      '    <div>' +
      '      <div class="biz-name">רועי שרבי | ליווי קליסטניקס אונליין</div>' +
      '      <div class="doc-title">טופס הצטרפות והצהרת בריאות חתומה</div>' +
      '    </div>' +
      '  </div>' +

      '  <div class="plan-strip">' + nbsp(data.plan) + '</div>' +

      '  <div class="section-title">פרטים אישיים</div>' +
      '  <div class="row"><span class="label">שם מלא</span><span class="value">' + nbsp(data.fullName) + '</span></div>' +
      '  <div class="row"><span class="label">תעודת זהות</span><span class="value">' + nbsp(data.idNumber) + '</span></div>' +
      '  <div class="row"><span class="label">תאריך לידה</span><span class="value">' + nbsp(data.birthDate) + '</span></div>' +
      '  <div class="row"><span class="label">גיל</span><span class="value">' + nbsp(data.age) + '</span></div>' +
      '  <div class="row"><span class="label">גובה</span><span class="value">' + nbsp(data.height + ' ס"מ') + '</span></div>' +
      '  <div class="row"><span class="label">משקל</span><span class="value">' + nbsp(data.weight + ' ק"ג') + '</span></div>' +
      '  <div class="row"><span class="label">כתובת</span><span class="value">' + nbsp(data.address) + '</span></div>' +
      '  <div class="row"><span class="label">אימייל</span><span class="value">' + nbsp(data.email) + '</span></div>' +
      '  <div class="row"><span class="label">טלפון</span><span class="value">' + nbsp(data.phone) + '</span></div>' +
      '  <div class="row"><span class="label">מסלול שאושר</span><span class="value">' + nbsp(data.planConfirm) + '</span></div>' +
      minorBlock +
      fitnessBlock +
      aboutBlock +

      '  <div class="section-title">שאלון בריאות</div>' +
      healthRows +
      healthDetailsBlock +

      '  <div class="terms-block" id="terms-section">' +
      '    <div class="section-title">' + nbsp(window.TERMS_TITLE) + '</div>' +
      window.TERMS_TEXT.split('\n').filter(function (line) { return line.trim(); })
        .map(function (line) { return '<p>' + line + '</p>'; }).join('') +
      '  </div>' +
      '  <p>המתאמן/ת מאשר/ת כי קרא/ה והבין/ה את ההצהרה לעיל ומסכים/ה לתנאיה במלואם. כמו כן, המתאמן/ת מתחייב/ת לכלל חודשי ותשלומי המסלול שנבחר.</p>' +

      '  <div class="sig-block">' +
      '    <div class="sig-col">' +
      '      <div class="sig-caption">חתימת המתאמן/ת</div>' +
      '      <img class="sig-img" src="' + data.signatureDataUrl + '">' +
      '      <div class="sig-name">' + nbsp(data.fullName) + '</div>' +
      '    </div>' +
      '    <div class="sig-col">' +
      '      <div class="sig-caption">חתימת בעל העסק</div>' +
      '      <img class="sig-img" src="' + businessSigDataUrl + '">' +
      '      <div class="sig-name">רועי שרבי</div>' +
      '    </div>' +
      '  </div>' +

      '  <div class="timestamp">נחתם בתאריך ' + nbsp(data.timestamp) + '</div>' +
      '</div>'
    );
  }

  var COVER_CSS = (
    '.cover { direction: rtl; font-family: Arial, Helvetica, sans-serif; color: #111; word-spacing: 1.4px; padding: 28px; }' +
    '.cover .header { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #6b21a8; padding-bottom: 12px; margin-bottom: 16px; }' +
    '.cover .logo { width: 44px; height: 44px; border-radius: 50%; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 4px; }' +
    '.cover .logo img { width: 100%; height: 100%; object-fit: contain; }' +
    '.cover .biz-name { font-weight: bold; font-size: 15px; }' +
    '.cover .doc-title { font-size: 13px; color: #555; margin-top: 2px; }' +
    '.cover .plan-strip { background: #f3ecfa; color: #6b21a8; font-weight: bold; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; }' +
    '.cover .section-title { font-weight: bold; color: #6b21a8; font-size: 14px; margin: 16px 0 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }' +
    '.cover .row { display: flex; justify-content: space-between; font-size: 12.5px; padding: 4px 0; border-bottom: 1px dotted #eee; }' +
    '.cover .row .label { color: #666; font-weight: bold; }' +
    '.cover .hq-row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; }' +
    '.cover .hq-q { flex: 1; padding-left: 10px; }' +
    '.cover .hq-a { font-weight: bold; }' +
    '.cover p { font-size: 12.5px; line-height: 1.6; }' +
    '.cover .terms-block { text-align: center; margin: 0 auto; }' +
    '.cover .terms-block .section-title { text-align: center; border-bottom: 1px solid #eee; }' +
    '.cover .terms-block p { text-align: center; }' +
    '.cover .sig-block { display: flex; gap: 20px; margin-top: 20px; }' +
    '.cover .sig-col { flex: 1; text-align: center; border: 1px solid #eee; border-radius: 8px; padding: 10px; }' +
    '.cover .sig-caption { font-size: 11px; color: #888; margin-bottom: 6px; }' +
    '.cover .sig-img { max-width: 100%; height: 60px; object-fit: contain; }' +
    '.cover .sig-name { font-size: 12px; font-weight: bold; margin-top: 6px; }' +
    '.cover .timestamp { text-align: center; font-size: 11px; color: #888; margin-top: 18px; }'
  );

  function loadImageAsDataUrl(url) {
    return fetch(url)
      .then(function (r) { return r.blob(); })
      .then(function (blob) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

  // Finds the bottom edge (in scaled canvas px) of every text-bearing element,
  // so page breaks can snap to whitespace between them instead of cutting mid-line.
  function collectSafeBreakpoints(inner) {
    var selector = '.row, .hq-row, .section-title, p, .sig-block, .timestamp, .header, .plan-strip';
    var innerTop = inner.getBoundingClientRect().top;
    var points = [];
    inner.querySelectorAll(selector).forEach(function (el) {
      var rect = el.getBoundingClientRect();
      points.push(Math.round((rect.bottom - innerTop) * RENDER_SCALE));
    });
    points.sort(function (a, b) { return a - b; });
    return points;
  }

  // The terms/declaration section always starts on a fresh page, so its
  // heading is never left dangling at the bottom of the previous page.
  function collectForcedBreaks(inner) {
    var innerTop = inner.getBoundingClientRect().top;
    var points = [];
    inner.querySelectorAll('#terms-section').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      points.push(Math.round((rect.top - innerTop) * RENDER_SCALE));
    });
    return points;
  }

  // html2canvas can snapshot before <img> tags finish decoding, leaving them
  // blank (this is what was happening to the logo). Wait for every image first.
  function waitForImages(container) {
    var imgs = Array.prototype.slice.call(container.querySelectorAll('img'));
    return Promise.all(imgs.map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
  }

  function renderCoverPages(data, businessSigDataUrl, pageWidthPt, pageHeightPt) {
    var outer = document.createElement('div');
    outer.style.position = 'fixed';
    outer.style.left = '-10000px';
    outer.style.top = '0';
    outer.style.width = '760px';

    var styleEl = document.createElement('style');
    styleEl.textContent = COVER_CSS;
    outer.appendChild(styleEl);

    var inner = document.createElement('div');
    inner.style.position = 'static';
    inner.style.width = '760px';
    inner.style.background = '#fff';
    inner.innerHTML = buildCoverHtml(data, businessSigDataUrl);
    outer.appendChild(inner);

    document.body.appendChild(outer);

    return waitForImages(inner)
      .then(function () {
        var breakpoints = collectSafeBreakpoints(inner);
        var forcedBreaks = collectForcedBreaks(inner);
        return window.html2canvas(inner, { scale: RENDER_SCALE, useCORS: true })
          .then(function (canvas) {
            var imgWidth = pageWidthPt;
            var pxPerPage = Math.floor((pageHeightPt * canvas.width) / imgWidth);
            var renderedHeight = 0;
            var pages = [];

            while (renderedHeight < canvas.height) {
              var limit = Math.min(renderedHeight + pxPerPage, canvas.height);
              var forcedInRange = forcedBreaks.filter(function (p) { return p > renderedHeight && p < limit; })[0];
              if (forcedInRange) limit = forcedInRange;
              var sliceEnd = limit;
              if (limit < canvas.height) {
                var best = breakpoints.filter(function (p) { return p > renderedHeight && p <= limit; }).pop();
                if (best) sliceEnd = best;
              }
              if (forcedInRange) sliceEnd = forcedInRange;
              var sliceHeight = sliceEnd - renderedHeight;
              var pageCanvas = document.createElement('canvas');
              pageCanvas.width = canvas.width;
              pageCanvas.height = sliceHeight;
              pageCanvas.getContext('2d').drawImage(
                canvas, 0, renderedHeight, canvas.width, sliceHeight,
                0, 0, canvas.width, sliceHeight
              );
              pages.push(pageCanvas);
              renderedHeight = sliceEnd;
            }

            return pages;
          });
      })
      .finally(function () {
        document.body.removeChild(outer);
      });
  }

  function bytesToBase64(bytes) {
    var chunkSize = 0x8000;
    var chunks = [];
    for (var i = 0; i < bytes.length; i += chunkSize) {
      chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize)));
    }
    return btoa(chunks.join(''));
  }

  function downloadPdf(bytes, filename) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }

  window.__generateSignedPdf = function (data) {
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    var pageWidth = pdf.internal.pageSize.getWidth();
    var pageHeight = pdf.internal.pageSize.getHeight();

    return Promise.all([
      loadImageAsDataUrl(BUSINESS_SIGNATURE_URL),
      loadImageAsDataUrl(LOGO_URL)
    ])
      .then(function (urls) {
        var businessSigDataUrl = urls[0];
        var logoDataUrl = urls[1];
        return renderCoverPages(data, businessSigDataUrl, pageWidth, pageHeight)
          .then(function (allPages) { return { allPages: allPages, logoDataUrl: logoDataUrl }; });
      })
      .then(function (result) {
        var logoSize = 20;
        var logoX = 24;
        var logoY = pageHeight - logoSize - 16;
        result.allPages.forEach(function (canvas, i) {
          var imgHeight = (canvas.height * pageWidth) / canvas.width;
          if (i > 0) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageWidth, imgHeight);
          pdf.addImage(result.logoDataUrl, 'PNG', logoX, logoY, logoSize, logoSize);
        });
        return new Uint8Array(pdf.output('arraybuffer'));
      })
      .then(function (mergedBytes) {
        var filename = (data.fullName || 'מתאמן').trim() + ' - ' + data.plan + '.pdf';
        var base64 = bytesToBase64(mergedBytes);

        return window.__uploadSignedPdf({
          pdfBase64: base64,
          filename: filename,
          name: data.fullName,
          id: data.idNumber,
          track: data.plan,
          phone: data.phone,
          email: data.email,
          time: data.timestamp
        }).then(function (uploadResult) {
          if (uploadResult && uploadResult.ok) {
            return { ok: true, uploaded: true };
          }
          downloadPdf(mergedBytes, filename);
          return { ok: true, uploaded: false };
        });
      });
  };
})();
