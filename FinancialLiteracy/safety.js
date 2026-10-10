document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    {
      question: 'You receive a message saying you won ₹10,000, but you must share your OTP to claim the prize. What should you do?',
      options: [
        'Share the OTP immediately.',
        'Click the link and provide bank details.',
        'Never share the OTP and verify the message through a trusted source.',
        'Forward the OTP to a friend.',
      ],
      answer: 2,
      explanation: 'A one-time password must never be shared. Suspicious prize claims should always be verified independently.'
    },
    {
      question: 'A link asks you to log in to update your account details. What is the safest action?',
      options: [
        'Click it immediately.',
        'Open the official app or website directly from your browser.',
        'Reply with your password.',
        'Share the link with others.',
      ],
      answer: 1,
      explanation: 'Always type the official website address or use your trusted app instead of clicking suspicious links.'
    },
    {
      question: 'A message asks for your bank details to process a refund. What should you do?',
      options: [
        'Share the details to get the refund.',
        'Ignore the message and confirm with the official institution.',
        'Send the details through WhatsApp.',
        'Call the sender from the message itself.',
      ],
      answer: 1,
      explanation: 'Never share bank details without verifying the request through official contact information.'
    },
    {
      question: 'Which password habit is the safest?',
      options: [
        'Use the same password everywhere.',
        'Use a short, memorable password.',
        'Create a unique password and do not share it.',
        'Write your password on a note beside your device.',
      ],
      answer: 2,
      explanation: 'Unique, strong passwords reduce the risk of multiple accounts being hacked at once.'
    },
    {
      question: 'What is a warning sign of a suspicious job offer?',
      options: [
        'Clear job details and a real company name.',
        'A request for payment before work begins.',
        'An interview process with proper communication.',
        'A formal contract from a known company.',
      ],
      answer: 1,
      explanation: 'A request for upfront payment is a common scam pattern. Always verify the opportunity independently.'
    },
    {
      question: 'A person pressures you to pay immediately for a loan or service. What should you do?',
      options: [
        'Pay at once to avoid missing out.',
        'Ask for time to think and verify the source.',
        'Share your OTP to confirm the payment.',
        'Send money to a new contact without checking.',
      ],
      answer: 1,
      explanation: 'Pressure and urgency are common scam tactics. A careful pause helps you protect your money.'
    },
    {
      question: 'What is the safest way to make a digital payment?',
      options: [
        'Use a trusted payment app or official bank channel.',
        'Send money to a random person asking for help.',
        'Share your UPI PIN with family and friends.',
        'Save your PIN in a message.',
      ],
      answer: 0,
      explanation: 'Use only trusted and official channels, and keep your payment details private.'
    },
    {
      question: 'A message asks you to click a link to claim a reward. What is the best response?',
      options: [
        'Click the link and enter your details.',
        'Ignore it and verify the offer through a trusted source.',
        'Send the message to everyone you know.',
        'Reply with your password to confirm identity.',
      ],
      answer: 1,
      explanation: 'When an offer seems too good to be true, independent verification is the safer choice.'
    },
    {
      question: 'Which habit helps protect your personal information online?',
      options: [
        'Sharing your password with a trusted friend.',
        'Checking if the website address is official and secure before entering details.',
        'Accepting every pop-up message.',
        'Giving your OTP to anyone who claims to be from support.',
      ],
      answer: 1,
      explanation: 'Careful verification of websites and requests helps protect your information and reduces scam risk.'
    },
    {
      question: 'A friend asks you for your OTP to help them log in quickly. What should you do?',
      options: [
        'Share it immediately because they are a friend.',
        'Never share the OTP and explain that it is a security risk.',
        'Reply with your password instead.',
        'Forward the OTP to a group chat.',
      ],
      answer: 1,
      explanation: 'OTPs and passwords are private. Sharing them can give others access to your accounts.'
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let selectedAnswers = [];

  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');
  const restartQuizBtn = document.getElementById('restartQuizBtn');
  const quizResult = document.getElementById('quizResult');
  const quizProgressText = document.getElementById('quizProgressText');
  const scoreText = document.getElementById('scoreText');

  function renderQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    quizProgressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    scoreText.textContent = `Score: ${score}`;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = option;
      button.setAttribute('aria-pressed', 'false');

      button.addEventListener('click', () => {
        document.querySelectorAll('.option-button').forEach((item) => {
          item.classList.remove('selected');
          item.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
        selectedAnswers[currentQuestionIndex] = index;
      });

      optionsContainer.appendChild(button);
    });

    nextQuestionBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
  }

  function finishQuiz() {
    const correctAnswers = questions.filter((question, index) => selectedAnswers[index] === question.answer).length;
    const percent = Math.round((correctAnswers / questions.length) * 100);
    const passed = percent >= 70;

    quizResult.hidden = false;
    quizResult.innerHTML = `
      <h3>Quiz complete</h3>
      <p>You scored ${percent}% (${correctAnswers} out of ${questions.length}).</p>
      <p>${passed ? 'Great work! You passed this safety quiz.' : 'You are learning—keep practising and revisit the questions you missed.'}</p>
      <ul>
        ${questions.map((question, index) => `<li><strong>Q${index + 1}:</strong> ${question.explanation}</li>`).join('')}
      </ul>
    `;

    if (passed) {
      window.MoneySmart.completeModule('safety', 20);
      const currentProgress = window.MoneySmart.getProgress();
      currentProgress.safetyQuizPass = true;
      window.MoneySmart.saveProgress(currentProgress);
    }

    document.getElementById('quizArea').style.display = 'none';
    restartQuizBtn.hidden = false;
    nextQuestionBtn.hidden = true;
  }

  nextQuestionBtn.addEventListener('click', () => {
    const selectedIndex = selectedAnswers[currentQuestionIndex];
    if (typeof selectedIndex !== 'number') {
      quizResult.hidden = false;
      quizResult.textContent = 'Please select one answer before moving to the next question.';
      return;
    }

    if (questions[currentQuestionIndex].answer === selectedIndex) {
      score += 1;
    }

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
      quizResult.hidden = true;
    } else {
      finishQuiz();
    }
  });

  restartQuizBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = [];
    quizResult.hidden = true;
    nextQuestionBtn.hidden = false;
    restartQuizBtn.hidden = true;
    document.getElementById('quizArea').style.display = 'block';
    renderQuestion();
  });

  renderQuestion();
});
