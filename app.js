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
      } catch {}
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
      } catch {}
    });
  }

  // =========================================================================
  // Universal Interactive SDK Request & Contracting Inquiry Modal
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
  // PrioriEngine C++23 WASM Mini-Console (priori_core.wasm + Zero-Copy Arena)
  // =========================================================================
  const canvas = document.getElementById('dspCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const panelEl = canvas.closest('.dsp-panel');
  const readoutEl = document.getElementById('dspReadout');
  const scorePillEl = document.getElementById('dspScorePill');
  const modeTabs = document.querySelectorAll('.dsp-tab[data-mode]');

  const btnEngineInfo = document.getElementById('btnEngineInfo');
  const btnCloseEngineInfo = document.getElementById('btnCloseEngineInfo');
  const consoleInfoPopover = document.getElementById('consoleInfoPopover');

  const btnSpawnStealth = document.getElementById('btnSpawnStealth');
  const btnSpawnJammer = document.getElementById('btnSpawnJammer');
  const btnTrackerCycle = document.getElementById('btnTrackerCycle');
  const btnPriorToggle = document.getElementById('btnPriorToggle');
  const btnResetSim = document.getElementById('btnResetSim');
  const btnConsoleTheme = document.getElementById('btnConsoleTheme');
  const btnOpenReport = document.getElementById('btnOpenReport');

  if (btnEngineInfo && consoleInfoPopover) {
    btnEngineInfo.addEventListener('click', () => {
      const nextOpen = consoleInfoPopover.hidden;
      consoleInfoPopover.hidden = !nextOpen;
      btnEngineInfo.classList.toggle('active', nextOpen);
      btnEngineInfo.setAttribute('aria-expanded', String(nextOpen));
    });
  }
  if (btnCloseEngineInfo && consoleInfoPopover) {
    btnCloseEngineInfo.addEventListener('click', () => {
      consoleInfoPopover.hidden = true;
      if (btnEngineInfo) {
        btnEngineInfo.classList.remove('active');
        btnEngineInfo.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const NUM_BINS = 192;
  const MIN_DB = -88;
  const MAX_DB = -14;
  const WF_ROWS = 78;

  const wfCanvas = document.createElement('canvas');
  wfCanvas.width = NUM_BINS;
  wfCanvas.height = WF_ROWS;
  const wfCtx = wfCanvas.getContext('2d');
  const wfRowImg = wfCtx.createImageData(NUM_BINS, 1);

  const trackerAlgos = [
    {
      id: 0,
      short: 'IMM-EKF',
      label: 'Tracker: IMM-EKF',
      cppName: 'ImmManeuverTracker',
      desc: '2-Model IMM-EKF (Constant-Velocity + Coordinated-Turn model switching)'
    },
    {
      id: 1,
      short: 'Kalman-CV',
      label: 'Tracker: Kalman',
      cppName: 'LinearKalmanTracker',
      desc: 'Single-Model Constant-Velocity Kalman Filter (lags on 5.5G turns)'
    },
    {
      id: 2,
      short: 'Basic α-β',
      label: 'Tracker: Basic α-β',
      cppName: 'AlphaBetaGateTracker',
      desc: 'Fixed-gain alpha-beta tracker with 38m gate (breaks lock & coasts in sharp turns)'
    }
  ];

  // Calm, realistic target angular rates (~0.29 - 0.34 rad/s -> ~20s per full figure-8 circuit!)
  // Staggered phases so at least one target is always entering or exiting a sharp 5.5G turn!
  const modeConfigs = {
    radar: {
      modeId: 0,
      name: 'Coastal Pulse-Doppler Radar',
      theaterBadge: '3D WGS84 COASTAL VALLEY // C++23 WASM TRACKER',
      fftSize: 1024,
      pfa: '1e-5',
      axisMin: -450,
      axisMax: 450,
      axisUnit: 'Hz',
      ticks: ['-450 Hz', '-225 Hz', '0 Hz (Clutter)', '+225 Hz', '+450 Hz'],
      priorDesc: 'Zero-Doppler MTI clutter notch + adaptive MVDR sidelobe nulling',
      defaultTargets: [
        { id: 'UAV-01', cx: -0.34, cz: 0.56, rx: 0.30, rz: 0.17, omega: 0.33, phase: 0.65, alt: 0.24, snr: 27.5 },
        { id: 'HSM-02', cx: 0.33, cz: 0.65, rx: 0.28, rz: 0.18, omega: -0.36, phase: 2.25, alt: 0.30, snr: 21.0 }
      ]
    },
    sonar: {
      modeId: 1,
      name: 'Subsea Canyon Passive/Active Sonar',
      theaterBadge: '3D BATHYMETRY // HYDROPHONE ARRAY + TRACKER',
      fftSize: 2048,
      pfa: '1e-4',
      axisMin: 0,
      axisMax: 1600,
      axisUnit: 'Hz',
      ticks: ['0 Hz', '400 Hz', '800 Hz', '1.2 kHz', '1.6 kHz'],
      priorDesc: 'Split-Step PE waveguide clutter subtraction + reverberation whitening',
      defaultTargets: [
        { id: 'UUV-01', cx: -0.30, cz: 0.52, rx: 0.27, rz: 0.16, omega: 0.27, phase: 0.80, alt: 0.16, snr: 24.5 },
        { id: 'SUB-02', cx: 0.32, cz: 0.68, rx: 0.26, rz: 0.16, omega: -0.29, phase: 2.35, alt: 0.13, snr: 18.0 }
      ]
    },
    diag: {
      modeId: 2,
      name: 'Passive RF TDOA & Emitter Watchdog',
      theaterBadge: '3D RF RIDGE // MULTI-SITE TDOA + SPECTRUM',
      fftSize: 1024,
      pfa: '1e-5',
      axisMin: 2400,
      axisMax: 2500,
      axisUnit: 'MHz',
      ticks: ['2400 MHz', '2425 MHz', '2450 MHz', '2475 MHz', '2500 MHz'],
      priorDesc: 'Co-channel wideband interference excision + TDOA multipath gating',
      defaultTargets: [
        { id: 'EMT-01', cx: -0.32, cz: 0.58, rx: 0.29, rz: 0.17, omega: 0.31, phase: 0.72, alt: 0.22, snr: 26.0 },
        { id: 'LPI-02', cx: 0.34, cz: 0.55, rx: 0.27, rz: 0.17, omega: -0.34, phase: 2.30, alt: 0.20, snr: 15.5 }
      ]
    }
  };

  let currentMode = 'radar';
  let trackerIdx = 0;
  let priorEnabled = true;
  let isDaylight = false;
  let targets = [];
  let jammers = [];
  let synCounter = 3;
  let jamCounter = 1;
  let hoverInfo = null;
  let simTime = 8.0;
  let lastFrameTs = performance.now();
  let wfAccum = 0;
  let lastWasmStepUs = 8.4;

  // Compiled C++23 PrioriCore WebAssembly State & Zero-Copy Tensor Views
  let wasmApi = null;
  let wasmPsdView = new Float32Array(NUM_BINS).fill(-75);
  let wasmThreshView = new Float32Array(NUM_BINS).fill(-64);
  let wasmTracksView = null;

  function syncAllToWasm() {
    if (!wasmApi) return;
    wasmApi.priori_clear_all();
    targets.forEach((t, idx) => {
      if (idx < 8) {
        wasmApi.priori_set_track(idx, 1, t.cx, t.cz, t.rx, t.rz, t.omega, t.phase, t.alt, t.snr, simTime);
      }
    });
    jammers.forEach((j, idx) => {
      if (idx < 2) {
        wasmApi.priori_set_jammer(idx, 1, j.az, j.center, j.width, j.power);
      }
    });
  }

  async function loadPrioriWasm() {
    try {
      const resp = await fetch('assets/priori_core.wasm');
      const bytes = await resp.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, {});
      const exp = instance.exports;
      wasmApi = exp;
      const buf = exp.memory.buffer;
      wasmPsdView = new Float32Array(buf, exp.priori_get_psd_ptr(), NUM_BINS);
      wasmThreshView = new Float32Array(buf, exp.priori_get_thresh_ptr(), NUM_BINS);
      wasmTracksView = new Float32Array(buf, exp.priori_get_tracks_ptr(), 8 * 14);
      syncAllToWasm();
      prewarmSimulation();
      updateReadoutBar();
      updateScorePill();
    } catch {
      // Graceful fallback if local file:// blocks fetch
    }
  }

  function terrainHeight(nx, nz, mode) {
    if (mode === 'sonar') {
      const canyon = -0.11 * Math.exp(-Math.pow(nx / 0.34, 2));
      const shelf = 0.08 * Math.pow(Math.abs(nx), 1.4) + 0.03 * Math.sin(nx * 5.0 + nz * 4.0);
      return Math.max(-0.12, canyon + shelf);
    }
    const flank = 0.14 * Math.pow(Math.abs(nx), 1.65) * (0.65 + 0.35 * nz);
    const ripples = 0.032 * Math.sin(nx * 6.2 + 0.5) * Math.cos(nz * 5.4);
    return flank + ripples;
  }

  function makeTarget(spec) {
    const x0 = spec.cx + spec.rx * Math.sin(spec.phase);
    const z0 = spec.cz + spec.rz * Math.sin(spec.phase * 2.0);
    return {
      ...spec,
      x: x0,
      z: z0,
      estX: x0,
      estZ: z0,
      estVx: 0,
      estVz: 0,
      errMeters: 3.0,
      liveBin: 0.5,
      status: 1, // 1 = LOCKED (Green), 2 = TURN LAG (Amber), 0 = LOST LOCK (Red)
      turnG: 1.2,
      immProb: 0.1,
      peakDb: -48,
      threshDb: -62,
      marginDb: 14,
      locked: true,
      trail: [],
      estTrail: []
    };
  }

  function cloneDefaults(mode) {
    const cfg = modeConfigs[mode] || modeConfigs.radar;
    targets = cfg.defaultTargets.map(makeTarget);
    jammers = [];
    synCounter = 3;
    jamCounter = 1;
    syncAllToWasm();
  }

  function binToPhysicalFreq(bin, mode) {
    const cfg = modeConfigs[mode] || modeConfigs.radar;
    const val = cfg.axisMin + bin * (cfg.axisMax - cfg.axisMin);
    if (cfg.axisUnit === 'Hz' && cfg.axisMin < 0) {
      return `${val >= 0 ? '+' : ''}${Math.round(val)} Hz`;
    }
    return `${Math.round(val)} ${cfg.axisUnit}`;
  }

  function updateReadoutBar() {
    const trk = trackerAlgos[trackerIdx];
    if (!readoutEl) return;
    const priorTag = priorEnabled ? 'PRIOR: ON' : 'PRIOR: OFF';
    const engineTag = wasmApi
      ? `C++23 WASM (7.0 KB): ${lastWasmStepUs.toFixed(1)} µs/step`
      : `LOADING C++23 WASM...`;
    readoutEl.textContent = `${engineTag} // ${trk.short} + 192-BIN OS-CFAR (${priorTag}) // ZERO-COPY ARENA`;
  }

  function updateScorePill() {
    if (!scorePillEl) return;
    const trk = trackerAlgos[trackerIdx];
    scorePillEl.classList.remove('pill-ok', 'pill-warn', 'pill-lost');

    if (targets.length === 0) {
      scorePillEl.textContent = '0 TRACKS • CLICK 3D MAP TO SPAWN';
      return;
    }

    const lostCount = targets.filter((t) => t.status === 0).length;
    const lagCount = targets.filter((t) => t.status === 2).length;
    const holdCount = targets.filter((t) => t.status === 1).length;
    const meanErr =
      targets.reduce((acc, t) => acc + (t.errMeters || 3.0), 0) / Math.max(1, targets.length);

    if (lostCount > 0) {
      scorePillEl.classList.add('pill-lost');
      scorePillEl.textContent = `✕ TRACK LOST (${lostCount}/${targets.length} BROKEN GATE) • ${trk.short}`;
    } else if (lagCount > 0) {
      scorePillEl.classList.add('pill-warn');
      scorePillEl.textContent = `⚠ TURN LAG (${meanErr.toFixed(0)}m ERR) • ${trk.short}`;
    } else {
      scorePillEl.classList.add('pill-ok');
      scorePillEl.textContent = `✓ ${holdCount}/${targets.length} HOLDING TRACK • ${trk.short} (${meanErr.toFixed(1)}m)`;
    }
  }

  cloneDefaults(currentMode);
  loadPrioriWasm();

  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modeTabs.forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.getAttribute('data-mode') || 'radar';
      cloneDefaults(currentMode);
      prewarmSimulation();
      updateReadoutBar();
      updateScorePill();
    });
  });

  if (btnTrackerCycle) {
    btnTrackerCycle.addEventListener('click', () => {
      trackerIdx = (trackerIdx + 1) % trackerAlgos.length;
      btnTrackerCycle.textContent = trackerAlgos[trackerIdx].label;
      btnTrackerCycle.classList.toggle('active', trackerIdx === 0);
      updateReadoutBar();
      updateScorePill();
    });
  }

  if (btnPriorToggle) {
    btnPriorToggle.addEventListener('click', () => {
      priorEnabled = !priorEnabled;
      btnPriorToggle.classList.toggle('active', priorEnabled);
      btnPriorToggle.setAttribute('aria-pressed', String(priorEnabled));
      btnPriorToggle.textContent = priorEnabled ? 'Prior: ON' : 'Prior: OFF';
      updateReadoutBar();
    });
  }

  if (btnConsoleTheme) {
    btnConsoleTheme.addEventListener('click', () => {
      isDaylight = !isDaylight;
      if (panelEl) panelEl.classList.toggle('theme-daylight', isDaylight);
      btnConsoleTheme.textContent = isDaylight ? '☾ Dark CIC' : '☀ Daylight';
      prewarmSimulation();
    });
  }

  if (btnSpawnStealth) {
    btnSpawnStealth.addEventListener('click', () => {
      if (targets.length >= 6) targets.shift();
      const cx = (Math.random() - 0.5) * 0.72;
      const cz = 0.42 + Math.random() * 0.34;
      const snr = +(13.5 + Math.random() * 6.0).toFixed(1);
      targets.push(
        makeTarget({
          id: `MNV-0${synCounter++}`,
          cx,
          cz,
          rx: 0.27,
          rz: 0.16,
          omega: (Math.random() < 0.5 ? 1 : -1) * (0.31 + Math.random() * 0.06),
          phase: 0.75 + Math.random() * 1.5,
          alt: 0.19 + Math.random() * 0.12,
          snr
        })
      );
      syncAllToWasm();
      updateScorePill();
    });
  }

  if (btnSpawnJammer) {
    btnSpawnJammer.addEventListener('click', () => {
      if (jammers.length >= 2) jammers.shift();
      const anchor = targets[targets.length - 1];
      const az = anchor ? anchor.x / (anchor.z + 0.28) : 0.25;
      const centerBin = anchor ? Math.min(0.85, Math.max(0.15, anchor.liveBin + 0.02)) : 0.42;
      jammers.push({
        id: `JAM-0${jamCounter++}`,
        az,
        center: centerBin,
        width: 0.085,
        power: 22.5
      });
      syncAllToWasm();
    });
  }

  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      trackerIdx = 0;
      priorEnabled = true;
      if (btnTrackerCycle) {
        btnTrackerCycle.textContent = trackerAlgos[0].label;
        btnTrackerCycle.classList.add('active');
      }
      if (btnPriorToggle) {
        btnPriorToggle.classList.add('active');
        btnPriorToggle.setAttribute('aria-pressed', 'true');
        btnPriorToggle.textContent = 'Prior: ON';
      }
      cloneDefaults(currentMode);
      prewarmSimulation();
      updateReadoutBar();
      updateScorePill();
    });
  }

  function project3D(nx, nz, ny, w, theaterH) {
    const depth = 0.62 + nz * 0.88;
    const persp = 1.0 / depth;
    const sx = w * 0.5 + nx * w * 0.46 * persp;
    const horizonY = theaterH * 0.17;
    const groundSpan = theaterH * 0.78;
    const sy = horizonY + (1.0 - nz * 0.84) * groundSpan * 0.88 - ny * theaterH * 0.46 * persp;
    return { sx, sy, scale: persp };
  }

  function unprojectToGround(sx, sy, w, theaterH) {
    const horizonY = theaterH * 0.17;
    const groundSpan = theaterH * 0.78;
    const normY = (sy - horizonY) / (groundSpan * 0.88);
    const nz = Math.max(0.24, Math.min(0.86, (1.0 - normY) / 0.84));
    const depth = 0.62 + nz * 0.88;
    const nx = Math.max(-0.78, Math.min(0.78, ((sx - w * 0.5) * depth) / (w * 0.46)));
    return { nx, nz };
  }

  function stepEngineFrame(dt, t) {
    const cfg = modeConfigs[currentMode] || modeConfigs.radar;
    const trk = trackerAlgos[trackerIdx];

    if (wasmApi && wasmTracksView) {
      const t0 = performance.now();
      wasmApi.priori_step_frame(dt, t, cfg.modeId, trk.id, priorEnabled ? 1 : 0);
      const stepUs = (performance.now() - t0) * 1000.0;
      lastWasmStepUs = lastWasmStepUs * 0.9 + Math.max(2.4, stepUs) * 0.1;

      // Read zero-copy C++23 Track Export Arena directly!
      for (let i = 0; i < targets.length && i < 8; i++) {
        const base = i * 14;
        if (wasmTracksView[base] < 0.5) continue;
        const tgt = targets[i];
        tgt.x = wasmTracksView[base + 1];
        tgt.z = wasmTracksView[base + 2];
        tgt.estX = wasmTracksView[base + 3];
        tgt.estZ = wasmTracksView[base + 4];
        tgt.estVx = wasmTracksView[base + 5];
        tgt.estVz = wasmTracksView[base + 6];
        tgt.errMeters = wasmTracksView[base + 8];
        tgt.liveBin = wasmTracksView[base + 9];
        tgt.status = Math.round(wasmTracksView[base + 10]);
        tgt.turnG = wasmTracksView[base + 11];
        tgt.immProb = wasmTracksView[base + 12];

        const bIdx = Math.max(0, Math.min(NUM_BINS - 1, Math.round(tgt.liveBin * (NUM_BINS - 1))));
        tgt.peakDb = wasmPsdView[bIdx];
        tgt.threshDb = wasmThreshView[bIdx];
        tgt.marginDb = tgt.peakDb - tgt.threshDb;
        tgt.locked = tgt.status !== 0;
      }
    }
  }

  function recordTrails() {
    for (const tgt of targets) {
      tgt.trail.push({ x: tgt.x, z: tgt.z });
      tgt.estTrail.push({ x: tgt.estX, z: tgt.estZ, status: tgt.status });
      if (tgt.trail.length > 42) tgt.trail.shift();
      if (tgt.estTrail.length > 42) tgt.estTrail.shift();
    }
  }

  function pushWaterfallRow() {
    wfCtx.drawImage(wfCanvas, 0, 0, NUM_BINS, WF_ROWS - 1, 0, 1, NUM_BINS, WF_ROWS - 1);
    const data = wfRowImg.data;
    for (let i = 0; i < NUM_BINS; i++) {
      const norm = Math.max(0, Math.min(1, (wasmPsdView[i] - -82) / 54));
      let r, g, b;
      if (isDaylight) {
        if (norm < 0.45) {
          const u = norm / 0.45;
          r = Math.round(234 - u * 185);
          g = Math.round(240 - u * 115);
          b = Math.round(248 - u * 35);
        } else {
          const u = (norm - 0.45) / 0.55;
          r = Math.round(49 + u * 171);
          g = Math.round(125 - u * 97);
          b = Math.round(213 - u * 155);
        }
      } else if (currentMode === 'sonar') {
        if (norm < 0.5) {
          const u = norm / 0.5;
          r = Math.round(10 + u * 22);
          g = Math.round(16 + u * 118);
          b = Math.round(38 + u * 102);
        } else {
          const u = (norm - 0.5) / 0.5;
          r = Math.round(32 + u * 195);
          g = Math.round(134 + u * 106);
          b = Math.round(140 - u * 75);
        }
      } else {
        if (norm < 0.42) {
          const u = norm / 0.42;
          r = Math.round(6 + u * 88);
          g = Math.round(9 + u * 22);
          b = Math.round(20 + u * 96);
        } else if (norm < 0.76) {
          const u = (norm - 0.42) / 0.34;
          r = Math.round(94 + u * 142);
          g = Math.round(31 + u * 96);
          b = Math.round(116 - u * 54);
        } else {
          const u = (norm - 0.76) / 0.24;
          r = Math.round(236 + u * 19);
          g = Math.round(127 + u * 118);
          b = Math.round(62 + u * 150);
        }
      }
      const p = i * 4;
      data[p] = r;
      data[p + 1] = g;
      data[p + 2] = b;
      data[p + 3] = 255;
    }
    wfCtx.putImageData(wfRowImg, 0, 0);
  }

  function prewarmSimulation() {
    wfCtx.fillStyle = isDaylight ? '#eaeff6' : '#050811';
    wfCtx.fillRect(0, 0, NUM_BINS, WF_ROWS);
    for (const tgt of targets) {
      tgt.trail = [];
      tgt.estTrail = [];
    }
    if (!wasmApi) return;
    const startT = simTime - WF_ROWS * 0.08;
    syncAllToWasm();
    for (let k = 0; k < WF_ROWS; k++) {
      const tk = startT + k * 0.08;
      stepEngineFrame(0.04, tk);
      if (k % 2 === 0) recordTrails();
      pushWaterfallRow();
    }
  }

  // Draw True Target Airframe Diamond
  function drawTrueTargetDiamond(cx, cy, size, dayMode) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    ctx.fillStyle = dayMode ? 'rgba(15, 23, 42, 0.20)' : 'rgba(248, 250, 252, 0.22)';
    ctx.strokeStyle = dayMode ? '#0f172a' : '#f8fafc';
    ctx.lineWidth = 1.6;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Draw Tracker Estimate Reticle: Green Box (Locked), Amber Box (Lagging), or Flashing Red X (Lost Lock!)
  function drawTrackerReticle(cx, cy, status, nowMs, dayMode) {
    ctx.save();
    ctx.translate(cx, cy);
    if (status === 1) {
      // HOLDING LOCK: Crisp Emerald Corner Brackets
      ctx.strokeStyle = dayMode ? '#059669' : '#34d399';
      ctx.lineWidth = 1.9;
      const r = 9.5;
      const c = 4.2;
      ctx.beginPath();
      ctx.moveTo(-r, -r + c); ctx.lineTo(-r, -r); ctx.lineTo(-r + c, -r);
      ctx.moveTo(r - c, -r);  ctx.lineTo(r, -r);  ctx.lineTo(r, -r + c);
      ctx.moveTo(r, r - c);   ctx.lineTo(r, r);   ctx.lineTo(r - c, r);
      ctx.moveTo(-r + c, r);  ctx.lineTo(-r, r);  ctx.lineTo(-r, r - c);
      ctx.stroke();
    } else if (status === 2) {
      // TURN LAG: Amber Bracket Box
      ctx.strokeStyle = dayMode ? '#d97706' : '#fbbf24';
      ctx.lineWidth = 1.9;
      ctx.strokeRect(-8.5, -8.5, 17, 17);
    } else {
      // TRACK LOST (GATE BROKEN): Flashing Coral-Red Crosshair X
      const flash = Math.sin(nowMs * 0.016) > -0.35;
      if (flash) {
        ctx.strokeStyle = dayMode ? '#dc2626' : '#f87171';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-8, -8); ctx.lineTo(8, 8);
        ctx.moveTo(8, -8);  ctx.lineTo(-8, 8);
        ctx.stroke();
        ctx.strokeRect(-10, -10, 20, 20);
      }
    }
    ctx.restore();
  }

  function renderFrame(now) {
    const dt = Math.min(0.04, Math.max(0.005, (now - lastFrameTs) / 1000));
    lastFrameTs = now;
    simTime += dt;
    wfAccum += dt;

    stepEngineFrame(dt, simTime);
    if (wfAccum >= 0.08) {
      wfAccum = 0;
      recordTrails();
      pushWaterfallRow();
      updateScorePill();
      updateReadoutBar();
    }

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, rect.width);
    const h = Math.max(260, rect.height);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const theaterH = Math.round(h * 0.58);
    const psdTop = theaterH + 18;
    const psdBottom = Math.round(h * 0.78);
    const wfTop = psdBottom + 16;
    const wfHeight = h - wfTop;

    // 1. Clear 3D Theater Background
    if (isDaylight) {
      const sky = ctx.createLinearGradient(0, 0, 0, theaterH);
      sky.addColorStop(0, '#dbeafe');
      sky.addColorStop(0.32, '#eff6ff');
      sky.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = sky;
    } else {
      const sky = ctx.createLinearGradient(0, 0, 0, theaterH);
      sky.addColorStop(0, '#040812');
      sky.addColorStop(0.35, '#081225');
      sky.addColorStop(1, '#060c19');
      ctx.fillStyle = sky;
    }
    ctx.fillRect(0, 0, w, h);

    // 2. Render 3D Perspective Terrain / Bathymetry Mesh
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, theaterH);
    ctx.clip();

    const cols = 17;
    const rows = 11;
    ctx.lineWidth = 1;

    const origin2D = project3D(0, 0.08, 0, w, theaterH);
    for (const rFrac of [0.3, 0.58, 0.86]) {
      ctx.beginPath();
      for (let s = 0; s <= 36; s++) {
        const a = -1.05 + (s / 36) * 2.1;
        const rx = Math.sin(a) * rFrac;
        const rz = 0.08 + Math.cos(a) * rFrac * 0.85;
        const p = project3D(rx, rz, terrainHeight(rx, rz, currentMode) * 0.35, w, theaterH);
        if (s === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = isDaylight ? 'rgba(2, 132, 199, 0.20)' : 'rgba(56, 189, 248, 0.14)';
      ctx.stroke();
    }

    for (let r = 0; r < rows; r++) {
      const nz = 0.1 + (r / (rows - 1)) * 0.84;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const nx = -0.92 + (c / (cols - 1)) * 1.84;
        const ny = terrainHeight(nx, nz, currentMode);
        const p = project3D(nx, nz, ny, w, theaterH);
        if (c === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = isDaylight ? 'rgba(71, 85, 105, 0.24)' : 'rgba(100, 148, 205, 0.19)';
      ctx.stroke();
    }

    for (let c = 0; c < cols; c += 2) {
      const nx = -0.92 + (c / (cols - 1)) * 1.84;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const nz = 0.1 + (r / (rows - 1)) * 0.84;
        const ny = terrainHeight(nx, nz, currentMode);
        const p = project3D(nx, nz, ny, w, theaterH);
        if (r === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.strokeStyle = isDaylight ? 'rgba(100, 116, 139, 0.16)' : 'rgba(71, 115, 172, 0.13)';
      ctx.stroke();
    }

    // 3. Calm Sweeping Sensor Sector Beam
    const sweepAz = Math.sin(simTime * 0.55) * 0.76;
    const beamLeft = project3D(Math.sin(sweepAz - 0.11) * 0.95, 0.92, 0.05, w, theaterH);
    const beamRight = project3D(Math.sin(sweepAz + 0.11) * 0.95, 0.92, 0.05, w, theaterH);
    const beamGrad = ctx.createLinearGradient(origin2D.sx, origin2D.sy, (beamLeft.sx + beamRight.sx) * 0.5, beamLeft.sy);
    beamGrad.addColorStop(0, isDaylight ? 'rgba(2, 132, 199, 0.22)' : 'rgba(56, 189, 248, 0.22)');
    beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(origin2D.sx, origin2D.sy);
    ctx.lineTo(beamLeft.sx, beamLeft.sy);
    ctx.lineTo(beamRight.sx, beamRight.sy);
    ctx.closePath();
    ctx.fill();

    // 4. Directional Jammer Cones + Adaptive Spatial Null Line
    for (const jam of jammers) {
      const jL = project3D((jam.az - 0.13) * 0.92, 0.94, 0.12, w, theaterH);
      const jR = project3D((jam.az + 0.13) * 0.92, 0.94, 0.12, w, theaterH);
      const jC = project3D(jam.az * 0.92, 0.92, 0.15, w, theaterH);
      ctx.fillStyle = priorEnabled
        ? isDaylight
          ? 'rgba(217, 119, 6, 0.10)'
          : 'rgba(251, 191, 36, 0.09)'
        : isDaylight
          ? 'rgba(220, 38, 38, 0.22)'
          : 'rgba(248, 113, 113, 0.22)';
      ctx.beginPath();
      ctx.moveTo(origin2D.sx, origin2D.sy);
      ctx.lineTo(jL.sx, jL.sy);
      ctx.lineTo(jR.sx, jR.sy);
      ctx.closePath();
      ctx.fill();

      if (priorEnabled) {
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = isDaylight ? '#0284c7' : '#38bdf8';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(origin2D.sx, origin2D.sy);
        ctx.lineTo(jC.sx, jC.sy);
        ctx.stroke();
        ctx.restore();
      }
      ctx.font = '600 8.5px "JetBrains Mono", Consolas, monospace';
      const jamTag = priorEnabled ? `${jam.id} [MVDR NULL -38dB]` : `${jam.id} [UNMITIGATED JAM]`;
      const jtw = ctx.measureText(jamTag).width + 8;
      const jtx = Math.max(8, Math.min(w - jtw - 8, jC.sx - jtw * 0.5));
      ctx.fillStyle = isDaylight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(6, 10, 20, 0.90)';
      ctx.fillRect(jtx, 29, jtw, 14);
      ctx.fillStyle = priorEnabled ? (isDaylight ? '#0369a1' : '#7dd3fc') : '#f87171';
      ctx.fillText(jamTag, jtx + 4, 39);
    }

    // 5. Render True Target vs. Tracker Estimate (with Clear Lock / Lag / Lost Visuals!)
    let linkedTarget = null;
    if (hoverInfo && hoverInfo.target) linkedTarget = hoverInfo.target;

    for (const tgt of targets) {
      const groundY = terrainHeight(tgt.x, tgt.z, currentMode);
      const pGround = project3D(tgt.x, tgt.z, groundY, w, theaterH);
      const pTrue = project3D(tgt.x, tgt.z, groundY + tgt.alt, w, theaterH);
      const pEst = project3D(tgt.estX, tgt.estZ, groundY + tgt.alt, w, theaterH);
      tgt.screenX = pTrue.sx;
      tgt.screenY = pTrue.sy;

      const stateColor =
        tgt.status === 1
          ? isDaylight ? '#059669' : '#34d399'
          : tgt.status === 2
            ? isDaylight ? '#d97706' : '#fbbf24'
            : isDaylight ? '#dc2626' : '#f87171';

      // Ground drop-stem
      ctx.strokeStyle = isDaylight ? 'rgba(15, 23, 42, 0.22)' : 'rgba(148, 163, 184, 0.26)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pGround.sx, pGround.sy);
      ctx.lineTo(pTrue.sx, pTrue.sy);
      ctx.stroke();

      // True Target Path (clean dashed white/slate reference curve)
      if (tgt.trail.length > 1) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i < tgt.trail.length; i++) {
          const pt = tgt.trail[i];
          const gy = terrainHeight(pt.x, pt.z, currentMode);
          const pr = project3D(pt.x, pt.z, gy + tgt.alt, w, theaterH);
          if (i === 0) ctx.moveTo(pr.sx, pr.sy);
          else ctx.lineTo(pr.sx, pr.sy);
        }
        ctx.strokeStyle = isDaylight ? 'rgba(51, 65, 85, 0.45)' : 'rgba(226, 232, 240, 0.36)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Tracker Estimated Trail (Green when locked, Amber when lagging, Red when lost!)
      if (tgt.estTrail.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < tgt.estTrail.length; i++) {
          const pt = tgt.estTrail[i];
          const gy = terrainHeight(pt.x, pt.z, currentMode);
          const pr = project3D(pt.x, pt.z, gy + tgt.alt, w, theaterH);
          if (i === 0) ctx.moveTo(pr.sx, pr.sy);
          else ctx.lineTo(pr.sx, pr.sy);
        }
        ctx.strokeStyle = stateColor;
        ctx.lineWidth = 2.1;
        ctx.stroke();
      }

      // Miss-Distance Error Vector connecting True Target <-> Tracker Estimate whenever error > 12m!
      const screenSeparation = Math.hypot(pEst.sx - pTrue.sx, pEst.sy - pTrue.sy);
      if (screenSeparation > 4.5) {
        ctx.save();
        ctx.setLineDash([3, 2]);
        ctx.strokeStyle = stateColor;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(pTrue.sx, pTrue.sy);
        ctx.lineTo(pEst.sx, pEst.sy);
        ctx.stroke();
        ctx.restore();
      }

      // If LOST LOCK (status === 0), draw tangential dead-reckoning coast arrow!
      if (tgt.status === 0) {
        const pCoast = project3D(
          tgt.estX + tgt.estVx * 1.1,
          tgt.estZ + tgt.estVz * 1.1,
          groundY + tgt.alt,
          w,
          theaterH
        );
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = stateColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pEst.sx, pEst.sy);
        ctx.lineTo(pCoast.sx, pCoast.sy);
        ctx.stroke();
        ctx.restore();
      }

      // Draw True Airframe Diamond + Tracker Estimate Reticle
      drawTrueTargetDiamond(pTrue.sx, pTrue.sy, 6.2, isDaylight);
      drawTrackerReticle(pEst.sx, pEst.sy, tgt.status, now, isDaylight);

      if (linkedTarget === tgt) {
        ctx.strokeStyle = isDaylight ? '#0284c7' : '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pTrue.sx, pTrue.sy, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Unmistakable Status Callout Pill (LOCKED vs. TURN LAG vs. TRACK LOST!)
      ctx.font = '600 9px "JetBrains Mono", Consolas, monospace';
      let stateWord = 'LOCKED';
      if (tgt.status === 2) stateWord = 'TURN LAG';
      else if (tgt.status === 0) stateWord = 'TRACK LOST';

      const turnBadge = tgt.turnG >= 3.8 ? ` • ${tgt.turnG.toFixed(1)}G TURN` : '';
      const tag = `${tgt.id}: ${stateWord} (${tgt.errMeters.toFixed(0)}m)${turnBadge}`;
      const ttw = ctx.measureText(tag).width + 10;
      const ttx = Math.max(6, Math.min(w - ttw - 6, pTrue.sx + 11));
      const tty = Math.max(46, Math.min(theaterH - 20, pTrue.sy - 15));

      ctx.fillStyle = isDaylight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(6, 11, 22, 0.90)';
      ctx.strokeStyle = stateColor;
      ctx.lineWidth = 1.2;
      ctx.fillRect(ttx, tty, ttw, 15);
      ctx.strokeRect(ttx, tty, ttw, 15);
      ctx.fillStyle = stateColor;
      ctx.fillText(tag, ttx + 5, tty + 10.8);
    }

    // Sensor Origin Marker + Label
    ctx.fillStyle = isDaylight ? '#0284c7' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(origin2D.sx, origin2D.sy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '600 8.5px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = isDaylight ? '#334155' : '#94a3b8';
    ctx.fillText('SENSOR ORIGIN', origin2D.sx + 8, origin2D.sy + 3);

    // Top-left Theater HUD Badge
    const cfg = modeConfigs[currentMode];
    ctx.fillStyle = isDaylight ? 'rgba(255, 255, 255, 0.86)' : 'rgba(5, 9, 18, 0.80)';
    ctx.fillRect(8, 7, 294, 18);
    ctx.font = '600 9px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = isDaylight ? '#0369a1' : '#93c5fd';
    ctx.fillText(cfg.theaterBadge, 13, 19);
    ctx.restore();

    // 6. Dock Divider Bar
    ctx.fillStyle = isDaylight ? '#cbd5e1' : '#0b1324';
    ctx.fillRect(0, theaterH, w, 18);
    ctx.font = '600 9px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = isDaylight ? '#1e293b' : '#93c5fd';
    ctx.fillText('DOCKED C++23 OS-CFAR SPECTRUM + WATERFALL (SHARED WASM MEMORY)', 10, theaterH + 12);

    // 7. Conditioned PSD + OS-CFAR Threshold Curve (Direct Zero-Copy Read from wasmPsdView!)
    const dbToY = (db) => {
      const n = (db - MIN_DB) / (MAX_DB - MIN_DB);
      return psdBottom - Math.max(0, Math.min(1, n)) * (psdBottom - psdTop - 6) - 3;
    };

    ctx.fillStyle = isDaylight ? '#f8fafc' : '#050914';
    ctx.fillRect(0, psdTop, w, psdBottom - psdTop);

    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = isDaylight ? 'rgba(100, 116, 139, 0.85)' : 'rgba(148, 163, 184, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(wasmThreshView[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(wasmPsdView[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDaylight ? '#0284c7' : '#60a5fa';
    ctx.lineWidth = 1.7;
    ctx.stroke();
    ctx.lineTo(w, psdBottom);
    ctx.lineTo(0, psdBottom);
    ctx.closePath();
    ctx.fillStyle = isDaylight ? 'rgba(2, 132, 199, 0.14)' : 'rgba(56, 189, 248, 0.14)';
    ctx.fill();

    for (const tgt of targets) {
      const px = tgt.liveBin * w;
      const py = dbToY(tgt.peakDb);
      ctx.fillStyle =
        tgt.status === 1 ? '#34d399' : tgt.status === 2 ? '#fbbf24' : '#f87171';
      ctx.beginPath();
      ctx.arc(px, py, linkedTarget === tgt ? 5.0 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Frequency Axis Strip
    ctx.fillStyle = isDaylight ? '#e2e8f0' : '#080e1c';
    ctx.fillRect(0, psdBottom, w, 16);
    ctx.font = '9px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = isDaylight ? '#334155' : '#94a3b8';
    const nTicks = cfg.ticks.length;
    for (let i = 0; i < nTicks; i++) {
      const frac = i / (nTicks - 1);
      const txt = cfg.ticks[i];
      const tw = ctx.measureText(txt).width;
      const tx = i === 0 ? 6 : i === nTicks - 1 ? w - tw - 6 : frac * w - tw * 0.5;
      ctx.fillText(txt, tx, psdBottom + 11.5);
    }

    // 8. Scrolling Waterfall
    ctx.drawImage(wfCanvas, 0, wfTop, w, wfHeight);

    // 9. Cross-View Hover Sync Cursor
    if (linkedTarget) {
      const syncX = linkedTarget.liveBin * w;
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = isDaylight ? '#0f172a' : '#f8fafc';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(syncX, psdTop);
      ctx.lineTo(syncX, h);
      ctx.stroke();
      ctx.restore();

      const syncLabel = `${linkedTarget.id} ↔ ${binToPhysicalFreq(linkedTarget.liveBin, currentMode)} [Click to Clear]`;
      ctx.font = '600 9.5px "JetBrains Mono", Consolas, monospace';
      const bw = ctx.measureText(syncLabel).width + 14;
      const bx = Math.min(w - bw - 6, Math.max(6, syncX - bw * 0.5));
      ctx.fillStyle = isDaylight ? 'rgba(15, 23, 42, 0.92)' : 'rgba(8, 15, 30, 0.94)';
      ctx.fillRect(bx, psdTop + 4, bw, 18);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(syncLabel, bx + 7, psdTop + 16);
    }

    requestAnimationFrame(renderFrame);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const theaterH = rect.height * 0.58;

    let nearTgt = null;
    if (my <= theaterH) {
      for (const tgt of targets) {
        if (Math.hypot(mx - (tgt.screenX || 0), my - (tgt.screenY || 0)) < 22) {
          nearTgt = tgt;
          break;
        }
      }
      hoverInfo = { mx, my, inTheater: true, target: nearTgt };
    } else {
      const bin = mx / Math.max(1, rect.width);
      for (const tgt of targets) {
        if (Math.abs(tgt.liveBin - bin) < 0.038) {
          nearTgt = tgt;
          break;
        }
      }
      hoverInfo = { mx, my, inTheater: false, target: nearTgt };
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoverInfo = null;
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const theaterH = rect.height * 0.58;

    if (hoverInfo && hoverInfo.target) {
      const idx = targets.indexOf(hoverInfo.target);
      if (idx !== -1) {
        targets.splice(idx, 1);
        hoverInfo = null;
        syncAllToWasm();
        updateScorePill();
        return;
      }
    }

    if (targets.length >= 6) targets.shift();

    if (my <= theaterH) {
      const { nx, nz } = unprojectToGround(mx, my, rect.width, theaterH);
      targets.push(
        makeTarget({
          id: `TRK-0${synCounter++}`,
          cx: Math.max(-0.52, Math.min(0.52, nx * 0.72)),
          cz: Math.max(0.32, Math.min(0.74, nz)),
          rx: 0.27,
          rz: 0.16,
          omega: (Math.random() < 0.5 ? 1 : -1) * 0.32,
          phase: 0.7,
          alt: 0.22,
          snr: 22.0
        })
      );
    } else {
      const u = Math.max(0.12, Math.min(0.88, mx / Math.max(1, rect.width)));
      targets.push(
        makeTarget({
          id: `TRK-0${synCounter++}`,
          cx: (u - 0.5) * 0.95,
          cz: 0.56,
          rx: 0.27,
          rz: 0.16,
          omega: u >= 0.5 ? 0.33 : -0.33,
          phase: 0.7,
          alt: 0.22,
          snr: 20.5
        })
      );
    }
    syncAllToWasm();
    updateScorePill();
  });

  requestAnimationFrame(renderFrame);

  // =========================================================================
  // Instant Scenario Analysis & Executable C++23 Tracker/DSP + PrioriSDK Generator Modal
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
    const trk = trackerAlgos[trackerIdx];
    const total = targets.length;
    const holdingList = targets.filter((t) => t.status === 1);
    const lostList = targets.filter((t) => t.status === 0);
    const pdPct = total > 0 ? Math.round(((total - lostList.length) / total) * 100) : 100;
    const meanErr =
      total > 0
        ? (targets.reduce((a, t) => a + (t.errMeters || 3.0), 0) / total).toFixed(1) + ' m'
        : 'N/A';

    if (reportKpis) {
      reportKpis.innerHTML = `
        <div class="kpi-box">
          <div class="kpi-label">Track Custody</div>
          <div class="kpi-val">${total - lostList.length} / ${total} (${pdPct}%)</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">${trk.short} Mean Error</div>
          <div class="kpi-val">${meanErr}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">C++23 WASM Step</div>
          <div class="kpi-val">${lastWasmStepUs.toFixed(1)} &mu;s</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">WASM Footprint</div>
          <div class="kpi-val">7.0 KB (0 Libs)</div>
        </div>
      `;
    }

    let rankText = '';
    if (total === 0) {
      rankText = '◈ NO ACTIVE TRACKS — Click anywhere in the 3D theater to spawn maneuvering targets.';
    } else if (lostList.length > 0) {
      rankText = `✕ TRACK LOST (${lostList.length} BROKEN GATE) — ${trk.short} exceeded the 38m validation gate during a 5.5G turn (or unmitigated jamming). Switch to IMM-EKF + Prior: ON to hold lock!`;
    } else if (holdingList.length < total) {
      rankText = `⚠ MANEUVER LAG (${meanErr} RMS) — Single-model CV Kalman lags behind 5.5G turns. Switch to 2-model IMM-EKF for tight ~3m custody.`;
    } else {
      rankText = `✓ TIGHT CUSTODY LOCKED (${trk.short} • ${meanErr} RMS) — C++23 IMM-EKF + OS-CFAR holding all 5.5G maneuvering targets cleanly.`;
    }
    if (reportRankBox) reportRankBox.textContent = rankText;

    if (reportNarrative) {
      reportNarrative.textContent = `Executed in compiled freestanding C++23 WebAssembly (priori_core.wasm, 7.0 KB): ${trk.desc} paired with 192-bin OS-CFAR in ${cfg.name} mode.`;
    }

    if (reportTableBody) {
      if (targets.length === 0) {
        reportTableBody.innerHTML = `<tr><td colspan="5" style="color: var(--text-muted);">No active tracks.</td></tr>`;
      } else {
        reportTableBody.innerHTML = targets
          .map((t) => {
            const freqStr = binToPhysicalFreq(t.liveBin, currentMode);
            const marginStr = `${t.marginDb >= 0 ? '+' : ''}${t.marginDb.toFixed(1)} dB`;
            let pill = `<span class="status-pill-ok">LOCKED (${t.errMeters.toFixed(1)}m)</span>`;
            if (t.status === 2) pill = `<span class="status-pill-warn">TURN LAG (${t.errMeters.toFixed(0)}m)</span>`;
            else if (t.status === 0) pill = `<span class="status-pill-warn" style="color:#fecaca;border-color:#f87171;">LOST LOCK (${t.errMeters.toFixed(0)}m)</span>`;
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

    const mdRows = targets
      .map(
        (t) =>
          `| ${t.id} | ${binToPhysicalFreq(t.liveBin, currentMode)} | +${t.snr.toFixed(1)} dB | ${t.errMeters.toFixed(1)} m | ${t.status === 1 ? 'LOCKED' : t.status === 2 ? 'TURN LAG' : 'LOST LOCK'} |`
      )
      .join('\n');

    latestMarkdownBrief = `# A Priori Labs — C++23 WASM Mini-Console Telemetry Brief
- **Engine Kernel:** Freestanding C++23 WebAssembly (\`priori_core.wasm\`, 7.0 KB, ${lastWasmStepUs.toFixed(1)} µs/step)
- **Tracker Algorithm:** ${trk.desc} (Mean Error: ${meanErr})
- **Signal Conditioning:** ${priorEnabled ? 'ENABLED (' + cfg.priorDesc + ')' : 'DISABLED'}

| Track ID | Doppler / Freq | Injected SNR | ${trk.short} Error | Custody |
| :--- | :--- | :--- | :--- | :--- |
${mdRows || '| None | — | — | — | — |'}
`;

    const sdkTargets = targets
      .map((t, idx) => `        {${101 + idx}u, "${t.id}", ${(t.x * 1800).toFixed(0)}.0f, ${(t.alt * 900).toFixed(0)}.0f, ${(t.z * 2400).toFixed(0)}.0f, ${t.liveBin.toFixed(3)}f, ${t.snr.toFixed(1)}f}`)
      .join(',\n');

    const envEnum = currentMode === 'sonar' ? 'PRIORI_ENV_MARITIME_OCEAN' : 'PRIORI_ENV_COASTAL_RADAR';
    const cmapEnum = isDaylight
      ? 'PRIORI_CMAP_CIVIDIS_SAFE'
      : currentMode === 'sonar'
        ? 'PRIORI_CMAP_VIRIDIS_SONAR'
        : 'PRIORI_CMAP_INFERNO_EW';

    const prioriSdkAppCode = `// A Priori Labs LLC — Auto-Configured PrioriSDK v0.8 3D + Waterfall Console
// Mode: ${cfg.name} | Tracker: ${trk.short} | Theme: ${isDaylight ? 'Daylight Bridge' : 'Dark CIC'}
#include <priori/priori.hpp>
#include <priori/priori_dsp.hpp>
#include <priori/priori_lab.hpp>

struct TrackSeed { std::uint32_t uid; const char* callsign; float x, y, z, bin_u, snr_db; };
static constexpr TrackSeed kSeeds[] = {
${sdkTargets || '        {101u, "UAV-01", -520.0f, 220.0f, 1340.0f, 0.36f, 26.0f}'}
};

int main(int argc, char** argv) {
    priori::AppConfig cfg{
        .title          = "${cfg.name.toUpperCase()} // PRIORI-SDK",
        .classification = PRIORI_CLASS_CUI,
        .env_style      = ${envEnum}
    };
    priori::App app(cfg, argc, argv);

    auto tPsd = app.create_tensor_1d("OS_CFAR_PSD_DB", ${cfg.fftSize});
    auto tWf  = app.create_tensor_2d("PEAK_HOLD_WF",   ${cfg.fftSize}, 256);
    float linkedCursorU = 0.50f;
    priori::lab::Inspector lab;

    app.run([&](priori::FrameContext& ctx) {
        for (const auto& s : kSeeds) {
            ctx.world.add_track({s.uid, s.x, s.y, s.z, 90.0f, 42.0f,
                                 PRIORI_AFFIL_HOSTILE, PRIORI_DIM_AIR,
                                 priori::Palette::Ice, 3800.0f, 4.0f, s.callsign, "${trk.short}"});
        }
        tWf.accumulate_peak_hold_in_current_row(tPsd.data());
        if (ctx.step_waterfalls) tWf.push_row(tPsd.data());

        const auto nav = ctx.ui.begin_header_bar(cfg.title, "${trk.short} + ZERO-COPY VRAM", ctx.gpu_frame_us, ctx.fps);
        lab.draw(ctx, {nav.x + 16.0f, nav.y, 184.0f, nav.h}, {});

        auto dock = ctx.ui.begin_card({16.0f, ctx.ui.top_safe_y() + 58.0f, 440.0f, 410.0f}, "COUPLED SPECTRUM & WATERFALL");
        ctx.ui.plot_line_1d(dock.next_row(95.0f), tPsd, 4.0f, 52.0f, priori::Palette::Ice, &linkedCursorU);
        ctx.ui.plot_waterfall_2d(dock.next_row(235.0f), tWf, 4.0f, 50.0f, ${cmapEnum}, &linkedCursorU);
    });
}`;

    if (codePythonEl) codePythonEl.textContent = prioriSdkAppCode;

    const cppCode = `// A Priori Labs LLC — Zero-Heap C++23 ${trk.cppName} (Compiled in priori_core.wasm)
// Runs headless on ARM/x86/FPGA blades, WebAssembly, or PrioriEngine Vulkan VRAM
#pragma once
#include <algorithm>
#include <cmath>

namespace apriori::tracking {

struct TrackState {
    float x{0}, z{0}, vx{0}, vz{0}, ax{0}, az{0};
    float imm_turn_prob{0.1f};
    bool  locked{true};
};

inline void step_imm_maneuver(TrackState& s, float meas_x, float meas_z, float sigma, float dt) noexcept {
    const float pred_x  = s.x  + s.vx * dt + 0.5f * s.ax * dt * dt;
    const float pred_z  = s.z  + s.vz * dt + 0.5f * s.az * dt * dt;
    const float rx      = meas_x - pred_x;
    const float rz      = meas_z - pred_z;
    const float innov   = std::hypot(rx, rz) / std::max(sigma, 1e-4f);

    // Blend Constant-Velocity (CV) & High-G Maneuver (CA) models via innovation likelihood
    const float target_mu = (innov > 1.1f) ? 0.94f : 0.10f;
    s.imm_turn_prob += (target_mu - s.imm_turn_prob) * 0.28f;

    const float k_pos = 0.24f + 0.44f * s.imm_turn_prob;
    const float k_vel = (2.10f + 7.40f * s.imm_turn_prob) * dt;
    s.x  = pred_x + k_pos * rx;
    s.z  = pred_z + k_pos * rz;
    s.vx = (s.vx + s.ax * dt) + k_vel * (rx / dt);
    s.vz = (s.vz + s.az * dt) + k_vel * (rz / dt);
    s.locked = true;
}

} // namespace apriori::tracking`;

    if (codeCppEl) codeCppEl.textContent = cppCode;

    const elapsedMs = Math.max(0.1, performance.now() - t0);
    if (modalEyebrow) {
      modalEyebrow.textContent = `C++23 WASM TELEMETRY // SYNTHESIZED IN ${elapsedMs.toFixed(2)} MS`;
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
      } catch {}
    });
  }

  wireCopyButton(btnCopyReport, () => latestMarkdownBrief);
  wireCopyButton(btnCopyPython, () => (codePythonEl ? codePythonEl.textContent : ''));
  wireCopyButton(btnCopyCpp, () => (codeCppEl ? codeCppEl.textContent : ''));
})();
