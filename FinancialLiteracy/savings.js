document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('savingsGoalForm');
  const goalTitle = document.getElementById('goalTitle');
  const goalTarget = document.getElementById('goalTarget');
  const goalSaved = document.getElementById('goalSaved');
  const weeklySaving = document.getElementById('weeklySaving');
  const saveButton = document.getElementById('saveSavingsGoal');
  const error = document.getElementById('savingsError');
  const result = document.getElementById('savingsResult');
  const resultTitle = document.getElementById('savingsResultTitle');
  const resultText = document.getElementById('savingsResultText');
  const progressFill = document.getElementById('savingsProgressFill');
  const savedStatus = document.getElementById('savingsSavedStatus');

  if (!form || !goalTitle || !goalTarget || !goalSaved || !weeklySaving ||
      !saveButton || !error || !result || !resultTitle ||
      !resultText || !progressFill || !savedStatus) {
    return;
  }

  const fields = [goalTitle, goalTarget, goalSaved, weeklySaving];
  const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  let calculatedGoal = null;

  function readAmount(input, allowZero = false) {
    const value = input.value.trim() === '' ? Number.NaN : Number(input.value);
    return Number.isFinite(value) && (allowZero ? value >= 0 : value > 0) ? value : null;
  }

  function restoreSavedGoal() {
    const savedGoal = window.MoneySmart?.getProgress().savingsGoal;
    if (!savedGoal || typeof savedGoal !== 'object') return;

    if (typeof savedGoal.title === 'string' && savedGoal.title) goalTitle.value = savedGoal.title;
    if (Number.isFinite(Number(savedGoal.target)) && Number(savedGoal.target) > 0) goalTarget.value = savedGoal.target;
    if (Number.isFinite(Number(savedGoal.saved)) && Number(savedGoal.saved) >= 0) goalSaved.value = savedGoal.saved;
    if (Number.isFinite(Number(savedGoal.weeklySaving)) && Number(savedGoal.weeklySaving) > 0) {
      weeklySaving.value = savedGoal.weeklySaving;
    }
  }

  function calculateGoal() {
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
    const title = goalTitle.value.trim();
    const target = readAmount(goalTarget);
    const alreadySaved = readAmount(goalSaved, true);
    const weeklyAmount = readAmount(weeklySaving);
    const invalidField = !title
      ? goalTitle
      : target === null
        ? goalTarget
        : alreadySaved === null
          ? goalSaved
          : weeklyAmount === null
            ? weeklySaving
            : null;

    if (invalidField) {
      const messages = {
        goalTitle: 'Enter a name for your savings goal.',
        goalTarget: 'Enter a goal amount greater than ₹0.',
        goalSaved: 'Enter an amount already saved of ₹0 or more.',
        weeklySaving: 'Enter a weekly savings amount greater than ₹0.',
      };
      invalidField.setAttribute('aria-invalid', 'true');
      error.textContent = messages[invalidField.id];
      error.hidden = false;
      result.hidden = true;
      saveButton.disabled = true;
      calculatedGoal = null;
      invalidField.focus();
      return false;
    }

    error.hidden = true;
    const remaining = Math.max(0, target - alreadySaved);
    const weeksNeeded = Math.ceil(remaining / weeklyAmount);
    const progress = Math.min(100, (alreadySaved / target) * 100);
    calculatedGoal = {
      title,
      target,
      saved: alreadySaved,
      weeklySaving: weeklyAmount,
      weeksNeeded,
      progress,
    };

    resultTitle.textContent = title;
    resultText.textContent = remaining === 0
      ? `Goal reached! You have already saved ${currency.format(target)}.`
      : `You need ${currency.format(remaining)} more. Saving ${currency.format(weeklyAmount)} each week will take about ${weeksNeeded} ${weeksNeeded === 1 ? 'week' : 'weeks'}.`;
    progressFill.style.width = `${progress}%`;
    savedStatus.hidden = true;
    result.hidden = false;
    saveButton.disabled = false;
    return true;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateGoal();
  });

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      savedStatus.hidden = true;
      calculateGoal();
    });
  });

  saveButton.addEventListener('click', async () => {
    if (!calculatedGoal || !window.MoneySmart) {
      error.textContent = 'The goal cannot be saved yet. Check the values and calculate your plan first.';
      error.hidden = false;
      return;
    }

    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';
    let timeoutId;
    try {
      const syncStatus = await Promise.race([
        window.MoneySmart.saveSavingsGoal(calculatedGoal),
        new Promise((resolve) => {
          timeoutId = window.setTimeout(() => resolve('pending'), 1200);
        }),
      ]);
      window.clearTimeout(timeoutId);
      savedStatus.textContent = syncStatus === 'failed'
        ? 'Saved on this device, but Firebase sync failed. Continuing to Investing...'
        : syncStatus === 'synced'
          ? 'Goal saved to your profile. Continuing to Investing...'
          : syncStatus === 'pending'
            ? 'Saved on this device. Firebase is taking longer to respond; continuing now.'
            : 'Goal saved on this device. Continuing to Investing...';
      savedStatus.hidden = false;
      window.setTimeout(() => window.location.assign('investing.html'), 200);
    } catch (saveError) {
      window.clearTimeout(timeoutId);
      console.error('Unable to save savings goal:', saveError);
      error.textContent = 'Could not save your goal. Please try again.';
      error.hidden = false;
      saveButton.disabled = false;
      saveButton.innerHTML = 'Save & Continue <span aria-hidden="true">→</span>';
    }
  });

  restoreSavedGoal();
  calculateGoal();
});
