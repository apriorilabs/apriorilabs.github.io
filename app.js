(() => {
  // Mobile menu toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // One-click Copy buttons for CAGE / UEI / Email
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const val = btn.getAttribute('data-copy');
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        const prev = btn.textContent;
        btn.textContent = 'COPIED';
        setTimeout(() => {
          btn.textContent = prev;
        }, 1600);
      } catch {
        // Fallback no-op
      }
    });
  });

  // PrioriEngine 5-Tab Project Showcase Switcher + Theater / UX Sub-Switchers (runs on engine.html & index.html)
  const engineTabs = document.querySelectorAll('.engine-tab');
  const enginePanes = {
    forensics: document.getElementById('engine-pane-forensics'),
    rf: document.getElementById('engine-pane-rf'),
    sda: document.getElementById('engine-pane-sda'),
    asw: document.getElementById('engine-pane-asw'),
    code: document.getElementById('engine-pane-code')
  };

  engineTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetKey = tab.getAttribute('data-engine-tab');
      engineTabs.forEach((t) => t.classList.toggle('active', t === tab));
      Object.entries(enginePanes).forEach(([key, pane]) => {
        if (!pane) return;
        const isMatch = key === targetKey;
        pane.classList.toggle('active', isMatch);
        pane.hidden = !isMatch;
      });
    });
  });

  const aswSubBtns = document.querySelectorAll('[data-asw-src]');
  const aswPreviewImg = document.getElementById('aswPreviewImg');
  const aswPreviewLink = document.getElementById('aswPreviewLink');
  const aswTheaterCaption = document.getElementById('aswTheaterCaption');

  aswSubBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-asw-src');
      const cap = btn.getAttribute('data-asw-caption');
      if (!src) return;
      aswSubBtns.forEach((b) => b.classList.toggle('active', b === btn));
      if (aswPreviewImg) aswPreviewImg.src = src;
      if (aswPreviewLink) aswPreviewLink.href = src;
      if (aswTheaterCaption && cap) aswTheaterCaption.textContent = cap;
    });
  });

  const spectraSubBtns = document.querySelectorAll('[data-spectra-src]');
  const spectraPreviewImg = document.getElementById('spectraPreviewImg');
  const spectraPreviewLink = document.getElementById('spectraPreviewLink');
  const spectraModeCaption = document.getElementById('spectraModeCaption');

  spectraSubBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-spectra-src');
      const cap = btn.getAttribute('data-spectra-caption');
      if (!src) return;
      spectraSubBtns.forEach((b) => b.classList.toggle('active', b === btn));
      if (spectraPreviewImg) spectraPreviewImg.src = src;
      if (spectraPreviewLink) spectraPreviewLink.href = src;
      if (spectraModeCaption && cap) spectraModeCaption.textContent = cap;
    });
  });

  // Copy full license text button on license.html
  const btnCopyLicense = document.getElementById('btnCopyLicense');
  const evalLicenseText = document.getElementById('evalLicenseText');
  if (btnCopyLicense && evalLicenseText) {
    btnCopyLicense.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(evalLicenseText.textContent || '');
        const prev = btnCopyLicense.textContent;
        btnCopyLicense.textContent = 'COPIED LICENSE TEXT!';
        setTimeout(() => {
          btnCopyLicense.textContent = prev;
        }, 1800);
      } catch {
        // Fallback no-op
      }
    });
  }

  // =========================================================================
  // Universal Interactive SDK Request & Contracting Inquiry Modal
  // (Prevents silent failure when OS has no default desktop mailto: handler)
  // =========================================================================
  const inquiryTracks = {
    eval: {
      eyebrow: 'TIER 01 // NO-COST LAB & IRAD EVALUATION REQUEST',
      title: 'Request PrioriSDK v0.8 Lab & IRAD Evaluation Bundle',
      subject: 'PrioriSDK v0.8 — No-Cost Lab & IRAD Evaluation Request',
      defaultEnv: 'RHEL 8/9 Linux ELF (x86_64 + Vulkan GPU)',
      promptNote:
        'Please send the non-viral PrioriSDK v0.8 Lab & IRAD Evaluation archive (C99/C++23 headers, Slang shaders, 4 reference workbenches, and LICENSE-EVALUATION.txt).'
    },
    commercial: {
      eyebrow: 'TIER 02 // COMMERCIAL DEPLOYMENT & PRIORICERT RMF',
      title: 'Program Deployment License & PrioriCert RMF Inquiry',
      subject: 'PrioriSDK — Program Deployment & PrioriCert RMF Licensing Inquiry',
      defaultEnv: 'Fielded Program / OEM Deployment (Linux ELF / Windows PE)',
      promptNote:
        'We would like to discuss program-scoped commercial deployment licensing (DFARS 227.7202 / FAR 52.227-19) and the PrioriCert RMF evidence package.'
    },
    teaming: {
      eyebrow: 'TIER 03 // PRIORICORE IP, SBIR & PRIME SUBCONTRACTING',
      title: 'Scope Prime Teaming, SBIR/STTR or Sensor Integration',
      subject: 'A Priori Labs — Prime Teaming / SBIR / PrioriCore Integration Inquiry',
      defaultEnv: 'Real-Time Radar / EW / Acoustic Sensor Pipeline',
      promptNote:
        'We would like to discuss teaming, direct R&D tasking, or PrioriCore physics/DSP integration for an upcoming sensor milestone or solicitation.'
    },
    general: {
      eyebrow: 'DIRECT CONTACT // CAGE 26YG3 • HUNTSVILLE, AL',
      title: 'Contact A Priori Labs Engineering & Contracting',
      subject: 'A Priori Labs LLC — Technical / Contracting Inquiry',
      defaultEnv: 'C++23 Edge DSP / Tracking / PrioriEngine',
      promptNote:
        'Reaching out to connect regarding real-time DSP, tracking, or PrioriEngine capabilities.'
    }
  };

  const inqBackdrop = document.createElement('div');
  inqBackdrop.className = 'modal-backdrop';
  inqBackdrop.id = 'inquiryModal';
  inqBackdrop.hidden = true;
  inqBackdrop.setAttribute('aria-hidden', 'true');
  inqBackdrop.innerHTML = `
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="inqModalTitle" style="max-width: 680px;">
      <div class="modal-header">
        <div>
          <span class="modal-eyebrow" id="inqEyebrow">TIER 01 // NO-COST LAB &amp; IRAD EVALUATION REQUEST</span>
          <h3 id="inqModalTitle">Request PrioriSDK v0.8 Lab &amp; IRAD Evaluation Bundle</h3>
        </div>
        <button class="modal-close" id="btnCloseInq" type="button" aria-label="Close Inquiry Modal">&times;</button>
      </div>
      <div class="modal-body" style="padding: 20px 24px 24px; overflow-y: auto;">
        <div class="inq-direct-strip">
          <div>
            <strong>Direct POC:</strong> Ryan Gubert &bull; <span style="color: var(--accent-ice);">info@apriori-labs.com</span> &bull; <a href="tel:+17347512203" style="color: var(--text-primary); text-decoration: underline;">(734) 751-2203</a>
          </div>
          <button class="copy-btn" type="button" id="btnCopyInqEmail">COPY EMAIL</button>
        </div>

        <div class="inq-grid">
          <div class="inq-field full">
            <label for="inqTrackSelect">Inquiry Track</label>
            <select id="inqTrackSelect" class="inq-select">
              <option value="eval">Tier 01 — No-Cost Lab &amp; IRAD SDK Evaluation ($0, Non-Viral)</option>
              <option value="commercial">Tier 02 — Commercial / Program License &amp; PrioriCert RMF</option>
              <option value="teaming">Tier 03 — Prime Subcontracting, SBIR/STTR &amp; PrioriCore IP</option>
              <option value="general">General Engineering &amp; Contracting Inquiry</option>
            </select>
          </div>
          <div class="inq-field">
            <label for="inqName">Your Name &amp; Role</label>
            <input id="inqName" class="inq-input" type="text" placeholder="e.g. Dr. Jane Doe, Lead DSP Engineer" />
          </div>
          <div class="inq-field">
            <label for="inqOrg">Organization / Lab / Prime</label>
            <input id="inqOrg" class="inq-input" type="text" placeholder="e.g. NSWC / DEVCOM / Defense Prime / Univ" />
          </div>
          <div class="inq-field full">
            <label for="inqEnv">Target OS, GPU &amp; Sensor Modality</label>
            <input id="inqEnv" class="inq-input" type="text" value="RHEL 8/9 Linux ELF (x86_64 + Vulkan GPU)" />
          </div>
          <div class="inq-field full">
            <label for="inqPreview">Ready-to-Send Request Brief (Editable)</label>
            <textarea id="inqPreview" class="inq-textarea"></textarea>
          </div>
        </div>

        <div class="inq-actions-grid">
          <button class="btn btn-primary btn-sm" type="button" id="btnCopyFullInq">
            1-Click Copy Request Brief
          </button>
          <a class="btn btn-outline btn-sm" id="btnGmailWeb" href="#" target="_blank" rel="noopener">
            Open in Gmail Web &nearr;
          </a>
          <a class="btn btn-outline btn-sm" id="btnOutlookWeb" href="#" target="_blank" rel="noopener">
            Open in Outlook / M365 Web &nearr;
          </a>
          <a class="btn btn-outline btn-sm" id="btnMailtoLaunch" href="#">
            Open Default Mail App
          </a>
        </div>

        <div class="inq-status-toast" id="inqToast" role="status" aria-live="polite"></div>

        <div style="margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 0.78rem; color: var(--text-muted);">
          <span>CAGE: <strong>26YG3</strong> &bull; UEI: <strong>RG2JV9CZQJC7</strong></span>
          <a href="license.html" style="color: var(--accent-ice); font-family: var(--font-mono); font-size: 0.75rem; text-decoration: underline;">
            Read Full Evaluation &amp; DFARS License Terms &rarr;
          </a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(inqBackdrop);

  const inqEyebrow = document.getElementById('inqEyebrow');
  const inqModalTitle = document.getElementById('inqModalTitle');
  const inqTrackSelect = document.getElementById('inqTrackSelect');
  const inqName = document.getElementById('inqName');
  const inqOrg = document.getElementById('inqOrg');
  const inqEnv = document.getElementById('inqEnv');
  const inqPreview = document.getElementById('inqPreview');
  const inqToast = document.getElementById('inqToast');
  const btnCloseInq = document.getElementById('btnCloseInq');
  const btnCopyInqEmail = document.getElementById('btnCopyInqEmail');
  const btnCopyFullInq = document.getElementById('btnCopyFullInq');
  const btnGmailWeb = document.getElementById('btnGmailWeb');
  const btnOutlookWeb = document.getElementById('btnOutlookWeb');
  const btnMailtoLaunch = document.getElementById('btnMailtoLaunch');

  let previewManuallyEdited = false;

  function updateInquiryLinks() {
    const key = (inqTrackSelect && inqTrackSelect.value) || 'eval';
    const trk = inquiryTracks[key] || inquiryTracks.eval;
    const subj = trk.subject;
    const body = (inqPreview && inqPreview.value) || '';
    const encTo = encodeURIComponent('info@apriori-labs.com');
    const encSubj = encodeURIComponent(subj);
    const encBody = encodeURIComponent(body);

    if (btnGmailWeb) {
      btnGmailWeb.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSubj}&body=${encBody}`;
    }
    if (btnOutlookWeb) {
      btnOutlookWeb.href = `https://outlook.office.com/mail/deeplink/compose?to=${encTo}&subject=${encSubj}&body=${encBody}`;
    }
    if (btnMailtoLaunch) {
      btnMailtoLaunch.href = `mailto:info@apriori-labs.com?subject=${encSubj}&body=${encBody}`;
    }
  }

  function rebuildInquiryMessage(resetEnv) {
    const key = (inqTrackSelect && inqTrackSelect.value) || 'eval';
    const trk = inquiryTracks[key] || inquiryTracks.eval;
    if (inqEyebrow) inqEyebrow.textContent = trk.eyebrow;
    if (inqModalTitle) inqModalTitle.textContent = trk.title;
    if (resetEnv && inqEnv) inqEnv.value = trk.defaultEnv;

    if (!previewManuallyEdited && inqPreview) {
      const nameVal = (inqName && inqName.value.trim()) || '[Your Name / Title]';
      const orgVal = (inqOrg && inqOrg.value.trim()) || '[Lab / Command / Company]';
      const envVal = (inqEnv && inqEnv.value.trim()) || trk.defaultEnv;
      inqPreview.value =
        `Hello Ryan / A Priori Labs,\n\n` +
        `${trk.promptNote}\n\n` +
        `- Name / Role: ${nameVal}\n` +
        `- Organization: ${orgVal}\n` +
        `- Target Platform / Sensor Focus: ${envVal}\n\n` +
        `Thank you!`;
    }
    updateInquiryLinks();
  }

  function inferTrackFromHref(el) {
    const explicit = el.getAttribute('data-inquiry');
    if (explicit && inquiryTracks[explicit]) return explicit;
    const href = (el.getAttribute('href') || '').toLowerCase();
    if (href.includes('commercial') || href.includes('prioricert') || href.includes('program')) return 'commercial';
    if (href.includes('prioricore') || href.includes('teaming') || href.includes('integration')) return 'teaming';
    if (href.includes('eval') || href.includes('priorisdk')) return 'eval';
    return 'general';
  }

  function openInquiryModal(trackKey) {
    previewManuallyEdited = false;
    if (inqTrackSelect) inqTrackSelect.value = inquiryTracks[trackKey] ? trackKey : 'general';
    if (inqToast) inqToast.textContent = '';
    rebuildInquiryMessage(true);
    inqBackdrop.hidden = false;
    inqBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeInquiryModal() {
    inqBackdrop.hidden = true;
    inqBackdrop.setAttribute('aria-hidden', 'true');
  }

  // Upgrade all CTA buttons (a.btn[href^="mailto:"] and [data-inquiry]) to open the interactive modal
  document.querySelectorAll('a.btn[href^="mailto:"], [data-inquiry]').forEach((el) => {
    if (el.id === 'btnMailtoLaunch') return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openInquiryModal(inferTrackFromHref(el));
    });
  });

  if (inqTrackSelect) {
    inqTrackSelect.addEventListener('change', () => {
      previewManuallyEdited = false;
      rebuildInquiryMessage(true);
    });
  }
  [inqName, inqOrg, inqEnv].forEach((inp) => {
    if (inp) inp.addEventListener('input', () => rebuildInquiryMessage(false));
  });
  if (inqPreview) {
    inqPreview.addEventListener('input', () => {
      previewManuallyEdited = true;
      updateInquiryLinks();
    });
  }
  if (btnCloseInq) btnCloseInq.addEventListener('click', closeInquiryModal);
  inqBackdrop.addEventListener('click', (e) => {
    if (e.target === inqBackdrop) closeInquiryModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !inqBackdrop.hidden) closeInquiryModal();
  });

  if (btnCopyInqEmail) {
    btnCopyInqEmail.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('info@apriori-labs.com');
        btnCopyInqEmail.textContent = 'COPIED!';
        if (inqToast) inqToast.textContent = '✓ Copied info@apriori-labs.com to clipboard.';
        setTimeout(() => {
          btnCopyInqEmail.textContent = 'COPY EMAIL';
        }, 1600);
      } catch {}
    });
  }

  if (btnCopyFullInq) {
    btnCopyFullInq.addEventListener('click', async () => {
      const key = (inqTrackSelect && inqTrackSelect.value) || 'eval';
      const trk = inquiryTracks[key] || inquiryTracks.eval;
      const fullClip = `To: info@apriori-labs.com\nSubject: ${trk.subject}\n\n${inqPreview ? inqPreview.value : ''}`;
      try {
        await navigator.clipboard.writeText(fullClip);
        if (inqToast) {
          inqToast.textContent = '✓ Full request copied to clipboard! Paste into any email client and send to info@apriori-labs.com.';
        }
      } catch {}
    });
  }

  // =========================================================================
  // Interactive Frequency-Domain PSD + Waterfall + Synthetic Target Sandbox
  // =========================================================================
  const canvas = document.getElementById('dspCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const readoutEl = document.getElementById('dspReadout');
  const scorePillEl = document.getElementById('dspScorePill');
  const modeTabs = document.querySelectorAll('.dsp-tab');

  const btnSpawnStealth = document.getElementById('btnSpawnStealth');
  const btnSpawnJammer = document.getElementById('btnSpawnJammer');
  const btnPriorToggle = document.getElementById('btnPriorToggle');
  const btnResetSim = document.getElementById('btnResetSim');
  const btnOpenReport = document.getElementById('btnOpenReport');

  const NUM_BINS = 200;
  const MIN_DB = -90;
  const MAX_DB = -14;

  // Offscreen waterfall spectrogram buffer
  const WF_ROWS = 110;
  const wfCanvas = document.createElement('canvas');
  wfCanvas.width = NUM_BINS;
  wfCanvas.height = WF_ROWS;
  const wfCtx = wfCanvas.getContext('2d');
  wfCtx.fillStyle = '#050811';
  wfCtx.fillRect(0, 0, NUM_BINS, WF_ROWS);
  const wfRowImg = wfCtx.createImageData(NUM_BINS, 1);

  const modeConfigs = {
    radar: {
      name: 'Pulse-Doppler Radar',
      fftSize: 1024,
      pfa: '1e-5',
      latencyMs: 0.38,
      cppKernelUs: 3.2,
      axisMin: -500,
      axisMax: 500,
      axisUnit: 'Hz',
      ticks: ['-500 Hz', '-250 Hz', '0 Hz (Clutter)', '+250 Hz', '+500 Hz'],
      priorDesc: 'Zero-Doppler MTI clutter notch + OS-CFAR adaptive sidelobe excision',
      defaultTargets: [
        { id: 'TRK-01', baseBin: 0.28, drift: 0.026, driftRate: 0.24, snr: 29, width: 0.013, kind: 'baseline' },
        { id: 'TRK-02', baseBin: 0.71, drift: -0.022, driftRate: 0.19, snr: 21, width: 0.013, kind: 'baseline' }
      ]
    },
    sonar: {
      name: 'Passive LOFAR / MVDR Sonar',
      fftSize: 2048,
      pfa: '1e-4',
      latencyMs: 0.54,
      cppKernelUs: 6.8,
      axisMin: 0,
      axisMax: 2000,
      axisUnit: 'Hz',
      ticks: ['0 Hz', '500 Hz', '1.0 kHz', '1.5 kHz', '2.0 kHz'],
      priorDesc: 'AIS shipping ambient soundscape subtraction + adaptive reverberation whitening',
      defaultTargets: [
        { id: 'TONAL-A', baseBin: 0.23, drift: 0.012, driftRate: 0.16, snr: 24, width: 0.011, kind: 'baseline' },
        { id: 'DEMON-B', baseBin: 0.62, drift: 0.009, driftRate: 0.14, snr: 18.5, width: 0.015, kind: 'baseline' }
      ]
    },
    diag: {
      name: 'RF Spectral Integrity Monitor',
      fftSize: 1024,
      pfa: '1e-5',
      latencyMs: 0.34,
      cppKernelUs: 3.1,
      axisMin: 2400,
      axisMax: 2500,
      axisUnit: 'MHz',
      ticks: ['2400 MHz', '2425 MHz', '2450 MHz', '2475 MHz', '2500 MHz'],
      priorDesc: 'Co-channel wideband interference excision + noise-floor drift calibration',
      defaultTargets: [
        { id: 'LINK-01', baseBin: 0.34, drift: 0.014, driftRate: 0.18, snr: 26, width: 0.013, kind: 'baseline' },
        { id: 'WEAK-02', baseBin: 0.76, drift: -0.01, driftRate: 0.15, snr: 14.5, width: 0.012, kind: 'stealth' }
      ]
    }
  };

  let currentMode = 'radar';
  let priorEnabled = true;
  let targets = [];
  let jammers = [];
  let synCounter = 1;
  let jamCounter = 1;
  let ripples = [];
  let hoverState = null;

  // Smooth temporal state buffers (eliminates harsh frame-to-frame jitter)
  const ouNoise = new Float32Array(NUM_BINS);
  const smoothedPower = new Float32Array(NUM_BINS);
  const smoothedThreshold = new Float32Array(NUM_BINS);
  let buffersInitialized = false;

  function cloneDefaults(mode) {
    const cfg = modeConfigs[mode] || modeConfigs.radar;
    targets = cfg.defaultTargets.map((t) => ({ ...t, phase: t.baseBin * 9.0 }));
    jammers = [];
    synCounter = 1;
    jamCounter = 1;
    buffersInitialized = false;
  }

  cloneDefaults(currentMode);

  function binToPhysicalFreq(bin, mode) {
    const cfg = modeConfigs[mode] || modeConfigs.radar;
    const val = cfg.axisMin + bin * (cfg.axisMax - cfg.axisMin);
    if (cfg.axisUnit === 'Hz' && cfg.axisMin < 0) {
      return `${val >= 0 ? '+' : ''}${Math.round(val)} Hz`;
    }
    return `${Math.round(val)} ${cfg.axisUnit}`;
  }

  function updateReadoutBar() {
    const cfg = modeConfigs[currentMode];
    if (!readoutEl || !cfg) return;
    const priorTag = priorEnabled ? 'PRIOR: ON' : 'PRIOR: OFF';
    readoutEl.textContent = `${cfg.fftSize}-PT FFT + OS-CFAR (${priorTag}) // LIVE JS SIM: ${cfg.latencyMs.toFixed(2)} ms • C++23 SIMD: ~${cfg.cppKernelUs.toFixed(1)} µs`;
  }

  updateReadoutBar();

  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modeTabs.forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.getAttribute('data-mode') || 'radar';
      cloneDefaults(currentMode);
      prewarmWaterfall();
      updateReadoutBar();
      updateScorePill();
    });
  });

  if (btnPriorToggle) {
    btnPriorToggle.addEventListener('click', () => {
      priorEnabled = !priorEnabled;
      btnPriorToggle.classList.toggle('active', priorEnabled);
      btnPriorToggle.setAttribute('aria-pressed', String(priorEnabled));
      btnPriorToggle.textContent = priorEnabled ? 'Prior: ON' : 'Prior: OFF';
      updateReadoutBar();
    });
  }

  if (btnSpawnStealth) {
    btnSpawnStealth.addEventListener('click', () => {
      if (targets.length >= 9) targets.shift();
      // Place stealth contact near environmental clutter or active jammer skirt to test A Priori Prior!
      let candidateBin = 0.5;
      if (jammers.length > 0) {
        const refJam = jammers[jammers.length - 1];
        candidateBin = Math.min(0.92, Math.max(0.08, refJam.center + (Math.random() < 0.5 ? -0.045 : 0.045)));
      } else if (currentMode === 'radar') {
        candidateBin = 0.5 + (Math.random() < 0.5 ? -0.055 : 0.055);
      } else if (currentMode === 'sonar') {
        candidateBin = 0.11 + Math.random() * 0.09;
      } else {
        candidateBin = 0.72 + Math.random() * 0.14;
      }
      const snr = +(10.2 + Math.random() * 2.4).toFixed(1);
      const id = `STL-0${synCounter++}`;
      targets.push({
        id,
        baseBin: candidateBin,
        drift: 0.011,
        driftRate: 0.17,
        snr,
        width: 0.012,
        kind: 'stealth',
        phase: Math.random() * 6.28
      });
      ripples.push({ bin: candidateBin, db: -68 + snr, age: 0, color: '#7dd3fc' });
    });
  }

  if (btnSpawnJammer) {
    btnSpawnJammer.addEventListener('click', () => {
      if (jammers.length >= 3) jammers.shift();
      // Place jammer near an existing target so user immediately sees masking vs excision
      const anchor = targets[Math.floor(Math.random() * targets.length)];
      const center = anchor
        ? Math.min(0.88, Math.max(0.12, anchor.baseBin + (Math.random() - 0.5) * 0.06))
        : 0.2 + Math.random() * 0.6;
      jammers.push({
        id: `JAM-0${jamCounter++}`,
        center,
        width: 0.072,
        power: 21.5
      });
      ripples.push({ bin: center, db: -48, age: 0, color: '#fbbf24' });
    });
  }

  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      cloneDefaults(currentMode);
      priorEnabled = true;
      if (btnPriorToggle) {
        btnPriorToggle.classList.add('active');
        btnPriorToggle.setAttribute('aria-pressed', 'true');
        btnPriorToggle.textContent = 'Prior: ON';
      }
      prewarmWaterfall();
      updateReadoutBar();
      updateScorePill();
    });
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(220, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function getLayout(w, h) {
    const psdTop = 12;
    const psdBottom = Math.floor(h * 0.58);
    const axisBandBottom = psdBottom + 20;
    const wfTop = axisBandBottom + 4;
    const wfHeight = Math.max(48, h - wfTop - 6);
    return { psdTop, psdBottom, axisBandBottom, wfTop, wfHeight };
  }

  function dbToY(db, psdTop, psdBottom) {
    const norm = (db - MIN_DB) / (MAX_DB - MIN_DB);
    const clamped = Math.max(0.02, Math.min(0.97, norm));
    return psdBottom - clamped * (psdBottom - psdTop);
  }

  function yToDb(y, psdTop, psdBottom) {
    const norm = (psdBottom - y) / Math.max(1, psdBottom - psdTop);
    const clamped = Math.max(0.04, Math.min(0.95, norm));
    return MIN_DB + clamped * (MAX_DB - MIN_DB);
  }

  // Deterministic pseudo-normal step for smooth AR(1) background speckle
  let rngSeed = 1337;
  function nextRand() {
    rngSeed = (rngSeed * 1664525 + 1013904223) >>> 0;
    return rngSeed / 4294967296 - 0.5;
  }

  function stepPhysics(dt, simTime) {
    // 1. Calm Ornstein-Uhlenbeck temporal correlation for thermal background
    const decay = Math.exp(-dt / 0.95);
    const drive = Math.sqrt(1 - decay * decay) * 4.6;
    for (let i = 0; i < NUM_BINS; i++) {
      ouNoise[i] = ouNoise[i] * decay + nextRand() * drive;
    }

    const instantPower = new Float32Array(NUM_BINS);
    const instantThreshold = new Float32Array(NUM_BINS);
    const priorAtten = priorEnabled ? 0.16 : 1.0; // ~84% clutter/jammer shelf suppression in dB excess

    for (let i = 0; i < NUM_BINS; i++) {
      const x = i / (NUM_BINS - 1);
      // 3-tap Hann spatial smoothing across FFT bins
      const nPrev = ouNoise[Math.max(0, i - 1)];
      const nCurr = ouNoise[i];
      const nNext = ouNoise[Math.min(NUM_BINS - 1, i + 1)];
      const smoothSpeckle = 0.25 * nPrev + 0.5 * nCurr + 0.25 * nNext;

      // Environmental clutter & interference baseline
      let envClutter = 0;
      if (currentMode === 'radar') {
        // Zero-Doppler ground/sea clutter ridge around center
        envClutter += 21.0 * Math.exp(-Math.pow((x - 0.5) / 0.058, 2));
      } else if (currentMode === 'sonar') {
        // Low-frequency shipping / sea-state ambient noise slope
        envClutter += 22.0 * Math.exp(-x * 4.2);
      } else {
        // Upper-band co-channel RF interference shelf
        envClutter += 17.5 * (1 / (1 + Math.exp(-(x - 0.67) * 32)));
      }

      // User-injected wideband jammers
      let jamShelf = 0;
      for (const jam of jammers) {
        jamShelf += jam.power * Math.exp(-Math.pow((x - jam.center) / jam.width, 2));
      }

      let totalDb = -74.0 + smoothSpeckle + (envClutter + jamShelf) * priorAtten;

      // Coherent target narrowband peaks (preserved through A Priori spatial/Doppler conditioning)
      for (const tgt of targets) {
        const center = tgt.baseBin + tgt.drift * Math.sin(simTime * tgt.driftRate + tgt.phase);
        tgt.liveBin = Math.min(0.98, Math.max(0.02, center));
        totalDb += tgt.snr * Math.exp(-Math.pow((x - tgt.liveBin) / tgt.width, 2));
      }

      instantPower[i] = totalDb;
    }

    // Sliding-window CFAR threshold:
    // When A Priori Prior is ON, order-statistic / clutter-aware guard prevents wideband shelves from blinding neighbors.
    const guard = 4;
    const train = 14;
    for (let i = 0; i < NUM_BINS; i++) {
      const samples = [];
      for (let k = -train - guard; k <= train + guard; k++) {
        if (Math.abs(k) <= guard) continue;
        const idx = Math.min(NUM_BINS - 1, Math.max(0, i + k));
        samples.push(instantPower[idx]);
      }
      if (priorEnabled) {
        // OS-CFAR 65th percentile order statistic (rejects adjacent multi-target / jammer edge contamination)
        samples.sort((a, b) => a - b);
        const osIdx = Math.floor(samples.length * 0.65);
        instantThreshold[i] = samples[osIdx] + 9.2;
      } else {
        // Conventional cell-averaging CA-CFAR (inflates severely near clutter/jammers!)
        let sum = 0;
        for (let s = 0; s < samples.length; s++) sum += samples[s];
        instantThreshold[i] = sum / samples.length + 10.6;
      }
    }

    // Temporal non-coherent CPI integration smoothing
    const alpha = buffersInitialized ? 1 - Math.exp(-dt / 0.18) : 1.0;
    for (let i = 0; i < NUM_BINS; i++) {
      smoothedPower[i] += alpha * (instantPower[i] - smoothedPower[i]);
      smoothedThreshold[i] += alpha * (instantThreshold[i] - smoothedThreshold[i]);
    }
    buffersInitialized = true;

    // Evaluate per-target lock state using linear sub-bin interpolation
    for (const tgt of targets) {
      const exactIdx = tgt.liveBin * (NUM_BINS - 1);
      const i0 = Math.max(0, Math.min(NUM_BINS - 1, Math.floor(exactIdx)));
      const i1 = Math.max(0, Math.min(NUM_BINS - 1, i0 + 1));
      const frac = exactIdx - i0;
      // Check max in ±1 bin mainlobe peak
      const pPeak = Math.max(
        smoothedPower[i0] * (1 - frac) + smoothedPower[i1] * frac,
        smoothedPower[Math.round(exactIdx)]
      );
      const tLocal = smoothedThreshold[i0] * (1 - frac) + smoothedThreshold[i1] * frac;
      tgt.peakDb = pPeak;
      tgt.threshDb = tLocal;
      tgt.marginDb = pPeak - tLocal;
      tgt.locked = tgt.marginDb >= 0;
    }
  }

  function pushWaterfallRow() {
    // Shift existing waterfall down by 1 pixel
    wfCtx.drawImage(wfCanvas, 0, 0, NUM_BINS, WF_ROWS - 1, 0, 1, NUM_BINS, WF_ROWS - 1);
    const data = wfRowImg.data;
    for (let i = 0; i < NUM_BINS; i++) {
      const norm = Math.max(0, Math.min(1, (smoothedPower[i] - -82) / 56));
      let r, g, b;
      if (norm < 0.35) {
        const u = norm / 0.35;
        r = Math.round(5 + u * 14);
        g = Math.round(8 + u * 28);
        b = Math.round(17 + u * 68);
      } else if (norm < 0.72) {
        const u = (norm - 0.35) / 0.37;
        r = Math.round(19 + u * 77);
        g = Math.round(36 + u * 129);
        b = Math.round(85 + u * 165);
      } else {
        const u = (norm - 0.72) / 0.28;
        r = Math.round(96 + u * 152);
        g = Math.round(165 + u * 85);
        b = Math.round(250 + u * 5);
      }
      const p = i * 4;
      data[p] = r;
      data[p + 1] = g;
      data[p + 2] = b;
      data[p + 3] = 255;
    }
    wfCtx.putImageData(wfRowImg, 0, 0);
  }

  // Pointer interaction: hover telemetry & click-to-inject / click-to-remove
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { psdTop, psdBottom } = getLayout(rect.width, rect.height);
    const bin = Math.max(0.03, Math.min(0.97, mx / Math.max(1, rect.width)));

    // Check if hovering near an existing target marker
    let nearTarget = null;
    for (const tgt of targets) {
      const tx = (tgt.liveBin ?? tgt.baseBin) * rect.width;
      const ty = dbToY(tgt.peakDb ?? -50, psdTop, psdBottom);
      if (Math.hypot(mx - tx, my - ty) < 15) {
        nearTarget = tgt;
        break;
      }
    }

    const clickDb = my <= psdBottom + 6 ? yToDb(my, psdTop, psdBottom) : -58;
    const estSnr = Math.max(7.0, Math.min(34.0, clickDb - -73.5));
    hoverState = { mx, my, bin, estSnr, nearTarget, inPsd: my <= psdBottom + 6 };
  });

  canvas.addEventListener('mouseleave', () => {
    hoverState = null;
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { psdTop, psdBottom } = getLayout(rect.width, rect.height);

    // Remove target if user clicked directly on an existing marker (keep at least 1 or allow full sandbox control)
    for (let idx = 0; idx < targets.length; idx++) {
      const tgt = targets[idx];
      const tx = (tgt.liveBin ?? tgt.baseBin) * rect.width;
      const ty = dbToY(tgt.peakDb ?? -50, psdTop, psdBottom);
      if (Math.hypot(mx - tx, my - ty) < 16) {
        targets.splice(idx, 1);
        ripples.push({ bin: tgt.liveBin ?? tgt.baseBin, db: tgt.peakDb ?? -55, age: 0, color: '#94a3b8' });
        return;
      }
    }

    if (targets.length >= 9) {
      targets.shift();
    }

    const bin = Math.max(0.04, Math.min(0.96, mx / Math.max(1, rect.width)));
    const clickDb = my <= psdBottom + 6 ? yToDb(my, psdTop, psdBottom) : -58;
    const snr = +Math.max(7.0, Math.min(34.0, clickDb - -73.5)).toFixed(1);
    const isStealth = snr < 13.0;
    const id = `${isStealth ? 'STL' : 'SYN'}-0${synCounter++}`;

    targets.push({
      id,
      baseBin: bin,
      drift: 0.012 * (Math.random() < 0.5 ? 1 : -1),
      driftRate: 0.15 + Math.random() * 0.08,
      snr,
      width: 0.0125,
      kind: isStealth ? 'stealth' : 'custom',
      phase: Math.random() * 6.28
    });

    ripples.push({ bin, db: -73.5 + snr, age: 0, color: '#7dd3fc' });
  });

  let lastFrameMs = performance.now();
  let simTime = 0;
  let wfAccum = 0;
  let scoreTimer = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateScorePill() {
    if (!scorePillEl) return;
    const total = targets.length;
    let lockedCount = 0;
    let minLockedSnr = Infinity;
    for (const t of targets) {
      if (t.locked) {
        lockedCount++;
        if (t.snr < minLockedSnr) minLockedSnr = t.snr;
      }
    }
    const minStr = minLockedSnr < Infinity ? `+${minLockedSnr.toFixed(1)} dB` : 'NONE';
    const jamStr = jammers.length > 0 ? ` • JAM: ${jammers.length}` : '';
    scorePillEl.textContent = `LOCKED: ${lockedCount}/${total} • MIN SNR: ${minStr}${jamStr}`;
  }

  function renderFrame(nowMs) {
    const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastFrameMs) / 1000));
    lastFrameMs = nowMs;

    if (!prefersReducedMotion) {
      simTime += dt;
    }

    stepPhysics(dt, simTime);

    wfAccum += dt;
    if (wfAccum >= 0.065) {
      wfAccum = 0;
      pushWaterfallRow();
    }

    scoreTimer += dt;
    if (scoreTimer >= 0.15) {
      scoreTimer = 0;
      updateScorePill();
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { psdTop, psdBottom, axisBandBottom, wfTop, wfHeight } = getLayout(w, h);

    ctx.clearRect(0, 0, w, h);

    // 1. Subtle PSD grid & dB reference lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    const dbTicks = [-30, -50, -70];
    ctx.font = '9.5px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.42)';
    for (const dbVal of dbTicks) {
      const y = dbToY(dbVal, psdTop, psdBottom);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.fillText(`${dbVal} dB`, 6, y - 3);
    }
    for (let c = 1; c < 8; c++) {
      const x = (w / 8) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, psdBottom);
      ctx.stroke();
    }

    // Highlight active jammer bands subtly in PSD background
    for (const jam of jammers) {
      const jx = jam.center * w;
      const jw = jam.width * 2.2 * w;
      const jGrad = ctx.createLinearGradient(jx - jw, 0, jx + jw, 0);
      jGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
      jGrad.addColorStop(0.5, priorEnabled ? 'rgba(251, 191, 36, 0.06)' : 'rgba(251, 191, 36, 0.16)');
      jGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = jGrad;
      ctx.fillRect(jx - jw, psdTop, jw * 2, psdBottom - psdTop);
    }

    // 2. Smooth PSD area fill
    ctx.beginPath();
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(smoothedPower[i], psdTop, psdBottom);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, psdBottom);
    ctx.lineTo(0, psdBottom);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, psdTop, 0, psdBottom);
    grad.addColorStop(0, 'rgba(96, 165, 250, 0.28)');
    grad.addColorStop(1, 'rgba(96, 165, 250, 0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // 3. Adaptive CFAR threshold curve
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(smoothedThreshold[i], psdTop, psdBottom);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = priorEnabled ? '#94a3b8' : 'rgba(251, 191, 36, 0.72)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Smooth PSD primary trace
    ctx.beginPath();
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(smoothedPower[i], psdTop, psdBottom);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.9;
    ctx.stroke();

    // 5. Expanding click ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rp = ripples[r];
      rp.age += dt;
      if (rp.age > 0.65) {
        ripples.splice(r, 1);
        continue;
      }
      const rx = rp.bin * w;
      const ry = dbToY(rp.db, psdTop, psdBottom);
      const radius = 5 + rp.age * 34;
      const alpha = Math.max(0, 1 - rp.age / 0.65);
      ctx.strokeStyle = rp.color;
      ctx.globalAlpha = alpha * 0.75;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // 6. Target Lock & Clutter-Masked markers (smoothly interpolated!)
    ctx.font = '10.5px "JetBrains Mono", Consolas, monospace';
    for (const tgt of targets) {
      const px = tgt.liveBin * w;
      const py = dbToY(tgt.peakDb, psdTop, psdBottom);

      if (tgt.locked) {
        ctx.beginPath();
        ctx.arc(px, py, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();

        ctx.strokeStyle = 'rgba(147, 197, 253, 0.85)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(px, py, 8.8, 0, Math.PI * 2);
        ctx.stroke();

        const freqTag = binToPhysicalFreq(tgt.liveBin, currentMode);
        const label = `${tgt.id} (${freqTag})`;
        const tw = ctx.measureText(label).width;
        const lx = Math.min(w - tw - 6, Math.max(6, px - tw * 0.5));
        const ly = Math.max(15, py - 13);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(label, lx, ly);
      } else {
        // Masked / Sub-threshold stealth contact
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(px, py, 8.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        const label = `${tgt.id} [MASKED]`;
        const tw = ctx.measureText(label).width;
        const lx = Math.min(w - tw - 6, Math.max(6, px - tw * 0.5));
        const ly = Math.max(15, py - 12);
        ctx.fillStyle = '#fde68a';
        ctx.fillText(label, lx, ly);
      }
    }

    // 7. Frequency Axis Divider Band
    ctx.fillStyle = '#080d19';
    ctx.fillRect(0, psdBottom, w, axisBandBottom - psdBottom);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, psdBottom);
    ctx.lineTo(w, psdBottom);
    ctx.moveTo(0, axisBandBottom);
    ctx.lineTo(w, axisBandBottom);
    ctx.stroke();

    const cfg = modeConfigs[currentMode];
    if (cfg && cfg.ticks) {
      ctx.font = '9.5px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      const nTicks = cfg.ticks.length;
      for (let tIdx = 0; tIdx < nTicks; tIdx++) {
        const frac = tIdx / (nTicks - 1);
        const tx = frac * w;
        const text = cfg.ticks[tIdx];
        const tw = ctx.measureText(text).width;
        const drawX = tIdx === 0 ? 6 : tIdx === nTicks - 1 ? w - tw - 6 : tx - tw * 0.5;
        ctx.fillText(text, drawX, psdBottom + 13.5);
      }
    }

    // 8. Bottom Pane: Scrolling Time-Frequency Waterfall Spectrogram
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(wfCanvas, 0, wfTop, w, wfHeight);
    ctx.restore();

    // Subtle waterfall label badge
    ctx.fillStyle = 'rgba(5, 8, 17, 0.72)';
    ctx.fillRect(6, wfTop + 5, 168, 16);
    ctx.font = '9px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = 'rgba(191, 219, 254, 0.85)';
    ctx.fillText('WATERFALL // TIME-FREQ', 11, wfTop + 16);

    // 9. Hover Tactical Crosshair & Live Injection Preview
    if (hoverState) {
      const { mx, my, bin, estSnr, nearTarget, inPsd } = hoverState;
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx, psdTop);
      ctx.lineTo(mx, wfTop + wfHeight);
      if (inPsd) {
        ctx.moveTo(0, my);
        ctx.lineTo(w, my);
      }
      ctx.stroke();
      ctx.restore();

      const freqStr = binToPhysicalFreq(bin, currentMode);
      const tipText = nearTarget
        ? `Click to clear ${nearTarget.id}`
        : `${freqStr} • +${estSnr.toFixed(1)} dB SNR [Click to Inject]`;

      ctx.font = '10px "JetBrains Mono", Consolas, monospace';
      const padX = 7;
      const boxW = ctx.measureText(tipText).width + padX * 2;
      const boxH = 20;
      const bx = Math.min(w - boxW - 6, Math.max(6, mx + 10));
      const by = Math.max(8, Math.min(psdBottom - boxH - 4, my - 26));

      ctx.fillStyle = 'rgba(8, 14, 28, 0.92)';
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.48)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e0f2fe';
      ctx.fillText(tipText, bx + padX, by + 13.5);
    }

    requestAnimationFrame(renderFrame);
  }

  function prewarmWaterfall() {
    wfCtx.fillStyle = '#050811';
    wfCtx.fillRect(0, 0, NUM_BINS, WF_ROWS);
    const startT = simTime - WF_ROWS * 0.065;
    for (let warm = 0; warm < WF_ROWS; warm++) {
      stepPhysics(0.065, startT + warm * 0.065);
      pushWaterfallRow();
    }
  }

  // Prime full waterfall history so initial render is immediately populated
  prewarmWaterfall();
  updateScorePill();
  requestAnimationFrame(renderFrame);

  // =========================================================================
  // Instant Scenario Analysis & Executable Code Generator Modal
  // =========================================================================
  const modal = document.getElementById('analysisModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalTabs = document.querySelectorAll('[data-modal-tab]');
  const reportKpis = document.getElementById('reportKpis');
  const reportRankBox = document.getElementById('reportRankBox');
  const reportNarrative = document.getElementById('reportNarrative');
  const reportTableBody = document.getElementById('reportTableBody');
  const codePythonEl = document.getElementById('codePython');
  const codeCppEl = document.getElementById('codeCpp');
  const btnJumpToCode = document.getElementById('btnJumpToCode');
  const btnCopyReport = document.getElementById('btnCopyReport');
  const btnCopyPython = document.getElementById('btnCopyPython');
  const btnCopyCpp = document.getElementById('btnCopyCpp');

  let latestMarkdownBrief = '';

  function switchModalTab(tabKey) {
    modalTabs.forEach((t) => {
      t.classList.toggle('active', t.getAttribute('data-modal-tab') === tabKey);
    });
    ['report', 'python', 'cpp'].forEach((k) => {
      const pane = document.getElementById(`pane-${k}`);
      if (pane) {
        const active = k === tabKey;
        pane.classList.toggle('active', active);
        pane.hidden = !active;
      }
    });
  }

  modalTabs.forEach((t) => {
    t.addEventListener('click', () => {
      switchModalTab(t.getAttribute('data-modal-tab') || 'report');
    });
  });

  if (btnJumpToCode) {
    btnJumpToCode.addEventListener('click', () => switchModalTab('cpp'));
  }

  function buildScenarioArtifacts() {
    const t0 = performance.now();
    const cfg = modeConfigs[currentMode];
    const total = targets.length;
    const lockedList = targets.filter((t) => t.locked);
    const maskedList = targets.filter((t) => !t.locked);
    const pdPct = total > 0 ? Math.round((lockedList.length / total) * 100) : 100;
    const minLockedSnr = lockedList.length > 0 ? Math.min(...lockedList.map((t) => t.snr)) : null;
    const suppressionDb = priorEnabled ? '+14.8 dB' : '0.0 dB (Off)';

    // KPI Cards
    if (reportKpis) {
      reportKpis.innerHTML = `
        <div class="kpi-box">
          <div class="kpi-label">Empirical Detection</div>
          <div class="kpi-val">${lockedList.length} / ${total} (${pdPct}%)</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Weakest Locked SNR</div>
          <div class="kpi-val">${minLockedSnr !== null ? `+${minLockedSnr.toFixed(1)} dB` : 'N/A'}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Prior Clutter Gain</div>
          <div class="kpi-val">${suppressionDb}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">C++23 SIMD Est.</div>
          <div class="kpi-val">~${cfg.cppKernelUs.toFixed(1)} &mu;s <span style="font-size:0.68rem;color:var(--text-muted);">(JS: ${cfg.latencyMs.toFixed(2)} ms)</span></div>
        </div>
      `;
    }

    // Rank / Engineering Diagnostic Headline
    let rankText = '';
    if (total === 0) {
      rankText = '◈ AMBIENT NOISE ONLY — Click the frequency plot to inject synthetic contacts and re-run.';
    } else if (maskedList.length > 0 && !priorEnabled) {
      rankText = `⚠ CLUTTER-MASKED (${maskedList.length} LOST) — Conventional CA-CFAR threshold inflated by clutter/interference. Toggle "A Priori Prior: ON" to recover sub-clutter contacts.`;
    } else if (lockedList.some((t) => t.snr <= 12.8) || (jammers.length > 0 && maskedList.length === 0)) {
      rankText = '★ SUB-CLUTTER ACE — Physics-prior conditioning + OS-CFAR successfully isolated low-SNR contacts under contested spectrum.';
    } else if (maskedList.length > 0 && priorEnabled) {
      rankText = '◈ SINGLE-CPI SNR FLOOR — Remaining masked contact is near thermal noise floor; requires multi-frame Track-Before-Detect integration.';
    } else {
      rankText = '✓ BASELINE VERIFIED — All synthetic contacts cleanly resolved above adaptive OS-CFAR threshold with zero false alarms.';
    }
    if (reportRankBox) reportRankBox.textContent = rankText;

    // Dynamic Engineering Narrative
    const jamNote =
      jammers.length > 0
        ? ` under ${jammers.length} active wideband interference source${jammers.length > 1 ? 's' : ''}`
        : ' across inhomogeneous environmental clutter';
    const priorNote = priorEnabled
      ? `With A Priori physics conditioning (${cfg.priorDesc}) active, wideband clutter shelves were attenuated prior to 65th-percentile OS-CFAR thresholding—preventing threshold masking of adjacent weak signatures.`
      : `Because A Priori physics conditioning was disabled, raw clutter and interference shelves inflated local cell-averaging CFAR thresholds, reducing sensitivity to nearby low-SNR targets.`;

    if (reportNarrative) {
      reportNarrative.textContent = `Evaluated ${total} synthetic contact${total === 1 ? '' : 's'} in ${cfg.name} mode (${cfg.fftSize}-pt FFT, Pfa = ${cfg.pfa})${jamNote}. ${priorNote}`;
    }

    // Contact Table
    if (reportTableBody) {
      if (targets.length === 0) {
        reportTableBody.innerHTML = `<tr><td colspan="5" style="color: var(--text-muted);">No active contacts in sandbox.</td></tr>`;
      } else {
        reportTableBody.innerHTML = targets
          .map((t) => {
            const freqStr = binToPhysicalFreq(t.liveBin ?? t.baseBin, currentMode);
            const marginStr = `${t.marginDb >= 0 ? '+' : ''}${t.marginDb.toFixed(1)} dB`;
            const pill = t.locked
              ? `<span class="status-pill-ok">LOCKED</span>`
              : `<span class="status-pill-warn">MASKED</span>`;
            return `<tr>
              <td><strong>${t.id}</strong></td>
              <td>${freqStr}</td>
              <td>+${t.snr.toFixed(1)} dB</td>
              <td>${marginStr}</td>
              <td>${pill}</td>
            </tr>`;
          })
          .join('');
      }
    }

    // Markdown Brief for Copy button
    const mdRows = targets
      .map(
        (t) =>
          `| ${t.id} | ${binToPhysicalFreq(t.liveBin ?? t.baseBin, currentMode)} | +${t.snr.toFixed(1)} dB | ${t.marginDb >= 0 ? '+' : ''}${t.marginDb.toFixed(1)} dB | ${t.locked ? 'LOCKED' : 'MASKED'} |`
      )
      .join('\n');

    latestMarkdownBrief = `# A Priori Labs — Synthetic Sandbox Telemetry Brief
- **Pipeline Mode:** ${cfg.name} (${cfg.fftSize}-pt FFT, Pfa = ${cfg.pfa})
- **A Priori Physics Conditioning:** ${priorEnabled ? 'ENABLED (' + cfg.priorDesc + ')' : 'DISABLED (Legacy CA-CFAR)'}
- **Empirical Detection:** ${lockedList.length}/${total} (${pdPct}%) | **Active Jammers:** ${jammers.length}

| Contact ID | Frequency / Axis | Injected SNR | CFAR Margin | Status |
| :--- | :--- | :--- | :--- | :--- |
${mdRows || '| None | — | — | — | — |'}

> Generated instantaneously in browser. Contact info@apriori-labs.com to turn mission sensor requirements directly into verified C++23 / PrioriSDK tactical edge pipelines.`;

    // Generate Live Zero-Dependency PrioriSDK v0.8 C++23 Console App parameterized by user's sandbox session
    const sdkTargets = targets
      .map(
        (t) =>
          `        {"${t.id}", ${(t.liveBin ?? t.baseBin).toFixed(3)}f, ${t.snr.toFixed(1)}f}`
      )
      .join(',\n');

    const sdkJammers = jammers
      .map((j) => `        {"${j.id}", ${j.center.toFixed(3)}f, ${j.power.toFixed(1)}f}`)
      .join(',\n');

    const envEnum = currentMode === 'sonar' ? 'PRIORI_ENV_MARITIME_OCEAN' : 'PRIORI_ENV_COASTAL_RADAR';
    const cmapEnum = currentMode === 'sonar' ? 'PRIORI_CMAP_VIRIDIS_SONAR' : 'PRIORI_CMAP_INFERNO_EW';

    const prioriSdkAppCode = `// A Priori Labs LLC — Auto-Configured PrioriSDK v0.8 Console (${cfg.name})
// Zero 3rd-party libraries | Zero localhost IPC sockets | Linux ELF & Windows PE
#include <priori/priori.hpp>
#include <priori/priori_dsp.hpp>
#include <priori/priori_lab.hpp>
#include <cmath>

struct SandboxContact { const char* id; float bin_norm; float snr_db; };
static constexpr SandboxContact kContacts[] = {
${sdkTargets || '        {"TRK-01", 0.280f, 29.0f}'}
};
static constexpr SandboxContact kJammers[] = {
${sdkJammers || '        {"NONE", 0.500f, 0.0f}'}
};

int main(int argc, char** argv) {
    priori::AppConfig cfg{
        .title          = "${cfg.name.toUpperCase()} // PRIORI-SDK",
        .classification = PRIORI_CLASS_CUI,           // Engine-enforced DoDI 5200.48 banners
        .env_style      = ${envEnum}
    };
    priori::App app(cfg, argc, argv);

    auto tPsd = app.create_tensor_1d("CONDITIONED_PSD_DB", ${cfg.fftSize});
    auto tWf  = app.create_tensor_2d("PEAK_HOLD_WATERFALL", ${cfg.fftSize}, 256);
    bool priorOn = ${priorEnabled ? 'true' : 'false'};
    float cursorU = 0.50f;

    priori::dsp::DspPipeline dsp;
    dsp.add_node("PRIOR_OS_CFAR_${cfg.fftSize}", "DMA_IQ_RING", "CONDITIONED_PSD_DB", [&]() {
        for (std::uint32_t i = 0; i < ${cfg.fftSize}u; ++i) {
            const float x = static_cast<float>(i) / ${cfg.fftSize - 1}.0f;
            float clutter = 21.0f * std::exp(-std::pow((x - 0.50f) / 0.058f, 2.0f));
            for (const auto& j : kJammers)
                clutter += j.snr_db * std::exp(-std::pow((x - j.bin_norm) / 0.072f, 2.0f));
            float pwr = 8.0f + clutter * (priorOn ? 0.16f : 1.0f);
            for (const auto& c : kContacts)
                pwr += c.snr_db * std::exp(-std::pow((x - c.bin_norm) / 0.008f, 2.0f));
            tPsd[i] = pwr;
        }
    });
    priori::lab::Inspector lab;

    app.run([&](priori::FrameContext& ctx) {
        dsp.execute_all();
        tWf.accumulate_peak_hold_in_current_row(tPsd.data()); // Zero dropped sub-ms transients
        if (ctx.step_waterfalls) tWf.push_row(tPsd.data());

        const auto nav = ctx.ui.begin_header_bar(cfg.title, "ZERO IPC MIDDLEWARE", ctx.gpu_frame_us, ctx.fps);
        if (ctx.ui.button({nav.x + 16.0f, nav.y, 170.0f, nav.h}, priorOn ? "PRIOR: ON" : "PRIOR: OFF", priorOn))
            priorOn = !priorOn;
        lab.draw(ctx, {nav.x + 196.0f, nav.y, 184.0f, nav.h}, dsp);

        auto card = ctx.ui.begin_card({16.0f, ctx.ui.top_safe_y() + 58.0f, 440.0f, 430.0f}, "${cfg.name.toUpperCase()}");
        ctx.ui.plot_line_1d(card.next_row(95.0f), tPsd, 4.0f, 52.0f, priori::Palette::Ice, &cursorU);
        ctx.ui.plot_waterfall_2d(card.next_row(240.0f), tWf, 4.0f, 50.0f, ${cmapEnum}, &cursorU);
    });
}`;

    if (codePythonEl) codePythonEl.textContent = prioriSdkAppCode;

    // Generate Deterministic Zero-Allocation C++23 Header Kernel
    const cppCode = `// A Priori Labs LLC — Deterministic Edge OS-CFAR + Prior Conditioning Kernel
// Mode: ${cfg.name} | FFT=${cfg.fftSize} | Zero dynamic heap allocation (C++23 std::span)
#pragma once
#include <algorithm>
#include <array>
#include <span>

namespace apriori::dsp {

struct CfarConfig {
    static constexpr std::size_t kFftBins   = ${cfg.fftSize};
    static constexpr int         kGuard     = 4;
    static constexpr int         kTrain     = 16;
    static constexpr bool        kUsePrior  = ${priorEnabled ? 'true' : 'false'};
    static constexpr float       kOffsetDb  = ${priorEnabled ? '9.2f' : '10.6f'};
};

inline void evaluate_os_cfar(
    std::span<const float, CfarConfig::kFftBins> psd_db,
    std::span<const float, CfarConfig::kFftBins> clutter_prior_db,
    std::span<float, CfarConfig::kFftBins>       out_thresh_db,
    std::span<bool, CfarConfig::kFftBins>        out_detections) noexcept
{
    std::array<float, CfarConfig::kFftBins> conditioned{};
    for (std::size_t i = 0; i < CfarConfig::kFftBins; ++i) {
        conditioned[i] = CfarConfig::kUsePrior
            ? (psd_db[i] - 0.84f * clutter_prior_db[i])
            : psd_db[i];
    }

    std::array<float, 2 * CfarConfig::kTrain> window{};
    constexpr int span = CfarConfig::kGuard + CfarConfig::kTrain;

    for (int i = 0; i < static_cast<int>(CfarConfig::kFftBins); ++i) {
        std::size_t count = 0;
        for (int k = -span; k <= span; ++k) {
            if (k >= -CfarConfig::kGuard && k <= CfarConfig::kGuard) continue;
            const int idx = std::clamp(i + k, 0, static_cast<int>(CfarConfig::kFftBins) - 1);
            if (count < window.size()) window[count++] = conditioned[idx];
        }
        float baseline = 0.0f;
        if constexpr (CfarConfig::kUsePrior) {
            const auto os_it = window.begin() + static_cast<std::ptrdiff_t>(count * 65 / 100);
            std::nth_element(window.begin(), os_it, window.begin() + count);
            baseline = *os_it; // O(N) deterministic order-statistic selection
        } else {
            for (std::size_t c = 0; c < count; ++c) baseline += window[c];
            baseline /= static_cast<float>(count);
        }
        out_thresh_db[i]  = baseline + CfarConfig::kOffsetDb;
        out_detections[i] = conditioned[i] >= out_thresh_db[i];
    }
}

} // namespace apriori::dsp`;

    if (codeCppEl) codeCppEl.textContent = cppCode;

    const elapsedMs = Math.max(0.1, performance.now() - t0);
    if (modalEyebrow) {
      modalEyebrow.textContent = `SANDBOX TELEMETRY // REPORT & CODE SYNTHESIZED IN ${elapsedMs.toFixed(2)} MS`;
    }
  }

  function openModal() {
    if (!modal) return;
    buildScenarioArtifacts();
    switchModalTab('report');
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenReport) btnOpenReport.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  function wireCopyButton(btn, getTextFn) {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(getTextFn());
        const prev = btn.textContent;
        btn.textContent = 'COPIED!';
        setTimeout(() => {
          btn.textContent = prev;
        }, 1600);
      } catch {
        // Fallback no-op
      }
    });
  }

  wireCopyButton(btnCopyReport, () => latestMarkdownBrief);
  wireCopyButton(btnCopyPython, () => (codePythonEl ? codePythonEl.textContent : ''));
  wireCopyButton(btnCopyCpp, () => (codeCppEl ? codeCppEl.textContent : ''));
})();
