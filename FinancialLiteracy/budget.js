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
    // Rapid Sorter State
    sorter: {
      index: 0,
      score: 0,
      streak: 0,
      completed: false,
    },
    // Simulator State
    sim: {
      persona: 'dayscholar',
      allowance: 3000,
      commute: 450,
      food: 900,
      study: 400,
      phone: 300,
      outings: 450,
      isSimulating: false,
    },
    // Goal Calculator State
    goal: {
      title: 'Entrance Test Registration Fee',
      cost: 1200,
      months: 3,
    },
    // Quiz State
    quiz: {
      q1: null,
      q2: null,
      q3: null,
    },
  };

  // Audio synthesis via Web Audio API (Zero external dependencies)
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
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  function playSuccessTone() {
    playTone(523.25, 0.12, 'triangle', 0);    // C5
    playTone(659.25, 0.20, 'triangle', 0.1);  // E5
  }

  function playErrorTone() {
    playTone(180, 0.22, 'sawtooth', 0);
  }

  function playFanfare() {
    playTone(523.25, 0.12, 'triangle', 0);    // C5
    playTone(659.25, 0.12, 'triangle', 0.1);  // E5
    playTone(783.99, 0.14, 'triangle', 0.2);  // G5
    playTone(1046.50, 0.35, 'triangle', 0.32); // C6
  }

  // Audio Toggle Button
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
      pillarTitle: 'Plan & Budget',
      pillarTagline: 'Master Your Money Before It Masters You',
      ruleTitle: '⚡ Quick Rule of Thumb: The 50 / 30 / 20 Guideline',
      ruleSubtitle: 'The golden framework to prevent running out of money before month-end.',
      needsTag: '50% Needs (Survival & Study)',
      wantsTag: '30% Wants (Fun & Lifestyle)',
      savingsTag: '20% Savings (Future Shield)',
      stage1Title: 'Build Your Intuition Before Spending',
      stage1Desc: "Explore Rahul's real-life dilemma in Hyderabad, then test your instinct in the 30-second Rapid Sorter!",
      stage2Title: 'The 30-Day Budget Lab: Make Choices, See Consequences',
      stage2Desc: 'Pick a student persona, allocate your digital allowance across weekly expenses, and run the 30-Day Calendar Simulation!',
      stage3Title: 'Bridge Simulation to Your Real Life',
      stage3Desc: 'Now transition from fictional characters to your personal reality. What is one real financial goal you want to fund?',
      stage4Title: 'Stage 4: Quiz Check & Achievement Reward',
      stage4Desc: 'Answer the 3 scenario questions below to confirm your comprehension and unlock the prestigious "Budget Boss" badge!',
      bossBadge: 'Badge: Budget Boss',
    },
    te: {
      pillarTitle: 'ప్లాన్ మరియు బడ్జెట్',
      pillarTagline: 'డబ్బు మిమ్మల్ని నియంత్రించే ముందే, మీరు మీ డబ్బును నియంత్రించండి',
      ruleTitle: '⚡ గోల్డెన్ నియమం: 50 / 30 / 20 సూత్రం',
      ruleSubtitle: 'నెల చివరికి డబ్బు అయిపోకుండా కాపాడే ప్రామాణిక సూత్రం.',
      needsTag: '50% అవసరాలు (చదువు & జీవితం)',
      wantsTag: '30% కోరికలు (వినోదం & ఇష్టాలు)',
      savingsTag: '20% పొదుపు (భవిష్యత్ రక్షణ)',
      stage1Title: 'ఖర్చు చేసేముందే అవగాహన పెంచుకోండి',
      stage1Desc: 'హైదరాబాద్‌లో రాహుల్ కథను పరిశీలించి, 30 సెకన్ల రాపిడ్ సార్టర్ గేమ్ ఆడండి!',
      stage2Title: '30 రోజుల బడ్జెట్ ల్యాబ్: నిర్ణయాలు తీసుకోండి, పరిణామాలు చూడండి',
      stage2Desc: 'విద్యార్థి పర్సొనాను ఎంచుకోండి, బడ్జెట్ కేటాయించండి, 30 రోజుల క్యాలెండర్ సిమ్యులేషన్ రన్ చేయండి!',
      stage3Title: 'సిమ్యులేషన్ నుండి నిజ జీవితానికి మార్గం',
      stage3Desc: 'మీ వ్యక్తిగత ఆర్థిక లక్ష్యాన్ని ఎంచుకోండి మరియు రోజువారీ పొదుపు ప్లాన్ పొందండి!',
      stage4Title: 'క్విజ్ చెక్ & సాధించిన బ్యాడ్జి రివార్డ్',
      stage4Desc: '3 ప్రశ్నలకు సమాధానమిచ్చి గౌరవప్రదమైన "బడ్జెట్ బాస్" బ్యాడ్జిని అన్‌లాక్ చేయండి!',
      bossBadge: 'బ్యాడ్జి: బడ్జెట్ బాస్',
    },
    hi: {
      pillarTitle: 'योजना और बजट',
      pillarTagline: 'पैसा आप पर हावी हो, उससे पहले पैसे का प्रबंधन सीखें',
      ruleTitle: '⚡ त्वरित नियम: 50 / 30 / 20 की सुनहरी मार्गदर्शिका',
      ruleSubtitle: 'महीना खत्म होने से पहले जेब खाली होने से बचाने का अचूक तरीका।',
      needsTag: '50% ज़रूरतें (पढ़ाई व जीवन)',
      wantsTag: '30% चाहतें (मनोरंजन व शौक)',
      savingsTag: '20% बचत (भविष्य की सुरक्षा)',
      stage1Title: 'खर्च करने से पहले बुनियादी समझ बनाएं',
      stage1Desc: 'हैदराबाद में राहुल की कहानी देखें, फिर 30 सेकंड का रैपिड सॉर्टर खेलें!',
      stage2Title: '30-दिवसीय बजट लैब: निर्णय लें, परिणाम देखें',
      stage2Desc: 'एक छात्र का किरदार चुनें, बजट आवंटित करें और 30-दिवसीय कैलेंडर सिमुलेशन चलाएं!',
      stage3Title: 'सिमुलेशन से अपनी वास्तविक ज़िंदगी की ओर',
      stage3Desc: 'काल्पनिक कहानी से अपनी वास्तविकता पर आएं। आपका असली वित्तीय लक्ष्य क्या है?',
      stage4Title: 'चरण 4: क्विज़ जांच एवं उपलब्धि पुरस्कार',
      stage4Desc: '3 परिदृश्य आधारित सवालों के जवाब देकर प्रतिष्ठित "बजट बॉस" बैज अनलॉक करें!',
      bossBadge: 'बैज: बजट बॉस',
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
    const titleEl = document.getElementById('pillarHeaderTitle');
    const tagEl = document.getElementById('pillarHeaderTagline');
    const ruleTitleEl = document.getElementById('ruleThumbTitle');
    const ruleSubEl = document.getElementById('ruleThumbSubtitle');
    const stage1T = document.getElementById('stage1Title');
    const stage1D = document.getElementById('stage1Desc');
    const stage2T = document.getElementById('stage2Title');
    const stage2D = document.getElementById('stage2Desc');
    const stage3T = document.getElementById('stage3Title');
    const stage3D = document.getElementById('stage3Desc');
    const stage4T = document.getElementById('stage4Title');
    const stage4D = document.getElementById('stage4Desc');
    const badgeLabel = document.getElementById('badgeChipLabel');

    if (titleEl) titleEl.textContent = texts.pillarTitle;
    if (tagEl) tagEl.textContent = texts.pillarTagline;
    if (ruleTitleEl) ruleTitleEl.textContent = texts.ruleTitle;
    if (ruleSubEl) ruleSubEl.textContent = texts.ruleSubtitle;
    if (stage1T) stage1T.textContent = texts.stage1Title;
    if (stage1D) stage1D.textContent = texts.stage1Desc;
    if (stage2T) stage2T.textContent = texts.stage2Title;
    if (stage2D) stage2D.textContent = texts.stage2Desc;
    if (stage3T) stage3T.textContent = texts.stage3Title;
    if (stage3D) stage3D.textContent = texts.stage3Desc;
    if (stage4T) stage4T.textContent = texts.stage4Title;
    if (stage4D) stage4D.textContent = texts.stage4Desc;
    if (badgeLabel) badgeLabel.textContent = texts.bossBadge;
  }

  // Language buttons listener
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

    const progressFill = document.getElementById('pillarProgressFill');
    const progressText = document.getElementById('pillarProgressText');
    const stageLabel = document.getElementById('pillarActiveStageLabel');

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `Module 1 of 4: ${percent}% Complete`;

    const stageNames = ['Stage 1: Warm-Up', 'Stage 2: Core Simulator', 'Stage 3: Personal Goal', 'Stage 4: Quiz & Reward'];
    const currentStageIndex = Math.min(completedCount, 3);
    if (stageLabel) stageLabel.textContent = stageNames[currentStageIndex];

    // Update Stepper Step classes
    const stepperSteps = document.querySelectorAll('.stepper-step');
    stepperSteps.forEach((step, idx) => {
      if (stages[idx]) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
    });

    // Sync Points
    if (window.MoneySmart) {
      const userProgress = window.MoneySmart.getProgress();
      const pointsCounter = document.getElementById('pillarPointsCounter');
      if (pointsCounter) pointsCounter.textContent = `${userProgress.points || 0} Points`;

      // Check if Budget Boss badge is unlocked
      const hasBossBadge = (userProgress.badges || []).includes('budget-boss') || userProgress.budgetCompleted;
      const badgeChip = document.getElementById('budgetBossBadgeChip');
      if (badgeChip) {
        if (hasBossBadge) {
          badgeChip.classList.add('unlocked');
          badgeChip.innerHTML = '<span>🏆</span> <span>Badge: Budget Boss Unlocked!</span>';
        } else {
          badgeChip.classList.remove('unlocked');
          badgeChip.innerHTML = '<span>🔒</span> <span>Badge: Budget Boss</span>';
        }
      }
    }
  }

  // Stepper smooth scroll
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
  // 4. QUICK 50 / 30 / 20 RULE OF THUMB CALCULATOR
  // =========================================================================
  function updateRuleThumb(amount) {
    const needs = Math.round(amount * 0.5);
    const wants = Math.round(amount * 0.3);
    const savings = Math.round(amount * 0.2);

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const needsEl = document.getElementById('ruleNeedsAmount');
    const wantsEl = document.getElementById('ruleWantsAmount');
    const savingsEl = document.getElementById('ruleSavingsAmount');

    if (needsEl) needsEl.textContent = formatINR(needs);
    if (wantsEl) wantsEl.textContent = formatINR(wants);
    if (savingsEl) savingsEl.textContent = formatINR(savings);
  }

  document.querySelectorAll('.rule-calc-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.rule-calc-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      updateRuleThumb(Number(pill.dataset.amount) || 3000);
      playTone(440, 0.08, 'sine');
    });
  });

  // =========================================================================
  // 5. STAGE 1: "NEED VS WANT" RAPID SORTER MINI-GAME
  // =========================================================================
  const sorterItems = [
    {
      emoji: '🚌',
      title: 'TSRTC Bus Pass / Metro Travel Card',
      cost: 'Cost: ₹350 / month',
      desc: 'Mandatory daily transit to reach college classes & lab sessions.',
      isNeed: true,
      explanation: 'Transport to college is essential to attend classes — that makes it a NEED.',
    },
    {
      emoji: '📱',
      title: '1.5GB/Day Mobile Data Recharge Pack',
      cost: 'Cost: ₹299 / month',
      desc: 'Used for college WhatsApp group updates, textbook PDFs, and test notices.',
      isNeed: true,
      explanation: 'Basic connectivity for academics and emergency communication is a NEED.',
    },
    {
      emoji: '🎬',
      title: 'Weekend Movie at Sandhya 70mm & Popcorn',
      cost: 'Cost: ₹450 / outing',
      desc: 'Friday night movie with friends and theatre snacks.',
      isNeed: false,
      explanation: 'Cinema entertainment is enjoyable fun, but non-essential — it is a WANT.',
    },
    {
      emoji: '👟',
      title: 'Branded Limited-Edition Designer Sneakers',
      cost: 'Cost: ₹4,000 one-time',
      desc: 'Fashion upgrade when current college shoes are still perfectly intact.',
      isNeed: false,
      explanation: 'Luxury brand fashion upgrades are definitely a WANT.',
    },
    {
      emoji: '📝',
      title: 'Board Exam Registration Fee & Lab Manual Prints',
      cost: 'Cost: ₹850 one-time',
      desc: 'Mandatory fee required by college board to appear for semester finals.',
      isNeed: true,
      explanation: 'Exam fees and required course materials are strictly non-negotiable NEEDS.',
    },
    {
      emoji: '🍔',
      title: 'Midnight Swiggy Shawarma & Cold Drinks',
      cost: 'Cost: ₹320 / order',
      desc: 'Impulse late-night food craving when hostel/home food is already provided.',
      isNeed: false,
      explanation: 'Late night takeout when food exists at home is a pure WANT.',
    },
  ];

  function renderSorterCard() {
    if (state.sorter.index >= sorterItems.length) {
      finishSorter();
      return;
    }

    const item = sorterItems[state.sorter.index];
    const emojiEl = document.getElementById('flyingItemEmoji');
    const titleEl = document.getElementById('flyingItemTitle');
    const costEl = document.getElementById('flyingItemCost');
    const descEl = document.getElementById('flyingItemDesc');
    const cardEl = document.getElementById('activeFlyingCard');

    if (emojiEl) emojiEl.textContent = item.emoji;
    if (titleEl) titleEl.textContent = item.title;
    if (costEl) costEl.textContent = item.cost;
    if (descEl) descEl.textContent = item.desc;

    if (cardEl) {
      cardEl.style.transform = 'scale(0.85)';
      cardEl.style.opacity = '0';
      setTimeout(() => {
        cardEl.style.transform = 'scale(1)';
        cardEl.style.opacity = '1';
      }, 50);
    }
  }

  function handleSorterChoice(userChosenNeed) {
    const item = sorterItems[state.sorter.index];
    const isCorrect = userChosenNeed === item.isNeed;
    const feedbackNotice = document.getElementById('sorterFeedbackNotice');
    const streakEl = document.getElementById('streakCount');
    const scoreEl = document.getElementById('sorterScore');

    if (isCorrect) {
      state.sorter.score += 1;
      state.sorter.streak += 1;
      playSuccessTone();
      if (feedbackNotice) {
        feedbackNotice.style.color = '#15803d';
        feedbackNotice.textContent = `✅ Correct! ${item.explanation}`;
      }
    } else {
      state.sorter.streak = 0;
      playErrorTone();
      if (feedbackNotice) {
        feedbackNotice.style.color = '#b91c1c';
        feedbackNotice.textContent = `❌ Not quite! ${item.explanation}`;
      }
    }

    if (streakEl) streakEl.textContent = `${state.sorter.streak}x Streak`;
    if (scoreEl) scoreEl.textContent = String(state.sorter.score);

    state.sorter.index += 1;
    setTimeout(() => {
      renderSorterCard();
    }, 700);
  }

  function finishSorter() {
    state.sorter.completed = true;
    state.progress.stage1 = true;
    updateProgress();

    const stageContainer = document.getElementById('flyingCardContainer');
    const btnGroup = document.getElementById('sorterButtonsGroup');
    const completeBox = document.getElementById('sorterCompleteBox');
    const feedbackNotice = document.getElementById('sorterFeedbackNotice');
    const resultMsg = document.getElementById('sorterResultMsg');

    if (stageContainer) stageContainer.hidden = true;
    if (btnGroup) btnGroup.hidden = true;
    if (feedbackNotice) feedbackNotice.textContent = '';
    if (completeBox) completeBox.hidden = false;

    if (resultMsg) {
      resultMsg.textContent = `Great job! You scored ${state.sorter.score} of ${sorterItems.length}. You proved you can tell essential survival Needs apart from lifestyle Wants!`;
    }

    playFanfare();

    // Reward points for completing Stage 1
    if (window.MoneySmart) {
      const p = window.MoneySmart.getProgress();
      p.points = (p.points || 0) + 15;
      window.MoneySmart.saveProgress(p);
      updateProgress();
    }
  }

  const sortNeedBtn = document.getElementById('sortNeedBtn');
  const sortWantBtn = document.getElementById('sortWantBtn');
  if (sortNeedBtn) sortNeedBtn.addEventListener('click', () => handleSorterChoice(true));
  if (sortWantBtn) sortWantBtn.addEventListener('click', () => handleSorterChoice(false));

  const proceedToStage2Btn = document.getElementById('proceedToStage2Btn');
  if (proceedToStage2Btn) {
    proceedToStage2Btn.addEventListener('click', () => {
      const stage2 = document.getElementById('stage2');
      if (stage2) stage2.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 6. STAGE 2: CORE INTERACTIVE SIMULATOR (30-DAY BUDGET LAB)
  // =========================================================================
  const personaDayScholar = document.getElementById('personaDayScholar');
  const personaHostel = document.getElementById('personaHostel');

  function setPersona(type) {
    state.sim.persona = type;
    if (type === 'dayscholar') {
      state.sim.allowance = 3000;
      state.sim.commute = 450;
      state.sim.food = 900;
      state.sim.study = 400;
      state.sim.phone = 300;
      state.sim.outings = 450;
      personaDayScholar.classList.add('active');
      personaHostel.classList.remove('active');
    } else {
      state.sim.allowance = 4500;
      state.sim.commute = 200;
      state.sim.food = 1800;
      state.sim.study = 600;
      state.sim.phone = 400;
      state.sim.outings = 800;
      personaHostel.classList.add('active');
      personaDayScholar.classList.remove('active');
    }

    // Update Slider inputs & maxes
    const commuteSlider = document.getElementById('simCommuteSlider');
    const foodSlider = document.getElementById('simFoodSlider');
    const studySlider = document.getElementById('simStudySlider');
    const phoneSlider = document.getElementById('simPhoneSlider');
    const outingsSlider = document.getElementById('simOutingsSlider');

    if (commuteSlider) commuteSlider.value = state.sim.commute;
    if (foodSlider) foodSlider.value = state.sim.food;
    if (studySlider) studySlider.value = state.sim.study;
    if (phoneSlider) phoneSlider.value = state.sim.phone;
    if (outingsSlider) outingsSlider.value = state.sim.outings;

    recalcSimValues();
    playTone(520, 0.08, 'sine');
  }

  if (personaDayScholar) personaDayScholar.addEventListener('click', () => setPersona('dayscholar'));
  if (personaHostel) personaHostel.addEventListener('click', () => setPersona('hosteler'));

  function recalcSimValues() {
    const commute = Number(document.getElementById('simCommuteSlider').value) || 0;
    const food = Number(document.getElementById('simFoodSlider').value) || 0;
    const study = Number(document.getElementById('simStudySlider').value) || 0;
    const phone = Number(document.getElementById('simPhoneSlider').value) || 0;
    const outings = Number(document.getElementById('simOutingsSlider').value) || 0;

    state.sim.commute = commute;
    state.sim.food = food;
    state.sim.study = study;
    state.sim.phone = phone;
    state.sim.outings = outings;

    const totalAllocated = commute + food + study + phone + outings;
    const savingsBuffer = state.sim.allowance - totalAllocated;

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    document.getElementById('simCommuteVal').textContent = formatINR(commute);
    document.getElementById('simFoodVal').textContent = formatINR(food);
    document.getElementById('simStudyVal').textContent = formatINR(study);
    document.getElementById('simPhoneVal').textContent = formatINR(phone);
    document.getElementById('simOutingsVal').textContent = formatINR(outings);

    document.getElementById('simAllowanceTotal').textContent = formatINR(state.sim.allowance);
    document.getElementById('simAllocatedTotal').textContent = formatINR(totalAllocated);

    const bufferEl = document.getElementById('simBufferTotal');
    if (savingsBuffer >= 0) {
      bufferEl.style.color = '#166534';
      bufferEl.textContent = `+${formatINR(savingsBuffer)}`;
    } else {
      bufferEl.style.color = '#dc2626';
      bufferEl.textContent = `-${formatINR(Math.abs(savingsBuffer))}`;
    }
  }

  ['simCommuteSlider', 'simFoodSlider', 'simStudySlider', 'simPhoneSlider', 'simOutingsSlider'].forEach((id) => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.addEventListener('input', recalcSimValues);
    }
  });

  // Calendar 30-Day simulation grid
  const calendarGrid = document.getElementById('calendarDaysGrid');
  function initCalendarGrid() {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    for (let day = 1; day <= 30; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.id = `calDay-${day}`;
      cell.textContent = String(day);
      calendarGrid.appendChild(cell);
    }
  }
  initCalendarGrid();

  function run30DaySimulation() {
    if (state.sim.isSimulating) return;
    state.sim.isSimulating = true;
    initCalendarGrid();

    const feedCard = document.getElementById('consequenceFeedCard');
    const feedIcon = document.getElementById('consequenceFeedIcon');
    const feedText = document.getElementById('consequenceFeedText');
    const dayIndicator = document.getElementById('simDayIndicator');
    const runBtn = document.getElementById('runSimulationBtn');

    if (runBtn) runBtn.disabled = true;
    if (feedCard) {
      feedCard.style.display = 'flex';
      feedCard.className = 'consequence-feed-card feed-alert-success';
      feedIcon.textContent = '🚀';
      feedText.textContent = 'Simulation initiated! Advancing through the month...';
    }

    const totalAllocated = state.sim.commute + state.sim.food + state.sim.study + state.sim.phone + state.sim.outings;
    const buffer = state.sim.allowance - totalAllocated;
    const isOutingsExcessive = state.sim.outings > (state.sim.allowance * 0.35);
    const isStudyNeglected = state.sim.study < 250;
    const isOverallocated = buffer < 0;

    let day = 1;
    const interval = setInterval(() => {
      if (day > 30) {
        clearInterval(interval);
        state.sim.isSimulating = false;
        if (runBtn) runBtn.disabled = false;
        return;
      }

      const cell = document.getElementById(`calDay-${day}`);
      if (dayIndicator) dayIndicator.textContent = `Day ${day} of 30`;

      // Special Events
      if (day === 8) {
        if (cell) cell.classList.add('event-day');
        feedIcon.textContent = '📚';
        feedText.textContent = 'Day 8 Event: Surprise college assignment announced! Printing & record binding required ₹150.';
        playTone(600, 0.1, 'triangle');
      } else if (day === 16) {
        if (cell) cell.classList.add('event-day');
        feedIcon.textContent = '🍿';
        feedText.textContent = 'Day 16 Event: Friends invite you for weekend dining & movies at Inorbit Mall / RTC X Roads.';
        playTone(550, 0.1, 'triangle');
      } else if (day === 20 && (isOutingsExcessive || isOverallocated)) {
        // Critical Failure on Day 20!
        if (cell) cell.classList.add('warning-day');
        feedCard.className = 'consequence-feed-card feed-alert-danger';
        feedIcon.textContent = '🚨';
        feedText.innerHTML = `<strong>CRITICAL WARNING (Day 20):</strong> You ran out of money on Day 20! Because weekend outings were over-allocated, you have ₹0 left. How will you pay for travel to your exam center or afford food for the next 10 days? <em>Click "Try Again / Reset" to balance your budget!</em>`;
        playErrorTone();
        clearInterval(interval);
        state.sim.isSimulating = false;
        if (runBtn) runBtn.disabled = false;
        return;
      } else if (day === 24 && isStudyNeglected) {
        if (cell) cell.classList.add('warning-day');
        feedCard.className = 'consequence-feed-card feed-alert-danger';
        feedIcon.textContent = '⚠️';
        feedText.innerHTML = `<strong>ACADEMIC WARNING (Day 24):</strong> Professor flagged incomplete lab records! Underfunding study materials & prints left you unprepared for practical submissions.`;
        playErrorTone();
      } else {
        if (cell) cell.classList.add('passed');
        playTone(700 + day * 10, 0.04, 'sine');
      }

      // Final day celebration
      if (day === 30) {
        if (buffer >= 0) {
          feedCard.className = 'consequence-feed-card feed-alert-success';
          feedIcon.textContent = '🎉';
          feedText.innerHTML = `<strong>OUTSTANDING MONTH (Day 30 Finished)!</strong> You completed the full month with ₹${buffer} intact in your emergency savings buffer! You demonstrated exceptional financial discipline.`;
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
      }

      day++;
    }, 100);
  }

  const runSimulationBtn = document.getElementById('runSimulationBtn');
  if (runSimulationBtn) runSimulationBtn.addEventListener('click', run30DaySimulation);

  const resetSimBtn = document.getElementById('resetSimBtn');
  if (resetSimBtn) {
    resetSimBtn.addEventListener('click', () => {
      setPersona(state.sim.persona);
      initCalendarGrid();
      const feedCard = document.getElementById('consequenceFeedCard');
      if (feedCard) feedCard.style.display = 'none';
      const dayIndicator = document.getElementById('simDayIndicator');
      if (dayIndicator) dayIndicator.textContent = 'Day 0 of 30';
    });
  }

  // =========================================================================
  // 7. STAGE 3: THE PERSONAL GOAL CALCULATOR
  // =========================================================================
  function recalcPersonalGoal() {
    const titleInput = document.getElementById('goalTitleInput');
    const costInput = document.getElementById('goalCostInput');
    const timeframeSelect = document.getElementById('goalTimeframeInput');

    const title = titleInput ? titleInput.value.trim() : 'Goal';
    const cost = Math.max(Number(costInput ? costInput.value : 1200) || 1200, 100);
    const months = Math.max(Number(timeframeSelect ? timeframeSelect.value : 3) || 1, 1);

    state.goal.title = title;
    state.goal.cost = cost;
    state.goal.months = months;

    const totalDays = months * 30;
    const totalWeeks = Math.max(Math.round(months * 4.3), 1);
    const dailyTarget = Math.ceil(cost / totalDays);
    const weeklyTarget = Math.ceil(cost / totalWeeks);

    const headingEl = document.getElementById('planGoalHeading');
    const costEl = document.getElementById('planGoalCostText');
    const monthsEl = document.getElementById('planGoalMonthsText');
    const dailyEl = document.getElementById('planDailyTarget');
    const weeklyEl = document.getElementById('planWeeklyTarget');
    const habitEl = document.getElementById('planHabitEquivalent');

    if (headingEl) headingEl.textContent = `Goal: ${title}`;
    if (costEl) costEl.textContent = `₹${cost}`;
    if (monthsEl) monthsEl.textContent = `${months} Month${months > 1 ? 's' : ''}`;
    if (dailyEl) dailyEl.textContent = `₹${dailyTarget} / day`;
    if (weeklyEl) weeklyEl.textContent = `₹${weeklyTarget} / week`;

    if (habitEl) {
      if (dailyTarget <= 25) {
        habitEl.textContent = `"Save ₹${dailyTarget} per day (₹${weeklyTarget} per week) to hit your goal on time. That's just skipping 1 bottled cold drink every 2 days!"`;
      } else if (dailyTarget <= 50) {
        habitEl.textContent = `"Save ₹${dailyTarget} per day (₹${weeklyTarget} per week) to hit your goal on time. That's equal to packing a snack from home instead of ordering fast food!"`;
      } else {
        habitEl.textContent = `"Save ₹${dailyTarget} per day (₹${weeklyTarget} per week) to hit your goal on time. A steady and focused commitment!"`;
      }
    }
  }

  // Pre-filled recommendation chips
  document.querySelectorAll('.goal-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.goal-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const titleInput = document.getElementById('goalTitleInput');
      const costInput = document.getElementById('goalCostInput');
      const timeframeSelect = document.getElementById('goalTimeframeInput');

      if (titleInput) titleInput.value = chip.dataset.goal;
      if (costInput) costInput.value = chip.dataset.cost;
      if (timeframeSelect) timeframeSelect.value = chip.dataset.months;

      recalcPersonalGoal();
      playTone(490, 0.08, 'sine');
    });
  });

  const goalTitleInput = document.getElementById('goalTitleInput');
  const goalCostInput = document.getElementById('goalCostInput');
  const goalTimeframeInput = document.getElementById('goalTimeframeInput');

  if (goalTitleInput) goalTitleInput.addEventListener('input', recalcPersonalGoal);
  if (goalCostInput) goalCostInput.addEventListener('input', recalcPersonalGoal);
  if (goalTimeframeInput) goalTimeframeInput.addEventListener('change', recalcPersonalGoal);

  const saveGoalBtn = document.getElementById('saveGoalToProfileBtn');
  if (saveGoalBtn) {
    saveGoalBtn.addEventListener('click', () => {
      recalcPersonalGoal();
      if (window.MoneySmart) {
        window.MoneySmart.saveSavingsGoal({
          title: state.goal.title,
          targetAmount: state.goal.cost,
          months: state.goal.months,
          dailyTarget: Math.ceil(state.goal.cost / (state.goal.months * 30)),
          weeklyTarget: Math.ceil(state.goal.cost / (state.goal.months * 4.3)),
          savedAt: new Date().toISOString(),
        });
      }

      state.progress.stage3 = true;
      updateProgress();

      const notice = document.getElementById('goalSavedNotice');
      if (notice) {
        notice.hidden = false;
        setTimeout(() => { notice.hidden = true; }, 4000);
      }
      playSuccessTone();
    });
  }

  // =========================================================================
  // 8. STAGE 4: QUIZ CHECK & BADGE REWARD
  // =========================================================================
  const quizAnswers = {
    1: {
      correct: 'b',
      explanation: 'Needs like project prints directly affect academic success and must come before optional leisure movies.',
    },
    2: {
      correct: 'c',
      explanation: 'Under the 50/30/20 guideline, 50% is allocated for essential Needs, 30% for Wants, and 20% for Savings.',
    },
    3: {
      correct: 'a',
      explanation: 'Wants (dining out, entertainment, shopping) should be trimmed immediately during a cash squeeze to protect essentials.',
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
      const allCorrect = q1 === true && q2 === true && q3 === true;
      state.progress.stage4 = true;
      updateProgress();

      const achievementCard = document.getElementById('achievementCard');
      if (achievementCard) {
        achievementCard.hidden = false;
        achievementCard.scrollIntoView({ behavior: 'smooth' });
      }

      playFanfare();

      // Complete module in MoneySmart and award Budget Boss badge
      if (window.MoneySmart) {
        window.MoneySmart.completeModule('budget', 50);
        updateProgress();
      }
    }
  }

  // Initial runs
  updateRuleThumb(3000);
  renderSorterCard();
  recalcSimValues();
  recalcPersonalGoal();
  updateProgress();
  applyLanguage(state.language);
});
