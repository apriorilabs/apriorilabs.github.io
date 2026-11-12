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

  // Real-time Physics/DSP Telemetry Canvas
  const canvas = document.getElementById('dspCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const readoutEl = document.getElementById('dspReadout');
  const modeTabs = document.querySelectorAll('.dsp-tab');

  let currentMode = 'radar';
  let t = 0;

  const modeConfigs = {
    radar: {
      readout: 'PIPELINE: 1024-PT DOPPLER // OS-CFAR (Pfa = 1e-5) // LATENCY: 0.42 ms',
      peaks: [
        { baseBin: 0.31, drift: 0.04, snr: 36, width: 0.016, label: 'TRK-01 (+18.4 m/s)' },
        { baseBin: 0.68, drift: -0.03, snr: 25, width: 0.014, label: 'TRK-02 (-9.2 m/s)' }
      ]
    },
    sonar: {
      readout: 'PIPELINE: MVDR ADAPTIVE BEAMFORMER // REVERB SUPPRESSION // GAIN: +14.8 dB',
      peaks: [
        { baseBin: 0.24, drift: 0.015, snr: 28, width: 0.012, label: 'TONAL-A (BRG 042°)' },
        { baseBin: 0.57, drift: 0.01, snr: 21, width: 0.018, label: 'BROADBAND-B (BRG 198°)' }
      ]
    },
    diag: {
      readout: 'PIPELINE: SPECTRAL INTEGRITY MONITOR // INTERFERENCE EXCISION ACTIVE',
      peaks: [
        { baseBin: 0.38, drift: 0.02, snr: 30, width: 0.015, label: 'VALID SIGNAL' },
        { baseBin: 0.76, drift: 0.005, snr: 44, width: 0.035, label: 'JAM / DRIFT ANOMALY', isAnomaly: true }
      ]
    }
  };

  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modeTabs.forEach((b) => b.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.getAttribute('data-mode') || 'radar';
      if (readoutEl && modeConfigs[currentMode]) {
        readoutEl.textContent = modeConfigs[currentMode].readout;
      }
    });
  });

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(180, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function sampleSpectrum(numBins, timeSec, mode) {
    const cfg = modeConfigs[mode] || modeConfigs.radar;
    const power = new Float32Array(numBins);
    const threshold = new Float32Array(numBins);

    for (let i = 0; i < numBins; i++) {
      const x = i / (numBins - 1);
      // Clutter / ambient background shape
      let clutter = -72;
      if (mode === 'radar') {
        // Zero-Doppler clutter ridge near center (0.5)
        clutter += 16 * Math.exp(-Math.pow((x - 0.5) / 0.055, 2));
      } else if (mode === 'sonar') {
        // Low-frequency ambient sea-state slope
        clutter += 18 * Math.exp(-x * 3.2);
      } else {
        // Elevated wideband noise shelf on upper band
        clutter += 10 * (1 / (1 + Math.exp(-(x - 0.68) * 28)));
      }

      // Deterministic pseudo-random Rayleigh/exponential bin ripple
      const ripple =
        3.2 * Math.sin(i * 0.73 + timeSec * 5.1) +
        2.4 * Math.cos(i * 1.91 - timeSec * 7.4) +
        1.6 * Math.sin(i * 3.37 + timeSec * 11.2);

      let signal = clutter + ripple;

      // Inject target / anomaly peaks
      for (const pk of cfg.peaks) {
        const center = pk.baseBin + pk.drift * Math.sin(timeSec * 0.55 + pk.baseBin * 6);
        const pulseMod = pk.isAnomaly ? (0.65 + 0.35 * Math.sin(timeSec * 3.4)) : 1.0;
        signal += pk.snr * pulseMod * Math.exp(-Math.pow((x - center) / pk.width, 2));
      }

      power[i] = signal;
    }

    // Sliding window OS-CFAR-like local baseline + guard cells
    const guard = 5;
    const train = 14;
    for (let i = 0; i < numBins; i++) {
      let sum = 0;
      let count = 0;
      for (let k = -train - guard; k <= train + guard; k++) {
        if (Math.abs(k) <= guard) continue;
        const idx = Math.min(numBins - 1, Math.max(0, i + k));
        // Clamp extreme anomaly spikes so adaptive threshold stays resilient (OS-CFAR behavior)
        sum += Math.min(power[idx], -46);
        count++;
      }
      threshold[i] = sum / Math.max(1, count) + 12.5;
    }

    return { power, threshold, cfg };
  }

  function renderFrame() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle dB & bin grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let r = 1; r < 5; r++) {
      const y = (h / 5) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let c = 1; c < 8; c++) {
      const x = (w / 8) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const numBins = 180;
    const { power, threshold, cfg } = sampleSpectrum(numBins, t, currentMode);

    const dbToY = (db) => {
      const minDb = -88;
      const maxDb = -12;
      const norm = (db - minDb) / (maxDb - minDb);
      return h - Math.max(0.04, Math.min(0.94, norm)) * (h - 24) - 10;
    };

    // Area fill under spectrum
    ctx.beginPath();
    for (let i = 0; i < numBins; i++) {
      const x = (i / (numBins - 1)) * w;
      const y = dbToY(power[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(96, 165, 250, 0.26)');
    grad.addColorStop(1, 'rgba(96, 165, 250, 0.01)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Adaptive CFAR threshold curve (dashed frost-slate)
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    for (let i = 0; i < numBins; i++) {
      const x = (i / (numBins - 1)) * w;
      const y = dbToY(threshold[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Primary PSD / Beamformer curve (crisp aerospace blue)
    ctx.beginPath();
    for (let i = 0; i < numBins; i++) {
      const x = (i / (numBins - 1)) * w;
      const y = dbToY(power[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight peak detections above CFAR threshold
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    for (const pk of cfg.peaks) {
      const center = pk.baseBin + pk.drift * Math.sin(t * 0.55 + pk.baseBin * 6);
      const binIdx = Math.min(numBins - 1, Math.max(0, Math.round(center * (numBins - 1))));
      if (power[binIdx] > threshold[binIdx]) {
        const px = (binIdx / (numBins - 1)) * w;
        const py = dbToY(power[binIdx]);
        const markerColor = pk.isAnomaly ? '#fbbf24' : '#f8fafc';

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = markerColor;
        ctx.fill();

        ctx.strokeStyle = pk.isAnomaly ? 'rgba(251, 191, 36, 0.65)' : 'rgba(147, 197, 253, 0.75)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.stroke();

        const labelX = Math.min(w - 148, Math.max(8, px - 56));
        const labelY = Math.max(18, py - 14);
        ctx.fillStyle = markerColor;
        ctx.fillText(pk.label, labelX, labelY);
      }
    }

    if (!prefersReducedMotion) {
      t += 0.018;
      requestAnimationFrame(renderFrame);
    }
  }

  renderFrame();
})();
