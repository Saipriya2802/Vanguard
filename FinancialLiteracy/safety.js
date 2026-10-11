document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    en: {
      eyebrow: 'Money basics • Module 4 of 4',
      title: 'Stay Financially Safe',
      lead: 'Pause, verify, and protect your personal and payment information.',
      otpTitle: 'Keep OTPs and PINs private',
      otpText: 'Never share your OTP, UPI PIN, password, or card security code—even with someone claiming to be from a bank.',
      verifyTitle: 'Verify before you click or pay',
      verifyText: 'Avoid unexpected links and QR codes. Open the official app or website yourself and confirm payment requests independently.',
      pauseTitle: 'Pause when someone pressures you',
      pauseText: 'Urgent threats, prize claims, and requests to install screen-sharing apps are warning signs. Stop and speak to someone you trust.',
      reportTitle: 'If you lose money to a cyber scam',
      reportText: 'Contact your bank using its official number and report financial cyber fraud promptly by calling India’s helpline 1930 or visiting cybercrime.gov.in.',
      finishedTitle: 'You’ve reached the end of the learning modules',
      dashboardLink: 'View your learning progress',
    },
    te: {
      eyebrow: 'డబ్బు ప్రాథమికాలు • మాడ్యూల్ 4 / 4',
      title: 'ఆర్థికంగా సురక్షితంగా ఉండండి',
      lead: 'ఆగి ఆలోచించండి, ధృవీకరించండి, మీ వ్యక్తిగత మరియు చెల్లింపు సమాచారాన్ని కాపాడుకోండి.',
      otpTitle: 'OTPలు, PINలను గోప్యంగా ఉంచండి',
      otpText: 'బ్యాంకు నుంచి అని చెప్పేవారితో సహా ఎవరితోనూ OTP, UPI PIN, పాస్‌వర్డ్ లేదా కార్డు సెక్యూరిటీ కోడ్‌ను పంచుకోకండి.',
      verifyTitle: 'క్లిక్ లేదా చెల్లింపుకు ముందు ధృవీకరించండి',
      verifyText: 'అనుకోని లింకులు, QR కోడ్‌లను నివారించండి. అధికారిక యాప్ లేదా వెబ్‌సైట్‌ను మీరే తెరిచి, చెల్లింపు అభ్యర్థనలను ధృవీకరించండి.',
      pauseTitle: 'ఎవరైనా తొందరపెడితే ఆగండి',
      pauseText: 'తక్షణ బెదిరింపులు, బహుమతి వాగ్దానాలు, స్క్రీన్ షేరింగ్ యాప్‌లను ఇన్‌స్టాల్ చేయమనే అభ్యర్థనలు హెచ్చరికలు. ఆగి, నమ్మకమైన వారితో మాట్లాడండి.',
      reportTitle: 'సైబర్ మోసంలో డబ్బు పోతే',
      reportText: 'బ్యాంకు అధికారిక నంబర్‌కు సంప్రదించండి. భారతదేశంలో ఆర్థిక సైబర్ మోసాన్ని వెంటనే 1930 హెల్ప్‌లైన్‌కు కాల్ చేసి లేదా cybercrime.gov.inలో నివేదించండి.',
      finishedTitle: 'మీరు అభ్యాస మాడ్యూళ్లను పూర్తి చేశారు',
      dashboardLink: 'మీ అభ్యాస ప్రగతిని చూడండి',
    },
    hi: {
      eyebrow: 'पैसों की बुनियादी बातें • मॉड्यूल 4 / 4',
      title: 'वित्तीय रूप से सुरक्षित रहें',
      lead: 'रुकें, जांचें और अपनी निजी तथा भुगतान जानकारी की सुरक्षा करें।',
      otpTitle: 'OTP और PIN गोपनीय रखें',
      otpText: 'किसी के साथ भी OTP, UPI PIN, पासवर्ड या कार्ड सुरक्षा कोड साझा न करें—भले ही वह बैंक से होने का दावा करे।',
      verifyTitle: 'क्लिक या भुगतान से पहले जांचें',
      verifyText: 'अनजान लिंक और QR कोड से बचें। आधिकारिक ऐप या वेबसाइट खुद खोलें और भुगतान अनुरोधों की स्वतंत्र रूप से पुष्टि करें।',
      pauseTitle: 'दबाव डालने पर रुकें',
      pauseText: 'तुरंत धमकी, इनाम का दावा और स्क्रीन-शेयरिंग ऐप इंस्टॉल करने के अनुरोध चेतावनी के संकेत हैं। रुकें और किसी भरोसेमंद व्यक्ति से बात करें।',
      reportTitle: 'साइबर धोखाधड़ी में पैसे खोने पर',
      reportText: 'बैंक के आधिकारिक नंबर पर संपर्क करें और भारत में वित्तीय साइबर धोखाधड़ी की तुरंत हेल्पलाइन 1930 पर कॉल करके या cybercrime.gov.in पर रिपोर्ट करें।',
      finishedTitle: 'आपने सभी सीखने के मॉड्यूल पूरे कर लिए हैं',
      dashboardLink: 'अपनी सीखने की प्रगति देखें',
    },
  };

  let language = localStorage.getItem('moneysmart-language') || 'en';

  function applyLanguage(selectedLanguage) {
    language = translations[selectedLanguage] ? selectedLanguage : 'en';
    if (window.MoneySmart) window.MoneySmart.setLanguage(language);

    document.querySelectorAll('.lang-pill[data-lang]').forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === language);
    });
    document.querySelectorAll('[data-safety-key]').forEach((element) => {
      const translatedText = translations[language][element.dataset.safetyKey];
      if (translatedText) element.textContent = translatedText;
    });
    document.documentElement.lang = language;
  }

  document.querySelectorAll('.lang-pill[data-lang]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

  applyLanguage(language);
});
