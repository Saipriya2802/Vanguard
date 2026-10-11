(function () {
  const STORAGE_KEY = 'moneysmart-progress';
  const LANGUAGE_KEY = 'moneysmart-language';

  const defaultProgress = {
    points: 0,
    goldenCoins: 0,
    knowledgeXP: 0,
    quizTopicRewards: [],
    completedModules: [],
    badges: [],
    language: 'en',
    quizScores: [],
    safetyQuizPass: false,
    budgetCompleted: false,
    savingsCompleted: false,
    investingCompleted: false,
    safetyCompleted: false,
    savingsGoal: null,
  };

  const translations = {
    en: {
      brandName: 'MoneySmart',
      navHome: 'Home',
      navStartLearning: 'Start Learning',
      navLearn: 'Learn',
      navProgress: 'Progress',
      navDashboard: 'Dashboard',
      langLabel: 'Language',
      startLearningBtn: 'Start Learning',
      startLearningBtnSecondary: 'Start Learning',
      exploreModulesBtn: 'Explore Modules',
      eyebrow: 'Financial literacy for students',
      heroTitle: 'Make Smart Money Choices. Build a Better Future.',
      heroSubtitle: 'Learn to budget, save, understand investing and stay safe from financial scams through fun, interactive activities.',
      learningModulesLabel: 'Learning modules',
      moduleHeading: 'Choose a money skill to practice',
      budgetCardTitle: 'Plan and Budget',
      budgetCardText: 'Learn to balance needs, wants, savings and spending.',
      budgetLinkText: 'Start Budgeting',
      savingsCardTitle: 'Save and Manage',
      savingsCardText: 'Build saving habits, set goals and prepare for unexpected expenses.',
      savingsLinkText: 'Start Saving',
      investingCardTitle: 'Understand Investing',
      investingCardText: 'Explore risk, time, compounding and diversification through hypothetical examples.',
      investingLinkText: 'Explore Simulation',
      safetyCardTitle: 'Stay Financially Safe',
      safetyCardText: 'Identify suspicious messages, protect personal information and avoid scams.',
      safetyLinkText: 'Test Your Knowledge',
      activitiesLabel: 'Play, practice, and earn',
      activitiesHeading: 'Your journey has more than lessons',
      gamesTitle: 'Money games',
      gamesText: 'Practice decisions in the budget and scam-detective games.',
      gamesLink: 'Play a game',
      challengesTitle: 'Challenges',
      challengesText: 'Try interactive money challenges and savings activities.',
      challengesLink: 'Take a challenge',
      quizzesTitle: 'Quizzes',
      quizzesText: 'Check what you know with the financial safety quiz.',
      quizzesLink: 'Take the quiz',
      rewardsTitle: 'Rewards',
      rewardsText: 'Earn points and badges as you complete learning pillars.',
      rewardsLink: 'View rewards',
      howItWorksLabel: 'How it works',
      howItWorksHeading: 'A simple learning path',
      stepOneTitle: 'Learn a concept',
      stepOneText: 'Explore simple ideas about money, goals and decisions.',
      stepTwoTitle: 'Make a financial decision',
      stepTwoText: 'Use virtual money to plan, save or choose a smart response.',
      stepThreeTitle: 'See the result',
      stepThreeText: 'Check feedback, earn points and improve your money habits.',
      progressPreviewLabel: 'Progress preview',
      progressPreviewHeading: 'Track your learning',
      completedModulesLabel: 'Completed modules',
      pointsLabel: 'Total points',
      badgesLabel: 'Earned badges',
      aboutTitle: 'About',
      aboutText: 'MoneySmart is a demo learning platform designed to help students build healthy money habits.',
      modulesFooterTitle: 'Learning Modules',
      privacyTitle: 'Privacy',
      privacyText: 'This project stores demo progress in the browser only. It does not collect real financial data.',
      disclaimerTitle: 'Educational Disclaimer',
      disclaimerText: 'Use this tool for practice and learning. It is not a banking or investment service.'
    },
    te: {
      brandName: 'మనీస్మార్ట్',
      navHome: 'హోమ్',
      navStartLearning: 'నేర్చుకోవడం ప్రారంభించండి',
      navLearn: 'నేర్చుకోండి',
      navProgress: 'ప్రోగ్రెస్',
      navDashboard: 'డాష్‌బోర్డ్',
      langLabel: 'భాష',
      startLearningBtn: 'నేర్చుకోవడం ప్రారంభించండి',
      startLearningBtnSecondary: 'నేర్చుకోవడం ప్రారంభించండి',
      exploreModulesBtn: 'మాడ్యూళ్లను చూడండి',
      eyebrow: 'విద్యార్థుల కోసం ఆర్థిక అక్షరాస్యత',
      heroTitle: 'స్మార్ట్ డబ్బు నిర్ణయాలు తీసుకోండి. మంచి భవిష్యత్తును నిర్మించండి.',
      heroSubtitle: 'బడ్జెట్, పొదుపు, పెట్టుబడి, మరియు స్కామ్‌ల నుంచి భద్రతను నేర్చుకోండి.',
      learningModulesLabel: 'అభ్యాస మాడ్యూళ్లు',
      moduleHeading: 'మీరు నేర్చుకోవాల్సిన అంశాన్ని ఎంచుకోండి',
      budgetCardTitle: 'బడ్జెట్ ప్లాన్',
      budgetCardText: 'అవసరాలు, ఇష్టాలు, పొదుపు మరియు ఖర్చులను సమతుల్యం చేయడం నేర్చుకోండి.',
      budgetLinkText: 'బడ్జెట్ను ప్రారంభించండి',
      savingsCardTitle: 'పొదుపు మరియు నిర్వహణ',
      savingsCardText: 'పొదుపు అలవాట్లు, లక్ష్యాలు, మరియు అ sudden ఖర్చుల కోసం సిద్ధంగా ఉండడం.',
      savingsLinkText: 'పొదుపును ప్రారంభించండి',
      investingCardTitle: 'పెట్టుబడి అర్థం చేసుకోవడం',
      investingCardText: 'రిస్క్, టైమ్, కాంపౌండింగ్ మరియు డైవర్సిఫికేషన్ గురించి తెలుసుకోండి.',
      investingLinkText: 'సిమ్యులేషన్ చూడండి',
      safetyCardTitle: 'ఆర్థిక భద్రత',
      safetyCardText: 'సందేహాస్పద సందేశాలు, సమాచార భద్రత, మరియు స్కామ్‌లను గుర్తించడం.',
      safetyLinkText: 'మీ జ్ఞానం పరీక్షించండి',
      activitiesLabel: 'ఆడండి, సాధన చేయండి, బహుమతులు పొందండి',
      activitiesHeading: 'మీ ప్రయాణంలో పాఠాలకంటే ఎక్కువ ఉన్నాయి',
      gamesTitle: 'డబ్బు ఆటలు',
      gamesText: 'బడ్జెట్ మరియు స్కామ్ గుర్తింపు ఆటల్లో నిర్ణయాలను సాధన చేయండి.',
      gamesLink: 'ఆట ఆడండి',
      challengesTitle: 'సవాళ్లు',
      challengesText: 'డబ్బు సవాళ్లు మరియు పొదుపు కార్యకలాపాలను ప్రయత్నించండి.',
      challengesLink: 'సవాలును ప్రయత్నించండి',
      quizzesTitle: 'క్విజ్‌లు',
      quizzesText: 'ఆర్థిక భద్రత క్విజ్‌తో మీ జ్ఞానాన్ని పరీక్షించండి.',
      quizzesLink: 'క్విజ్ ప్రారంభించండి',
      rewardsTitle: 'బహుమతులు',
      rewardsText: 'అభ్యాస అంశాలను పూర్తి చేసి పాయింట్లు మరియు బ్యాడ్జ్‌లు పొందండి.',
      rewardsLink: 'బహుమతులు చూడండి',
      howItWorksLabel: 'ఇది ఎలా పనిచేస్తుంది',
      howItWorksHeading: 'సాధారణ అభ్యాస మార్గం',
      stepOneTitle: 'మొదట భావన నేర్చుకోండి',
      stepOneText: 'డబ్బు, లక్ష్యాలు, మరియు నిర్ణయాల గురించి సరళంగా తెలుసుకోండి.',
      stepTwoTitle: 'ఆర్థిక నిర్ణయం తీసుకోండి',
      stepTwoText: 'వర్చువల్ డబ్బుతో ప్రణాళిక, పొదుపు, లేదా బాగా ఆలోచించిన నిర్ణయం తీసుకోండి.',
      stepThreeTitle: 'ఫలితాన్ని చూడండి',
      stepThreeText: 'ప్రతి చర్య తర్వాత ఫీడ్బ్యాక్, పాయింట్లు, మరియు అభ్యాస మెరుగుదల చూడండి.',
      progressPreviewLabel: 'ప్రోగ్రెస్ ప్రివ్యూ',
      progressPreviewHeading: 'మీ అభ్యాసాన్ని పర్యవేక్షించండి',
      completedModulesLabel: 'పూర్తయిన మాడ్యూళ్లు',
      pointsLabel: 'మొత్తം పాయింట్లు',
      badgesLabel: 'సాధించిన బ్యాడ్జీలు',
      aboutTitle: 'గురించి',
      aboutText: 'మనీస్మార్ట్ అనేది విద్యార్థులకు ఆరోగ్యకరమైన డబ్బు అలవాట్లు పెంచే ప్రాక్టీస్ ప్లాట్‌ఫారం.',
      modulesFooterTitle: 'నేర్చుకునే మాడ్యూళ్లు',
      privacyTitle: 'ప్రైవసీ',
      privacyText: 'ఈ ప్రాజెక్ట్ డెమో ప్రోగ్రెస్‌ను బ్రౌజర్‌లో మాత్రమే భద్రపరుస్తుంది.',
      disclaimerTitle: 'చ educational Disclaimer',
      disclaimerText: 'ఈ సాధనాన్ని అభ్యాసం మరియు ప్రాక్టీస్ కోసం మాత్రమే ఉపయోగించండి. ఇది బ్యాంకింగ్ లేదా పెట్టుబడి సేవ కాదు.'
    },
    hi: {
      brandName: 'मनीस्मार्ट',
      navHome: 'होम',
      navStartLearning: 'सीखना शुरू करें',
      navLearn: 'सीखें',
      navProgress: 'प्रगति',
      navDashboard: 'डैशबोर्ड',
      langLabel: 'भाषा',
      startLearningBtn: 'सीखना शुरू करें',
      startLearningBtnSecondary: 'सीखना शुरू करें',
      exploreModulesBtn: 'मॉड्यूल देखें',
      eyebrow: 'छात्रों के लिए वित्तीय साक्षरता',
      heroTitle: 'स्मार्ट वित्तीय निर्णय लें। बेहतर भविष्य बनाएं।',
      heroSubtitle: 'रोचक गतिविधियों के माध्यम से बजट बनाना, बचत करना, निवेश समझना और धोखाधड़ी से सुरक्षित रहना सीखें।',
      learningModulesLabel: 'अध्ययन मॉड्यूल',
      moduleHeading: 'अभ्यास के लिए एक कौशल चुनें',
      budgetCardTitle: 'योजना और बजट',
      budgetCardText: 'जरूरतों, चाहतों, बचत और खर्चों में संतुलन बनाना सीखें।',
      budgetLinkText: 'बजट बनाना शुरू करें',
      savingsCardTitle: 'बचत और प्रबंधन',
      savingsCardText: 'बचत की आदतें डालें, लक्ष्य तय करें और अप्रत्याशित खर्चों के लिए तैयार रहें।',
      savingsLinkText: 'बचत शुरू करें',
      investingCardTitle: 'निवेश को समझें',
      investingCardText: 'काल्पनिक उदाहरणों से जोखिम, समय, चक्रवृद्धि और विविधीकरण को समझें।',
      investingLinkText: 'सिमुलेशन देखें',
      safetyCardTitle: 'वित्तीय सुरक्षा',
      safetyCardText: 'संदिग्ध संदेशों को पहचानें, व्यक्तिगत जानकारी सुरक्षित रखें और घोटालों से बचें।',
      safetyLinkText: 'अपने ज्ञान का परीक्षण करें',
      activitiesLabel: 'खेलें, अभ्यास करें और इनाम पाएं',
      activitiesHeading: 'आपकी यात्रा में पाठों से अधिक है',
      gamesTitle: 'मनी गेम्स',
      gamesText: 'बजट और स्कैम-जांच गेम्स में फैसलों का अभ्यास करें।',
      gamesLink: 'गेम खेलें',
      challengesTitle: 'चुनौतियां',
      challengesText: 'इंटरैक्टिव मनी चुनौतियां और बचत गतिविधियां आजमाएं।',
      challengesLink: 'चुनौती लें',
      quizzesTitle: 'क्विज़',
      quizzesText: 'वित्तीय सुरक्षा क्विज़ से अपना ज्ञान जांचें।',
      quizzesLink: 'क्विज़ लें',
      rewardsTitle: 'इनाम',
      rewardsText: 'लर्निंग पिलर पूरे करके अंक और बैज कमाएं।',
      rewardsLink: 'इनाम देखें',
      howItWorksLabel: 'यह कैसे काम करता है',
      howItWorksHeading: 'एक सरल सीखने का मार्ग',
      stepOneTitle: 'अवधारणा समझें',
      stepOneText: 'पैसों, लक्ष्यों और निर्णयों के बारे में सरल विचार जानें।',
      stepTwoTitle: 'वित्तीय निर्णय लें',
      stepTwoText: 'योजना बनाने और बचत के लिए वर्चुअल मनी का उपयोग करें।',
      stepThreeTitle: 'परिणाम देखें',
      stepThreeText: 'फीडबैक जांचें, अंक अर्जित करें और अपनी आदतों में सुधार करें।',
      progressPreviewLabel: 'प्रगति पूर्वावलोकन',
      progressPreviewHeading: 'अपनी प्रगति ट्रैक करें',
      completedModulesLabel: 'पूर्ण किए गए मॉड्यूल',
      pointsLabel: 'कुल अंक',
      badgesLabel: 'अर्जित बैज',
      aboutTitle: 'परिचय',
      aboutText: 'मनीस्मार्ट एक शैक्षिक मंच है जो छात्रों को स्वस्थ वित्तीय आदतें बनाने में मदद करता है।',
      modulesFooterTitle: 'लर्निंग मॉड्यूल',
      privacyTitle: 'गोपनीयता',
      privacyText: 'यह प्रोजेक्ट केवल ब्राउज़र में स्थानीय रूप से प्रगति संग्रहीत करता है।',
      disclaimerTitle: 'शैक्षिक अस्वीकरण',
      disclaimerText: 'यह केवल अभ्यास और सीखने के लिए है। यह कोई बैंकिंग या निवेश सेवा नहीं है।'
    }
  };

  function safeStorageGet(key, fallbackValue) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) {
        return fallbackValue;
      }

      const parsed = JSON.parse(saved);
      return parsed !== null ? parsed : fallbackValue;
    } catch (error) {
      return fallbackValue;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Browser may block storage in some restricted situations.
    }
  }

  function getProgress() {
    const progress = safeStorageGet(STORAGE_KEY, defaultProgress);
    return {
      ...defaultProgress,
      ...progress,
      completedModules: Array.isArray(progress.completedModules) ? progress.completedModules : [],
      badges: Array.isArray(progress.badges) ? progress.badges : [],
      quizScores: Array.isArray(progress.quizScores) ? progress.quizScores : [],
      quizTopicRewards: Array.isArray(progress.quizTopicRewards) ? progress.quizTopicRewards : [],
    };
  }

  function saveProgress(progress) {
    safeStorageSet(STORAGE_KEY, progress);
    if (window.MoneySmartFirebase) {
      return window.MoneySmartFirebase.saveProgress(progress);
    }
    return Promise.resolve('local');
  }

  function saveSavingsGoal(goal) {
    safeStorageSet('moneysmart-savings-goal', goal);
    const progress = getProgress();
    progress.savingsGoal = goal;
    return saveProgress(progress);
  }

  function resetProgress() {
    const progress = { ...defaultProgress, completedModules: [], badges: [], quizScores: [] };
    safeStorageSet('moneysmart-savings-goal', null);
    saveProgress(progress);
  }

  function getSavedLanguage() {
    const saved = safeStorageGet(LANGUAGE_KEY, 'en');
    return saved && translations[saved] ? saved : 'en';
  }

  function applyTranslations(language) {
    const selectedLanguage = translations[language] ? language : 'en';
    const texts = translations[selectedLanguage];

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      const value = texts[key] || translations.en[key] || element.textContent.trim();
      if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
        element.value = value;
      } else {
        element.textContent = value;
      }
    });

    document.documentElement.lang = selectedLanguage;
  }

  function ensureBadges(progress = getProgress()) {
    const earnedBadges = new Set(progress.badges || []);
    const badgeRules = [
      { key: 'budget-boss', condition: () => progress.budgetCompleted || progress.completedModules.includes('budget') },
      { key: 'budget-planner', condition: () => progress.completedModules.includes('budget') },
      { key: 'emergency-proof', condition: () => progress.savingsCompleted || progress.completedModules.includes('savings') },
      { key: 'savings-star', condition: () => progress.completedModules.includes('savings') },
      { key: 'market-master', condition: () => progress.investingCompleted || progress.completedModules.includes('investing') },
      { key: 'scam-detective', condition: () => progress.safetyQuizPass || progress.safetyCompleted || progress.completedModules.includes('safety') },
      { key: 'learning-champion', condition: () => ['budget', 'savings', 'investing', 'safety'].every((module) => progress.completedModules.includes(module)) },
    ];

    badgeRules.forEach((rule) => {
      if (rule.condition()) {
        earnedBadges.add(rule.key);
      }
    });

    progress.badges = Array.from(earnedBadges);
    saveProgress(progress);
    return progress;
  }

  function completeModule(moduleKey, pointsToAdd = 0) {
    const progress = getProgress();
    if (!Array.isArray(progress.completedModules)) {
      progress.completedModules = [];
    }

    const alreadyCompleted = progress.completedModules.includes(moduleKey);
    if (!alreadyCompleted) {
      progress.completedModules.push(moduleKey);
      if (pointsToAdd > 0) {
        progress.points = Number(progress.points || 0) + pointsToAdd;
      }
    }

    if (moduleKey === 'budget') progress.budgetCompleted = true;
    if (moduleKey === 'savings') progress.savingsCompleted = true;
    if (moduleKey === 'investing') progress.investingCompleted = true;
    if (moduleKey === 'safety') progress.safetyCompleted = true;

    const updatedProgress = ensureBadges(progress);
    saveProgress(updatedProgress);
    updateProgressSummary();
    return updatedProgress;
  }

  function updateProgressSummary() {
    const progress = ensureBadges(getProgress());
    const completedCount = document.getElementById('completedModulesCount');
    const totalPoints = document.getElementById('totalPointsCount');
    const badgeCount = document.getElementById('badgeCount');

    if (completedCount) completedCount.textContent = String(progress.completedModules.length);
    if (totalPoints) totalPoints.textContent = String(progress.points || 0);
    if (badgeCount) badgeCount.textContent = String((progress.badges || []).length);
  }

  function getBadgeLabels() {
    return {
      'budget-boss': 'Budget Boss',
      'budget-planner': 'Budget Boss',
      'emergency-proof': 'Emergency Proof',
      'savings-star': 'Emergency Proof',
      'crisis-navigator': 'Crisis Navigator',
      'budgeting-master': 'Budgeting Basics Mastery',
      'emergency-funds-master': 'Emergency Funds Mastery',
      'digital-scam-safety-master': 'Digital Scam Safety Mastery',
      'market-master': 'Market Master',
      'scam-detective': 'Scam Detective',
      'learning-champion': 'Learning Champion',
    };
  }

  function getNextSuggestion() {
    const progress = getProgress();
    const moduleOrder = [
      { key: 'budget', label: 'Budget challenge', href: 'budget.html' },
      { key: 'savings', label: 'Savings activity', href: 'savings.html' },
      { key: 'investing', label: 'Investing simulation', href: 'investing.html' },
      { key: 'safety', label: 'Financial safety quiz', href: 'safety.html' },
    ];

    const next = moduleOrder.find((module) => !progress.completedModules.includes(module.key));
    return next || { label: 'You have completed all modules', href: 'dashboard.html' };
  }

  function setLanguage(language) {
    const selectedLanguage = translations[language] ? language : 'en';
    safeStorageSet(LANGUAGE_KEY, selectedLanguage);
    applyTranslations(selectedLanguage);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const language = getSavedLanguage();
    applyTranslations(language);

    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.value = language;
      selector.addEventListener('change', (event) => {
        setLanguage(event.target.value);
      });
    }

    updateProgressSummary();
    document.addEventListener('moneysmart:progress-loaded', updateProgressSummary);
  });

  window.MoneySmart = {
    getProgress,
    saveProgress,
    saveSavingsGoal,
    resetProgress,
    completeModule,
    getNextSuggestion,
    getBadgeLabels,
    ensureBadges,
    setLanguage,
  };
})();
