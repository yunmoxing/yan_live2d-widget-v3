import Model from './model.js';
import showMessage from './message.js';
import { randomSelection } from './utils.js';
import tools from './tools.js';

function getElement(id) {
  return document.getElementById(id);
}

function slideInWaifu() {
  const waifu = getElement('waifu');

  if (!waifu) {
    return;
  }

  setTimeout(() => {
    waifu.style.bottom = '0';
  }, 0);
}

function isInSeason(date, now) {
  const [after, before = after] = date.split('-');
  const [afterMonth, afterDay] = after.split('/').map(Number);
  const [beforeMonth, beforeDay] = before.split('/').map(Number);
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return (
    afterMonth <= month &&
    month <= beforeMonth &&
    afterDay <= day &&
    day <= beforeDay
  );
}

function loadWidget(config) {
  const model = new Model(config);

  localStorage.removeItem('waifu-display');
  sessionStorage.removeItem('waifu-text');
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="waifu">
      <div id="waifu-tips"></div>
      <canvas id="live2d" width="800" height="800"></canvas>
      <div id="waifu-tool"></div>
    </div>`
  );

  slideInWaifu();

  const registerTools = () => {
    const waifuTool = getElement('waifu-tool');

    if (!waifuTool) {
      return;
    }

    tools['switch-model'].callback = () => model.switchModel();
    tools['switch-texture'].callback = () => model.switchTextures();

    const enabledTools = Array.isArray(config.tools)
      ? config.tools
      : Object.keys(tools);

    config.tools = enabledTools;

    for (const tool of enabledTools) {
      if (!tools[tool]) {
        continue;
      }

      const { icon, callback } = tools[tool];
      waifuTool.insertAdjacentHTML(
        'beforeend',
        `<span id="waifu-tool-${tool}">${icon}</span>`
      );

      getElement(`waifu-tool-${tool}`)?.addEventListener('click', callback);
    }
  };

  const registerEventListener = result => {
    jsonData = result;

    let userAction = false;
    let userActionTimer = null;
    const messageArray = [...result.message.default];

    window.addEventListener('mousemove', () => {
      userAction = true;
    });
    window.addEventListener('keydown', () => {
      userAction = true;
    });

    setInterval(() => {
      if (userAction) {
        userAction = false;
        clearInterval(userActionTimer);
        userActionTimer = null;
      } else if (!userActionTimer) {
        userActionTimer = setInterval(() => {
          showMessage(messageArray, 6000, 9);
        }, 20000);
      }
    }, 1000);

    showMessage(welcomeMessage(), 7000, 11);

    window.addEventListener('mouseover', event => {
      for (const { selector, text } of result.mouseover) {
        if (!event.target.closest(selector)) {
          continue;
        }

        const message = randomSelection(text).replace(
          '{text}',
          event.target.innerText
        );
        showMessage(message, 4000, 8);
        return;
      }
    });

    window.addEventListener('click', event => {
      for (const { selector, text } of result.click) {
        if (!event.target.closest(selector)) {
          continue;
        }

        const message = randomSelection(text).replace(
          '{text}',
          event.target.innerText
        );
        showMessage(message, 4000, 8);
        return;
      }
    });

    result.seasons.forEach(({ date, text }) => {
      const now = new Date();

      if (!isInSeason(date, now)) {
        return;
      }

      const message = randomSelection(text).replace(
        '{year}',
        String(now.getFullYear())
      );
      messageArray.push(message);
    });

    const devtools = () => {};
    console.log('%c', devtools);
    devtools.toString = () => {
      showMessage(result.message.console, 6000, 9);
    };

    window.addEventListener('copy', () => {
      showMessage(result.message.copy, 6000, 9);
    });

    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        showMessage(result.message.visibilitychange, 6000, 9);
      }
    });
  };

  const registerMoveEventListener = () => {
    if (config.dragEnable === false) {
      return;
    }

    const waifu = getElement('waifu');
    const live2d = getElement('live2d');

    if (!waifu || !live2d) {
      return;
    }

    let isDown = false;
    let waifuLeft = 0;
    let mouseLeft = 0;
    let waifuTop = 0;
    let mouseTop = 0;
    const isDirectionEmpty =
      !config.dragDirection || config.dragDirection.length === 0;

    waifu.onmousedown = e => {
      isDown = true;
      waifuLeft = waifu.offsetLeft;
      mouseLeft = e.clientX;
      waifuTop = waifu.offsetTop;
      mouseTop = e.clientY;
    };

    window.onmousemove = e => {
      if (!isDown) {
        return;
      }

      if (isDirectionEmpty || config.dragDirection.includes('x')) {
        let currentLeft = waifuLeft + (e.clientX - mouseLeft);

        if (currentLeft < 0) {
          currentLeft = 0;
        } else if (currentLeft > window.innerWidth - live2d.clientWidth) {
          currentLeft = window.innerWidth - live2d.clientWidth;
        }

        waifu.style.left = `${currentLeft}px`;
      }

      if (isDirectionEmpty || config.dragDirection.includes('y')) {
        let currentTop = waifuTop + (e.clientY - mouseTop);

        if (currentTop < 30) {
          currentTop = 30;
        } else if (currentTop > window.innerHeight - live2d.clientHeight + 10) {
          currentTop = window.innerHeight - live2d.clientHeight + 10;
        }

        waifu.style.top = `${currentTop}px`;
      }
    };

    window.onmouseup = () => {
      isDown = false;
    };
  };

  const initModel = async () => {
    const modelId = Number(localStorage.getItem('modelId') ?? 0);
    const modelTexturesId = Number(
      localStorage.getItem('modelTexturesId') ?? 0
    );

    window.live2d.init(`${config.cdnPath}model/`);
    await model.loadModel(modelId, modelTexturesId);

    const response = await fetch(config.waifuPath);
    const result = await response.json();

    registerEventListener(result);
    registerMoveEventListener();
  };

  registerTools();
  void initModel();
}

function initWidget(config, apiPath) {
  if (typeof config === 'string') {
    config = {
      waifuPath: config,
      apiPath
    };
  }

  homePath = config.homePath;
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="waifu-toggle">
      <span>看板娘</span>
    </div>`
  );

  const toggle = getElement('waifu-toggle');

  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const waifu = getElement('waifu');

    toggle.classList.remove('waifu-toggle-active');

    if (toggle.getAttribute('first-time')) {
      loadWidget(config);
      toggle.removeAttribute('first-time');
      return;
    }

    if (!waifu) {
      return;
    }

    localStorage.removeItem('waifu-display');
    waifu.style.display = '';
    slideInWaifu();
  });

  const waifuDisplayTime = Number(localStorage.getItem('waifu-display'));

  if (waifuDisplayTime && Date.now() - waifuDisplayTime <= 86400000) {
    toggle.setAttribute('first-time', 'true');
    setTimeout(() => {
      toggle.classList.add('waifu-toggle-active');
    }, 0);
    return;
  }

  loadWidget(config);
}

let jsonData = null;
let homePath = '/';

function welcomeMessage() {
  if (location.pathname === homePath) {
    for (const { hour, text } of jsonData.time) {
      const now = new Date();
      const [after, before = after] = hour.split('-');

      if (after <= now.getHours() && now.getHours() <= before) {
        return text;
      }
    }
  }

  const text = `欢迎阅读<span>「${document.title.split(' - ')[0]}」</span>`;

  if (document.referrer !== '') {
    const referrer = new URL(document.referrer);
    const domain = referrer.hostname.split('.')[1];
    const domains = {
      baidu: '百度',
      so: '360搜索',
      google: '谷歌搜索'
    };

    if (location.hostname === referrer.hostname) {
      return text;
    }

    const from = domain in domains ? domains[domain] : referrer.hostname;
    return `Hello！来自 <span>${from}</span> 的朋友<br>${text}`;
  }

  return text;
}

function showWelcomeMessage() {
  showMessage(welcomeMessage(), 7000, 11);
}

export { initWidget, showWelcomeMessage };
