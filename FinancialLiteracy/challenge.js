(() => {
  const choices = document.getElementById('challengeChoices');
  const result = document.getElementById('challengeResult');
  const resultTitle = document.getElementById('challengeResultTitle');
  const resultText = document.getElementById('challengeResultText');
  const lesson = document.getElementById('challengeLesson');
  const reward = document.getElementById('challengeReward');
  const retry = document.getElementById('challengeRetry');

  if (!choices || !result || !resultTitle || !resultText || !lesson || !reward || !retry) {
    return;
  }

  function showOutcome(choice) {
    choices.hidden = true;
    result.hidden = false;

    if (choice === 'cash') {
      resultTitle.textContent = '😟 Oops!';
      resultText.textContent = 'Your wallet drops to ₹100. You run out of bus money by Day 18 and can’t travel to college!';
      lesson.textContent = 'Lesson: Paying everything out of pocket for an unexpected emergency leaves you with no daily survival money.';
      reward.hidden = true;
      retry.hidden = false;
      return;
    }

    resultTitle.textContent = '🎉 Great job!';
    resultText.textContent = 'You fix your screen and still have ₹400 cash left—enough to cover all your bus fares for the rest of the month!';
    lesson.textContent = 'Lesson: Having an emergency savings buffer acts as a shock absorber so unexpected costs don’t ruin your daily budget.';
    reward.textContent = '🏅 Crisis Navigator badge unlocked!';
    reward.hidden = false;
    retry.hidden = true;

    if (window.MoneySmart) {
      const progress = window.MoneySmart.getProgress();
      const badges = Array.isArray(progress.badges) ? progress.badges : [];
      if (!badges.includes('crisis-navigator')) {
        progress.badges = [...badges, 'crisis-navigator'];
        window.MoneySmart.saveProgress(progress);
      }
    }
  }

  choices.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice]');
    if (button) {
      showOutcome(button.dataset.choice);
    }
  });

  retry.addEventListener('click', () => {
    result.hidden = true;
    choices.hidden = false;
  });
})();
