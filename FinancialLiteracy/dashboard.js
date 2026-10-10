document.addEventListener('DOMContentLoaded', () => {
  const progressList = document.getElementById('moduleProgressList');
  const badgeList = document.getElementById('badgeList');
  const suggestedActivity = document.getElementById('suggestedActivity');
  const dashboardEmptyState = document.getElementById('dashboardEmptyState');
  const dashboardContent = document.getElementById('dashboardContent');

  const moduleConfig = [
    { key: 'budget', label: 'Plan and Budget', href: 'budget.html' },
    { key: 'savings', label: 'Save and Manage', href: 'savings.html' },
    { key: 'investing', label: 'Understand Investing', href: 'investing.html' },
    { key: 'safety', label: 'Stay Financially Safe', href: 'safety.html' },
  ];

  function getProgress() {
    const saved = localStorage.getItem('moneysmart-progress');
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      return null;
    }
  }

  function renderModuleProgress(progress) {
    if (!progressList) {
      return;
    }

    progressList.innerHTML = '';
    moduleConfig.forEach((module) => {
      const completed = Array.isArray(progress.completedModules) && progress.completedModules.includes(module.key);
      const percent = completed ? 100 : 0;
      const item = document.createElement('div');
      item.className = 'module-progress-item';
      item.innerHTML = `
        <div class="module-progress-header">
          <span>${module.label}</span>
          <span>${percent}%</span>
        </div>
        <div class="module-progress-bar"><span style="width: ${percent}%"></span></div>
      `;
      progressList.appendChild(item);
    });
  }

  function renderBadges(progress) {
    const labels = {
      'budget-planner': 'Budget Planner',
      'savings-star': 'Savings Star',
      'scam-detective': 'Scam Detective',
      'learning-champion': 'Learning Champion',
    };

    if (!badgeList) {
      return;
    }

    const badges = Array.isArray(progress.badges) && progress.badges.length > 0 ? progress.badges : [];
    badgeList.innerHTML = '';

    if (badges.length === 0) {
      const item = document.createElement('li');
      item.textContent = 'No badges yet. Complete a challenge to earn one.';
      badgeList.appendChild(item);
      return;
    }

    badges.forEach((badgeKey) => {
      const item = document.createElement('li');
      item.innerHTML = `<span class="badge-icon">★</span> <span>${labels[badgeKey] || badgeKey}</span>`;
      badgeList.appendChild(item);
    });
  }

  function renderSuggestedActivity(progress) {
    if (!suggestedActivity) {
      return;
    }

    const next = window.MoneySmart.getNextSuggestion();
    suggestedActivity.innerHTML = `<strong>Suggested next activity:</strong> <a href="${next.href}">${next.label}</a>`;
  }

  function renderDashboard() {
    const progress = getProgress();
    if (!progress || (!progress.completedModules || progress.completedModules.length === 0) && (!progress.badges || progress.badges.length === 0) && !progress.points) {
      dashboardEmptyState.hidden = false;
      dashboardContent.hidden = true;
      return;
    }

    dashboardEmptyState.hidden = true;
    dashboardContent.hidden = false;

    document.getElementById('dashboardPoints').textContent = String(progress.points || 0);
    document.getElementById('dashboardModules').textContent = String((progress.completedModules || []).length);

    const quizScores = Array.isArray(progress.quizScores) && progress.quizScores.length > 0 ? progress.quizScores : [0];
    const latestQuizScore = Math.max(...quizScores);
    document.getElementById('dashboardQuizScore').textContent = `${latestQuizScore}%`;

    const savingsGoal = progress.savingsGoal || { progress: 0 };
    const savingsPercent = Number(savingsGoal.progress || 0);
    document.getElementById('dashboardSavings').textContent = `${savingsPercent.toFixed(0)}%`;

    renderModuleProgress(progress);
    renderBadges(progress);
    renderSuggestedActivity(progress);
  }

  window.addEventListener('moneysmart:progress-loaded', renderDashboard);

  document.getElementById('resetProgressBtn').addEventListener('click', () => {
    const confirmed = window.confirm('Reset all demo progress in this browser?');
    if (!confirmed) {
      return;
    }

    window.MoneySmart.resetProgress();
    renderDashboard();
  });

  renderDashboard();
});
