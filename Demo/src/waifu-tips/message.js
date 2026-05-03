import { randomSelection } from './utils.js';

let messageTimer;

function showMessage(text, timeout, priority) {
  const currentPriority = Number(sessionStorage.getItem('waifu-text'));

  if (
    !text ||
    (Number.isFinite(currentPriority) && currentPriority > priority)
  ) {
    return;
  }

  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  const tips = document.getElementById('waifu-tips');

  if (!tips) {
    return;
  }

  const message = randomSelection(text);
  sessionStorage.setItem('waifu-text', String(priority));
  tips.innerHTML = message;
  tips.classList.add('waifu-tips-active');

  messageTimer = setTimeout(() => {
    sessionStorage.removeItem('waifu-text');
    tips.classList.remove('waifu-tips-active');
  }, timeout);
}

export default showMessage;
