document.addEventListener('DOMContentLoaded', () => {
  const goalNameInput = document.getElementById('goalName');
  const goalAmountInput = document.getElementById('goalAmount');
  const goalMonthsInput = document.getElementById('goalMonths');
  const allowanceInput = document.getElementById('monthlyAllowance');
  const safeInput = document.getElementById('safeCoins');
  const growthInput = document.getElementById('growthCoins');
  const volatileInput = document.getElementById('volatileCoins');
  const advanceButton = document.getElementById('advanceMonth');
  const playButton = document.getElementById('playToGoal');
  const resetButton = document.getElementById('resetTower');
  const allocationMessage = document.getElementById('allocationMessage');
  const status = document.getElementById('towerStatus');
  const floors = document.getElementById('towerFloors');
  const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const settingsInputs = [goalNameInput, goalAmountInput, goalMonthsInput, allowanceInput];
  const allocationInputs = [safeInput, growthInput, volatileInput];
  const annualRates = { safe: 0, growth: 0.08, volatile: 0.12 };
  let state = createState();

  function createState() {
    return {
      month: 0,
      contributed: 0,
      balances: { safe: 0, growth: 0, volatile: 0 },
      goalReachedAtMonth: null,
      shockApplied: false,
    };
  }

  function getSettings() {
    return {
      goalName: goalNameInput.value.trim() || 'My goal',
      goalAmount: Number(goalAmountInput.value),
      months: Number(goalMonthsInput.value),
      allowance: Number(allowanceInput.value),
    };
  }

  function getAllocation() {
    return allocationInputs.map((input) => Number(input.value));
  }

  function allocationIsValid() {
    const coins = getAllocation();
    return allocationInputs.every((input) => input.value !== '' && input.checkValidity())
      && coins.reduce((sum, value) => sum + value, 0) === 100;
  }

  function settingsAreValid() {
    return settingsInputs.slice(1).every((input) => input.value !== '' && input.checkValidity())
      && Number.isFinite(Number(goalAmountInput.value))
      && Number.isFinite(Number(goalMonthsInput.value))
      && Number.isFinite(Number(allowanceInput.value));
  }

  function renderTower() {
    const { goalName, goalAmount, months, allowance } = getSettings();
    const balance = state.balances.safe + state.balances.growth + state.balances.volatile;
    const progressPercent = goalAmount > 0 ? Math.min(100, Math.round((balance / goalAmount) * 100)) : 0;
    const growth = balance - state.contributed;

    document.getElementById('towerGoalName').textContent = goalName;
    document.getElementById('towerGoalTarget').textContent = `${currency.format(goalAmount || 0)} goal`;
    document.getElementById('targetAmount').textContent = currency.format(goalAmount || 0);
    document.getElementById('currentBalance').textContent = currency.format(balance);
    document.getElementById('goalProgressText').textContent = `${progressPercent}%`;
    document.getElementById('goalProgressFill').style.width = `${progressPercent}%`;
    document.querySelector('.tower-progress-track').setAttribute('aria-valuenow', String(progressPercent));
    document.getElementById('currentMonth').textContent = String(state.month);
    document.getElementById('monthTarget').textContent = String(months || 0);
    document.getElementById('totalContributed').textContent = currency.format(state.contributed);
    document.getElementById('totalGrowth').textContent = `${growth >= 0 ? '+' : '−'}${currency.format(Math.abs(growth))}`;
    document.getElementById('coinValue').textContent = `${currency.format((allowance || 0) / 100)} per coin`;
    floors.setAttribute('aria-label', `Tower showing ${state.month} of ${months || 0} months completed${state.goalReachedAtMonth ? `, goal reached in month ${state.goalReachedAtMonth}` : ''}`);

    const building = document.createDocumentFragment();
    for (let month = 1; month <= months; month += 1) {
      const floor = document.createElement('span');
      floor.className = 'tower-floor';
      if (month <= state.month) floor.classList.add('is-built');
      if (month % 6 === 0 || month === months) floor.textContent = String(month);
      if (month === state.goalReachedAtMonth) floor.classList.add('goal-floor');
      building.appendChild(floor);
    }
    floors.replaceChildren(building);

    const isFinished = state.month >= months;
    settingsInputs.forEach((input) => {
      input.disabled = state.month > 0;
    });
    const canContinue = settingsAreValid() && allocationIsValid() && !isFinished;
    advanceButton.disabled = !canContinue;
    playButton.disabled = !canContinue;
    updateAllocationMessage();
  }

  function updateAllocationMessage() {
    const values = getAllocation();
    const sum = values.reduce((total, value) => total + value, 0);
    const valid = allocationIsValid();
    allocationMessage.textContent = valid
      ? `Allocation total: ${sum} of 100 coins.`
      : `Allocation total: ${sum} of 100 coins. Adjust the buckets to total exactly 100.`;
    allocationMessage.classList.toggle('is-invalid', !valid);
    allocationInputs.forEach((input) => input.setAttribute('aria-invalid', String(input.value !== '' && !input.checkValidity())));
    const canContinue = settingsAreValid() && valid && state.month < getSettings().months;
    advanceButton.disabled = !canContinue;
    playButton.disabled = !canContinue;
  }

  function advanceOneMonth() {
    if (!settingsAreValid() || !allocationIsValid() || state.month >= getSettings().months) return false;

    const { allowance } = getSettings();
    const coinValue = allowance / 100;
    const [safeCoins, growthCoins, volatileCoins] = getAllocation();
    state.month += 1;
    const monthlyContributions = {
      safe: safeCoins * coinValue,
      growth: growthCoins * coinValue,
      volatile: volatileCoins * coinValue,
    };

    Object.keys(monthlyContributions).forEach((bucket) => {
      state.balances[bucket] += monthlyContributions[bucket];
      state.balances[bucket] *= 1 + annualRates[bucket] / 12;
    });
    state.contributed += allowance;

    if (state.month === 24 && state.balances.volatile > 0) {
      state.balances.volatile *= 0.75;
      state.shockApplied = true;
    }

    const balance = state.balances.safe + state.balances.growth + state.balances.volatile;
    if (state.goalReachedAtMonth === null && balance >= getSettings().goalAmount) {
      state.goalReachedAtMonth = state.month;
    }
    return true;
  }

  function updateStatus() {
    const { goalAmount, months } = getSettings();
    const balance = state.balances.safe + state.balances.growth + state.balances.volatile;
    const messageParts = [`Month ${state.month} of ${months}.`];
    if (state.shockApplied) {
      messageParts.push('The example 25% volatile-bucket drop was applied in month 24.');
    }
    if (state.goalReachedAtMonth !== null) {
      messageParts.push(`Goal reached in month ${state.goalReachedAtMonth}.`);
    }
    if (state.month >= months) {
      messageParts.push(balance >= goalAmount
        ? `At the goal date, the simulated balance is ${currency.format(balance)}.`
        : `At the goal date, the simulated balance is ${currency.format(balance)}, ${currency.format(goalAmount - balance)} short.`);
    } else {
      messageParts.push('Update your allocation before the next month, or simulate the remaining months.');
    }
    status.textContent = messageParts.join(' ');
  }

  function advanceMonth() {
    if (advanceOneMonth()) {
      renderTower();
      updateStatus();
    }
  }

  function resetSimulation() {
    state = createState();
    renderTower();
    status.textContent = `Month 0 of ${getSettings().months}. Set your allocation, then add the first month.`;
  }

  allocationInputs.forEach((input) => {
    input.addEventListener('input', updateAllocationMessage);
  });

  settingsInputs.forEach((input) => {
    input.addEventListener('input', () => {
      renderTower();
      if (state.month === 0) {
        status.textContent = settingsAreValid()
          ? `Month 0 of ${getSettings().months}. Set your allocation, then add the first month.`
          : 'Enter a valid goal amount, timeline, and monthly allowance to start.';
      }
    });
  });

  document.querySelectorAll('.tower-preset').forEach((button) => {
    button.addEventListener('click', () => {
      safeInput.value = button.dataset.safe;
      growthInput.value = button.dataset.growth;
      volatileInput.value = button.dataset.volatile;
      updateAllocationMessage();
    });
  });

  advanceButton.addEventListener('click', advanceMonth);
  playButton.addEventListener('click', () => {
    if (!settingsAreValid() || !allocationIsValid()) return;
    while (advanceOneMonth()) {}
    renderTower();
    updateStatus();
  });
  resetButton.addEventListener('click', resetSimulation);

  renderTower();
});
