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
  // PrioriEngine Live Interactive Mini-Console (Coupled 3D Theater + Tracker + Docked Waterfall)
  // =========================================================================
  const canvas = document.getElementById('dspCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const panelEl = canvas.closest('.dsp-panel');
  const readoutEl = document.getElementById('dspReadout');
  const scorePillEl = document.getElementById('dspScorePill');
  const modeTabs = document.querySelectorAll('.dsp-tab');

  const btnSpawnStealth = document.getElementById('btnSpawnStealth');
  const btnSpawnJammer = document.getElementById('btnSpawnJammer');
  const btnTrackerCycle = document.getElementById('btnTrackerCycle');
  const btnPriorToggle = document.getElementById('btnPriorToggle');
  const btnResetSim = document.getElementById('btnResetSim');
  const btnConsoleTheme = document.getElementById('btnConsoleTheme');
  const btnOpenReport = document.getElementById('btnOpenReport');

  const NUM_BINS = 192;
  const MIN_DB = -88;
  const MAX_DB = -14;
  const WF_ROWS = 76;

  const wfCanvas = document.createElement('canvas');
  wfCanvas.width = NUM_BINS;
  wfCanvas.height = WF_ROWS;
  const wfCtx = wfCanvas.getContext('2d');
  const wfRowImg = wfCtx.createImageData(NUM_BINS, 1);

  const trackerAlgos = [
    {
      key: 'imm',
      short: 'IMM-EKF',
      label: 'Tracker: IMM-EKF',
      posGain: 0.34,
      velGain: 0.24,
      covScale: 1.0,
      cppName: 'ImmManeuverTracker',
      desc: 'Interacting Multiple Model (Constant-Velocity + Coordinated-Turn EKF)'
    },
    {
      key: 'kalman',
      short: 'Kalman-CV',
      label: 'Tracker: Kalman',
      posGain: 0.17,
      velGain: 0.085,
      covScale: 1.85,
      cppName: 'LinearKalmanTracker',
      desc: 'Single-model Constant-Velocity Kalman filter'
    },
    {
      key: 'alphabeta',
      short: 'Basic α-β',
      label: 'Tracker: Basic α-β',
      posGain: 0.075,
      velGain: 0.024,
      covScale: 3.35,
      cppName: 'AlphaBetaTracker',
      desc: 'Fixed-gain legacy alpha-beta smoothing filter (lags on high-G turns)'
    }
  ];

  const modeConfigs = {
    radar: {
      name: 'Coastal Pulse-Doppler Radar',
      theaterBadge: '3D WGS84 COASTAL VALLEY // AESA + TRACKER',
      fftSize: 1024,
      pfa: '1e-5',
      cppKernelUs: 3.2,
      axisMin: -450,
      axisMax: 450,
      axisUnit: 'Hz',
      ticks: ['-450 Hz', '-225 Hz', '0 Hz (Clutter)', '+225 Hz', '+450 Hz'],
      priorDesc: 'Zero-Doppler MTI clutter notch + adaptive MVDR sidelobe nulling',
      defaultTargets: [
        { id: 'UAV-01', cx: -0.34, cz: 0.56, rx: 0.28, rz: 0.16, omega: 0.82, phase: 0.4, alt: 0.24, snr: 27.5 },
        { id: 'HSM-02', cx: 0.32, cz: 0.66, rx: 0.25, rz: 0.19, omega: -1.08, phase: 2.1, alt: 0.31, snr: 20.5 }
      ]
    },
    sonar: {
      name: 'Subsea Canyon Passive/Active Sonar',
      theaterBadge: '3D BATHYMETRY // HYDROPHONE ARRAY + TRACKER',
      fftSize: 2048,
      pfa: '1e-4',
      cppKernelUs: 6.8,
      axisMin: 0,
      axisMax: 1600,
      axisUnit: 'Hz',
      ticks: ['0 Hz', '400 Hz', '800 Hz', '1.2 kHz', '1.6 kHz'],
      priorDesc: 'Split-Step PE waveguide clutter subtraction + reverberation whitening',
      defaultTargets: [
        { id: 'UUV-01', cx: -0.28, cz: 0.52, rx: 0.24, rz: 0.14, omega: 0.52, phase: 1.0, alt: 0.16, snr: 24.0 },
        { id: 'SUB-02', cx: 0.30, cz: 0.70, rx: 0.22, rz: 0.15, omega: -0.44, phase: 3.6, alt: 0.12, snr: 17.5 }
      ]
    },
    diag: {
      name: 'Passive RF TDOA & Emitter Watchdog',
      theaterBadge: '3D RF RIDGE // MULTI-SITE TDOA + SPECTRUM',
      fftSize: 1024,
      pfa: '1e-5',
      cppKernelUs: 3.1,
      axisMin: 2400,
      axisMax: 2500,
      axisUnit: 'MHz',
      ticks: ['2400 MHz', '2425 MHz', '2450 MHz', '2475 MHz', '2500 MHz'],
      priorDesc: 'Co-channel wideband interference excision + TDOA multipath gating',
      defaultTargets: [
        { id: 'EMT-01', cx: -0.30, cz: 0.60, rx: 0.26, rz: 0.17, omega: 0.74, phase: 0.8, alt: 0.21, snr: 25.5 },
        { id: 'LPI-02', cx: 0.35, cz: 0.54, rx: 0.22, rz: 0.16, omega: -0.94, phase: 2.7, alt: 0.19, snr: 14.2 }
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
  let simTime = 12.0;
  let lastFrameTs = performance.now();
  let wfAccum = 0;

  const ouNoise = new Float32Array(NUM_BINS);
  const instantPower = new Float32Array(NUM_BINS);
  const instantThresh = new Float32Array(NUM_BINS);
  const smoothedPower = new Float32Array(NUM_BINS);
  const smoothedThreshold = new Float32Array(NUM_BINS);
  let buffersInitialized = false;

  function terrainHeight(nx, nz, mode) {
    if (mode === 'sonar') {
      // Submarine canyon trough in center, continental shelf walls on flanks
      const canyon = -0.11 * Math.exp(-Math.pow(nx / 0.34, 2));
      const shelf = 0.08 * Math.pow(Math.abs(nx), 1.4) + 0.03 * Math.sin(nx * 5.0 + nz * 4.0);
      return Math.max(-0.12, canyon + shelf);
    }
    // Coastal valley / ridge relief
    const flank = 0.14 * Math.pow(Math.abs(nx), 1.65) * (0.65 + 0.35 * nz);
    const ripples = 0.032 * Math.sin(nx * 6.2 + 0.5) * Math.cos(nz * 5.4);
    return flank + ripples;
  }

  function makeTarget(spec) {
    const x0 = spec.cx + spec.rx * Math.cos(spec.phase);
    const z0 = spec.cz + spec.rz * Math.sin(spec.phase * 1.5);
    return {
      ...spec,
      x: x0,
      z: z0,
      vx: 0,
      vz: 0,
      estX: x0,
      estZ: z0,
      estVx: 0,
      estVz: 0,
      errMeters: 4.0,
      liveBin: 0.5,
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
    buffersInitialized = false;
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
    const cfg = modeConfigs[currentMode];
    const trk = trackerAlgos[trackerIdx];
    if (!readoutEl || !cfg) return;
    const priorTag = priorEnabled ? 'PRIOR: ON' : 'PRIOR: OFF';
    readoutEl.textContent = `${trk.short} + ${cfg.fftSize}-PT OS-CFAR (${priorTag}) // PRI-ENGINE GPU: ~0.85 ms • C++23 DSP: ~${cfg.cppKernelUs.toFixed(1)} µs`;
  }

  function updateScorePill() {
    if (!scorePillEl) return;
    const lockedList = targets.filter((t) => t.locked);
    const trk = trackerAlgos[trackerIdx];
    if (targets.length === 0) {
      scorePillEl.textContent = `TRACKS: 0/0 • CLICK 3D MAP TO SPAWN`;
      return;
    }
    const meanErr =
      targets.reduce((acc, t) => acc + (t.errMeters || 4.0), 0) / Math.max(1, targets.length);
    scorePillEl.textContent = `LOCKED: ${lockedList.length}/${targets.length} • ${trk.short} ERR: ${meanErr.toFixed(1)} m`;
  }

  cloneDefaults(currentMode);
  updateReadoutBar();

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
      if (targets.length >= 7) targets.shift();
      const cx = (Math.random() - 0.5) * 0.85;
      const cz = 0.36 + Math.random() * 0.44;
      const snr = +(11.4 + Math.random() * 3.0).toFixed(1);
      targets.push(
        makeTarget({
          id: `MNV-0${synCounter++}`,
          cx,
          cz,
          rx: 0.22 + Math.random() * 0.1,
          rz: 0.14 + Math.random() * 0.07,
          omega: (Math.random() < 0.5 ? 1 : -1) * (1.05 + Math.random() * 0.45),
          phase: Math.random() * 6.28,
          alt: 0.18 + Math.random() * 0.16,
          snr
        })
      );
      updateScorePill();
    });
  }

  if (btnSpawnJammer) {
    btnSpawnJammer.addEventListener('click', () => {
      if (jammers.length >= 2) jammers.shift();
      const anchor = targets[targets.length - 1];
      const az = anchor ? Math.atan2(anchor.x, Math.max(0.15, anchor.z)) + 0.08 : (Math.random() - 0.5) * 0.9;
      const centerBin = anchor ? Math.min(0.86, Math.max(0.14, anchor.liveBin + 0.03)) : 0.35 + Math.random() * 0.3;
      jammers.push({
        id: `JAM-0${jamCounter++}`,
        az,
        center: centerBin,
        width: 0.085,
        power: 22.5
      });
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

  // Project normalized 3D theater coordinates (nx in [-1..1], nz in [0.05..1.0], ny in [-0.15..0.45]) to 2D canvas
  function project3D(nx, nz, ny, w, theaterH) {
    const depth = 0.62 + nz * 0.88;
    const persp = 1.0 / depth;
    const sx = w * 0.5 + nx * w * 0.46 * persp;
    const horizonY = theaterH * 0.17;
    const groundSpan = theaterH * 0.78;
    const sy = horizonY + (1.0 - nz * 0.84) * groundSpan * 0.88 - ny * theaterH * 0.46 * persp;
    return { sx, sy, scale: persp };
  }

  // Approximate inverse ground-plane projection for click-to-spawn in 3D theater
  function unprojectToGround(sx, sy, w, theaterH) {
    const horizonY = theaterH * 0.17;
    const groundSpan = theaterH * 0.78;
    const normY = (sy - horizonY) / (groundSpan * 0.88);
    const nz = Math.max(0.18, Math.min(0.92, (1.0 - normY) / 0.84));
    const depth = 0.62 + nz * 0.88;
    const nx = Math.max(-0.85, Math.min(0.85, ((sx - w * 0.5) * depth) / (w * 0.46)));
    return { nx, nz };
  }

  function stepPhysics(dt, t) {
    const trk = trackerAlgos[trackerIdx];

    // 1. Update 3D target maneuvering trajectories + kinematic state estimators
    for (const tgt of targets) {
      const prevX = tgt.x;
      const prevZ = tgt.z;
      const ang = tgt.phase + t * tgt.omega;
      // Lissajous / figure-8 evasive trajectory with coordinated high-G turns
      const nx = Math.max(-0.88, Math.min(0.88, tgt.cx + tgt.rx * Math.cos(ang)));
      const nz = Math.max(0.16, Math.min(0.92, tgt.cz + tgt.rz * Math.sin(ang * 1.65)));
      tgt.vx = (nx - prevX) / Math.max(0.004, dt);
      tgt.vz = (nz - prevZ) / Math.max(0.004, dt);
      tgt.x = nx;
      tgt.z = nz;

      // Check jammer angular proximity
      const tgtAz = Math.atan2(nx, nz);
      let jamPenalty = 1.0;
      for (const jam of jammers) {
        if (Math.abs(tgtAz - jam.az) < 0.24) {
          jamPenalty = priorEnabled ? 1.25 : 2.9;
        }
      }

      // Predict step
      const predX = tgt.estX + tgt.estVx * dt;
      const predZ = tgt.estZ + tgt.estVz * dt;

      // Deterministic pseudo-measurement jitter scaled by SNR & jammer suppression
      const snrFactor = Math.max(0.35, (28.0 - tgt.snr) / 14.0);
      const measJitter = 0.0045 * snrFactor * jamPenalty;
      const measX = nx + measJitter * Math.sin(t * 17.3 + tgt.phase * 5.0);
      const measZ = nz + measJitter * Math.cos(t * 13.7 + tgt.phase * 3.0);

      // Update step (IMM adapts rapidly on high-acceleration turns; alpha-beta lags visibly!)
      const resX = measX - predX;
      const resZ = measZ - predZ;
      const effPosGain = Math.min(0.65, trk.posGain / Math.sqrt(jamPenalty));
      const effVelGain = trk.velGain / Math.max(0.012, dt * 18.0);

      tgt.estX = predX + effPosGain * resX;
      tgt.estZ = predZ + effPosGain * resZ;
      tgt.estVx = tgt.estVx + effVelGain * resX;
      tgt.estVz = tgt.estVz + effVelGain * resZ;

      const dxErr = tgt.estX - nx;
      const dzErr = tgt.estZ - nz;
      tgt.errMeters = Math.max(2.1, Math.hypot(dxErr, dzErr) * 520.0 * (priorEnabled ? 1.0 : 1.35));

      // Map 3D radial velocity (or bearing/freq in sonar/RF) directly to docked spectrum bin!
      const rNorm = Math.max(0.15, Math.hypot(nx, nz));
      const vr = (nx * tgt.vx + nz * tgt.vz) / rNorm;
      if (currentMode === 'radar') {
        tgt.liveBin = Math.max(0.06, Math.min(0.94, 0.5 + vr * 0.62));
      } else {
        tgt.liveBin = Math.max(0.08, Math.min(0.92, 0.5 + nx * 0.36 + vr * 0.18));
      }
    }

    // 2. Synthesize coupled spectrum + clutter + jammer + OS-CFAR / CA-CFAR
    for (let i = 0; i < NUM_BINS; i++) {
      const u = i / (NUM_BINS - 1);
      ouNoise[i] = ouNoise[i] * 0.82 + (Math.random() - 0.5) * 3.1;

      let clutter = 0;
      if (currentMode === 'radar') {
        clutter = 21.5 * Math.exp(-Math.pow((u - 0.5) / 0.052, 2));
      } else if (currentMode === 'sonar') {
        clutter = 16.5 * Math.exp(-u / 0.17);
      } else {
        clutter = 9.0 * Math.exp(-Math.pow((u - 0.5) / 0.18, 2));
      }

      for (const jam of jammers) {
        clutter += jam.power * Math.exp(-Math.pow((u - jam.center) / jam.width, 2));
      }

      const suppressedClutter = priorEnabled ? clutter * 0.15 : clutter;
      let sigLinear = Math.pow(10, (-75.5 + suppressedClutter + ouNoise[i]) / 10);

      for (const tgt of targets) {
        const lobe = tgt.snr * Math.exp(-Math.pow((u - tgt.liveBin) / 0.015, 2));
        if (lobe > 0.25) {
          sigLinear += Math.pow(10, (-74.0 + lobe) / 10);
        }
      }
      instantPower[i] = Math.max(MIN_DB, Math.min(MAX_DB, 10 * Math.log10(sigLinear)));
    }

    const guard = 4;
    const train = 14;
    const win = [];
    for (let i = 0; i < NUM_BINS; i++) {
      win.length = 0;
      for (let k = -(guard + train); k <= guard + train; k++) {
        if (k >= -guard && k <= guard) continue;
        const idx = Math.max(0, Math.min(NUM_BINS - 1, i + k));
        win.push(instantPower[idx]);
      }
      if (priorEnabled) {
        win.sort((a, b) => a - b);
        instantThresh[i] = win[Math.floor(win.length * 0.65)] + 9.0;
      } else {
        let sum = 0;
        for (let s = 0; s < win.length; s++) sum += win[s];
        instantThresh[i] = sum / win.length + 10.6;
      }
    }

    const alpha = buffersInitialized ? 1 - Math.exp(-dt / 0.14) : 1.0;
    for (let i = 0; i < NUM_BINS; i++) {
      smoothedPower[i] += alpha * (instantPower[i] - smoothedPower[i]);
      smoothedThreshold[i] += alpha * (instantThresh[i] - smoothedThreshold[i]);
    }
    buffersInitialized = true;

    for (const tgt of targets) {
      const fIdx = tgt.liveBin * (NUM_BINS - 1);
      const i0 = Math.max(0, Math.min(NUM_BINS - 1, Math.round(fIdx)));
      tgt.peakDb = smoothedPower[i0];
      tgt.threshDb = smoothedThreshold[i0];
      tgt.marginDb = tgt.peakDb - tgt.threshDb;
      tgt.locked = tgt.marginDb >= -0.2;
    }
  }

  function recordTrails() {
    for (const tgt of targets) {
      tgt.trail.push({ x: tgt.x, z: tgt.z });
      tgt.estTrail.push({ x: tgt.estX, z: tgt.estZ });
      if (tgt.trail.length > 30) tgt.trail.shift();
      if (tgt.estTrail.length > 30) tgt.estTrail.shift();
    }
  }

  function pushWaterfallRow() {
    wfCtx.drawImage(wfCanvas, 0, 0, NUM_BINS, WF_ROWS - 1, 0, 1, NUM_BINS, WF_ROWS - 1);
    const data = wfRowImg.data;
    for (let i = 0; i < NUM_BINS; i++) {
      const norm = Math.max(0, Math.min(1, (smoothedPower[i] - -82) / 54));
      let r, g, b;
      if (isDaylight) {
        // High-contrast MIL-STD-1472H Daylight colormap (Alabaster -> Cobalt -> Deep Crimson)
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
        // Viridis-inspired sonar colormap
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
        // Inferno-EW colormap (Black -> Violet -> Amber/Ice)
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
    const startT = simTime - WF_ROWS * 0.06;
    for (let k = 0; k < WF_ROWS; k++) {
      const tk = startT + k * 0.06;
      stepPhysics(0.06, tk);
      if (k % 2 === 0) recordTrails();
      pushWaterfallRow();
    }
  }

  function drawMil2525Symbol(cx, cy, size, locked, dayMode) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    if (locked) {
      ctx.fillStyle = dayMode ? 'rgba(2, 132, 199, 0.22)' : 'rgba(56, 189, 248, 0.24)';
      ctx.strokeStyle = dayMode ? '#0369a1' : '#7dd3fc';
    } else {
      ctx.fillStyle = dayMode ? 'rgba(217, 119, 6, 0.22)' : 'rgba(251, 191, 36, 0.24)';
      ctx.strokeStyle = dayMode ? '#b45309' : '#fbbf24';
    }
    ctx.lineWidth = 1.7;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = dayMode ? '#0f172a' : '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, 0, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderFrame(now) {
    const dt = Math.min(0.05, Math.max(0.005, (now - lastFrameTs) / 1000));
    lastFrameTs = now;
    simTime += dt;
    wfAccum += dt;

    stepPhysics(dt, simTime);
    if (wfAccum >= 0.055) {
      wfAccum = 0;
      recordTrails();
      pushWaterfallRow();
      updateScorePill();
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

    const theaterH = Math.round(h * 0.57);
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

    // Range rings on ground plane
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

    // Transverse & longitudinal 3D wireframe contours
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

    // 3. Sweeping Sensor Sector Beam
    const sweepAz = Math.sin(simTime * 0.95) * 0.78;
    const beamLeft = project3D(Math.sin(sweepAz - 0.11) * 0.95, 0.92, 0.05, w, theaterH);
    const beamRight = project3D(Math.sin(sweepAz + 0.11) * 0.95, 0.92, 0.05, w, theaterH);
    const beamGrad = ctx.createLinearGradient(origin2D.sx, origin2D.sy, (beamLeft.sx + beamRight.sx) * 0.5, beamLeft.sy);
    beamGrad.addColorStop(0, isDaylight ? 'rgba(2, 132, 199, 0.26)' : 'rgba(56, 189, 248, 0.26)');
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
      const jL = project3D(Math.sin(jam.az - 0.13) * 0.98, 0.94, 0.12, w, theaterH);
      const jR = project3D(Math.sin(jam.az + 0.13) * 0.98, 0.94, 0.12, w, theaterH);
      const jC = project3D(Math.sin(jam.az) * 0.95, 0.92, 0.15, w, theaterH);
      ctx.fillStyle = priorEnabled
        ? isDaylight
          ? 'rgba(217, 119, 6, 0.11)'
          : 'rgba(251, 191, 36, 0.10)'
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
      ctx.font = '9px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = isDaylight ? '#b45309' : '#fbbf24';
      ctx.fillText(priorEnabled ? `${jam.id} [NULL -38dB]` : `${jam.id} [JAMMING]`, jC.sx - 34, Math.max(28, jC.sy));
    }

    // 5. Render 3D Targets, Altitude Drop-Stems, True vs. Estimated Tracker Trails & Covariance Ellipses
    const trkAlgo = trackerAlgos[trackerIdx];
    let linkedTarget = null;
    if (hoverInfo && hoverInfo.target) linkedTarget = hoverInfo.target;

    for (const tgt of targets) {
      const groundY = terrainHeight(tgt.x, tgt.z, currentMode);
      const pGround = project3D(tgt.x, tgt.z, groundY, w, theaterH);
      const pAir = project3D(tgt.x, tgt.z, groundY + tgt.alt, w, theaterH);
      const pEst = project3D(tgt.estX, tgt.estZ, groundY + tgt.alt, w, theaterH);
      tgt.screenX = pAir.sx;
      tgt.screenY = pAir.sy;

      // Ground shadow & altitude stem
      ctx.strokeStyle = isDaylight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pGround.sx, pGround.sy);
      ctx.lineTo(pAir.sx, pAir.sy);
      ctx.stroke();

      ctx.fillStyle = isDaylight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.ellipse(pGround.sx, pGround.sy, 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // True target wake (subtle dashed)
      if (tgt.trail.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < tgt.trail.length; i++) {
          const pt = tgt.trail[i];
          const gy = terrainHeight(pt.x, pt.z, currentMode);
          const pr = project3D(pt.x, pt.z, gy + tgt.alt, w, theaterH);
          if (i === 0) ctx.moveTo(pr.sx, pr.sy);
          else ctx.lineTo(pr.sx, pr.sy);
        }
        ctx.strokeStyle = isDaylight ? 'rgba(100, 116, 139, 0.35)' : 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Tracker Estimated Trail (solid bright cyan/emerald)
      if (tgt.estTrail.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < tgt.estTrail.length; i++) {
          const pt = tgt.estTrail[i];
          const gy = terrainHeight(pt.x, pt.z, currentMode);
          const pr = project3D(pt.x, pt.z, gy + tgt.alt, w, theaterH);
          if (i === 0) ctx.moveTo(pr.sx, pr.sy);
          else ctx.lineTo(pr.sx, pr.sy);
        }
        ctx.strokeStyle = isDaylight ? '#0284c7' : '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // 2-Sigma Tracker Uncertainty Covariance Ellipse around Estimated State
      const covRx = Math.max(7, (6.5 + tgt.errMeters * 0.34) * trkAlgo.covScale * pEst.scale * 0.55);
      const covRy = covRx * 0.62;
      ctx.fillStyle = isDaylight ? 'rgba(16, 185, 129, 0.14)' : 'rgba(52, 211, 153, 0.13)';
      ctx.strokeStyle = isDaylight ? 'rgba(5, 150, 105, 0.65)' : 'rgba(52, 211, 153, 0.62)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(pEst.sx, pEst.sy, covRx, covRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Highlight ring if hovered/linked from either 3D map or spectrum
      if (linkedTarget === tgt) {
        ctx.strokeStyle = isDaylight ? '#0f172a' : '#ffffff';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(pAir.sx, pAir.sy, 13, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Velocity leader vector + MIL-STD-2525E SDF Diamond
      const pVel = project3D(tgt.estX + tgt.estVx * 0.22, tgt.estZ + tgt.estVz * 0.22, groundY + tgt.alt, w, theaterH);
      ctx.strokeStyle = isDaylight ? '#0369a1' : '#bae6fd';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(pEst.sx, pEst.sy);
      ctx.lineTo(pVel.sx, pVel.sy);
      ctx.stroke();

      drawMil2525Symbol(pAir.sx, pAir.sy, 7.2, tgt.locked, isDaylight);

      // Tactical Callout Label
      ctx.font = '600 9.5px "JetBrains Mono", Consolas, monospace';
      const tag = `${tgt.id} (${tgt.errMeters.toFixed(0)}m)`;
      ctx.fillStyle = isDaylight ? '#0f172a' : '#f1f5f9';
      ctx.fillText(tag, pAir.sx + 10, pAir.sy - 6);
    }

    // Sensor Origin Array Marker
    ctx.fillStyle = isDaylight ? '#0284c7' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(origin2D.sx, origin2D.sy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Top-left Theater HUD Badge
    const cfg = modeConfigs[currentMode];
    ctx.fillStyle = isDaylight ? 'rgba(255, 255, 255, 0.84)' : 'rgba(5, 9, 18, 0.76)';
    ctx.fillRect(8, 7, 268, 18);
    ctx.font = '600 9px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = isDaylight ? '#0369a1' : '#93c5fd';
    ctx.fillText(cfg.theaterBadge, 13, 19);
    ctx.restore();

    // 6. Dock Divider Bar (Coupled Zero-Copy PSD + OS-CFAR + Peak-Hold Waterfall)
    ctx.fillStyle = isDaylight ? '#cbd5e1' : '#0b1324';
    ctx.fillRect(0, theaterH, w, 18);
    ctx.font = '600 9px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = isDaylight ? '#1e293b' : '#93c5fd';
    ctx.fillText('DOCKED ZERO-COPY SPECTRUM + PEAK-HOLD WATERFALL (0 MS CURSOR LOCK)', 10, theaterH + 12);

    // 7. Conditioned PSD + OS-CFAR Threshold Curve
    const dbToY = (db) => {
      const n = (db - MIN_DB) / (MAX_DB - MIN_DB);
      return psdBottom - Math.max(0, Math.min(1, n)) * (psdBottom - psdTop - 6) - 3;
    };

    ctx.fillStyle = isDaylight ? '#f8fafc' : '#050914';
    ctx.fillRect(0, psdTop, w, psdBottom - psdTop);

    // OS-CFAR Dashed Line
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = isDaylight ? 'rgba(100, 116, 139, 0.85)' : 'rgba(148, 163, 184, 0.62)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(smoothedThreshold[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // PSD Fill & Stroke
    ctx.beginPath();
    for (let i = 0; i < NUM_BINS; i++) {
      const x = (i / (NUM_BINS - 1)) * w;
      const y = dbToY(smoothedPower[i]);
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

    // Target lock markers on PSD
    for (const tgt of targets) {
      const px = tgt.liveBin * w;
      const py = dbToY(tgt.peakDb);
      ctx.fillStyle = tgt.locked ? (isDaylight ? '#0369a1' : '#f8fafc') : '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py, linkedTarget === tgt ? 4.8 : 3.2, 0, Math.PI * 2);
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

    // 8. Scrolling Peak-Hold Waterfall
    ctx.drawImage(wfCanvas, 0, wfTop, w, wfHeight);

    // 9. Zero-Lag Cross-View Sync Cursor (Links 3D Target <-> Spectrum/Waterfall!)
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
    } else if (hoverInfo && hoverInfo.inTheater) {
      const tip = 'Click 3D Theater to Spawn Maneuvering Target';
      ctx.font = '9.5px "JetBrains Mono", Consolas, monospace';
      const bw = ctx.measureText(tip).width + 12;
      const bx = Math.min(w - bw - 6, Math.max(6, hoverInfo.mx + 12));
      const by = Math.max(28, Math.min(theaterH - 24, hoverInfo.my - 22));
      ctx.fillStyle = isDaylight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(8, 15, 30, 0.90)';
      ctx.strokeStyle = isDaylight ? '#0284c7' : 'rgba(125, 211, 252, 0.45)';
      ctx.lineWidth = 1;
      ctx.fillRect(bx, by, bw, 18);
      ctx.strokeRect(bx, by, bw, 18);
      ctx.fillStyle = isDaylight ? '#0f172a' : '#e0f2fe';
      ctx.fillText(tip, bx + 6, by + 12.5);
    }

    requestAnimationFrame(renderFrame);
  }

  // Hover & Click interaction across BOTH 3D Theater and Docked Spectrum
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const theaterH = rect.height * 0.57;

    let nearTgt = null;
    if (my <= theaterH) {
      for (const tgt of targets) {
        if (Math.hypot(mx - (tgt.screenX || 0), my - (tgt.screenY || 0)) < 20) {
          nearTgt = tgt;
          break;
        }
      }
      hoverInfo = { mx, my, inTheater: true, target: nearTgt };
    } else {
      const bin = mx / Math.max(1, rect.width);
      for (const tgt of targets) {
        if (Math.abs(tgt.liveBin - bin) < 0.035) {
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
    const theaterH = rect.height * 0.57;

    // Clear target if clicked on either its 3D symbol or its spectrum peak
    if (hoverInfo && hoverInfo.target) {
      const idx = targets.indexOf(hoverInfo.target);
      if (idx !== -1) {
        targets.splice(idx, 1);
        hoverInfo = null;
        updateScorePill();
        return;
      }
    }

    if (targets.length >= 7) targets.shift();

    if (my <= theaterH) {
      const { nx, nz } = unprojectToGround(mx, my, rect.width, theaterH);
      targets.push(
        makeTarget({
          id: `TRK-0${synCounter++}`,
          cx: Math.max(-0.55, Math.min(0.55, nx * 0.72)),
          cz: Math.max(0.28, Math.min(0.76, nz)),
          rx: 0.21,
          rz: 0.14,
          omega: (Math.random() < 0.5 ? 1 : -1) * (0.9 + Math.random() * 0.4),
          phase: Math.random() * 6.28,
          alt: 0.2 + Math.random() * 0.14,
          snr: +(16.0 + Math.random() * 11.0).toFixed(1)
        })
      );
    } else {
      const u = Math.max(0.1, Math.min(0.9, mx / Math.max(1, rect.width)));
      targets.push(
        makeTarget({
          id: `TRK-0${synCounter++}`,
          cx: (u - 0.5) * 1.1,
          cz: 0.55,
          rx: 0.22,
          rz: 0.15,
          omega: u >= 0.5 ? 0.95 : -0.95,
          phase: 0.5,
          alt: 0.22,
          snr: 19.5
        })
      );
    }
    updateScorePill();
  });

  prewarmSimulation();
  updateScorePill();
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
    const lockedList = targets.filter((t) => t.locked);
    const maskedList = targets.filter((t) => !t.locked);
    const pdPct = total > 0 ? Math.round((lockedList.length / total) * 100) : 100;
    const meanErr =
      total > 0
        ? (targets.reduce((a, t) => a + (t.errMeters || 4.0), 0) / total).toFixed(1) + ' m'
        : 'N/A';

    if (reportKpis) {
      reportKpis.innerHTML = `
        <div class="kpi-box">
          <div class="kpi-label">Active Track Custody</div>
          <div class="kpi-val">${lockedList.length} / ${total} (${pdPct}%)</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">${trk.short} Mean Error</div>
          <div class="kpi-val">${meanErr}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Prior Conditioning</div>
          <div class="kpi-val">${priorEnabled ? '+14.8 dB Gain' : 'Off (Raw)'}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">PrioriEngine GPU</div>
          <div class="kpi-val">~0.85 ms</div>
        </div>
      `;
    }

    let rankText = '';
    if (total === 0) {
      rankText = '◈ NO ACTIVE TRACKS — Click anywhere in the 3D theater to spawn maneuvering targets.';
    } else if (maskedList.length > 0 && !priorEnabled) {
      rankText = `⚠ INTERFERENCE MASKED (${maskedList.length} LOST) — Toggle "Prior: ON" to null clutter/jamming and restore custody.`;
    } else if (trackerIdx === 2) {
      rankText = `⚠ MANEUVER LAG DETECTED (${meanErr} RMS) — Basic α-β filter overshoots during evasive turns. Cycle Tracker to IMM-EKF for tight custody.`;
    } else {
      rankText = `✓ TIGHT CUSTODY LOCKED (${trk.short} • ${meanErr} RMS) — Coupled 3D tracking + OS-CFAR holding all maneuvering targets cleanly.`;
    }
    if (reportRankBox) reportRankBox.textContent = rankText;

    if (reportNarrative) {
      reportNarrative.textContent = `Running ${trk.desc} paired with ${cfg.fftSize}-pt OS-CFAR in ${cfg.name} mode (${jammers.length} active jammer${jammers.length === 1 ? '' : 's'}, ${isDaylight ? 'MIL-STD-1472H Daylight' : 'Dark CIC'} UX).`;
    }

    if (reportTableBody) {
      if (targets.length === 0) {
        reportTableBody.innerHTML = `<tr><td colspan="5" style="color: var(--text-muted);">No active tracks.</td></tr>`;
      } else {
        reportTableBody.innerHTML = targets
          .map((t) => {
            const freqStr = binToPhysicalFreq(t.liveBin, currentMode);
            const marginStr = `${t.marginDb >= 0 ? '+' : ''}${t.marginDb.toFixed(1)} dB`;
            const pill = t.locked
              ? `<span class="status-pill-ok">LOCKED (${t.errMeters.toFixed(1)}m)</span>`
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

    const mdRows = targets
      .map(
        (t) =>
          `| ${t.id} | ${binToPhysicalFreq(t.liveBin, currentMode)} | +${t.snr.toFixed(1)} dB | ${t.errMeters.toFixed(1)} m | ${t.locked ? 'LOCKED' : 'MASKED'} |`
      )
      .join('\n');

    latestMarkdownBrief = `# A Priori Labs — PrioriEngine Mini-Console Brief
- **Theater Mode:** ${cfg.name} (${isDaylight ? 'Daylight Bridge UX' : 'Dark CIC UX'})
- **Tracker Algorithm:** ${trk.desc} (Mean Error: ${meanErr})
- **Signal Conditioning:** ${priorEnabled ? 'ENABLED (' + cfg.priorDesc + ')' : 'DISABLED'}

| Track ID | Doppler / Freq | Injected SNR | ${trk.short} Error | Status |
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

    const cppCode = `// A Priori Labs LLC — Zero-Heap C++23 ${trk.cppName} + OS-CFAR Pipeline
// Runs headless on ARM/x86/FPGA blades or plugs directly into PrioriEngine VRAM
#pragma once
#include <algorithm>
#include <array>
#include <span>

namespace apriori::tracking {

struct KinematicState2D {
    float x{0.0f}, z{0.0f}, vx{0.0f}, vz{0.0f};
};

struct ${trk.cppName} {
    static constexpr float kPosGain = ${trk.posGain.toFixed(3)}f;
    static constexpr float kVelGain = ${trk.velGain.toFixed(3)}f;

    static constexpr void step(KinematicState2D& s, float meas_x, float meas_z, float dt) noexcept {
        const float pred_x = s.x + s.vx * dt;
        const float pred_z = s.z + s.vz * dt;
        const float rx     = meas_x - pred_x;
        const float rz     = meas_z - pred_z;
        s.x  = pred_x + kPosGain * rx;
        s.z  = pred_z + kPosGain * rz;
        s.vx = s.vx   + (kVelGain / std::max(dt, 1e-3f)) * rx;
        s.vz = s.vz   + (kVelGain / std::max(dt, 1e-3f)) * rz;
    }
};

} // namespace apriori::tracking`;

    if (codeCppEl) codeCppEl.textContent = cppCode;

    const elapsedMs = Math.max(0.1, performance.now() - t0);
    if (modalEyebrow) {
      modalEyebrow.textContent = `PRIORI-ENGINE TELEMETRY // SYNTHESIZED IN ${elapsedMs.toFixed(2)} MS`;
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
