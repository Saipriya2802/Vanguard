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
    // Feature 1 Portfolio State (₹10,000 Total)
    portfolio: {
      stocks: 4000,
      mf: 3500,
      fd: 2500,
      total: 10000,
    },
    // Feature 2 Market Surprise State
    market: {
      base: 2000,
      current: 2000,
      shockTriggered: false,
      recovered: false,
    },
    // Feature 3 Risk vs Return Situations State
    situations: {
      1: null,
      2: null,
      3: null,
    },
    // Stage 4 Quiz State
    quiz: {
      1: null,
      2: null,
      3: null,
    },
  };

  // Web Audio API Synthesizer
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
    playTone(523.25, 0.12, 'triangle', 0);
    playTone(659.25, 0.20, 'triangle', 0.1);
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
      headerTitle: 'Understand Investing',
      headerTagline: 'Put Your Money to Work: Compounding, Risk & Return',
      stage1T: 'Build Your ₹10,000 Virtual Portfolio',
      stage1D: 'You receive ₹10,000 in virtual money. Choose how much to allocate between Stocks, Mutual Funds, and Fixed Deposits to balance risk and growth!',
      stage2T: 'Market Volatility: Experiencing Real Market Risk',
      stage2D: 'Example: You invest ₹2,000 in virtual stocks. Suddenly, a global market correction hits! How does volatility affect your money?',
      stage3T: 'Compare Two Investments: Choose Based on Situation',
      stage3D: 'Higher potential return always demands higher risk tolerance. Match the right investment tool to each real-life student scenario!',
      stage4T: 'Stage 4: Investing Mastery Checkpoint',
      stage4D: 'Demonstrate your command of investing principles to unlock the official "Market Master" badge!',
      marketBadge: 'Badge: Market Master',
    },
    te: {
      headerTitle: 'పెట్టుబడిని అర్థం చేసుకోండి',
      headerTagline: 'మీ డబ్బును పనిచేయించండి: కాంపౌండింగ్, రిస్క్ మరియు రిటర్న్',
      stage1T: 'మీ ₹10,000 వర్చువల్ పోర్ట్‌ఫోలియోను నిర్మించండి',
      stage1D: 'మీకు ₹10,000 వర్చువల్ డబ్బు లభిస్తుంది. స్టాక్స్, మ్యూచువల్ ఫండ్స్ మరియు ఫిక్స్‌డ్ డిపాజిట్ల మధ్య కేటాయించండి!',
      stage2T: 'మార్కెట్ హెచ్చుతగ్గులు: రిస్క్‌ను ప్రత్యక్షంగా అనుభవించండి',
      stage2D: 'ఉదాహరణ: మీరు స్టాక్స్‌లో ₹2,000 పెట్టుబడి పెట్టారు. మార్కెట్ 10% పడిపోయింది, విలువ ₹1,800 అయ్యింది!',
      stage3T: 'రెండు పెట్టుబడులను సరిపోల్చండి: పరిస్థితిని బట్టి ఎంచుకోండి',
      stage3D: 'ఎక్కువ లాభం కావాలంటే ఎక్కువ రిస్క్ భరించాలి. విద్యార్థి పరిస్థితులకు తగిన సాధనాన్ని ఎంచుకోండి!',
      stage4T: 'దశ 4: ఇన్వెస్టింగ్ మాస్టరీ చెక్‌పాయింట్',
      stage4D: 'పెట్టుబడి ప్రాథమిక సూత్రాలను నిరూపించి "మార్కెట్ మాస్టర్" బ్యాడ్జిని అన్‌లాక్ చేయండి!',
      marketBadge: 'బ్యాడ్జి: మార్కెట్ మాస్టర్',
    },
    hi: {
      headerTitle: 'निवेश को समझें',
      headerTagline: 'अपने पैसे को काम पर लगाएं: चक्रवृद्धि, जोखिम और रिटर्न',
      stage1T: 'अपना ₹10,000 का वर्चुअल पोर्टफोलियो बनाएं',
      stage1D: 'आपको ₹10,000 वर्चुअल मनी मिलती है। स्टॉक्स, म्यूचुअल फंड्स और फिक्स्ड डिपॉजिट में आवंटन चुनें!',
      stage2T: 'बाजार के उतार-चढ़ाव: वास्तविक जोखिम का अनुभव करें',
      stage2D: 'उदाहरण: आपने शेयरों में ₹2,000 लगाए। बाजार 10% गिरा, मूल्य ₹1,800 हो गया। जानें जोखिम का सच!',
      stage3T: 'दो निवेशों की तुलना करें: परिस्थिति के अनुसार चुनें',
      stage3D: 'अधिक रिटर्न के लिए अधिक जोखिम सहन करना पड़ता है। हर छात्र परिस्थिति के लिए सही उपकरण चुनें!',
      stage4T: 'चरण 4: निवेश मास्टरी चेकपॉइंट',
      stage4D: 'निवेश सिद्धांतों को साबित करें और आधिकारिक "मार्केट मास्टर" बैज अनलॉक करें!',
      marketBadge: 'बैज: मार्केट मास्टर',
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
    const hT = document.getElementById('investHeaderTitle');
    const hTag = document.getElementById('investHeaderTagline');
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
    if (s1T) s1T.textContent = texts.stage1T;
    if (s1D) s1D.textContent = texts.stage1D;
    if (s2T) s2T.textContent = texts.stage2T;
    if (s2D) s2D.textContent = texts.stage2D;
    if (s3T) s3T.textContent = texts.stage3T;
    if (s3D) s3D.textContent = texts.stage3D;
    if (s4T) s4T.textContent = texts.stage4T;
    if (s4D) s4D.textContent = texts.stage4D;
    if (bLbl) bLbl.textContent = texts.marketBadge;
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

    const progressFill = document.getElementById('investProgressFill');
    const progressText = document.getElementById('investProgressText');
    const stageLabel = document.getElementById('investActiveStageLabel');

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `Module 3 of 4: ${percent}% Complete`;

    const stageNames = [
      'Feature 1: ₹10,000 Investment Game',
      'Feature 2: Market Surprise Challenge',
      'Feature 3: Risk vs Return Challenge',
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
      const pointsCounter = document.getElementById('investPointsCounter');
      if (pointsCounter) pointsCounter.textContent = `${userProgress.points || 0} Points`;

      const hasBadge = (userProgress.badges || []).includes('market-master') || userProgress.investingCompleted;
      const badgeChip = document.getElementById('marketMasterBadgeChip');
      if (badgeChip) {
        if (hasBadge) {
          badgeChip.classList.add('unlocked');
          badgeChip.innerHTML = '<span>🏆</span> <span>Badge: Market Master Unlocked!</span>';
        } else {
          badgeChip.classList.remove('unlocked');
          badgeChip.innerHTML = '<span>🔒</span> <span>Badge: Market Master</span>';
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
  // 4. FEATURE 1: THE ₹10,000 INVESTMENT GAME
  // =========================================================================
  function updatePortfolio(stocks, mf, fd) {
    const total = stocks + mf + fd;
    state.portfolio.stocks = stocks;
    state.portfolio.mf = mf;
    state.portfolio.fd = fd;
    state.portfolio.total = total;

    const sPercent = Math.round((stocks / 10000) * 100);
    const mPercent = Math.round((mf / 10000) * 100);
    const fPercent = Math.round((fd / 10000) * 100);

    const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    document.getElementById('stocksValText').textContent = `${formatINR(stocks)} (${sPercent}%)`;
    document.getElementById('mfValText').textContent = `${formatINR(mf)} (${mPercent}%)`;
    document.getElementById('fdValText').textContent = `${formatINR(fd)} (${fPercent}%)`;

    document.getElementById('portBarStocks').style.width = `${sPercent}%`;
    document.getElementById('portBarMF').style.width = `${mPercent}%`;
    document.getElementById('portBarFD').style.width = `${fPercent}%`;

    const unallocEl = document.getElementById('unallocatedBadge');
    const remaining = 10000 - total;
    if (remaining === 0) {
      unallocEl.style.background = '#dcfce7';
      unallocEl.style.color = '#15803d';
      unallocEl.textContent = '100% Fully Allocated';
    } else if (remaining > 0) {
      unallocEl.style.background = '#e0f2fe';
      unallocEl.style.color = '#0369a1';
      unallocEl.textContent = `Unallocated: ${formatINR(remaining)}`;
    } else {
      unallocEl.style.background = '#fee2e2';
      unallocEl.style.color = '#b91c1c';
      unallocEl.textContent = `Over-allocated by ${formatINR(Math.abs(remaining))}`;
    }

    // Weighted Annual Return: Stocks ~ 14%, MF ~ 11%, FD ~ 6.5%
    const rate = ((stocks * 0.14) + (mf * 0.11) + (fd * 0.065)) / (total > 0 ? total : 1);
    const ratePercent = (rate * 100).toFixed(2);
    document.getElementById('portfolioWeightedRate').textContent = `${ratePercent}%`;

    const riskProfileEl = document.getElementById('portfolioRiskProfile');
    if (sPercent >= 60) {
      riskProfileEl.textContent = 'Risk Profile: Aggressive High Growth (High Short-Term Swings)';
      riskProfileEl.style.color = '#4338ca';
    } else if (fPercent >= 50) {
      riskProfileEl.textContent = 'Risk Profile: Conservative Capital Preservation';
      riskProfileEl.style.color = '#059669';
    } else {
      riskProfileEl.textContent = 'Risk Profile: Moderate Balanced Wealth Strategy';
      riskProfileEl.style.color = '#0891b2';
    }

    // Multi-year compound growth
    const val1Y = Math.round(10000 * Math.pow(1 + rate, 1));
    const val3Y = Math.round(10000 * Math.pow(1 + rate, 3));
    const val5Y = Math.round(10000 * Math.pow(1 + rate, 5));

    document.getElementById('proj1Year').textContent = formatINR(val1Y);
    document.getElementById('proj3Year').textContent = formatINR(val3Y);
    document.getElementById('proj5Year').textContent = formatINR(val5Y);
  }

  const sSlider = document.getElementById('stocksSlider');
  const mSlider = document.getElementById('mfSlider');
  const fSlider = document.getElementById('fdSlider');

  function handleSliderInput() {
    const s = Number(sSlider.value) || 0;
    const m = Number(mSlider.value) || 0;
    const f = Number(fSlider.value) || 0;
    updatePortfolio(s, m, f);
  }

  if (sSlider) sSlider.addEventListener('input', handleSliderInput);
  if (mSlider) mSlider.addEventListener('input', handleSliderInput);
  if (fSlider) fSlider.addEventListener('input', handleSliderInput);

  document.querySelectorAll('.port-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.port-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const s = Number(btn.dataset.s);
      const m = Number(btn.dataset.m);
      const f = Number(btn.dataset.f);
      sSlider.value = s;
      mSlider.value = m;
      fSlider.value = f;
      updatePortfolio(s, m, f);
      playTone(520, 0.08, 'sine');
    });
  });

  const confirmPortBtn = document.getElementById('confirmPortfolioBtn');
  if (confirmPortBtn) {
    confirmPortBtn.addEventListener('click', () => {
      state.progress.stage1 = true;
      updateProgress();
      playSuccessTone();

      if (window.MoneySmart) {
        const p = window.MoneySmart.getProgress();
        p.points = (p.points || 0) + 15;
        window.MoneySmart.saveProgress(p);
        updateProgress();
      }

      const stage2 = document.getElementById('stage2');
      if (stage2) stage2.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. FEATURE 2: MARKET SURPRISE CHALLENGE (-10% Fall & 2-Year Recovery)
  // =========================================================================
  const triggerShockBtn = document.getElementById('triggerMarketShockBtn');
  const triggerReboundBtn = document.getElementById('triggerMarketReboundBtn');

  if (triggerShockBtn) {
    triggerShockBtn.addEventListener('click', () => {
      state.market.shockTriggered = true;
      state.market.current = 1800; // -10% drop on ₹2,000

      triggerShockBtn.disabled = true;
      if (triggerReboundBtn) triggerReboundBtn.disabled = false;

      const statusCard = document.getElementById('marketSurpriseStatusCard');
      const label = document.getElementById('marketSurpriseLabel');
      const sub = document.getElementById('marketSurpriseSub');
      const val = document.getElementById('marketCurrentValue');
      const pct = document.getElementById('marketChangePercent');
      const notice = document.getElementById('marketLessonNotice');
      const icon = document.getElementById('marketLessonIcon');
      const text = document.getElementById('marketLessonText');

      if (label) {
        label.textContent = 'Market Correction (-10%)';
        label.style.color = '#dc2626';
      }
      if (sub) sub.textContent = 'Temporary Economic Drop';
      if (val) {
        val.textContent = '₹1,800';
        val.style.color = '#dc2626';
      }
      if (pct) {
        pct.textContent = '-10% Paper Loss (-₹200)';
        pct.style.color = '#dc2626';
      }

      if (notice) {
        notice.className = 'consequence-feed-card feed-alert-danger';
        icon.textContent = '📉';
        text.innerHTML = `<strong>MARKET LESSON:</strong> A 10% market dip occurred! Your ₹2,000 stock value dropped to ₹1,800. <strong>Crucial lesson:</strong> This is a <em>paper loss</em>, NOT a real loss, unless you panic sell! Quality assets fluctuate in the short term. Now click <strong>"Fast-Forward 2 Years (Recovery)"</strong> to see the power of holding!`;
      }

      playErrorTone();
    });
  }

  if (triggerReboundBtn) {
    triggerReboundBtn.addEventListener('click', () => {
      state.market.recovered = true;
      state.market.current = 2250; // Rebounded to ₹2,250 (+25% over 2 years)

      triggerReboundBtn.disabled = true;

      const label = document.getElementById('marketSurpriseLabel');
      const sub = document.getElementById('marketSurpriseSub');
      const val = document.getElementById('marketCurrentValue');
      const pct = document.getElementById('marketChangePercent');
      const notice = document.getElementById('marketLessonNotice');
      const icon = document.getElementById('marketLessonIcon');
      const text = document.getElementById('marketLessonText');

      if (label) {
        label.textContent = 'Bull Market Recovery (+25%)';
        label.style.color = '#059669';
      }
      if (sub) sub.textContent = '2 Years of Patient Holding';
      if (val) {
        val.textContent = '₹2,250';
        val.style.color = '#059669';
      }
      if (pct) {
        pct.textContent = '+12.5% Net Profit Overall (+₹250)';
        pct.style.color = '#059669';
      }

      if (notice) {
        notice.className = 'consequence-feed-card feed-alert-success';
        icon.textContent = '📈';
        text.innerHTML = `<strong>PATIENCE REWARDED!</strong> Over the following 2 years, businesses expanded profits and the market rebounded. Your investment surged to <strong>₹2,250</strong>! Investors who panicked at ₹1,800 lost ₹200 forever; investors who stayed disciplined generated real wealth!`;
      }

      playFanfare();
      state.progress.stage2 = true;
      updateProgress();

      if (window.MoneySmart) {
        const p = window.MoneySmart.getProgress();
        p.points = (p.points || 0) + 20;
        window.MoneySmart.saveProgress(p);
        updateProgress();
      }
    });
  }

  // =========================================================================
  // 6. FEATURE 3: RISK VS. RETURN CHALLENGE
  // =========================================================================
  const situationAnswers = {
    1: {
      correct: 'a',
      explanation: 'Since Priya needs the exam fee in 3 months, capital safety is non-negotiable. Fixed Deposits ensure her fee is 100% intact without short-term market risk.',
    },
    2: {
      correct: 'b',
      explanation: 'With a 6-year timeframe, Arjun has ample time to weather temporary market dips and let the compounding power of equity multiply his wealth.',
    },
    3: {
      correct: 'b',
      explanation: '"Guaranteed high returns with zero risk" is the classic trademark of financial fraud. In authentic finance, risk and return are inseparable twins.',
    },
  };

  document.querySelectorAll('.rr-choice-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sitNum = Number(btn.dataset.sit);
      const opt = btn.dataset.opt;
      const feedback = document.getElementById(`sitFeedback-${sitNum}`);
      const isCorrect = opt === situationAnswers[sitNum].correct;

      state.situations[sitNum] = isCorrect;

      const parentCard = btn.closest('.quiz-q-card');
      parentCard.querySelectorAll('.rr-choice-btn').forEach((b) => {
        b.disabled = true;
        if (b.dataset.opt === situationAnswers[sitNum].correct) {
          b.classList.add('correct');
        } else if (b === btn && !isCorrect) {
          b.classList.add('wrong');
        }
      });

      if (feedback) {
        feedback.hidden = false;
        if (isCorrect) {
          feedback.style.background = '#dcfce7';
          feedback.style.color = '#15803d';
          feedback.innerHTML = `<strong>Correct Decision!</strong> ${situationAnswers[sitNum].explanation}`;
          playSuccessTone();
        } else {
          feedback.style.background = '#fee2e2';
          feedback.style.color = '#b91c1c';
          feedback.innerHTML = `<strong>Incorrect.</strong> ${situationAnswers[sitNum].explanation}`;
          playErrorTone();
        }
      }

      // Check if all 3 situations are attempted
      if (state.situations[1] !== null && state.situations[2] !== null && state.situations[3] !== null) {
        state.progress.stage3 = true;
        updateProgress();
      }
    });
  });

  // =========================================================================
  // 7. STAGE 4: CHECKPOINT QUIZ & BADGE UNLOCK
  // =========================================================================
  const quizAnswers = {
    1: {
      correct: 'b',
      explanation: 'Staying calm during temporary market dips avoids converting paper volatility into permanent realized loss.',
    },
    2: {
      correct: 'a',
      explanation: 'Diversification means not putting all eggs in one basket. Fixed Deposits and Mutual Funds cushion against sharp drops in single stocks.',
    },
    3: {
      correct: 'b',
      explanation: 'Money needed in the short term (tuition, rent, emergency cushion) must always be kept in safe, liquid instruments like bank accounts or FDs.',
    },
  };

  document.querySelectorAll('.checkpoint-quiz-grid .quiz-q-card').forEach((card) => {
    const qNum = Number(card.dataset.q);
    const buttons = card.querySelectorAll('.quiz-opt-btn');
    const feedbackBox = card.querySelector('.quiz-feedback-box');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedOpt = btn.dataset.opt;
        const correctOpt = quizAnswers[qNum].correct;
        const isCorrect = selectedOpt === correctOpt;

        state.quiz[qNum] = isCorrect;

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
    const { 1: q1, 2: q2, 3: q3 } = state.quiz;
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
        window.MoneySmart.completeModule('investing', 50);
        updateProgress();
      }
    }
  }

  // Initial runs
  updatePortfolio(4000, 3500, 2500);
  updateProgress();
  applyLanguage(state.language);
});
