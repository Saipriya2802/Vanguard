document.addEventListener('DOMContentLoaded', () => {
  const text = {
    en: {
      eyebrow: 'Money basics • Module 3 of 4',
      title: 'Understand Investing',
      lead: 'Learn how time, compounding, and risk can affect investments.',
      timeTitle: 'Give investments time',
      timeText: 'Investments can rise and fall. Money you may need soon is usually better kept somewhere stable and easy to access.',
      compoundTitle: 'Understand compounding',
      compoundText: 'Compounding happens when returns can earn returns too. Over time, this may help money grow, but growth is never guaranteed.',
      diversifyTitle: 'Spread risk',
      diversifyText: 'Diversification means spreading money across different investments instead of relying on just one. It can reduce some risks, not remove them all.',
      calculatorEyebrow: 'Try an example',
      calculatorTitle: 'Explore potential growth',
      calculatorIntro: 'Change the amounts and assumptions to see how regular investing and compounding may affect a future value.',
      initialLabel: 'Starting amount (₹)',
      monthlyLabel: 'Monthly contribution (₹)',
      rateLabel: 'Assumed yearly return (%)',
      yearsLabel: 'Time invested (years)',
      futureValueLabel: 'Estimated future value',
      contributedLabel: 'Total amount invested',
      growthLabel: 'Estimated growth',
      estimateNote: 'Illustration only: assumes monthly contributions and a constant rate, compounded monthly. Actual returns vary and are not guaranteed.',
      disclaimer: 'This learning example excludes fees, taxes, and inflation. It is not investment advice.',
      nextEyebrow: 'Next learning module',
      nextTitle: 'Stay Financially Safe',
      nextText: 'Learn to protect your money and recognize common scams.',
      nextLink: 'Continue to Financial Safety',
      inputError: 'Enter valid amounts within the limits shown to calculate an estimate.',
    },
    te: {
      eyebrow: 'డబ్బు ప్రాథమికాలు • మాడ్యూల్ 3 / 4',
      title: 'పెట్టుబడిని అర్థం చేసుకోండి',
      lead: 'సమయం, చక్రవడ్డీ మరియు రిస్క్ పెట్టుబడులను ఎలా ప్రభావితం చేస్తాయో తెలుసుకోండి.',
      timeTitle: 'పెట్టుబడికి సమయం ఇవ్వండి',
      timeText: 'పెట్టుబడుల విలువ పెరగవచ్చు లేదా తగ్గవచ్చు. త్వరలో అవసరమయ్యే డబ్బును స్థిరంగా, సులభంగా తీసుకోగలిగే చోట ఉంచడం మంచిది.',
      compoundTitle: 'చక్రవడ్డీని అర్థం చేసుకోండి',
      compoundText: 'లాభాలపై కూడా లాభాలు వచ్చినప్పుడు చక్రవడ్డీ ఏర్పడుతుంది. కాలక్రమేణా డబ్బు పెరగడానికి ఇది సహాయపడవచ్చు, కానీ వృద్ధికి హామీ లేదు.',
      diversifyTitle: 'రిస్క్‌ను విస్తరించండి',
      diversifyText: 'వైవిధ్యీకరణ అంటే ఒకదానిపై మాత్రమే ఆధారపడకుండా వివిధ పెట్టుబడుల్లో డబ్బును విభజించడం. ఇది కొన్ని రిస్క్‌లను తగ్గించవచ్చు, పూర్తిగా తొలగించదు.',
      calculatorEyebrow: 'ఉదాహరణ ప్రయత్నించండి',
      calculatorTitle: 'సంభావ్య వృద్ధిని చూడండి',
      calculatorIntro: 'నెలవారీ పెట్టుబడి, చక్రవడ్డీ భవిష్యత్ విలువను ఎలా ప్రభావితం చేయవచ్చో చూడటానికి మొత్తాలు, అంచనాలను మార్చండి.',
      initialLabel: 'ప్రారంభ మొత్తం (₹)',
      monthlyLabel: 'నెలవారీ పెట్టుబడి (₹)',
      rateLabel: 'అంచనా వార్షిక రాబడి (%)',
      yearsLabel: 'పెట్టుబడి కాలం (సంవత్సరాలు)',
      futureValueLabel: 'అంచనా భవిష్యత్ విలువ',
      contributedLabel: 'మొత్తం పెట్టుబడి',
      growthLabel: 'అంచనా వృద్ధి',
      estimateNote: 'ఇది కేవలం ఉదాహరణ: నెలవారీ పెట్టుబడి, స్థిరమైన రేటు, నెలవారీ చక్రవడ్డీని ఊహిస్తుంది. నిజమైన రాబడి మారవచ్చు; హామీ లేదు.',
      disclaimer: 'ఈ ఉదాహరణలో ఫీజులు, పన్నులు, ద్రవ్యోల్బణం లేవు. ఇది పెట్టుబడి సలహా కాదు.',
      nextEyebrow: 'తదుపరి అభ్యాస మాడ్యూల్',
      nextTitle: 'ఆర్థికంగా సురక్షితంగా ఉండండి',
      nextText: 'మీ డబ్బును ఎలా కాపాడుకోవాలో, సాధారణ మోసాలను ఎలా గుర్తించాలో తెలుసుకోండి.',
      nextLink: 'ఆర్థిక భద్రతకు కొనసాగండి',
      inputError: 'అంచనా కోసం చూపిన పరిమితుల్లో సరైన మొత్తాలను నమోదు చేయండి.',
    },
    hi: {
      eyebrow: 'पैसों की बुनियादी बातें • मॉड्यूल 3 / 4',
      title: 'निवेश को समझें',
      lead: 'जानें कि समय, चक्रवृद्धि और जोखिम निवेश को कैसे प्रभावित कर सकते हैं।',
      timeTitle: 'निवेश को समय दें',
      timeText: 'निवेश का मूल्य बढ़ या घट सकता है। जिसकी जल्द जरूरत हो, उस पैसे को आमतौर पर स्थिर और आसानी से उपलब्ध जगह पर रखना बेहतर है।',
      compoundTitle: 'चक्रवृद्धि को समझें',
      compoundText: 'जब रिटर्न पर भी रिटर्न मिलता है, तो चक्रवृद्धि होती है। समय के साथ इससे पैसा बढ़ सकता है, लेकिन वृद्धि की गारंटी नहीं होती।',
      diversifyTitle: 'जोखिम फैलाएं',
      diversifyText: 'विविधीकरण का अर्थ है एक ही निवेश पर निर्भर न रहकर पैसे को अलग-अलग निवेशों में बांटना। इससे कुछ जोखिम कम हो सकते हैं, सभी नहीं।',
      calculatorEyebrow: 'उदाहरण देखें',
      calculatorTitle: 'संभावित वृद्धि का अनुमान',
      calculatorIntro: 'राशि और मान्यताएं बदलकर देखें कि नियमित निवेश और चक्रवृद्धि भविष्य की राशि को कैसे प्रभावित कर सकते हैं।',
      initialLabel: 'शुरुआती राशि (₹)',
      monthlyLabel: 'मासिक निवेश (₹)',
      rateLabel: 'मान लिया गया वार्षिक रिटर्न (%)',
      yearsLabel: 'निवेश की अवधि (वर्ष)',
      futureValueLabel: 'अनुमानित भविष्य की राशि',
      contributedLabel: 'कुल निवेश राशि',
      growthLabel: 'अनुमानित वृद्धि',
      estimateNote: 'केवल उदाहरण: मासिक निवेश और स्थिर दर मानकर मासिक चक्रवृद्धि की गई है। वास्तविक रिटर्न अलग हो सकता है और इसकी गारंटी नहीं है।',
      disclaimer: 'इस उदाहरण में शुल्क, कर और महंगाई शामिल नहीं हैं। यह निवेश सलाह नहीं है।',
      nextEyebrow: 'अगला सीखने का मॉड्यूल',
      nextTitle: 'वित्तीय रूप से सुरक्षित रहें',
      nextText: 'अपने पैसे की सुरक्षा करना और आम धोखाधड़ी पहचानना सीखें।',
      nextLink: 'वित्तीय सुरक्षा पर आगे बढ़ें',
      inputError: 'अनुमान देखने के लिए दी गई सीमाओं के भीतर सही राशि दर्ज करें।',
    },
  };

  const inputs = [
    document.getElementById('initialAmount'),
    document.getElementById('monthlyContribution'),
    document.getElementById('annualRate'),
    document.getElementById('investmentYears'),
  ];
  const error = document.getElementById('calculatorError');
  const formatINR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  let language = localStorage.getItem('moneysmart-language') || 'en';

  function applyLanguage(selectedLanguage) {
    language = text[selectedLanguage] ? selectedLanguage : 'en';
    if (window.MoneySmart) window.MoneySmart.setLanguage(language);

    document.querySelectorAll('.lang-pill[data-lang]').forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === language);
    });
    document.querySelectorAll('[data-investing-key]').forEach((element) => {
      element.textContent = text[language][element.dataset.investingKey];
    });
    document.documentElement.lang = language;
    if (!error.hidden) error.textContent = text[language].inputError;
  }

  function calculateGrowth() {
    const invalidInput = inputs.find((input) => !input.checkValidity());
    if (invalidInput) {
      inputs.forEach((input) => input.setAttribute('aria-invalid', String(!input.checkValidity())));
      error.textContent = text[language].inputError;
      error.hidden = false;
      return;
    }

    inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    error.hidden = true;

    const [startingAmount, monthlyContribution, annualRate, years] = inputs.map((input) => Number(input.value));
    const monthCount = years * 12;
    const monthlyRate = annualRate / 100 / 12;
    const growthFactor = Math.pow(1 + monthlyRate, monthCount);
    const futureStartingAmount = startingAmount * growthFactor;
    const futureContributions = monthlyRate === 0
      ? monthlyContribution * monthCount
      : monthlyContribution * ((growthFactor - 1) / monthlyRate);
    const futureValue = Math.round(futureStartingAmount + futureContributions);
    const totalContributed = startingAmount + monthlyContribution * monthCount;

    document.getElementById('futureValue').textContent = formatINR.format(futureValue);
    document.getElementById('totalContributed').textContent = formatINR.format(totalContributed);
    document.getElementById('estimatedGrowth').textContent = formatINR.format(futureValue - totalContributed);
  }

  document.querySelectorAll('.lang-pill[data-lang]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });
  inputs.forEach((input) => input.addEventListener('input', calculateGrowth));
  document.getElementById('proceedSafety').addEventListener('click', () => {
    if (window.MoneySmart) window.MoneySmart.completeModule('investing');
  });

  applyLanguage(language);
  calculateGrowth();
});
