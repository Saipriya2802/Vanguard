document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STATE & AUDIO SYNTHESIZER
  // =========================================================================
  const state = {
    language: localStorage.getItem('moneysmart-language') || 'en',
    audioEnabled: true,
    progress: {
      stage1: false,
      stage2: false,
      stage3: false,
      stage4: false,
    },
    // Stage 1: Leak & 48-Hr State
    leak: {
      daily: 20,
      label: 'Cutting Chai & Samosa',
      isPausing: false,
      pauseCompleted: false,
    },
    // Stage 2: Rainy Day Challenge State
    survival: {
      totalBase: 2500,
      emergencyJar: 1000,
      wallet: 1500,
      isRunning: false,
      completed: false,
    },
    // Stage 3: RD Simulator State
    rdMonthly: 500,
    // Stage 4: Quiz State
    quiz: {
      q1: null,
      q2: null,
      q3: null,
    },
  };

  // Web Audio API Sound Synthesizer
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration = 0.15, type = 'sine', delay = 0) {
    if (!state.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }, delay * 1000);
    } catch (e) {}
  }

  function playSuccessTone() {
    playTone(523.25, 0.12, 'triangle', 0);    // C5
    playTone(659.25, 0.20, 'triangle', 0.1);  // E5
  }

  function playErrorTone() {
    playTone(180, 0.22, 'sawtooth', 0);
  }

  function playFanfare() {
    playTone(523.25, 0.12, 'triangle', 0);
    playTone(659.25, 0.12, 'triangle', 0.1);
    playTone(783.99, 0.14, 'triangle', 0.2);
    playTone(1046.50, 0.35, 'triangle', 0.32);
  }

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      document.getElementById('audioIcon').textContent = state.audioEnabled ? '🔊' : '🔇';
      document.getElementById('audioText').textContent = state.audioEnabled ? 'Sound ON' : 'Muted';
    });
  }

  // =========================================================================
  // 2. MULTI-LANGUAGE DICTIONARY (EN, TE, HI)
  // =========================================================================
  const i18n = {
    en: {
      headerTitle: 'Save & Manage',
      headerTagline: 'Build Habits, Expect the Unexpected',
      payTitle: 'Rule Spotlight: "Pay Yourself First"',
      payDesc: "Most students wait until month-end to save whatever is left over — usually ₹0. The golden habit: The moment money enters your hands, immediately route a fixed 20% into your Emergency Jar, then spend the rest guilt-free!",
      stage1T: 'The "Chai & Snack" Leak Calculator',
      stage1D: 'Small, unnoticed daily expenses quietly drain student finances. Discover how micro-habits compound over 12 months!',
      stage2T: 'Rainy Day Survival Challenge: 4 Weeks of Student Life',
      stage2D: 'You start with a total monthly allowance of ₹2,500. Divide it between your Daily Spending Wallet and your locked Emergency Jar, then face 4 unexpected real-world crisis cards!',
      stage3T: 'Safe vs. Unsafe Tools: Where Does Your Money Live?',
      stage3D: 'Not all savings places are created equal. Compare beginner-friendly storage vehicles to protect your cash from theft, inflation, and impulse leaks!',
      stage4T: 'Stage 4: Practical Checkpoint Quiz',
      stage4D: 'Demonstrate your mastery of sustainable saving habits and unlock the official "Emergency Proof" badge!',
      emergencyBadge: 'Badge: Emergency Proof',
    },
    te: {
      headerTitle: 'పొదుపు మరియు నిర్వహణ',
      headerTagline: 'మంచి అలవాట్లను నిర్మించండి, ఊహించని ఖర్చులను ఎదుర్కోండి',
      payTitle: 'గోల్డెన్ నియమం: "ముందు మీకే చెల్లించండి" (Pay Yourself First)',
      payDesc: 'ఖర్చులు అయిపోయాక మిగిలినది దాచుకోవడం కాదు; చేతికి డబ్బు రాగానే మొదట 20% ఎమర్జెన్సీ జార్‌లో ఉంచండి, ఆ తర్వాత మిగిలినది మనశ్శాంతిగా ఖర్చు చేయండి!',
      stage1T: '"చాయ్ & స్నాక్" ఖర్చుల లీక్ కాలిక్యులేటర్',
      stage1D: 'చిన్న రోజువారీ ఖర్చులు విద్యార్థుల పొదుపును ఎలా హరిస్తాయో తెలుసుకోండి. 12 నెలల్లో ఈ చిన్న మొత్తం ఎంత పెద్దదవుతుందో చూడండి!',
      stage2T: 'వర్షపు రోజు మనుగడ సవాలు: 4 వారాల విద్యార్థి జీవితం',
      stage2D: 'మీ వద్ద ₹2,500 ఉన్నాయి. ఖర్చు వాలెట్ మరియు ఎమర్జెన్సీ జార్ మధ్య విభజించి 4 ఊహించని సంక్షోభాలను ఎదుర్కోండి!',
      stage3T: 'సురక్షితమైన vs ప్రమాదకరమైన పొదుపు సాధనాలు',
      stage3D: 'డబ్బును ఎక్కడ దాచుకుంటే సురక్షితం? దొంగతనం, ద్రవ్యోల్బణం నుండి రక్షణ పొందడానికి మార్గాలను సరిపోల్చండి!',
      stage4T: 'దశ 4: ప్రాక్టికల్ చెక్‌పాయింట్ క్విజ్',
      stage4D: 'పొదుపు అలవాట్లను నిరూపించుకుని అధికారిక "ఎమర్జెన్సీ ప్రూఫ్" బ్యాడ్జిని అన్‌లాక్ చేయండి!',
      emergencyBadge: 'బ్యాడ్జి: ఎమర్జెన్సీ ప్రూఫ్',
    },
    hi: {
      headerTitle: 'बचत और प्रबंधन',
      headerTagline: 'आदतें बनाएं, अप्रत्याशित खर्चों के लिए तैयार रहें',
      payTitle: 'सुनहरा नियम: "पहले खुद को भुगतान करें" (Pay Yourself First)',
      payDesc: 'महीना खत्म होने पर जो बचे उसे बचाने की बजाय, जेब में पैसा आते ही 20% पहले इमरजेंसी जार में डालें, फिर बाकी आराम से खर्च करें!',
      stage1T: '"चाय और स्नैक" लीक कैलकुलेटर',
      stage1D: 'दैनिक छोटे-छोटे खर्च कैसे चुपचाप आपकी बचत को खत्म कर देते हैं। देखें 12 महीनों में यह छोटी आदत कितनी बड़ी बन जाती है!',
      stage2T: 'रेनी डे सर्वाइवल चैलेंज: 4 हफ्तों का छात्र जीवन',
      stage2D: 'आपके पास ₹2,500 हैं। इसे खर्च वॉलेट और इमरजेंसी जार में बांटें और 4 अप्रत्याशित संकटों का सामना करें!',
      stage3T: 'सुरक्षित बनाम असुरक्षित उपकरण: आपका पैसा कहां रहे?',
      stage3D: 'सभी बचत उपकरण एक जैसे नहीं होते। चोरी और महंगाई से बचने के लिए सही जगह चुनें!',
      stage4T: 'चरण 4: व्यावहारिक चेकपॉइंट क्विज़',
      stage4D: 'सस्टेनेबल बचत की आदतें साबित करें और "इमरजेंसी प्रूफ" बैज अनलॉक करें!',
      emergencyBadge: 'बैज: इमरजेंसी प्रूफ',
    },
  };

  function applyLanguage(lang) {
    state.language = lang;
    localStorage.setItem('moneysmart-language', lang);
    if (window.MoneySmart && window.MoneySmart.setLanguage) {
      window.MoneySmart.setLanguage(lang);
    }

    document.querySelectorAll('.lang-pill[data-lang]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const texts = i18n[lang] || i18n.en;
    const hT = document.getElementById('savingsHeaderTitle');
    const hTag = document.getElementById('savingsHeaderTagline');
    const pT = document.getElementById('payFirstTitle');
    const pD = document.getElementById('payFirstDesc');
    const s1T = document.getElementById('stage1Title');
    const s1D = document.getElementById('stage1Desc');
    const s2T = document.getElementById('stage2Title');
    const s2D = document.getElementById('stage2Desc');
    const s3T = document.getElementById('stage3Title');
    const s3D = document.getElementById('stage3Desc');
    const s4T = document.getElementById('stage4Title');
    const s4D = document.getElementById('stage4Desc');
    const bLbl = document.getElementById('badgeChipLabel');

    if (hT) hT.textContent = texts.headerTitle;
    if (hTag) hTag.textContent = texts.headerTagline;
    if (pT) pT.textContent = texts.payTitle;
    if (pD) pD.textContent = texts.payDesc;
    if (s1T) s1T.textContent = texts.stage1T;
    if (s1D) s1D.textContent = texts.stage1D;
    if (s2T) s2T.textContent = texts.stage2T;
    if (s2D) s2D.textContent = texts.stage2D;
    if (s3T) s3T.textContent = texts.stage3T;
    if (s3D) s3D.textContent = texts.stage3D;
    if (s4T) s4T.textContent = texts.stage4T;
    if (s4D) s4D.textContent = texts.stage4D;
    if (bLbl) bLbl.textContent = texts.emergencyBadge;
  }

  document.querySelectorAll('.lang-pill[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // =========================================================================
  // 3. PROGRESS TRACKER & STEPPER NAVIGATION
  // =========================================================================
  function updateProgress() {
    const stages = [state.progress.stage1, state.progress.stage2, state.progress.stage3, state.progress.stage4];
    const completedCount = stages.filter(Boolean).length;
    const percent = Math.round((completedCount / 4) * 100);

    const progressFill = document.getElementById('savingsProgressFill');
    const progressText = document.getElementById('savingsProgressText');
    const stageLabel = document.getElementById('savingsActiveStageLabel');

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `Module 2 of 4: ${percent}% Complete`;

    const stageNames = [
      'Stage 1: Habit Leak & 48-Hr Rule',
      'Stage 2: Rainy Day Challenge',
      'Stage 3: Where to Keep Savings',
      'Stage 4: Checkpoint & Reward',
    ];
    if (stageLabel) stageLabel.textContent = stageNames[Math.min(completedCount, 3)];

    document.querySelectorAll('.stepper-step').forEach((step, idx) => {
      if (stages[idx]) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
    });

    if (window.MoneySmart) {
      const userProgress = window.MoneySmart.getProgress();
      const pointsCounter = document.getElementById('savingsPointsCounter');
      if (pointsCounter) pointsCounter.textContent = `${userProgress.points || 0} Points`;

      const hasBadge = (userProgress.badges || []).includes('emergency-proof') || userProgress.savingsCompleted;
      const badgeChip = document.getElementById('emergencyProofBadgeChip');
      if (badgeChip) {
        if (hasBadge) {
          badgeChip.classList.add('unlocked');
          badgeChip.innerHTML = '<span>🛡️</span> <span>Badge: Emergency Proof Unlocked!</span>';
        } else {
          badgeChip.classList.remove('unlocked');
          badgeChip.innerHTML = '<span>🔒</span> <span>Badge: Emergency Proof</span>';
        }
      }
    }
  }

  document.querySelectorAll('.stepper-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stepper-step').forEach((s) => s.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // =========================================================================
  // 4. STAGE 1: CHAI & SNACK LEAK CALCULATOR & 48-HR RULE
  // =========================================================================
  function updateLeakCalculator(dailyAmount, label) {
    state.leak.daily = dailyAmount;
    if (label) state.leak.label = label;

    const monthly = dailyAmount * 30;
    const yearly = dailyAmount * 365;

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const dailyEl = document.getElementById('leakDailyAmount');
    const monthlyEl = document.getElementById('leakMonthlyAmount');
    const yearlyEl = document.getElementById('leakYearlyAmount');
    const headingEl = document.getElementById('leakItemHeading');
    const customText = document.getElementById('customDailyText');
    const customSlider = document.getElementById('customDailySlider');
    const milestoneDesc = document.getElementById('leakMilestoneDesc');

    if (dailyEl) dailyEl.textContent = formatINR(dailyAmount);
    if (monthlyEl) monthlyEl.textContent = formatINR(monthly);
    if (yearlyEl) yearlyEl.textContent = formatINR(yearly);
    if (headingEl) headingEl.textContent = `Habit: ${state.leak.label}`;
    if (customText) customText.textContent = `${formatINR(dailyAmount)} / day`;
    if (customSlider) customSlider.value = dailyAmount;

    if (milestoneDesc) {
      if (yearly < 5000) {
        milestoneDesc.textContent = `That ${formatINR(yearly)} easily covers your college semester exam registration fees (₹1,500) PLUS high-speed 4G data for your entire academic year!`;
      } else if (yearly < 12000) {
        milestoneDesc.textContent = `That ${formatINR(yearly)} could fully fund a full year of college reference textbooks (₹4,000) PLUS a professional coding / design certification exam (₹3,000)!`;
      } else {
        milestoneDesc.textContent = `That ${formatINR(yearly)} provides a massive down-payment toward a dedicated student study laptop or high-end tablet!`;
      }
    }
  }

  document.querySelectorAll('.leak-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.leak-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const daily = Number(chip.dataset.daily) || 20;
      updateLeakCalculator(daily, chip.dataset.label);
      playTone(480, 0.08, 'sine');
    });
  });

  const customDailySlider = document.getElementById('customDailySlider');
  if (customDailySlider) {
    customDailySlider.addEventListener('input', (e) => {
      document.querySelectorAll('.leak-chip').forEach((c) => c.classList.remove('active'));
      const daily = Number(e.target.value) || 20;
      updateLeakCalculator(daily, 'Custom Daily Expense');
    });
  }

  // 48-Hour Pause Chamber Simulation
  const start48HrBtn = document.getElementById('start48HrPauseBtn');
  if (start48HrBtn) {
    start48HrBtn.addEventListener('click', () => {
      if (state.leak.isPausing) return;
      state.leak.isPausing = true;
      start48HrBtn.disabled = true;

      const gaugeSection = document.getElementById('feverGaugeSection');
      const feverBar = document.getElementById('pauseFeverBar');
      const hoursText = document.getElementById('pauseHoursText');
      const feverPercent = document.getElementById('pauseFeverPercent');
      const narrative = document.getElementById('pauseNarrative');

      if (gaugeSection) gaugeSection.style.display = 'block';

      // Stage 1: Hour 0
      hoursText.textContent = 'Hour 0 of 48: High Emotional Craving (FOMO spike)';
      feverPercent.textContent = '100% Impulse Fever';
      feverBar.style.width = '100%';
      narrative.textContent = '🔥 High adrenaline! Brain says "Buy now or miss out forever!"';
      playTone(400, 0.15, 'sawtooth');

      // Stage 2: Hour 24
      setTimeout(() => {
        hoursText.textContent = 'Hour 24 of 48: Emotional Heat Cooling';
        feverPercent.textContent = '45% Impulse Fever';
        feverBar.style.width = '45%';
        narrative.textContent = '❄️ Urge cools. You realize your current earphones work fine and reviews say battery life is average.';
        playTone(550, 0.12, 'triangle');
      }, 1400);

      // Stage 3: Hour 48
      setTimeout(() => {
        hoursText.textContent = 'Hour 48 of 48: Complete Clarity Achieved';
        feverPercent.textContent = '0% Impulse Fever';
        feverBar.style.width = '0%';
        narrative.innerHTML = '🎉 <strong>Impulse successfully eliminated!</strong> You saved ₹1,499 without sacrificing your peace of mind. Over 70% of impulse cravings evaporate within 48 hours!';
        playSuccessTone();

        state.leak.isPausing = false;
        state.progress.stage1 = true;
        updateProgress();

        if (window.MoneySmart) {
          const p = window.MoneySmart.getProgress();
          p.points = (p.points || 0) + 15;
          window.MoneySmart.saveProgress(p);
          updateProgress();
        }
      }, 2800);
    });
  }

  // =========================================================================
  // 5. STAGE 2: RAINY DAY SURVIVAL CHALLENGE (4 WEEKS)
  // =========================================================================
  const splitJarSlider = document.getElementById('splitJarSlider');
  function updateSplitAllocation(emergencyAmount) {
    emergencyAmount = Math.max(0, Math.min(emergencyAmount, state.survival.totalBase));
    const walletAmount = state.survival.totalBase - emergencyAmount;

    state.survival.emergencyJar = emergencyAmount;
    state.survival.wallet = walletAmount;

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const walletPercent = Math.round((walletAmount / state.survival.totalBase) * 100);
    const emergencyPercent = Math.round((emergencyAmount / state.survival.totalBase) * 100);

    const walletEl = document.getElementById('displayWalletAmount');
    const emergencyEl = document.getElementById('displayEmergencyAmount');

    if (walletEl) walletEl.textContent = `${formatINR(walletAmount)} (${walletPercent}%)`;
    if (emergencyEl) emergencyEl.textContent = `${formatINR(emergencyAmount)} (${emergencyPercent}%)`;

    if (splitJarSlider) splitJarSlider.value = emergencyAmount;
  }

  if (splitJarSlider) {
    splitJarSlider.addEventListener('input', (e) => {
      document.querySelectorAll('.split-preset-btn').forEach((b) => b.classList.remove('active'));
      updateSplitAllocation(Number(e.target.value) || 0);
    });
  }

  document.querySelectorAll('.split-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.split-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateSplitAllocation(Number(btn.dataset.emergency) || 0);
      playTone(520, 0.08, 'sine');
    });
  });

  const crisisEvents = [
    { week: 1, title: 'Shattered Phone Screen', cost: 600 },
    { week: 2, title: "Friend's Birthday Dinner", cost: 350 },
    { week: 3, title: 'Sudden Viral Fever Clinic', cost: 450 },
    { week: 4, title: 'College Symposium Project', cost: 300 },
  ];

  function runSurvivalChallenge() {
    if (state.survival.isRunning) return;
    state.survival.isRunning = true;

    const startBtn = document.getElementById('startSurvivalBtn');
    if (startBtn) startBtn.disabled = true;

    // Reset week cards visually
    for (let w = 1; w <= 4; w++) {
      const card = document.getElementById(`weekCard-${w}`);
      const statusPill = document.getElementById(`weekStatus-${w}`);
      if (card) card.className = 'survival-week-card';
      if (statusPill) statusPill.style.display = 'none';
    }

    const banner = document.getElementById('survivalOutcomeBanner');
    const icon = document.getElementById('survivalOutcomeIcon');
    const text = document.getElementById('survivalOutcomeText');

    if (banner) {
      banner.style.display = 'flex';
      banner.className = 'consequence-feed-card feed-alert-success';
      icon.textContent = '🚀';
      text.textContent = 'Week 1 underway... Testing your financial buffer against real life shocks!';
    }

    let currentEmergency = state.survival.emergencyJar;
    let currentWallet = state.survival.wallet;
    let weekIndex = 0;

    const interval = setInterval(() => {
      if (weekIndex >= crisisEvents.length) {
        clearInterval(interval);
        state.survival.isRunning = false;
        if (startBtn) startBtn.disabled = false;

        // Final Outcome
        if (currentWallet >= 0 && currentEmergency >= 0) {
          banner.className = 'consequence-feed-card feed-alert-success';
          icon.textContent = '🎉';
          text.innerHTML = `<strong>SURVIVAL MASTER!</strong> You navigated all 4 weeks of unexpected student surprises without borrowing or overdrawing! Emergency Jar preserved ₹${currentEmergency} and your Daily Wallet finished at ₹${currentWallet}!`;
          playFanfare();

          state.progress.stage2 = true;
          updateProgress();

          if (window.MoneySmart) {
            const p = window.MoneySmart.getProgress();
            p.points = (p.points || 0) + 20;
            window.MoneySmart.saveProgress(p);
            updateProgress();
          }
        }
        return;
      }

      const event = crisisEvents[weekIndex];
      const weekNum = event.week;
      const card = document.getElementById(`weekCard-${weekNum}`);
      const statusPill = document.getElementById(`weekStatus-${weekNum}`);

      if (card) card.classList.add('active-week');

      // Check absorption
      if (currentEmergency >= event.cost) {
        currentEmergency -= event.cost;
        if (card) {
          card.classList.remove('active-week');
          card.classList.add('absorbed');
        }
        if (statusPill) {
          statusPill.style.display = 'block';
          statusPill.className = 'comic-status-pill comic-status-ok';
          statusPill.textContent = `Absorbed by Jar! (Jar Left: ₹${currentEmergency})`;
        }
        text.textContent = `Week ${weekNum}: Emergency Jar absorbed the ₹${event.cost} cost for ${event.title}! Daily spending remained 100% safe.`;
        playTone(650, 0.12, 'triangle');
      } else {
        // Emergency jar can't fully cover it; leak into daily wallet!
        const leftoverCost = event.cost - currentEmergency;
        currentEmergency = 0;
        currentWallet -= leftoverCost;

        if (currentWallet < 0) {
          // Failure State!
          if (card) {
            card.classList.remove('active-week');
            card.classList.add('overdrawn');
          }
          if (statusPill) {
            statusPill.style.display = 'block';
            statusPill.className = 'comic-status-pill comic-status-danger';
            statusPill.textContent = `Overdrawn! Deficit: -₹${Math.abs(currentWallet)}`;
          }
          banner.className = 'consequence-feed-card feed-alert-danger';
          icon.textContent = '🚨';
          text.innerHTML = `<strong>CRITICAL FAILURE (Week ${weekNum}):</strong> Account overdrawn by -₹${Math.abs(currentWallet)}! Because your Emergency Jar was underfunded, the ${event.title} cost (₹${event.cost}) wiped out your daily spending money. You must now borrow money or skip important college project printouts! <em>Click "Reset & Optimize Buffer" to fund your Emergency Jar and try again.</em>`;
          playErrorTone();

          clearInterval(interval);
          state.survival.isRunning = false;
          if (startBtn) startBtn.disabled = false;
          return;
        } else {
          // Barely survived
          if (card) {
            card.classList.remove('active-week');
            card.classList.add('absorbed');
          }
          if (statusPill) {
            statusPill.style.display = 'block';
            statusPill.className = 'comic-status-pill comic-status-warn';
            statusPill.textContent = `Drained Jar + Wallet Left: ₹${currentWallet}`;
          }
          text.textContent = `Week ${weekNum}: Jar was drained! You had to use ₹${leftoverCost} from your daily spending wallet.`;
          playTone(450, 0.15, 'sawtooth');
        }
      }

      weekIndex++;
    }, 1100);
  }

  const startSurvivalBtn = document.getElementById('startSurvivalBtn');
  if (startSurvivalBtn) startSurvivalBtn.addEventListener('click', runSurvivalChallenge);

  const resetSurvivalBtn = document.getElementById('resetSurvivalBtn');
  if (resetSurvivalBtn) {
    resetSurvivalBtn.addEventListener('click', () => {
      updateSplitAllocation(1000);
      for (let w = 1; w <= 4; w++) {
        const card = document.getElementById(`weekCard-${w}`);
        const statusPill = document.getElementById(`weekStatus-${w}`);
        if (card) card.className = 'survival-week-card';
        if (statusPill) statusPill.style.display = 'none';
      }
      const banner = document.getElementById('survivalOutcomeBanner');
      if (banner) banner.style.display = 'none';
      playTone(500, 0.08, 'sine');
    });
  }

  // =========================================================================
  // 6. STAGE 3: WHERE TO KEEP SAVINGS (1-YEAR RD SIMULATOR)
  // =========================================================================
  function updateRDSimulator(monthly) {
    state.rdMonthly = monthly;
    const principal = monthly * 12;

    // Mattress = 0% interest
    const mattress = principal;
    // Savings Bank Account ~ 2.8%
    const bank = Math.round(principal + (principal * 0.028 / 2));
    // 1-Year Recurring Deposit ~ 7.0% compounded quarterly
    // RD maturity formula approx: P * n + P * (n*(n+1)/2) * (r / 12)
    const rdInterest = Math.round(monthly * (12 * 13 / 2) * (0.070 / 12));
    const rdTotal = principal + rdInterest;

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const mEl = document.getElementById('mattressTotal');
    const bEl = document.getElementById('bankTotal');
    const rdEl = document.getElementById('rdTotal');

    if (mEl) mEl.textContent = formatINR(mattress);
    if (bEl) bEl.textContent = formatINR(bank);
    if (rdEl) rdEl.textContent = formatINR(rdTotal);
  }

  document.querySelectorAll('.rd-sim-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.rd-sim-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      updateRDSimulator(Number(pill.dataset.monthly) || 500);
      playTone(540, 0.08, 'sine');
      state.progress.stage3 = true;
      updateProgress();
    });
  });

  // =========================================================================
  // 7. STAGE 4: CHECKPOINT QUIZ & BADGE UNLOCK
  // =========================================================================
  const quizAnswers = {
    1: {
      correct: 'b',
      explanation: 'Under "Pay Yourself First", saving ₹300–₹400 immediately ensures emergency resilience, while the remaining ₹600 can be spent happily without guilt.',
    },
    2: {
      correct: 'b',
      explanation: 'The 48-Hour Rule gives your brain chemistry time to calm down from flash sales and FOMO, preventing 70%+ of regret purchases.',
    },
    3: {
      correct: 'a',
      explanation: 'Regulated bank accounts prevent theft, earn real interest, and an automated RD builds an unbreakable habit that curbs impulsive withdrawals.',
    },
  };

  document.querySelectorAll('.quiz-q-card').forEach((card) => {
    const qNum = Number(card.dataset.q);
    const buttons = card.querySelectorAll('.quiz-opt-btn');
    const feedbackBox = card.querySelector('.quiz-feedback-box');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedOpt = btn.dataset.opt;
        const correctOpt = quizAnswers[qNum].correct;
        const isCorrect = selectedOpt === correctOpt;

        state.quiz[`q${qNum}`] = isCorrect;

        buttons.forEach((b) => {
          b.disabled = true;
          if (b.dataset.opt === correctOpt) {
            b.classList.add('correct');
          } else if (b === btn && !isCorrect) {
            b.classList.add('wrong');
          }
        });

        if (feedbackBox) {
          feedbackBox.hidden = false;
          if (isCorrect) {
            feedbackBox.style.background = '#dcfce7';
            feedbackBox.style.color = '#15803d';
            feedbackBox.innerHTML = `<strong>Correct!</strong> ${quizAnswers[qNum].explanation}`;
            playSuccessTone();
          } else {
            feedbackBox.style.background = '#fee2e2';
            feedbackBox.style.color = '#b91c1c';
            feedbackBox.innerHTML = `<strong>Incorrect.</strong> ${quizAnswers[qNum].explanation}`;
            playErrorTone();
          }
        }

        checkQuizCompletion();
      });
    });
  });

  function checkQuizCompletion() {
    const { q1, q2, q3 } = state.quiz;
    if (q1 !== null && q2 !== null && q3 !== null) {
      state.progress.stage4 = true;
      updateProgress();

      const achievementCard = document.getElementById('achievementCard');
      if (achievementCard) {
        achievementCard.hidden = false;
        achievementCard.scrollIntoView({ behavior: 'smooth' });
      }

      playFanfare();

      if (window.MoneySmart) {
        window.MoneySmart.completeModule('savings', 50);
        updateProgress();
      }
    }
  }

  // Initial setup
  updateLeakCalculator(20, 'Cutting Chai & Samosa');
  updateSplitAllocation(1000);
  updateRDSimulator(500);
  updateProgress();
  applyLanguage(state.language);
});
