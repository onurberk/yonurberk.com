(function () {
  const displayEl = document.getElementById('display');
  const keysEl = document.querySelector('.keys');
  const installButton = document.getElementById('installButton');

  let expression = '';
  let deferredPrompt = null;

  function setDisplay(value) {
    displayEl.value = value;
  }

  function appendToExpression(token) {
    expression += token;
    setDisplay(expression);
  }

  function clearAll() {
    expression = '';
    setDisplay('');
  }

  function deleteLast() {
    expression = expression.slice(0, -1);
    setDisplay(expression);
  }

  function sanitize(raw) {
    // Replace unicode operators and percent handling
    const normalized = raw
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/%/g, '/100');

    // Only allow digits, operators, dot, parentheses, and spaces
    if (!/^[0-9+\-*/().\s]*$/.test(normalized)) {
      throw new Error('Invalid characters');
    }
    return normalized;
  }

  function evaluate() {
    if (!expression) return;
    try {
      const safe = sanitize(expression);
      // Evaluate safely by constructing a function after sanitization
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${safe})`)();
      expression = String(result);
      setDisplay(expression);
    } catch (err) {
      setDisplay('Hata');
      setTimeout(() => setDisplay(expression), 900);
    }
  }

  function handleKey(token, type) {
    if (type === 'digit') return appendToExpression(token);
    if (type === 'operator') {
      if (!expression) return; // don't start with operator
      const lastChar = expression.trim().slice(-1);
      if ('+-*/'.includes(lastChar)) {
        expression = expression.slice(0, -1) + token;
        return setDisplay(expression);
      }
      return appendToExpression(token);
    }
  }

  keysEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === 'clear') return clearAll();
    if (action === 'delete') return deleteLast();
    if (action === 'percent') return appendToExpression('%');
    if (action === 'equals') return evaluate();

    if (btn.classList.contains('digit')) return handleKey(value, 'digit');
    if (btn.classList.contains('operator')) return handleKey(value, 'operator');
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const { key } = e;
    if (/^[0-9]$/.test(key)) return appendToExpression(key);
    if (key === '.') return appendToExpression('.');
    if (['+', '-', '*', '/'].includes(key)) return handleKey(key, 'operator');
    if (key === 'Enter' || key === '=') { e.preventDefault(); return evaluate(); }
    if (key === 'Backspace') return deleteLast();
    if (key === 'Escape') return clearAll();
    if (key === '%') return appendToExpression('%');
  });

  // PWA install flow
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installButton.disabled = true;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.hidden = true;
    installButton.disabled = false;
    if (outcome !== 'accepted') {
      // user dismissed, keep app usable
    }
  });

  window.addEventListener('appinstalled', () => {
    installButton.hidden = true;
    deferredPrompt = null;
  });

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
