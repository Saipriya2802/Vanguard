document.addEventListener('DOMContentLoaded', () => {
  const topics = {
    budgeting: {
      title: 'Budgeting Basics',
      badge: 'budgeting-master',
      questionCount: 5,
      passingScore: 2,
    },
    emergency: {
      title: 'Emergency Funds',
      badge: 'emergency-funds-master',
      questionCount: 3,
      passingScore: 2,
    },
    scams: {
      title: 'Digital Scam Safety',
      badge: 'digital-scam-safety-master',
      questionCount: 3,
      passingScore: 2,
    },
  };

  const topicHub = document.getElementById('quizTopicHub');
  const activeQuiz = document.getElementById('activeQuiz');
  const quizContent = document.getElementById('quizContent');
  const loadingMessage = document.getElementById('quizLoading');
  const sourceNotice = document.getElementById('quizSourceNotice');
  const loadError = document.getElementById('quizLoadError');
  const resultScreen = document.getElementById('quizResult');
  const topicLabel = document.getElementById('quizTopicLabel');
  const questionCount = document.getElementById('quizQuestionCount');
  const questionText = document.getElementById('quizQuestion');
  const optionsContainer = document.getElementById('quizOptions');
  const feedback = document.getElementById('quizFeedback');
  const nextButton = document.getElementById('nextQuizQuestion');
  let currentTopicKey = '';
  let currentQuestions = [];
  let generationId = 0;
  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;

  function getProgress() {
    return window.MoneySmart ? window.MoneySmart.getProgress() : { goldenCoins: 0, quizTopicRewards: [], badges: [] };
  }

  function updateWallet() {
    document.getElementById('quizWallet').textContent = String(getProgress().goldenCoins || 0);
  }

  function updateTopicStatuses() {
    const progress = getProgress();
    document.querySelectorAll('[data-topic-status]').forEach((status) => {
      const topic = topics[status.dataset.topicStatus];
      const rewardEarned = (progress.quizTopicRewards || []).includes(status.dataset.topicStatus);
      status.textContent = rewardEarned ? `🏅 ${topic.title} Mastered` : `${topic.questionCount} questions`;
    });
  }

  function renderQuestion() {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    topicLabel.textContent = topics[currentTopicKey].title;
    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    questionText.textContent = currentQuestion.question;
    feedback.hidden = true;
    feedback.textContent = '';
    nextButton.hidden = true;
    nextButton.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'See results' : 'Next question';
    hasAnswered = false;
    optionsContainer.replaceChildren();
    document.getElementById('quizProgressFill').style.width = `${(currentQuestionIndex / currentQuestions.length) * 100}%`;

    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'quiz-option';
      button.type = 'button';
      button.textContent = `[ ${String.fromCharCode(65 + index)} ] ${option}`;
      button.addEventListener('click', () => selectAnswer(index));
      optionsContainer.appendChild(button);
    });
  }

  function selectAnswer(selectedIndex) {
    if (hasAnswered) return;
    hasAnswered = true;
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const correct = selectedIndex === currentQuestion.answer;
    if (correct) score += 1;

    optionsContainer.querySelectorAll('.quiz-option').forEach((button, index) => {
      button.disabled = true;
      if (index === currentQuestion.answer) button.classList.add('is-correct');
      if (index === selectedIndex && !correct) button.classList.add('is-incorrect');
    });

    feedback.className = `quiz-feedback ${correct ? 'is-correct' : 'is-incorrect'}`;
    const correctAnswer = `[ ${String.fromCharCode(65 + currentQuestion.answer)} ] ${currentQuestion.options[currentQuestion.answer]}`;
    feedback.textContent = `${correct ? '✅ Correct!' : '❌ Not quite.'} Correct answer: ${correctAnswer} Why: ${currentQuestion.why}`;
    feedback.hidden = false;
    document.getElementById('quizProgressFill').style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
    nextButton.hidden = false;
  }

  function finishQuiz() {
    const topic = topics[currentTopicKey];
    const questionTotal = currentQuestions.length;
    const passingScore = topic.passingScore;
    const passed = score >= passingScore;
    let coinsEarned = 0;
    let xpAdded = 0;
    let badgeUnlocked = false;
    const progress = getProgress();
    const rewardedTopics = Array.isArray(progress.quizTopicRewards) ? progress.quizTopicRewards : [];
    const badges = Array.isArray(progress.badges) ? progress.badges : [];

    if (passed) {
      if (!rewardedTopics.includes(currentTopicKey)) {
        coinsEarned = 50;
        xpAdded = 100;
        progress.goldenCoins = Number(progress.goldenCoins || 0) + coinsEarned;
        progress.knowledgeXP = Number(progress.knowledgeXP || 0) + xpAdded;
        progress.quizTopicRewards = [...rewardedTopics, currentTopicKey];
      }
      badgeUnlocked = !badges.includes(topic.badge);
      if (badgeUnlocked) progress.badges = [...badges, topic.badge];
    }

    progress.quizScores = [...(Array.isArray(progress.quizScores) ? progress.quizScores : []), Math.round((score / questionTotal) * 100)];
    if (window.MoneySmart) {
      window.MoneySmart.saveProgress(progress);
    }

    activeQuiz.hidden = true;
    resultScreen.hidden = false;
    document.getElementById('quizResultTitle').textContent = passed ? `🎉 ${topic.title} passed!` : `Keep practicing: ${topic.title}`;
    document.getElementById('quizResultScore').textContent = `Your score: ${score} out of ${questionTotal}${passed ? ' — you passed!' : ` — you need at least ${passingScore} correct answers to pass.`}`;
    document.getElementById('quizResultCoins').textContent = String(coinsEarned);
    document.getElementById('quizResultXP').textContent = String(xpAdded);
    const badgeResult = document.getElementById('quizResultBadge');
    badgeResult.hidden = !passed;
    badgeResult.textContent = badgeUnlocked ? `🏅 ${topic.title} Mastery badge unlocked!` : `🏅 ${topic.title} Mastery badge already unlocked.`;
    document.getElementById('quizResultNote').textContent = passed
      ? (coinsEarned ? 'Rewards added to your wallet and dashboard progress.' : 'You have already earned this topic’s rewards; try another topic to earn more.')
      : 'Review the topic and try again. You can earn its rewards after passing.';
    updateWallet();
    updateTopicStatuses();
  }

  function validateGeneratedQuestions(questions) {
    const expectedCount = topics[currentTopicKey].questionCount;
    return Array.isArray(questions)
      && questions.length === expectedCount
      && questions.every((question) => question
        && typeof question.question === 'string'
        && question.question.trim().length > 0
        && Array.isArray(question.options)
        && question.options.length === 4
        && question.options.every((option) => typeof option === 'string' && option.trim().length > 0)
        && Number.isInteger(question.answer)
        && question.answer >= 0
        && question.answer < 4
        && typeof question.why === 'string'
        && question.why.trim().length > 0);
  }

  function getQuizApiUrl() {
    if (window.location.port === '8001') {
      return new URL('/api/generate-quiz', window.location.origin).toString();
    }
    return 'http://127.0.0.1:8001/api/generate-quiz';
  }

  async function loadTopicQuiz() {
    const topicKey = currentTopicKey;
    const topic = topics[topicKey];
    const requestId = ++generationId;
    currentQuestionIndex = 0;
    score = 0;
    currentQuestions = [];
    topicLabel.textContent = topic.title;
    questionCount.textContent = `Preparing ${topic.questionCount} questions…`;
    quizContent.hidden = true;
    loadingMessage.hidden = false;
    loadError.hidden = true;
    sourceNotice.hidden = true;
    activeQuiz.hidden = false;
    document.querySelectorAll('[data-topic]').forEach((button) => {
      button.disabled = true;
    });

    try {
      const response = await fetch(getQuizApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ topic: topicKey }),
      });
      let payload;
      try {
        payload = await response.json();
      } catch (error) {
        throw new Error('The quiz server returned an unreadable response. Start the MoneySmart server on port 8001 and reopen the quiz page at http://127.0.0.1:8001/quizzes.html.');
      }
      if (!response.ok) {
        throw new Error(payload.error || 'Quiz generation failed.');
      }
      if (!validateGeneratedQuestions(payload.questions)) {
        throw new Error('The quiz service returned questions in an invalid format.');
      }
      if (requestId !== generationId || activeQuiz.hidden) return;

      currentQuestions = payload.questions;
      sourceNotice.textContent = payload.source === 'practice'
        ? 'Using the built-in practice set. Add a Groq API key to enable AI-generated questions.'
        : '';
      sourceNotice.hidden = payload.source !== 'practice';
      loadingMessage.hidden = true;
      quizContent.hidden = false;
      renderQuestion();
    } catch (error) {
      if (requestId !== generationId || activeQuiz.hidden) return;
      loadingMessage.hidden = true;
      loadError.hidden = false;
      loadError.firstChild.textContent = `${error instanceof TypeError
        ? 'Could not connect to the quiz server. Start it with ..\\.venv\\Scripts\\python.exe server.py from the FinancialLiteracy folder, then reopen the quiz page at http://127.0.0.1:8001/quizzes.html.'
        : error.message} `;
    } finally {
      if (requestId === generationId) {
        document.querySelectorAll('[data-topic]').forEach((button) => {
          button.disabled = false;
        });
      }
    }
  }

  document.querySelectorAll('[data-topic]').forEach((button) => {
    button.addEventListener('click', () => {
      currentTopicKey = button.dataset.topic;
      resultScreen.hidden = true;
      topicHub.hidden = true;
      loadTopicQuiz();
    });
  });

  nextButton.addEventListener('click', () => {
    if (currentQuestionIndex === currentQuestions.length - 1) {
      finishQuiz();
      return;
    }
    currentQuestionIndex += 1;
    renderQuestion();
  });

  function returnToTopics() {
    generationId += 1;
    document.querySelectorAll('[data-topic]').forEach((button) => {
      button.disabled = false;
    });
    activeQuiz.hidden = true;
    resultScreen.hidden = true;
    topicHub.hidden = false;
    updateWallet();
    updateTopicStatuses();
  }

  document.getElementById('backToQuizTopics').addEventListener('click', returnToTopics);
  document.getElementById('returnToTopics').addEventListener('click', returnToTopics);
  document.getElementById('retryQuizGeneration').addEventListener('click', loadTopicQuiz);
  updateWallet();
  updateTopicStatuses();
});
